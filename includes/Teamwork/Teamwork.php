<?php
/**
 * Teamwork integration: settings, push, queue and status sync-back.
 *
 * Once an item is pushed, Teamwork owns its status: completing the task there
 * marks the item Resolved here, and reopening it sets the item back to Open.
 *
 * @package FeedbackCollector\Teamwork
 */

namespace FeedbackCollector\Teamwork;

use FeedbackCollector\Admin\Admin;
use FeedbackCollector\Admin\Layout;
use FeedbackCollector\Branding;
use FeedbackCollector\DueDates;
use FeedbackCollector\Items;
use FeedbackCollector\Rounds;
use FeedbackCollector\Screenshots;
use FeedbackCollector\Videos;
use WP_Error;
use const FeedbackCollector\CAP;

defined( 'ABSPATH' ) || exit;

/**
 * Wires Teamwork into the admin UI and background jobs.
 */
final class Teamwork {

	private const OPTION       = 'fbc_teamwork';
	private const STATE_OPTION = 'fbc_tw_state';
	public const SYNC_HOOK     = 'fbc_tw_sync';
	public const QUEUE_HOOK    = 'fbc_tw_queue';
	private const BATCH        = 25;

	/**
	 * Hooks.
	 */
	public static function register(): void {
		add_filter( 'cron_schedules', array( self::class, 'cron_schedules' ) ); // phpcs:ignore WordPress.WP.CronInterval
		add_action( self::SYNC_HOOK, array( self::class, 'cron_sync' ) );
		add_action( self::QUEUE_HOOK, array( self::class, 'process_queue' ) );
		add_action( 'fbc_item_created', array( self::class, 'maybe_auto_push' ) );
		add_action( 'fbc_item_due_changed', array( self::class, 'push_due_date' ) );
		add_filter( 'fbc_present_item', array( self::class, 'present' ), 10, 2 );
		add_filter( 'fbc_teamwork_task_url', array( self::class, 'task_url' ), 10, 2 );
		add_action( 'fbc_comment_created', array( self::class, 'handle_comment_created' ), 10, 6 );
		add_action( 'init', array( self::class, 'ensure_schedule' ) );

		if ( is_admin() ) {
			add_action( 'fbc_settings_rows', array( self::class, 'settings_rows' ) );
			add_action( 'fbc_save_settings', array( self::class, 'save_settings' ) );
			add_action( 'fbc_settings_after', array( self::class, 'settings_tools' ) );
			add_filter( 'fbc_bulk_actions', array( self::class, 'bulk_actions' ) );
			add_filter( 'fbc_handle_bulk_action', array( self::class, 'handle_bulk' ), 10, 3 );
			add_filter( 'fbc_teamwork_column', array( self::class, 'column' ), 10, 2 );
			add_action( 'fbc_detail_sidebar', array( self::class, 'detail_box' ) );
			add_action( 'fbc_list_header_actions', array( self::class, 'header_actions' ) );
			add_action( 'fbc_list_notices', array( self::class, 'notices' ) );
			add_action( 'admin_post_fbc_tw_test', array( self::class, 'handle_test' ) );
			add_action( 'admin_post_fbc_tw_create_list', array( self::class, 'handle_create_list' ) );
			add_action( 'admin_post_fbc_tw_push', array( self::class, 'handle_push' ) );
			add_action( 'admin_post_fbc_tw_create_and_push', array( self::class, 'handle_create_and_push' ) );
			add_action( 'admin_post_fbc_tw_create_and_push_all', array( self::class, 'handle_create_and_push_all' ) );
			add_action( 'admin_post_fbc_tw_sync', array( self::class, 'handle_sync' ) );
		}
	}

	// ------------------------------------------------------------------ config

	/**
	 * Stored settings with defaults.
	 *
	 * @return array<string, mixed>
	 */
	public static function settings(): array {
		return wp_parse_args(
			(array) get_option( self::OPTION, array() ),
			array(
				'site'          => '',
				'key_enc'       => '',
				'project_id'    => 0,
				'project_name'  => '',
				'tasklist_id'      => 0,
				'tasklist_name'    => '',
				'tasklist_private' => false,
				'round'            => 0, // Legacy counter; Rounds::current() is the source of truth.
				'round_lists'   => array(), // round => array( 'id' => task list ID, 'name' => list name ).
				'auto_push'     => false,
				'send_email'    => true,
				'sync_interval' => 'hourly',
				'tags'          => array(),
			)
		);
	}

	/**
	 * Saves settings.
	 *
	 * @param array<string, mixed> $settings Settings.
	 */
	private static function save( array $settings ): void {
		update_option( self::OPTION, $settings, false );
	}

	/**
	 * Teamwork base URL; a wp-config constant wins.
	 */
	public static function site(): string {
		$site = defined( 'FBC_TEAMWORK_SITE' ) ? (string) constant( 'FBC_TEAMWORK_SITE' ) : (string) self::settings()['site'];
		return untrailingslashit( esc_url_raw( $site ) );
	}

	/**
	 * Whether the key comes from wp-config.
	 */
	public static function key_from_constant(): bool {
		return defined( 'FBC_TEAMWORK_API_KEY' ) && '' !== (string) constant( 'FBC_TEAMWORK_API_KEY' );
	}

	/**
	 * The API key: FBC_TEAMWORK_API_KEY in wp-config, else the encrypted option.
	 */
	private static function api_key(): string {
		if ( self::key_from_constant() ) {
			return (string) constant( 'FBC_TEAMWORK_API_KEY' );
		}
		return self::decrypt( (string) self::settings()['key_enc'] );
	}

	/**
	 * API client, or null when not configured.
	 */
	public static function client(): ?Client {
		$site = self::site();
		$key  = self::api_key();
		return ( '' !== $site && '' !== $key ) ? new Client( $site, $key ) : null;
	}

	/**
	 * Ready to push: credentials plus a project and task list.
	 */
	public static function ready(): bool {
		$s = self::settings();
		return null !== self::client() && $s['project_id'] && self::list_for_round( Rounds::current() );
	}

	/**
	 * The Teamwork task list for a round, or 0 if that round has none.
	 *
	 * Only a site set up before per-round lists existed (no map yet) treats its active
	 * list as the current round's. Once any round is mapped, an unmapped round has no
	 * list, so starting Round N+1 never routes its items into Round N's list.
	 *
	 * @param int $round Round.
	 */
	public static function list_for_round( int $round ): int {
		$s   = self::settings();
		$map = (array) $s['round_lists'];
		if ( ! empty( $map[ $round ]['id'] ) ) {
			return (int) $map[ $round ]['id'];
		}
		return ( ! $map && Rounds::current() === $round ) ? (int) $s['tasklist_id'] : 0;
	}

	/**
	 * Display name of a round's task list.
	 *
	 * @param int $round Round.
	 */
	public static function list_name_for_round( int $round ): string {
		$s   = self::settings();
		$map = (array) $s['round_lists'];
		if ( ! empty( $map[ $round ]['name'] ) ) {
			return (string) $map[ $round ]['name'];
		}
		return ( ! $map && Rounds::current() === $round ) ? (string) $s['tasklist_name'] : '';
	}

	/**
	 * Creates a custom-named task list in the selected project, maps it to a round, and makes it active.
	 *
	 * @param string    $name       Task list name.
	 * @param int|null  $round      Round (defaults to current).
	 * @param bool|null $is_private Whether the list is private (defaults to saved tasklist_private setting).
	 * @return int|WP_Error New task list ID.
	 */
	public static function create_custom_list( string $name, ?int $round = null, ?bool $is_private = null ): int|WP_Error {
		$client = self::client();
		$s      = self::settings();
		if ( ! $client || ! $s['project_id'] ) {
			return new WP_Error( 'fbc_tw_not_ready', __( 'Choose a Teamwork project first.', 'feedback-collector' ) );
		}
		$name = trim( $name );
		if ( '' === $name ) {
			return new WP_Error( 'fbc_tw_empty_name', __( 'Task list name cannot be empty.', 'feedback-collector' ) );
		}
		$round      = $round ?? Rounds::current();
		$is_private = null === $is_private ? ! empty( $s['tasklist_private'] ) : (bool) $is_private;
		$id         = $client->create_tasklist( (int) $s['project_id'], $name, $is_private );
		if ( is_wp_error( $id ) ) {
			return $id;
		}
		$s['round_lists'][ $round ] = array(
			'id'      => $id,
			'name'    => $name,
			'private' => $is_private,
		);
		$s['round']                 = max( (int) $s['round'], $round );
		$s['tasklist_id']           = $id;
		$s['tasklist_name']         = $name;
		$s['tasklist_private']      = $is_private;
		self::save( $s );
		return $id;
	}

	/**
	 * Creates "QA – Round N – date" in the selected project, maps it to the round and makes it active.
	 *
	 * @param int       $round      Round.
	 * @param bool|null $is_private Whether the list is private (defaults to saved tasklist_private setting).
	 * @return int|WP_Error New task list ID.
	 */
	public static function create_round_list( int $round, ?bool $is_private = null ): int|WP_Error {
		/* translators: 1: round number, 2: date */
		$name = sprintf( __( 'QA – Round %1$d – %2$s', 'feedback-collector' ), $round, wp_date( 'Y-m-d' ) );
		return self::create_custom_list( $name, $round, $is_private );
	}

	/**
	 * Derives a secretbox key from the site's auth salt.
	 * This is a fallback; the wp-config constant is the recommended setup.
	 */
	private static function box_key(): string {
		return sodium_crypto_generichash( wp_salt( 'auth' ) . '|fbc-teamwork', '', SODIUM_CRYPTO_SECRETBOX_KEYBYTES );
	}

	/**
	 * Encrypts a secret for storage.
	 *
	 * @param string $plain Secret.
	 */
	private static function encrypt( string $plain ): string {
		$nonce = random_bytes( SODIUM_CRYPTO_SECRETBOX_NONCEBYTES );
		return base64_encode( $nonce . sodium_crypto_secretbox( $plain, $nonce, self::box_key() ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	}

	/**
	 * Decrypts a stored secret; empty string when missing or undecryptable (e.g. salts changed).
	 *
	 * @param string $stored Stored value.
	 */
	private static function decrypt( string $stored ): string {
		if ( '' === $stored ) {
			return '';
		}
		$raw = base64_decode( $stored, true ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode
		if ( false === $raw || strlen( $raw ) <= SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ) {
			return '';
		}
		$plain = sodium_crypto_secretbox_open( substr( $raw, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ), substr( $raw, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES ), self::box_key() );
		return false === $plain ? '' : $plain;
	}

	// ------------------------------------------------------------------ cron

	/**
	 * Sync frequencies offered in Settings: cron schedule name => minutes.
	 *
	 * @return array<string, int>
	 */
	public static function sync_intervals(): array {
		return array(
			'fbc_five_minutes'    => 5,
			'fbc_fifteen_minutes' => 15,
			'fbc_thirty_minutes'  => 30,
			'hourly'              => 60,
		);
	}

	/**
	 * The chosen sync schedule (falls back to hourly).
	 */
	public static function sync_interval(): string {
		$chosen = (string) self::settings()['sync_interval'];
		return isset( self::sync_intervals()[ $chosen ] ) ? $chosen : 'hourly';
	}

	/**
	 * Adds the 5/15/30-minute intervals (hourly is built in).
	 *
	 * @param array<string, array<string, mixed>> $schedules Schedules.
	 * @return array<string, array<string, mixed>>
	 */
	public static function cron_schedules( array $schedules ): array {
		foreach ( self::sync_intervals() as $name => $minutes ) {
			if ( 'hourly' === $name ) {
				continue;
			}
			$schedules[ $name ] = array(
				'interval' => $minutes * MINUTE_IN_SECONDS,
				/* translators: %d: minutes */
				'display'  => sprintf( __( 'Every %d minutes', 'feedback-collector' ), $minutes ),
			);
		}
		return $schedules;
	}

	/**
	 * Keeps the sync job scheduled at the chosen frequency while Teamwork is connected.
	 */
	public static function ensure_schedule(): void {
		if ( null === self::client() ) {
			return;
		}
		$interval = self::sync_interval();
		if ( wp_get_schedule( self::SYNC_HOOK ) === $interval && wp_next_scheduled( self::SYNC_HOOK ) ) {
			return;
		}
		// New install, or the frequency changed: (re)schedule from now.
		wp_clear_scheduled_hook( self::SYNC_HOOK );
		wp_schedule_event( time() + self::sync_intervals()[ $interval ] * MINUTE_IN_SECONDS, $interval, self::SYNC_HOOK );
	}

	/**
	 * Clears scheduled jobs (on deactivation).
	 */
	public static function unschedule(): void {
		wp_clear_scheduled_hook( self::SYNC_HOOK );
		wp_clear_scheduled_hook( self::QUEUE_HOOK );
	}

	/**
	 * Cron entry for sync; errors are recorded in the sync state.
	 */
	public static function cron_sync(): void {
		self::sync();
	}

	// ------------------------------------------------------------------ push

	/**
	 * Pushes one item. Idempotent: an item that already has a Teamwork task is never pushed again,
	 * and concurrent pushes of the same item are blocked by an atomic claim.
	 *
	 * @param int $id Item ID.
	 * @return int|WP_Error Teamwork task ID.
	 */
	public static function push( int $id ): int|WP_Error {
		$item = Items::get( $id );
		if ( ! $item ) {
			return new WP_Error( 'fbc_not_found', __( 'Feedback item not found.', 'feedback-collector' ) );
		}
		if ( $item['tw_task_id'] ) {
			return $item['tw_task_id'];
		}
		$client = self::client();
		$s      = self::settings();
		if ( ! $client || ! $s['project_id'] ) {
			return new WP_Error( 'fbc_tw_not_ready', __( 'Connect Teamwork and choose a project and QA list in Feedback → Settings first.', 'feedback-collector' ) );
		}
		// Each item goes to its own round's list, so a Round 1 item pushed during Round 2 lands in Round 1.
		$list = self::list_for_round( (int) $item['round'] );
		if ( ! $list ) {
			return new WP_Error(
				'fbc_tw_no_round_list',
				/* translators: %d: round number */
				sprintf( __( 'There is no Teamwork list for Round %d. Pick or create one in Feedback → Settings.', 'feedback-collector' ), (int) $item['round'] )
			);
		}
		if ( ! self::claim( $id ) ) {
			return new WP_Error( 'fbc_tw_busy', __( 'This item is already being pushed.', 'feedback-collector' ) );
		}

		$task = self::build_task( $item, $client, $s );

		// Attach the screenshot. A failed upload never blocks the push: the task body
		// already links to the image, so the developer still sees it.
		$pending = array();
		$shot    = Screenshots::path( $item );
		if ( '' !== $shot ) {
			$ref = $client->upload_pending_file( $shot, sprintf( 'feedback-%d.%s', (int) $item['id'], pathinfo( $shot, PATHINFO_EXTENSION ) ) );
			if ( is_wp_error( $ref ) ) {
				/* translators: %s: error */
				Items::add_comment( $id, sprintf( __( 'screenshot was not attached in Teamwork (%s); the task links to it instead', 'feedback-collector' ), $ref->get_error_message() ), 'activity', 0 );
			} else {
				$pending[] = $ref;
			}
		}
		$video = Videos::path( $item );
		if ( '' !== $video ) {
			$ref = $client->upload_pending_file( $video, sprintf( 'feedback-%d-recording.webm', (int) $item['id'] ) );
			if ( is_wp_error( $ref ) ) {
				/* translators: %s: error */
				Items::add_comment( $id, sprintf( __( 'recording was not attached in Teamwork (%s); the task links to it instead', 'feedback-collector' ), $ref->get_error_message() ), 'activity', 0 );
			} else {
				$pending[] = $ref;
			}
		}

		$task_id = $client->create_task( $list, $task, (bool) $s['send_email'], $pending );

		if ( is_wp_error( $task_id ) ) {
			$limited = 'fbc_tw_rate_limited' === $task_id->get_error_code();
			Items::update(
				$id,
				array(
					'tw_sync_state' => $limited ? 'queued' : 'error',
					'tw_sync_error' => $task_id->get_error_message(),
				)
			);
			return $task_id;
		}

		Items::update(
			$id,
			array(
				'tw_task_id'    => $task_id,
				'tw_project_id' => (int) $s['project_id'],
				'tw_sync_state' => 'synced',
				'tw_sync_error' => null,
			)
		);
		/* translators: 1: task ID, 2: task list name */
		Items::add_comment( $id, sprintf( __( 'pushed to Teamwork as task #%1$d in %2$s', 'feedback-collector' ), $task_id, $s['tasklist_name'] ?: __( 'the QA list', 'feedback-collector' ) ), 'activity' );
		// Comments written before the push were skipped by the comment hook (no task yet).
		self::push_pending_comments( $client, $id, $task_id );
		return $task_id;
	}

	/**
	 * Atomically marks an item as being pushed. Stale claims (crashed requests) expire after 10 minutes.
	 *
	 * @param int $id Item ID.
	 */
	private static function claim( int $id ): bool {
		global $wpdb;
		$now   = current_time( 'mysql', true );
		$stale = gmdate( 'Y-m-d H:i:s', time() - 10 * MINUTE_IN_SECONDS );
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$rows = $wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . Items::table() . " SET tw_sync_state = 'pushing', updated_at = %s WHERE id = %d AND tw_task_id = 0 AND ( tw_sync_state <> 'pushing' OR updated_at < %s )", // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
				$now,
				$id,
				$stale
			)
		);
		return 1 === (int) $rows;
	}

	/**
	 * Builds the v3 task payload.
	 *
	 * @param array<string, mixed> $item   Item.
	 * @param Client               $client Client.
	 * @param array<string, mixed> $s      Settings.
	 * @return array<string, mixed>
	 */
	private static function build_task( array $item, Client $client, array $s ): array {
		$labels = Items::labels();
		$ctx    = is_array( $item['context'] ) ? $item['context'] : array();
		$anchor = is_array( $item['anchor'] ) ? $item['anchor'] : array();
		$link   = Admin::view_on_page_url( $item );
		$page   = Items::page_url( $item );
		$by     = get_userdata( (int) $item['reporter_id'] );

		// Teamwork rejects HTML descriptions (and any explicit content type other than its default),
		// so this is Markdown-flavoured text. The page URL leads, in
		// full, so it's visible in Teamwork lists and notifications too.
		$md    = '**' . __( 'Page URL', 'feedback-collector' ) . ':** ' . self::md_link( $page, $page ) . "\n\n";
		$md   .= '' !== $item['description'] ? self::md_text( (string) $item['description'] ) . "\n\n" : '';
		$md   .= '**' . self::md_link( __( 'Open the pin on the page →', 'feedback-collector' ), $link ) . "**\n\n";
		$lines = array( __( 'Page title', 'feedback-collector' ) . ': ' . self::md_text( (string) $item['page_title'] ) );
		if ( $ctx ) {
			$lines[] = __( 'Breakpoint', 'feedback-collector' ) . ': ' . self::md_text( sprintf( '%s · %d×%d @%sx', $ctx['breakpoint'] ?? '', $ctx['viewport_w'] ?? 0, $ctx['viewport_h'] ?? 0, $ctx['dpr'] ?? 1 ) );
			$lines[] = __( 'Browser', 'feedback-collector' ) . ': ' . self::md_text( trim( ( $ctx['browser'] ?? '' ) . ' · ' . ( $ctx['os'] ?? '' ), ' ·' ) );
		}
		$lines[]  = __( 'Element', 'feedback-collector' ) . ': ' . ( $anchor ? self::md_code( (string) ( $anchor['selector'] ?? '' ) ) : __( 'whole page', 'feedback-collector' ) );
		$lines[]  = __( 'Priority', 'feedback-collector' ) . ': ' . self::md_text( $labels['priority'][ $item['priority'] ] ?? $item['priority'] );
		$lines[]  = __( 'Reported by', 'feedback-collector' ) . ': ' . self::md_text( ( $by ? $by->display_name : '' ) . ' (' . Branding::text( 'name' ) . ' #' . (int) $item['id'] . ')' );
		$shot_url = Screenshots::url( $item );
		if ( '' !== $shot_url ) {
			$lines[] = __( 'Screenshot', 'feedback-collector' ) . ': ' . self::md_link( __( 'view image', 'feedback-collector' ), $shot_url );
		}
		$video_url = Videos::url( $item );
		if ( '' !== $video_url ) {
			/* translators: %s: length, e.g. 1:42 */
			$lines[] = __( 'Screen recording', 'feedback-collector' ) . ': ' . self::md_link( sprintf( __( 'watch video (%s)', 'feedback-collector' ), Videos::clock( (int) $item['video_duration'] ) ), $video_url );
		}
		$md .= '- ' . implode( "\n- ", $lines ) . "\n";
		if ( '' !== $video_url && ! empty( $item['video_events'] ) ) {
			$md .= "\n" . __( 'During the recording:', 'feedback-collector' ) . "\n";
			foreach ( $item['video_events'] as $event ) {
				$what = 'error' === $event['kind']
					? __( 'JS error', 'feedback-collector' ) . ' ' . self::md_code( (string) $event['label'] )
					: __( 'clicked', 'feedback-collector' ) . ' ' . self::md_code( (string) $event['label'] );
				$md  .= '- ' . Videos::clock( intdiv( (int) $event['t'], 1000 ) ) . ' · ' . $what . "\n";
			}
		}
		if ( ! empty( $ctx['js_errors'] ) ) {
			$md .= "\n" . __( 'JavaScript errors on the page:', 'feedback-collector' ) . "\n";
			foreach ( $ctx['js_errors'] as $err ) {
				$md .= '- ' . self::md_code( (string) $err ) . "\n";
			}
		}

		$task = array(
			'name'                   => sprintf( '[%s] %s', $labels['type'][ $item['type'] ] ?? $item['type'], $item['title'] ),
			'description'            => $md,
			'priority'               => in_array( $item['priority'], array( 'high', 'critical' ), true ) ? 'high' : $item['priority'],
		);
		// Teamwork writes due dates through dueAt (Y-m-d; it reads back as dueDate).
		$due = DueDates::sanitize( (string) ( $item['due_date'] ?? '' ) );
		if ( $due ) {
			$task['dueAt'] = $due;
		}

		$tag_id = self::tag_for_type( $item['type'], $client );
		if ( $tag_id ) {
			$task['tagIds'] = array( $tag_id );
		}

		if ( $item['tw_assignee_id'] ) {
			// Picked from the Teamwork project directly: no email matching needed.
			$task['assignees'] = array( 'userIds' => array( (int) $item['tw_assignee_id'] ) );
		} elseif ( $item['assignee_id'] ) {
			$person = self::person_for_user( (int) $item['assignee_id'], $client, (int) $s['project_id'] );
			if ( $person ) {
				$task['assignees'] = array( 'userIds' => array( $person ) );
			} else {
				$user                 = get_userdata( (int) $item['assignee_id'] );
				$task['description'] .= "\n_" . self::md_text(
					sprintf(
						/* translators: %s: user name */
						__( 'Assigned in WordPress to %s, who has no matching Teamwork account on this project.', 'feedback-collector' ),
						$user ? $user->display_name : '#' . $item['assignee_id']
					)
				) . "_\n";
			}
		}
		return $task;
	}

	/**
	 * Escapes user text for Markdown (no HTML, no accidental formatting).
	 *
	 * @param string $text Text.
	 */
	private static function md_text( string $text ): string {
		$text = str_replace( array( "\r\n", "\r" ), "\n", wp_strip_all_tags( $text ) );
		$text = str_replace( "\n", "  \n", $text ); // Keep the reporter's line breaks.
		return (string) preg_replace( '/([\\\\`*_\[\]<>])/', '\\\\$1', $text );
	}

	/**
	 * Inline code span that can't be broken out of.
	 *
	 * @param string $text Text.
	 */
	private static function md_code( string $text ): string {
		$text = str_replace( array( "\r", "\n" ), ' ', wp_strip_all_tags( $text ) );
		return str_contains( $text, '`' ) ? '`` ' . $text . ' ``' : '`' . $text . '`';
	}

	/**
	 * Markdown link with a safe URL.
	 *
	 * @param string $label Label.
	 * @param string $url   URL.
	 */
	private static function md_link( string $label, string $url ): string {
		$url = str_replace( array( '(', ')', ' ' ), array( '%28', '%29', '%20' ), esc_url_raw( $url ) );
		return '[' . self::md_text( $label ) . '](' . $url . ')';
	}

	/**
	 * Cached tag ID for a feedback type. Tag failures never block a push.
	 *
	 * @param string $type   Item type.
	 * @param Client $client Client.
	 */
	private static function tag_for_type( string $type, Client $client ): int {
		$s = self::settings();
		if ( ! empty( $s['tags'][ $type ] ) ) {
			return (int) $s['tags'][ $type ];
		}
		$name = Items::labels()['type'][ $type ] ?? $type;
		$id   = $client->ensure_tag( $name );
		if ( is_wp_error( $id ) ) {
			return 0;
		}
		$s['tags'][ $type ] = $id;
		self::save( $s );
		return $id;
	}

	/**
	 * Matches a WordPress user to a Teamwork person on the project by email.
	 *
	 * @param int    $user_id    WP user.
	 * @param Client $client     Client.
	 * @param int    $project_id Project.
	 */
	private static function person_for_user( int $user_id, Client $client, int $project_id ): int {
		$user = get_userdata( $user_id );
		if ( ! $user ) {
			return 0;
		}
		$cache_key = 'fbc_tw_people_' . $project_id;
		$people    = get_transient( $cache_key );
		if ( ! is_array( $people ) ) {
			$people = $client->people_by_email( $project_id );
			if ( is_wp_error( $people ) ) {
				return 0;
			}
			set_transient( $cache_key, $people, HOUR_IN_SECONDS );
		}
		return (int) ( $people[ strtolower( $user->user_email ) ] ?? 0 );
	}

	/**
	 * Marks items queued and makes sure the queue runner is scheduled.
	 *
	 * @param int[] $ids Item IDs.
	 * @return int Number queued.
	 */
	public static function queue( array $ids ): int {
		global $wpdb;
		$ids = array_filter( array_map( 'absint', $ids ) );
		if ( ! $ids ) {
			return 0;
		}
		$in = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- $in is a list of %d placeholders.
		$n = (int) $wpdb->query( $wpdb->prepare( "UPDATE %i SET tw_sync_state = 'queued', tw_sync_error = NULL WHERE tw_task_id = 0 AND tw_sync_state <> 'pushing' AND id IN ($in)", array_merge( array( Items::table() ), $ids ) ) );
		self::schedule_queue( 0 );
		return $n;
	}

	/**
	 * Schedules the queue runner.
	 *
	 * @param int $delay Seconds from now.
	 */
	private static function schedule_queue( int $delay ): void {
		if ( ! wp_next_scheduled( self::QUEUE_HOOK ) ) {
			wp_schedule_single_event( time() + $delay, self::QUEUE_HOOK );
		}
	}

	/**
	 * Pushes up to a batch of queued items. Stops and reschedules on a rate limit,
	 * so a large bulk push completes without losing items.
	 *
	 * @param int $limit Max items this run.
	 * @return array{pushed: int, failed: int, remaining: int}
	 */
	public static function process_queue( int $limit = self::BATCH ): array {
		global $wpdb;
		$limit = $limit > 0 ? $limit : self::BATCH;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$ids    = array_map( 'intval', $wpdb->get_col( $wpdb->prepare( "SELECT id FROM %i WHERE tw_sync_state = 'queued' AND tw_task_id = 0 ORDER BY id ASC LIMIT %d", Items::table(), $limit ) ) );
		$pushed = 0;
		$failed = 0;

		foreach ( $ids as $id ) {
			$result = self::push( $id );
			if ( ! is_wp_error( $result ) ) {
				++$pushed;
				continue;
			}
			if ( 'fbc_tw_rate_limited' === $result->get_error_code() ) {
				$data = $result->get_error_data();
				wp_clear_scheduled_hook( self::QUEUE_HOOK );
				wp_schedule_single_event( time() + (int) ( $data['retry_after'] ?? 60 ), self::QUEUE_HOOK );
				break;
			}
			if ( 'fbc_tw_not_ready' === $result->get_error_code() ) {
				break;
			}
			++$failed;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$remaining = (int) $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM %i WHERE tw_sync_state = 'queued' AND tw_task_id = 0", Items::table() ) );
		if ( $remaining && self::ready() ) {
			self::schedule_queue( 5 );
		}
		return array(
			'pushed'    => $pushed,
			'failed'    => $failed,
			'remaining' => $remaining,
		);
	}

	/**
	 * A due date edited here goes to the Teamwork task too (best effort; a failure is
	 * noted in the item's thread so it's never silent).
	 *
	 * @param int $id Item ID.
	 */
	public static function push_due_date( int $id ): void {
		$item   = Items::get( $id );
		$client = self::client();
		if ( ! $item || ! $item['tw_task_id'] || ! $client ) {
			return;
		}
		$result = $client->update_task( (int) $item['tw_task_id'], array( 'dueAt' => DueDates::sanitize( (string) $item['due_date'] ) ) );
		if ( is_wp_error( $result ) ) {
			/* translators: %s: error message */
			Items::add_comment( $id, sprintf( __( 'Couldn’t update the due date in Teamwork: %s', 'feedback-collector' ), $result->get_error_message() ), 'activity' );
		}
	}

	/**
	 * Auto-push on creation, when enabled. Runs in the background so the reviewer isn't kept waiting.
	 *
	 * @param int $id New item ID.
	 */
	public static function maybe_auto_push( int $id ): void {
		if ( self::settings()['auto_push'] && self::ready() ) {
			self::queue( array( $id ) );
			spawn_cron();
		}
	}

	// ------------------------------------------------------------------ sync-back

	/**
	 * Mirrors Teamwork completion onto pushed items. Never touches unpushed items.
	 *
	 * @return array{checked: int, changed: int}|WP_Error
	 */
	public static function sync(): array|WP_Error {
		global $wpdb;
		$client = self::client();
		if ( ! $client ) {
			return new WP_Error( 'fbc_tw_not_ready', __( 'Teamwork is not connected.', 'feedback-collector' ) );
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.NotPrepared
		$rows    = $wpdb->get_results( 'SELECT id, status, due_date, tw_task_id, tw_project_id FROM ' . Items::table() . ' WHERE tw_task_id > 0', ARRAY_A );
		$state   = (array) get_option( self::STATE_OPTION, array() );
		$started = time();

		if ( ! $rows ) {
			$state = array_merge(
				$state,
				array(
					'last_sync'   => $started,
					'last_result' => array(
						'checked' => 0,
						'changed' => 0,
					),
					'last_error'  => '',
				)
			);
			update_option( self::STATE_OPTION, $state, false );
			return array(
				'checked' => 0,
				'changed' => 0,
			);
		}

		$by_task  = array();
		$projects = array();
		foreach ( $rows as $row ) {
			$by_task[ (int) $row['tw_task_id'] ]     = $row;
			$projects[ (int) $row['tw_project_id'] ] = true;
		}
		unset( $projects[0] );

		// Overlap the window by five minutes so clock skew never drops a change.
		$since   = ! empty( $state['last_sync'] ) ? gmdate( 'Y-m-d\TH:i:s\Z', (int) $state['last_sync'] - 5 * MINUTE_IN_SECONDS ) : null;
		$checked = 0;
		$changed = 0;

		$errors = array();
		foreach ( array_keys( $projects ) as $project_id ) {
			$tasks = $client->project_tasks( $project_id, $since );
			if ( is_wp_error( $tasks ) ) {
				// One unreachable project (archived, no access…) must not stop the others syncing.
				$errors[ $project_id ] = $tasks;
				continue;
			}
			foreach ( $tasks as $task ) {
				$row = $by_task[ (int) ( $task['id'] ?? 0 ) ] ?? null;
				if ( ! $row ) {
					continue;
				}
				++$checked;
				self::sync_task_comments( $client, (int) $row['id'], (int) $task['id'] );
				// Retry any reviewer comment whose earlier send failed.
				self::push_pending_comments( $client, (int) $row['id'], (int) $task['id'] );
				$completed = 'completed' === ( $task['status'] ?? '' ) || ! empty( $task['completedAt'] );
				$target    = null;
				if ( $completed && 'resolved' !== $row['status'] ) {
					$target = 'resolved';
				} elseif ( ! $completed && 'resolved' === $row['status'] ) {
					$target = 'open';
				}
				if ( $target ) {
					Items::update(
						(int) $row['id'],
						array(
							'status'    => $target,
							'_actor_id' => 0,
						)
					);
					++$changed;
				}
				// Due date changed in Teamwork (day-only there, same as here). Only when the
				// response carries the field, so a sparse payload never clears a date.
				if ( array_key_exists( 'dueDate', $task ) ) {
					$tw_due = DueDates::sanitize( substr( (string) $task['dueDate'], 0, 10 ) );
					if ( $tw_due !== DueDates::sanitize( (string) $row['due_date'] ) ) {
						Items::update(
							(int) $row['id'],
							array(
								'due_date'  => $tw_due,
								'_actor_id' => 0,
							)
						);
						++$changed;
					}
				}
			}
		}

		$error_text = implode(
			'; ',
			array_map(
				/* translators: 1: Teamwork project ID, 2: error message */
				static fn( int $pid, WP_Error $e ): string => sprintf( __( 'Project %1$d: %2$s', 'feedback-collector' ), $pid, $e->get_error_message() ),
				array_keys( $errors ),
				$errors
			)
		);
		$state = array(
			// Keep the old window when a project failed, so its changes are picked up next time.
			'last_sync'   => $errors ? (int) ( $state['last_sync'] ?? 0 ) : $started,
			'last_result' => array(
				'checked' => $checked,
				'changed' => $changed,
			),
			'last_error'  => $error_text,
		);
		update_option( self::STATE_OPTION, $state, false );
		if ( $errors && count( $errors ) === count( $projects ) ) {
			return reset( $errors );
		}
		return array(
			'checked' => $checked,
			'changed' => $changed,
		);
	}

	// ------------------------------------------------------------------ REST shape

	/**
	 * Adds the Teamwork task URL to the item shape.
	 *
	 * @param array<string, mixed> $out  Presented item.
	 * @param array<string, mixed> $item Raw item.
	 * @return array<string, mixed>
	 */
	public static function present( array $out, array $item ): array {
		$out['tw_task_url'] = $item['tw_task_id'] && self::site() ? self::site() . '/app/tasks/' . (int) $item['tw_task_id'] : '';
		$out['tw_note']     = '';
		if ( ! $item['tw_task_id'] && self::client() && self::settings()['project_id'] ) {
			if ( 'error' === $item['tw_sync_state'] ) {
				/* translators: %s: error message */
				$out['tw_note'] = sprintf( __( 'Teamwork push failed: %s', 'feedback-collector' ), (string) $item['tw_sync_error'] );
			} elseif ( ! self::list_for_round( (int) $item['round'] ) ) {
				/* translators: %d: round number */
				$out['tw_note'] = sprintf( __( 'Not in Teamwork yet: Round %d has no QA list.', 'feedback-collector' ), (int) $item['round'] );
			} elseif ( in_array( $item['tw_sync_state'], array( 'queued', 'pushing' ), true ) ) {
				$out['tw_note'] = __( 'Sending to Teamwork…', 'feedback-collector' );
			}
		}
		return $out;
	}

	// ------------------------------------------------------------------ admin UI

	/**
	 * Settings rows inside the main settings form.
	 */
	public static function settings_rows(): void {
		$s      = self::settings();
		$client = self::client();

		echo '<tr><th scope="row"><label for="fbc-tw-site">' . esc_html__( 'Teamwork site URL', 'feedback-collector' ) . '</label></th><td>';
		if ( defined( 'FBC_TEAMWORK_SITE' ) ) {
			echo '<code>' . esc_html( self::site() ) . '</code> <span class="description">' . esc_html__( 'Set by FBC_TEAMWORK_SITE in wp-config.php', 'feedback-collector' ) . '</span>';
		} else {
			printf( '<input type="url" id="fbc-tw-site" name="tw_site" class="regular-text" value="%s" placeholder="https://yourcompany.teamwork.com" />', esc_attr( (string) $s['site'] ) );
		}
		echo '</td></tr>';

		echo '<tr><th scope="row"><label for="fbc-tw-key">' . esc_html__( 'API key', 'feedback-collector' ) . '</label></th><td>';
		if ( self::key_from_constant() ) {
			echo '<span class="dashicons dashicons-yes-alt" style="color:#00a32a"></span> ' . esc_html__( 'Using FBC_TEAMWORK_API_KEY from wp-config.php', 'feedback-collector' );
		} else {
			$stored = (string) $s['key_enc'];
			$has    = '' !== self::decrypt( $stored );
			if ( '' !== $stored && ! $has ) {
				echo '<div class="notice inline notice-warning"><p>' . esc_html__( 'The saved key can no longer be read (this site’s security salts changed, e.g. after a migration). Paste the key again.', 'feedback-collector' ) . '</p></div>';
			}
			printf( '<input type="password" id="fbc-tw-key" name="tw_key" class="regular-text" autocomplete="new-password" placeholder="%s" />', esc_attr( $has ? __( '•••••••• saved — leave blank to keep', 'feedback-collector' ) : __( 'Paste the Teamwork API key', 'feedback-collector' ) ) );
			echo '<p class="description">' . wp_kses(
				__( 'Stored encrypted in the database and never shown again or sent to the browser. In Teamwork: profile icon → <strong>Edit My Details</strong> → <strong>API &amp; Mobile</strong> → <strong>Show your Token</strong>. Use a dedicated “QA Bot” user that is only on the projects it needs.', 'feedback-collector' ),
				array( 'strong' => array() )
			) . '</p>';
		}
		echo '</td></tr>';

		if ( ! $client ) {
			return;
		}

		$projects = get_transient( 'fbc_tw_projects' );
		if ( ! is_array( $projects ) ) {
			$projects = $client->projects();
			if ( ! is_wp_error( $projects ) ) {
				set_transient( 'fbc_tw_projects', $projects, 10 * MINUTE_IN_SECONDS );
			}
		}
		echo '<tr><th scope="row"><label for="fbc-tw-project">' . esc_html__( 'Project', 'feedback-collector' ) . '</label></th><td>';
		if ( is_wp_error( $projects ) ) {
			echo '<div class="notice inline notice-error"><p>' . esc_html( $projects->get_error_message() ) . '</p></div>';
		} else {
			echo '<select id="fbc-tw-project" name="tw_project"><option value="0">' . esc_html__( '— Choose a project —', 'feedback-collector' ) . '</option>';
			foreach ( $projects as $id => $name ) {
				printf( '<option value="%d"%s>%s</option>', (int) $id, selected( (int) $s['project_id'], (int) $id, false ), esc_html( $name ) );
			}
			echo '</select>';
		}
		echo '</td></tr>';

		if ( $s['project_id'] ) {
			$lists          = $client->tasklists( (int) $s['project_id'] );
			$current_round  = Rounds::current();
			/* translators: 1: round number, 2: current date */
			$suggested_name = sprintf( __( 'QA – Round %1$d – %2$s', 'feedback-collector' ), $current_round, wp_date( 'Y-m-d' ) );

			echo '<tr><th scope="row"><label>' . esc_html__( 'QA task list', 'feedback-collector' ) . '</label></th><td>';
			if ( is_wp_error( $lists ) ) {
				echo '<div class="notice inline notice-error"><p>' . esc_html( $lists->get_error_message() ) . '</p></div>';
			} else {
				echo '<fieldset class="fbc-tw-list-fieldset">';
				echo '<div style="display:flex;gap:20px;margin-bottom:10px;align-items:center;">';
				echo '<label style="font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer;">';
				echo '<input type="radio" name="tw_list_mode" value="existing" checked="checked" /> ';
				esc_html_e( 'Select existing list', 'feedback-collector' );
				echo '</label>';
				echo '<label style="font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer;">';
				echo '<input type="radio" name="tw_list_mode" value="new" /> ';
				esc_html_e( 'Create new list', 'feedback-collector' );
				echo '</label>';
				echo '</div>';

				echo '<div id="fbc-tw-existing-list-panel">';
				echo '<select id="fbc-tw-list" name="tw_tasklist" style="max-width:380px;width:100%;">';
				echo '<option value="0">' . esc_html__( '— Choose a task list —', 'feedback-collector' ) . '</option>';
				foreach ( $lists as $id => $name ) {
					printf( '<option value="%d"%s>%s</option>', (int) $id, selected( (int) $s['tasklist_id'], (int) $id, false ), esc_html( $name ) );
				}
				echo '<option value="__new__">' . esc_html__( '+ Create new task list…', 'feedback-collector' ) . '</option>';
				echo '</select>';
				echo '<p class="description">' . esc_html__( 'Select an existing task list in this project, or switch to create a new one.', 'feedback-collector' ) . '</p>';
				echo '</div>';

				echo '<div id="fbc-tw-new-list-panel" style="display:none;">';
				echo '<div style="display:flex;gap:8px;align-items:center;max-width:540px;">';
				printf(
					'<input type="text" id="fbc-tw-new-list-name" name="tw_new_list_name" class="regular-text" style="flex:1;" value="%s" placeholder="%s" />',
					esc_attr( $suggested_name ),
					esc_attr( $suggested_name )
				);
				echo '<button type="submit" name="fbc_tw_create_list_btn" value="1" class="button button-secondary" style="white-space:nowrap;">' . esc_html__( 'Create list now', 'feedback-collector' ) . '</button>';
				echo '</div>';

				$is_priv = ! empty( $s['tasklist_private'] );
				echo '<div style="margin-top:10px;display:flex;gap:18px;align-items:center;">';
				echo '<span style="font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#50575e;">' . esc_html__( 'Privacy:', 'feedback-collector' ) . '</span>';
				echo '<label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;">';
				echo '<input type="radio" name="tw_new_list_privacy" value="public"' . checked( ! $is_priv, true, false ) . ' /> ';
				esc_html_e( 'Public (everyone in project)', 'feedback-collector' );
				echo '</label>';
				echo '<label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;">';
				echo '<input type="radio" name="tw_new_list_privacy" value="private"' . checked( $is_priv, true, false ) . ' /> ';
				esc_html_e( 'Private (restricted)', 'feedback-collector' );
				echo '</label>';
				echo '</div>';

				printf(
					'<p class="description">%s</p>',
					/* translators: %d: round number */
					sprintf( esc_html__( 'Creates a new list in this project and sets it as the active QA list for Round %d. Private lists are only visible to project administrators and assigned users in Teamwork.', 'feedback-collector' ), $current_round )
				);
				echo '</div>';
				echo '</fieldset>';

				echo '<script>
				(function() {
					var modeExisting = document.querySelector(\'input[name="tw_list_mode"][value="existing"]\');
					var modeNew = document.querySelector(\'input[name="tw_list_mode"][value="new"]\');
					var existingPanel = document.getElementById("fbc-tw-existing-list-panel");
					var newPanel = document.getElementById("fbc-tw-new-list-panel");
					var selectList = document.getElementById("fbc-tw-list");
					var newListName = document.getElementById("fbc-tw-new-list-name");

					function setMode(mode) {
						if (mode === "new") {
							if (modeNew) modeNew.checked = true;
							if (existingPanel) existingPanel.style.display = "none";
							if (newPanel) newPanel.style.display = "block";
							if (newListName) {
								newListName.focus();
								newListName.select();
							}
						} else {
							if (modeExisting) modeExisting.checked = true;
							if (existingPanel) existingPanel.style.display = "block";
							if (newPanel) newPanel.style.display = "none";
						}
					}

					if (modeExisting) {
						modeExisting.addEventListener("change", function() { setMode("existing"); });
					}
					if (modeNew) {
						modeNew.addEventListener("change", function() { setMode("new"); });
					}
					if (selectList) {
						selectList.addEventListener("change", function() {
							if (this.value === "__new__") {
								setMode("new");
								this.value = "0";
							}
						});
					}
				})();
				</script>';
			}
			echo '</td></tr>';
		}

		printf(
			'<tr><th scope="row">%1$s</th><td><label><input type="checkbox" name="tw_auto_push" value="1"%2$s /> %3$s</label></td></tr>',
			esc_html__( 'Auto-push', 'feedback-collector' ),
			checked( (bool) $s['auto_push'], true, false ),
			esc_html__( 'Push new feedback to Teamwork as soon as it is created', 'feedback-collector' )
		);

		$labels = array(
			'fbc_five_minutes'    => __( 'Every 5 minutes', 'feedback-collector' ),
			'fbc_fifteen_minutes' => __( 'Every 15 minutes', 'feedback-collector' ),
			'fbc_thirty_minutes'  => __( 'Every 30 minutes', 'feedback-collector' ),
			'hourly'              => __( 'Every hour (default)', 'feedback-collector' ),
		);
		echo '<tr><th scope="row"><label for="fbc-tw-interval">' . esc_html__( 'Sync with Teamwork', 'feedback-collector' ) . '</label></th><td><select id="fbc-tw-interval" name="tw_sync_interval">';
		foreach ( $labels as $value => $label ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( $value ), selected( self::sync_interval(), $value, false ), esc_html( $label ) );
		}
		echo '</select><p class="description">' . esc_html( self::sync_status_text() ) . ' ' . esc_html__( 'Checks Teamwork for completed or reopened tasks. WP-Cron runs when the site gets visits, so a quiet staging site may sync a little late; use “Sync now” any time.', 'feedback-collector' ) . '</p></td></tr>';

		printf(
			'<tr><th scope="row">%1$s</th><td><input type="hidden" name="tw_options_shown" value="1" /><label><input type="checkbox" name="tw_send_email" value="1"%2$s /> %3$s</label><p class="description">%4$s</p></td></tr>',
			esc_html__( 'Email notifications', 'feedback-collector' ),
			checked( (bool) $s['send_email'], true, false ),
			esc_html__( 'Email assignees when a task is created in Teamwork', 'feedback-collector' ),
			esc_html__( 'Applies to every push from this site. When off, tasks are still created and assigned in Teamwork; nobody is emailed about them.', 'feedback-collector' )
		);
	}

	/**
	 * Saves the Teamwork fields of the settings form (nonce already checked).
	 */
	public static function save_settings(): void {
		// phpcs:disable WordPress.Security.NonceVerification.Missing
		$s = self::settings();
		if ( ! defined( 'FBC_TEAMWORK_SITE' ) && isset( $_POST['tw_site'] ) ) {
			$site = esc_url_raw( trim( sanitize_text_field( wp_unslash( $_POST['tw_site'] ) ) ) );
			if ( $site !== $s['site'] ) {
				$s['site']        = $site;
				$s['tags']        = array();
				$s['project_id']  = 0;
				$s['tasklist_id'] = 0;
				delete_transient( 'fbc_tw_projects' );
			}
		}
		if ( ! self::key_from_constant() && ! empty( $_POST['tw_key'] ) ) {
			$s['key_enc'] = self::encrypt( trim( sanitize_text_field( wp_unslash( $_POST['tw_key'] ) ) ) );
			$s['tags']    = array();
			delete_transient( 'fbc_tw_projects' );
		}
		if ( isset( $_POST['tw_project'] ) ) {
			$project = absint( $_POST['tw_project'] );
			if ( $project !== (int) $s['project_id'] ) {
				$s['project_id']    = $project;
				$s['tasklist_id']   = 0;
				$s['tasklist_name'] = '';
				$projects           = get_transient( 'fbc_tw_projects' );
				$s['project_name']  = is_array( $projects ) ? (string) ( $projects[ $project ] ?? '' ) : '';
			} else {
				$mode       = isset( $_POST['tw_list_mode'] ) ? sanitize_key( wp_unslash( $_POST['tw_list_mode'] ) ) : 'existing';
				$create_btn = ! empty( $_POST['fbc_tw_create_list_btn'] );

				if ( 'new' === $mode || $create_btn ) {
					$new_name = isset( $_POST['tw_new_list_name'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['tw_new_list_name'] ) ) ) : '';
					if ( '' === $new_name ) {
						/* translators: 1: round number, 2: date */
						$new_name = sprintf( __( 'QA – Round %1$d – %2$s', 'feedback-collector' ), Rounds::current(), wp_date( 'Y-m-d' ) );
					}
					$is_private = false;
					if ( isset( $_POST['tw_new_list_privacy'] ) ) {
						$is_private = 'private' === sanitize_key( wp_unslash( $_POST['tw_new_list_privacy'] ) );
					} elseif ( ! empty( $_POST['tw_new_list_private'] ) ) {
						$is_private = true;
					}

					$created_id = self::create_custom_list( $new_name, null, $is_private );
					if ( ! is_wp_error( $created_id ) ) {
						$s             = self::settings(); // Reload updated settings from create_custom_list.
						$privacy_label = $is_private ? __( 'Private', 'feedback-collector' ) : __( 'Public', 'feedback-collector' );
						/* translators: 1: list name, 2: privacy label */
						set_transient( 'fbc_tw_created_list_msg', sprintf( __( 'Created “%1$s” (%2$s) and set it as the active QA task list.', 'feedback-collector' ), $new_name, $privacy_label ), 30 );
					} else {
						set_transient( 'fbc_tw_error_msg', $created_id->get_error_message(), 30 );
					}
				} else {
					if ( isset( $_POST['tw_new_list_privacy'] ) ) {
						$s['tasklist_private'] = 'private' === sanitize_key( wp_unslash( $_POST['tw_new_list_privacy'] ) );
					}
					if ( isset( $_POST['tw_tasklist'] ) ) {
					$list = absint( $_POST['tw_tasklist'] );
					if ( $list !== (int) $s['tasklist_id'] ) {
						$s['tasklist_id']   = $list;
						$client             = self::client();
						$lists              = $client && $project ? $client->tasklists( $project ) : array();
						$s['tasklist_name'] = is_array( $lists ) ? (string) ( $lists[ $list ] ?? '' ) : '';
						// Picking a list maps it to the current round; earlier rounds keep theirs.
						$current = Rounds::current();
						if ( $list ) {
							$s['round_lists'][ $current ] = array(
								'id'   => $list,
								'name' => $s['tasklist_name'],
							);
						} else {
							unset( $s['round_lists'][ $current ] );
						}
					}
				}
			}
		}
		}
		// These checkboxes only render once Teamwork is connected. An absent checkbox means
		// "unchecked" only if it was on the form; otherwise the first save (pasting the key)
		// would silently turn emails off.
		if ( ! empty( $_POST['tw_options_shown'] ) ) {
			$s['auto_push']  = ! empty( $_POST['tw_auto_push'] );
			$s['send_email'] = ! empty( $_POST['tw_send_email'] );
		}
		if ( isset( $_POST['tw_sync_interval'] ) ) {
			$interval = sanitize_key( wp_unslash( $_POST['tw_sync_interval'] ) );
			if ( isset( self::sync_intervals()[ $interval ] ) ) {
				$s['sync_interval'] = $interval;
			}
		}
		// phpcs:enable
		self::save( $s );
		self::ensure_schedule();
	}

	/**
	 * Buttons rendered below the settings form (each its own form).
	 */
	public static function settings_tools(): void {
		if ( ! self::client() ) {
			return;
		}
		$s = self::settings();
		Layout::card_open( __( 'Teamwork tools', 'feedback-collector' ) );
		echo '<p>';
		self::button_form( 'fbc_tw_sync', __( 'Sync now', 'feedback-collector' ), array(), 'primary' );
		echo ' ';
		self::button_form( 'fbc_tw_test', __( 'Test connection', 'feedback-collector' ) );
		$current = Rounds::current();
		if ( $s['project_id'] ) {
			echo ' ';
			self::button_form(
				'fbc_tw_create_list',
				/* translators: %d: round number */
				sprintf( __( 'Create “QA – Round %d” list', 'feedback-collector' ), $current )
			);
		}
		echo '</p><p class="description">' . esc_html( self::sync_status_text() ) . '</p>';
		self::sync_result_notice();
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_tw_msg'] ) ) {
			$type = isset( $_GET['fbc_tw_ok'] ) && '1' === $_GET['fbc_tw_ok'] ? 'success' : 'error';
			printf( '<div class="notice notice-%s inline"><p>%s</p></div>', esc_attr( $type ), esc_html( sanitize_text_field( wp_unslash( $_GET['fbc_tw_msg'] ) ) ) );
		}
		// phpcs:enable
		Layout::card_close();
	}

	/**
	 * A one-button admin-post form.
	 *
	 * @param string                    $action Action name.
	 * @param string                    $label  Button label.
	 * @param array<string, int|string> $fields Extra hidden fields.
	 * @param string                    $button_class Button class.
	 */
	private static function button_form( string $action, string $label, array $fields = array(), string $button_class = 'secondary' ): void {
		printf( '<form method="post" action="%s" style="display:inline">', esc_url( admin_url( 'admin-post.php' ) ) );
		wp_nonce_field( $action );
		printf( '<input type="hidden" name="action" value="%s" />', esc_attr( $action ) );
		foreach ( $fields as $name => $value ) {
			printf( '<input type="hidden" name="%s" value="%s" />', esc_attr( $name ), esc_attr( (string) $value ) );
		}
		submit_button( $label, $button_class, 'submit', false );
		echo '</form>';
	}

	/**
	 * Redirect back to settings with a message.
	 *
	 * @param string $message Message.
	 * @param bool   $ok      Success.
	 */
	private static function back_to_settings( string $message, bool $ok ): void {
		wp_safe_redirect(
			add_query_arg(
				array(
					'page'       => Admin::SLUG . '-settings',
					'fbc_tw_msg' => rawurlencode( $message ),
					'fbc_tw_ok'  => $ok ? '1' : '0',
				),
				admin_url( 'admin.php' )
			)
		);
		exit;
	}

	/**
	 * Test connection.
	 */
	public static function handle_test(): void {
		check_admin_referer( 'fbc_tw_test' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$client = self::client();
		$me     = $client ? $client->me() : new WP_Error( 'fbc_tw_not_ready', __( 'Add a site URL and API key first.', 'feedback-collector' ) );
		if ( is_wp_error( $me ) ) {
			self::back_to_settings( $me->get_error_message(), false );
		}
		/* translators: %s: Teamwork user name */
		self::back_to_settings( sprintf( __( 'Connected to Teamwork as %s.', 'feedback-collector' ), trim( ( $me['firstName'] ?? '' ) . ' ' . ( $me['lastName'] ?? '' ) ) ), true );
	}

	/**
	 * Creates the next QA round list and makes it active.
	 */
	public static function handle_create_list(): void {
		check_admin_referer( 'fbc_tw_create_list' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$id = self::create_round_list( Rounds::current() );
		if ( is_wp_error( $id ) ) {
			self::back_to_settings( $id->get_error_message(), false );
		}
		/* translators: %s: list name */
		self::back_to_settings( sprintf( __( 'Created “%s” and set it as the active QA list.', 'feedback-collector' ), self::list_name_for_round( Rounds::current() ) ), true );
	}

	/**
	 * Push one item from the detail screen.
	 */
	public static function handle_push(): void {
		$id = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
		check_admin_referer( 'fbc_tw_push' );
		if ( ! current_user_can( CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$result = self::push( $id );
		$url    = Admin::item_url( $id );
		if ( is_wp_error( $result ) ) {
			$url = add_query_arg( 'fbc_tw_err', rawurlencode( $result->get_error_message() ), $url );
		}
		wp_safe_redirect( $url );
		exit;
	}

	/**
	 * Detail screen: creates the QA list for this item's round, then pushes the item to it.
	 */
	public static function handle_create_and_push(): void {
		$id = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
		check_admin_referer( 'fbc_tw_create_and_push' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$item   = Items::get( $id );
		$round  = $item ? (int) $item['round'] : Rounds::current();
		$result = self::list_for_round( $round ) ? true : self::create_round_list( $round );
		if ( ! is_wp_error( $result ) ) {
			$result = self::push( $id );
		}
		$url = Admin::item_url( $id );
		if ( is_wp_error( $result ) ) {
			$url = add_query_arg( 'fbc_tw_err', rawurlencode( $result->get_error_message() ), $url );
		}
		wp_safe_redirect( $url );
		exit;
	}

	/**
	 * List screen: creates the current round's QA list, then pushes every unpushed item in that round.
	 */
	public static function handle_create_and_push_all(): void {
		check_admin_referer( 'fbc_tw_create_and_push_all' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$round  = Rounds::current();
		$result = self::list_for_round( $round ) ? true : self::create_round_list( $round );
		$back   = admin_url( 'admin.php?page=' . Admin::SLUG );
		if ( is_wp_error( $result ) ) {
			wp_safe_redirect( add_query_arg( 'fbc_sync_err', rawurlencode( $result->get_error_message() ), $back ) );
			exit;
		}
		self::queue( self::unpushed_ids( $round ) );
		wp_clear_scheduled_hook( self::QUEUE_HOOK );
		$done = self::process_queue( 10 );
		wp_safe_redirect(
			add_query_arg(
				array(
					'fbc_tw_pushed' => (int) $done['pushed'],
					'fbc_tw_failed' => (int) $done['failed'],
					'fbc_tw_queued' => (int) $done['remaining'],
				),
				$back
			)
		);
		exit;
	}

	/**
	 * IDs of items in a round that aren't in Teamwork yet.
	 *
	 * @param int $round Round.
	 * @return int[]
	 */
	private static function unpushed_ids( int $round ): array {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		return array_map( 'intval', $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM %i WHERE round = %d AND tw_task_id = 0', Items::table(), $round ) ) );
	}

	/**
	 * "Sync with Teamwork now".
	 */
	public static function handle_sync(): void {
		check_admin_referer( 'fbc_tw_sync' );
		if ( ! current_user_can( CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		// Send anything waiting in the push queue, then pull status changes back.
		wp_clear_scheduled_hook( self::QUEUE_HOOK );
		self::process_queue();
		$result = self::sync();
		$args   = is_wp_error( $result )
			? array( 'fbc_sync_err' => rawurlencode( $result->get_error_message() ) )
			: array(
				'fbc_synced'  => $result['changed'],
				'fbc_checked' => $result['checked'],
			);
		wp_safe_redirect( add_query_arg( $args, wp_get_referer() ?: admin_url( 'admin.php?page=' . Admin::SLUG ) ) );
		exit;
	}

	/**
	 * Adds the bulk push action.
	 *
	 * @param array<string, string> $actions Actions.
	 * @return array<string, string>
	 */
	public static function bulk_actions( array $actions ): array {
		if ( self::ready() ) {
			$actions = array( 'tw_push' => __( 'Push to Teamwork', 'feedback-collector' ) ) + $actions;
		}
		return $actions;
	}

	/**
	 * Handles the bulk push: a first batch runs now, the rest continues in the background.
	 *
	 * @param int    $done   Count so far.
	 * @param string $action Action.
	 * @param int[]  $ids    Item IDs.
	 */
	public static function handle_bulk( int $done, string $action, array $ids ): int {
		if ( 'tw_push' !== $action ) {
			return $done;
		}
		$queued = self::queue( $ids );
		wp_clear_scheduled_hook( self::QUEUE_HOOK );
		$result = self::process_queue( 10 );
		return $queued ? $queued : $result['pushed'];
	}

	/**
	 * List table column content.
	 *
	 * @param string               $html Default.
	 * @param array<string, mixed> $item Item.
	 */
	public static function column( string $html, array $item ): string {
		if ( $item['tw_task_id'] ) {
			return sprintf( '<a class="fbc-pill" href="%s" target="_blank" rel="noopener">Task #%d</a>', esc_url( self::site() . '/app/tasks/' . (int) $item['tw_task_id'] ), (int) $item['tw_task_id'] );
		}
		switch ( $item['tw_sync_state'] ) {
			case 'queued':
			case 'pushing':
				return '<span class="dashicons dashicons-update" title="' . esc_attr__( 'Queued for Teamwork', 'feedback-collector' ) . '"></span>';
			case 'error':
				return '<span class="dashicons dashicons-warning" style="color:#d63638" title="' . esc_attr( (string) $item['tw_sync_error'] ) . '"></span>';
		}
		return $html;
	}

	/**
	 * Browser URL for a Teamwork task.
	 *
	 * @param string $url     Existing URL.
	 * @param int    $task_id Teamwork task ID.
	 */
	public static function task_url( string $url, int $task_id ): string {
		$site = self::site();
		return $site && $task_id > 0 ? untrailingslashit( $site ) . '/app/tasks/' . $task_id : $url;
	}

	/**
	 * Pushes a newly created WordPress comment to its linked Teamwork task.
	 *
	 * @param int    $comment_id    New comment ID.
	 * @param int    $item_id       Item ID.
	 * @param string $body          Comment text.
	 * @param int    $user_id       Author ID (0 = sync).
	 * @param string $kind          'comment' or 'activity'.
	 * @param int    $tw_comment_id Existing Teamwork comment ID if synced.
	 */
	public static function handle_comment_created( int $comment_id, int $item_id, string $body, int $user_id, string $kind, int $tw_comment_id = 0 ): void {
		if ( 'comment' !== $kind || $tw_comment_id > 0 || 0 === $user_id ) {
			return;
		}

		// Not pushed yet: push() sends this comment along with the task.
		$item = Items::get( $item_id );
		if ( ! $item || empty( $item['tw_task_id'] ) ) {
			return;
		}

		$client = self::client();
		if ( ! $client ) {
			return;
		}

		self::send_comment( $client, $comment_id, (int) $item['tw_task_id'], $body, $user_id );
	}

	/**
	 * Sends one WordPress comment to a Teamwork task and records the Teamwork comment ID.
	 *
	 * @param Client $client     Client.
	 * @param int    $comment_id WordPress comment ID.
	 * @param int    $task_id    Teamwork task ID.
	 * @param string $body       Comment text.
	 * @param int    $user_id    Author ID.
	 */
	private static function send_comment( Client $client, int $comment_id, int $task_id, string $body, int $user_id ): bool {
		$user   = get_userdata( $user_id );
		$author = $user ? $user->display_name : __( 'A reviewer', 'feedback-collector' );
		$brand  = Branding::text( 'name' );
		/* translators: 1: author name, 2: branding name, 3: comment body */
		$tw_body = sprintf( "From %1\$s via %2\$s:\n\n%3\$s", $author, $brand, $body );

		$res = $client->create_task_comment( $task_id, $tw_body );
		if ( is_wp_error( $res ) || $res <= 0 ) {
			return false;
		}
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$wpdb->update( Items::comments_table(), array( 'tw_comment_id' => $res ), array( 'id' => $comment_id ) );
		return true;
	}

	/**
	 * Sends an item's reviewer comments that are not in Teamwork yet: ones written before
	 * the push, and ones whose earlier send failed. Activity entries stay in WordPress.
	 *
	 * @param Client $client  Client.
	 * @param int    $item_id Item ID.
	 * @param int    $task_id Teamwork task ID.
	 * @return array{sent: int, failed: int}
	 */
	public static function push_pending_comments( Client $client, int $item_id, int $task_id ): array {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$rows   = $wpdb->get_results( $wpdb->prepare( "SELECT id, body, user_id FROM %i WHERE item_id = %d AND kind = 'comment' AND tw_comment_id = 0 AND user_id > 0 ORDER BY id ASC", Items::comments_table(), $item_id ), ARRAY_A );
		$result = array(
			'sent'   => 0,
			'failed' => 0,
		);
		foreach ( $rows ?: array() as $row ) {
			$ok = self::send_comment( $client, (int) $row['id'], $task_id, (string) $row['body'], (int) $row['user_id'] );
			++$result[ $ok ? 'sent' : 'failed' ];
		}
		return $result;
	}

	/**
	 * Item IDs that are in Teamwork but still have reviewer comments that are not.
	 *
	 * @return array<int, int>
	 */
	public static function items_with_pending_comments(): array {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$ids = $wpdb->get_col( $wpdb->prepare( "SELECT DISTINCT c.item_id FROM %i c JOIN %i i ON i.id = c.item_id WHERE i.tw_task_id > 0 AND c.kind = 'comment' AND c.tw_comment_id = 0 AND c.user_id > 0 ORDER BY c.item_id ASC", Items::comments_table(), Items::table() ) );
		return array_map( 'intval', $ids ?: array() );
	}

	/**
	 * Syncs comments from a Teamwork task to an item's thread.
	 *
	 * @param Client $client  Client.
	 * @param int    $item_id Item ID.
	 * @param int    $task_id Teamwork task ID.
	 */
	public static function sync_task_comments( Client $client, int $item_id, int $task_id ): int {
		global $wpdb;
		$comments = $client->task_comments( $task_id );
		if ( is_wp_error( $comments ) || empty( $comments ) ) {
			return 0;
		}

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$existing     = $wpdb->get_col( $wpdb->prepare( 'SELECT tw_comment_id FROM %i WHERE item_id = %d AND tw_comment_id > 0', Items::comments_table(), $item_id ) );
		$existing_ids = array_flip( array_map( 'intval', $existing ?: array() ) );

		$added = 0;
		foreach ( $comments as $c ) {
			$c_id = (int) ( $c['id'] ?? 0 );
			if ( ! $c_id || isset( $existing_ids[ $c_id ] ) ) {
				continue;
			}

			$text = trim( (string) ( $c['body'] ?? $c['text'] ?? '' ) );
			if ( '' === $text ) {
				continue;
			}

			// If this comment was pushed by us previously, ignore if marked with prefix.
			$brand = Branding::text( 'name' );
			if ( str_starts_with( $text, 'From ' ) && str_contains( $text, 'via ' . $brand . ":\n\n" ) ) {
				continue;
			}

			$author_name = trim( (string) ( $c['author']['firstName'] ?? $c['user']['firstName'] ?? $c['postedBy']['firstName'] ?? '' ) . ' ' . (string) ( $c['author']['lastName'] ?? $c['user']['lastName'] ?? $c['postedBy']['lastName'] ?? '' ) );
			/* translators: 1: author name, 2: comment body */
			$body = $author_name ? sprintf( "[%s via Teamwork]\n\n%s", $author_name, $text ) : sprintf( "[Teamwork]\n\n%s", $text );

			Items::add_comment( $item_id, $body, 'comment', 0, $c_id );
			$existing_ids[ $c_id ] = true;
			++$added;
		}
		return $added;
	}

	/**
	 * Teamwork box on the detail screen.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function detail_box( array $item ): void {
		Layout::card_open( __( 'Teamwork', 'feedback-collector' ) );
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_tw_err'] ) ) {
			echo '<div class="notice notice-error inline"><p>' . esc_html( sanitize_text_field( wp_unslash( $_GET['fbc_tw_err'] ) ) ) . '</p></div>'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
		$s        = self::settings();
		$round    = (int) $item['round'];
		$list     = self::list_for_round( $round );
		$settings = admin_url( 'admin.php?page=' . Admin::SLUG . '-settings' );

		if ( $item['tw_task_id'] ) {
			// Pushed: the main action is going straight to the task.
			$list_name = self::list_name_for_round( $round );
			printf(
				'<p><a class="button button-primary button-large" href="%1$s" target="_blank" rel="noopener">%2$s</a></p><p class="description">%3$s</p><p class="description">%4$s</p>',
				esc_url( self::site() . '/app/tasks/' . (int) $item['tw_task_id'] ),
				esc_html__( 'Open in Teamwork ↗', 'feedback-collector' ),
				esc_html(
					$list_name
						/* translators: 1: task ID, 2: task list name */
						? sprintf( __( 'Task #%1$d in “%2$s”.', 'feedback-collector' ), (int) $item['tw_task_id'], $list_name )
						/* translators: %d: task ID */
						: sprintf( __( 'Task #%d.', 'feedback-collector' ), (int) $item['tw_task_id'] )
				),
				esc_html__( 'Completing this task in Teamwork marks this item Resolved here.', 'feedback-collector' )
			);
		} elseif ( ! self::client() ) {
			printf( '<p class="description">%s</p><p><a class="button" href="%s">%s</a></p>', esc_html__( 'Not connected to Teamwork yet.', 'feedback-collector' ), esc_url( $settings ), esc_html__( 'Connect Teamwork', 'feedback-collector' ) );
		} elseif ( ! $s['project_id'] ) {
			printf( '<p class="description">%s</p><p><a class="button" href="%s">%s</a></p>', esc_html__( 'Teamwork is connected. Choose which project QA feedback goes to.', 'feedback-collector' ), esc_url( $settings ), esc_html__( 'Choose a project', 'feedback-collector' ) );
		} else {
			if ( 'error' === $item['tw_sync_state'] ) {
				echo '<div class="notice notice-error inline"><p>' . esc_html( (string) $item['tw_sync_error'] ) . '</p></div>';
			}
			$project = (string) $s['project_name'];
			if ( $list ) {
				/* translators: 1: round number, 2: task list name */
				echo '<p class="description">' . esc_html( sprintf( __( 'Not in Teamwork yet. Round %1$d → “%2$s”.', 'feedback-collector' ), $round, self::list_name_for_round( $round ) ) ) . '</p><p>';
				self::button_form( 'fbc_tw_push', 'error' === $item['tw_sync_state'] ? __( 'Retry push', 'feedback-collector' ) : __( 'Push to Teamwork', 'feedback-collector' ), array( 'id' => (int) $item['id'] ), 'primary' );
				echo '</p>';
			} else {
				// Connected with a project, but this item's round has no QA list: fix both in one click.
				echo '<p class="description">' . esc_html(
					sprintf(
						/* translators: 1: project name, 2: round number */
						__( 'Connected to %1$s, but Round %2$d doesn’t have a QA list yet.', 'feedback-collector' ),
						'' !== $project ? $project : __( 'your project', 'feedback-collector' ),
						$round
					)
				) . '</p><p>';
				if ( ! current_user_can( 'manage_options' ) ) {
					echo esc_html__( 'Ask an administrator to create it in Settings.', 'feedback-collector' ) . '</p>';
					Layout::card_close();
					return;
				}
				self::button_form(
					'fbc_tw_create_and_push',
					/* translators: %d: round number */
					sprintf( __( 'Create Round %d QA list & push', 'feedback-collector' ), $round ),
					array( 'id' => (int) $item['id'] ),
					'primary'
				);
				echo '</p>';
			}
		}
		Layout::card_close();
	}

	/**
	 * "Last synced 5 minutes ago · next in 55 mins" (plus the last problem, if any).
	 */
	public static function sync_status_text(): string {
		$state   = (array) get_option( self::STATE_OPTION, array() );
		$parts   = array();
		$parts[] = ! empty( $state['last_sync'] )
			/* translators: %s: human time difference */
			? sprintf( __( 'Last synced %s ago', 'feedback-collector' ), human_time_diff( (int) $state['last_sync'] ) )
			: __( 'Not synced yet', 'feedback-collector' );
		$next = wp_next_scheduled( self::SYNC_HOOK );
		if ( $next ) {
			$parts[] = $next > time()
				/* translators: %s: human time difference */
				? sprintf( __( 'next in %s', 'feedback-collector' ), human_time_diff( $next ) )
				: __( 'next sync is due (waiting for a site visit)', 'feedback-collector' );
		}
		$text = implode( ' · ', $parts ) . '.';
		if ( ! empty( $state['last_error'] ) ) {
			/* translators: %s: error message */
			$text .= ' ' . sprintf( __( 'Last problem: %s', 'feedback-collector' ), (string) $state['last_error'] );
		}
		return $text;
	}

	/**
	 * Result of a "Sync now" click, wherever it was clicked.
	 */
	private static function sync_result_notice(): void {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_sync_err'] ) ) {
			printf( '<div class="notice notice-error inline is-dismissible"><p>%s</p></div>', esc_html( sanitize_text_field( wp_unslash( $_GET['fbc_sync_err'] ) ) ) );
		} elseif ( isset( $_GET['fbc_synced'] ) ) {
			printf(
				'<div class="notice notice-success inline is-dismissible"><p>%s</p></div>',
				esc_html(
					sprintf(
						/* translators: 1: changed count, 2: checked count */
						__( 'Synced with Teamwork: %1$d item(s) updated, %2$d changed task(s) checked.', 'feedback-collector' ),
						absint( $_GET['fbc_synced'] ),
						absint( $_GET['fbc_checked'] ?? 0 )
					)
				)
			);
		}
		// phpcs:enable
	}

	/**
	 * "Sync now" next to the page title.
	 */
	public static function header_actions(): void {
		if ( ! self::client() ) {
			return;
		}
		printf( '<form method="post" action="%s">', esc_url( admin_url( 'admin-post.php' ) ) );
		wp_nonce_field( 'fbc_tw_sync' );
		echo '<input type="hidden" name="action" value="fbc_tw_sync" />';
		submit_button( __( 'Sync with Teamwork', 'feedback-collector' ), 'secondary', 'submit', false );
		printf( ' <span class="description">%s</span>', esc_html( self::sync_status_text() ) );
		echo '</form>';
	}

	/**
	 * Sync result notices on the list screen.
	 */
	public static function notices(): void {
		$round = Rounds::current();
		if ( self::client() && self::settings()['project_id'] && ! self::list_for_round( $round ) ) {
			$waiting = count( self::unpushed_ids( $round ) );
			echo '<div class="notice notice-warning inline"><p><strong>' . esc_html(
				sprintf(
					/* translators: 1: round number, 2: item count */
					_n( 'Round %1$d has no Teamwork QA list, so %2$d item hasn’t been sent to Teamwork.', 'Round %1$d has no Teamwork QA list, so %2$d items haven’t been sent to Teamwork.', $waiting, 'feedback-collector' ),
					$round,
					$waiting
				)
			) . '</strong></p><p>';
			if ( current_user_can( 'manage_options' ) ) {
				/* translators: %d: round number */
				self::button_form( 'fbc_tw_create_and_push_all', sprintf( __( 'Create Round %d QA list & push all', 'feedback-collector' ), $round ), array(), 'primary' );
			} else {
				esc_html_e( 'Ask an administrator to create it in Settings.', 'feedback-collector' );
			}
			echo '</p></div>';
		}
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_tw_pushed'] ) ) {
			$queued = absint( $_GET['fbc_tw_queued'] ?? 0 );
			$failed = absint( $_GET['fbc_tw_failed'] ?? 0 );
			/* translators: %d: pushed count */
			$msg = sprintf( __( 'Sent %d item(s) to Teamwork.', 'feedback-collector' ), absint( $_GET['fbc_tw_pushed'] ) );
			if ( $queued ) {
				/* translators: %d: still-queued count */
				$msg .= ' ' . sprintf( __( '%d more will follow in the background.', 'feedback-collector' ), $queued );
			}
			if ( $failed ) {
				/* translators: %d: failed count */
				$msg .= ' ' . sprintf( __( '%d failed: hover the warning icon in the Teamwork column for the reason.', 'feedback-collector' ), $failed );
			}
			printf( '<div class="notice notice-%s is-dismissible"><p>%s</p></div>', $failed ? 'warning' : 'success', esc_html( $msg ) );
		}
		// phpcs:enable
		self::sync_result_notice();
	}
}
