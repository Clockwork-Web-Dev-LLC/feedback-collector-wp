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
use FeedbackCollector\Items;
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
		add_filter( 'fbc_present_item', array( self::class, 'present' ), 10, 2 );
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
				'tasklist_id'   => 0,
				'tasklist_name' => '',
				'round'         => 0,
				'auto_push'     => false,
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
		return null !== self::client() && $s['project_id'] && $s['tasklist_id'];
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
	 * Adds a 15-minute interval.
	 *
	 * @param array<string, array<string, mixed>> $schedules Schedules.
	 * @return array<string, array<string, mixed>>
	 */
	public static function cron_schedules( array $schedules ): array {
		$schedules['fbc_fifteen_minutes'] = array(
			'interval' => 15 * MINUTE_IN_SECONDS,
			'display'  => __( 'Every 15 minutes', 'feedback-collector' ),
		);
		return $schedules;
	}

	/**
	 * Keeps the sync job scheduled while Teamwork is connected.
	 */
	public static function ensure_schedule(): void {
		if ( null !== self::client() && ! wp_next_scheduled( self::SYNC_HOOK ) ) {
			wp_schedule_event( time() + 60, 'fbc_fifteen_minutes', self::SYNC_HOOK );
		}
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
		if ( ! $client || ! $s['project_id'] || ! $s['tasklist_id'] ) {
			return new WP_Error( 'fbc_tw_not_ready', __( 'Connect Teamwork and choose a project and QA list in Feedback → Settings first.', 'feedback-collector' ) );
		}
		if ( ! self::claim( $id ) ) {
			return new WP_Error( 'fbc_tw_busy', __( 'This item is already being pushed.', 'feedback-collector' ) );
		}

		$task    = self::build_task( $item, $client, $s );
		$task_id = $client->create_task( (int) $s['tasklist_id'], $task );

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
		$page   = home_url( $item['page_path'] ) . ( $item['page_query'] ? '?' . $item['page_query'] : '' );
		$by     = get_userdata( (int) $item['reporter_id'] );

		$html  = '' !== $item['description'] ? '<p>' . nl2br( esc_html( $item['description'] ) ) . '</p>' : '';
		$html .= '<p><strong><a href="' . esc_url( $link ) . '">' . esc_html__( 'Open the pin on the page →', 'feedback-collector' ) . '</a></strong></p><ul>';
		$html .= '<li>' . esc_html__( 'Page', 'feedback-collector' ) . ': <a href="' . esc_url( $page ) . '">' . esc_html( $item['page_path'] ) . '</a></li>';
		if ( $ctx ) {
			$html .= '<li>' . esc_html__( 'Breakpoint', 'feedback-collector' ) . ': ' . esc_html( sprintf( '%s · %d×%d @%sx', $ctx['breakpoint'] ?? '', $ctx['viewport_w'] ?? 0, $ctx['viewport_h'] ?? 0, $ctx['dpr'] ?? 1 ) ) . '</li>';
			$html .= '<li>' . esc_html__( 'Browser', 'feedback-collector' ) . ': ' . esc_html( trim( ( $ctx['browser'] ?? '' ) . ' · ' . ( $ctx['os'] ?? '' ), ' ·' ) ) . '</li>';
		}
		$html .= '<li>' . esc_html__( 'Element', 'feedback-collector' ) . ': ' . ( $anchor ? '<code>' . esc_html( (string) ( $anchor['selector'] ?? '' ) ) . '</code>' : esc_html__( 'whole page', 'feedback-collector' ) ) . '</li>';
		$html .= '<li>' . esc_html__( 'Priority', 'feedback-collector' ) . ': ' . esc_html( $labels['priority'][ $item['priority'] ] ?? $item['priority'] ) . '</li>';
		$html .= '<li>' . esc_html__( 'Reported by', 'feedback-collector' ) . ': ' . esc_html( $by ? $by->display_name : '' ) . ' (Feedback Collector #' . (int) $item['id'] . ')</li>';
		$html .= '</ul>';
		if ( ! empty( $ctx['js_errors'] ) ) {
			$html .= '<p>' . esc_html__( 'JavaScript errors on the page:', 'feedback-collector' ) . '</p><ul>';
			foreach ( $ctx['js_errors'] as $err ) {
				$html .= '<li><code>' . esc_html( (string) $err ) . '</code></li>';
			}
			$html .= '</ul>';
		}

		$task = array(
			'name'                   => sprintf( '[%s] %s', $labels['type'][ $item['type'] ] ?? $item['type'], $item['title'] ),
			'description'            => $html,
			'descriptionContentType' => 'HTML',
			'priority'               => in_array( $item['priority'], array( 'high', 'critical' ), true ) ? 'high' : $item['priority'],
		);

		$tag_id = self::tag_for_type( $item['type'], $client );
		if ( $tag_id ) {
			$task['tagIds'] = array( $tag_id );
		}

		if ( $item['assignee_id'] ) {
			$person = self::person_for_user( (int) $item['assignee_id'], $client, (int) $s['project_id'] );
			if ( $person ) {
				$task['assignees'] = array( 'userIds' => array( $person ) );
			} else {
				$user                 = get_userdata( (int) $item['assignee_id'] );
				$task['description'] .= '<p><em>' . esc_html(
					sprintf(
						/* translators: %s: user name */
						__( 'Assigned in WordPress to %s, who has no matching Teamwork account on this project.', 'feedback-collector' ),
						$user ? $user->display_name : '#' . $item['assignee_id']
					)
				) . '</em></p>';
			}
		}
		return $task;
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
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare
		$n = (int) $wpdb->query( $wpdb->prepare( 'UPDATE ' . Items::table() . " SET tw_sync_state = 'queued', tw_sync_error = NULL WHERE tw_task_id = 0 AND tw_sync_state <> 'pushing' AND id IN ($in)", $ids ) );
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
		$ids    = array_map( 'intval', $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . " WHERE tw_sync_state = 'queued' AND tw_task_id = 0 ORDER BY id ASC LIMIT %d", $limit ) ) );
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
		$remaining = (int) $wpdb->get_var( 'SELECT COUNT(*) FROM ' . Items::table() . " WHERE tw_sync_state = 'queued' AND tw_task_id = 0" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
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
		$rows = $wpdb->get_results( 'SELECT id, status, tw_task_id, tw_project_id FROM ' . Items::table() . ' WHERE tw_task_id > 0', ARRAY_A );
		$state   = (array) get_option( self::STATE_OPTION, array() );
		$started = time();

		if ( ! $rows ) {
			$state = array_merge( $state, array( 'last_sync' => $started, 'last_result' => array( 'checked' => 0, 'changed' => 0 ), 'last_error' => '' ) );
			update_option( self::STATE_OPTION, $state, false );
			return array( 'checked' => 0, 'changed' => 0 );
		}

		$by_task  = array();
		$projects = array();
		foreach ( $rows as $row ) {
			$by_task[ (int) $row['tw_task_id'] ] = $row;
			$projects[ (int) $row['tw_project_id'] ] = true;
		}
		unset( $projects[0] );

		// Overlap the window by five minutes so clock skew never drops a change.
		$since   = ! empty( $state['last_sync'] ) ? gmdate( 'Y-m-d\TH:i:s\Z', (int) $state['last_sync'] - 5 * MINUTE_IN_SECONDS ) : null;
		$checked = 0;
		$changed = 0;

		foreach ( array_keys( $projects ) as $project_id ) {
			$tasks = $client->project_tasks( $project_id, $since );
			if ( is_wp_error( $tasks ) ) {
				$state['last_error'] = $tasks->get_error_message();
				update_option( self::STATE_OPTION, $state, false );
				return $tasks;
			}
			foreach ( $tasks as $task ) {
				$row = $by_task[ (int) ( $task['id'] ?? 0 ) ] ?? null;
				if ( ! $row ) {
					continue;
				}
				++$checked;
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
			}
		}

		$state = array(
			'last_sync'   => $started,
			'last_result' => array( 'checked' => $checked, 'changed' => $changed ),
			'last_error'  => '',
		);
		update_option( self::STATE_OPTION, $state, false );
		return array( 'checked' => $checked, 'changed' => $changed );
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
		return $out;
	}

	// ------------------------------------------------------------------ admin UI

	/**
	 * Settings rows inside the main settings form.
	 */
	public static function settings_rows(): void {
		$s      = self::settings();
		$client = self::client();

		echo '<tr><th scope="row" colspan="2"><h2 style="margin:1em 0 0">' . esc_html__( 'Teamwork', 'feedback-collector' ) . '</h2></th></tr>';

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
			$has = '' !== self::decrypt( (string) $s['key_enc'] );
			printf( '<input type="password" id="fbc-tw-key" name="tw_key" class="regular-text" autocomplete="new-password" placeholder="%s" />', esc_attr( $has ? __( '•••••••• saved — leave blank to keep', 'feedback-collector' ) : '' ) );
			echo '<p class="description">' . wp_kses(
				__( 'Recommended: use a dedicated Teamwork “QA bot” user that is only on the projects it needs, and put its key in <code>wp-config.php</code> as <code>define( \'FBC_TEAMWORK_API_KEY\', \'…\' );</code> instead of saving it here.', 'feedback-collector' ),
				array( 'code' => array() )
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
			$lists = $client->tasklists( (int) $s['project_id'] );
			echo '<tr><th scope="row"><label for="fbc-tw-list">' . esc_html__( 'QA task list', 'feedback-collector' ) . '</label></th><td>';
			if ( is_wp_error( $lists ) ) {
				echo '<div class="notice inline notice-error"><p>' . esc_html( $lists->get_error_message() ) . '</p></div>';
			} else {
				echo '<select id="fbc-tw-list" name="tw_tasklist"><option value="0">' . esc_html__( '— Choose a task list —', 'feedback-collector' ) . '</option>';
				foreach ( $lists as $id => $name ) {
					printf( '<option value="%d"%s>%s</option>', (int) $id, selected( (int) $s['tasklist_id'], (int) $id, false ), esc_html( $name ) );
				}
				echo '</select><p class="description">' . esc_html__( 'Or create a fresh “QA – Round N” list with the button below.', 'feedback-collector' ) . '</p>';
			}
			echo '</td></tr>';
		}

		printf(
			'<tr><th scope="row">%1$s</th><td><label><input type="checkbox" name="tw_auto_push" value="1"%2$s /> %3$s</label></td></tr>',
			esc_html__( 'Auto-push', 'feedback-collector' ),
			checked( (bool) $s['auto_push'], true, false ),
			esc_html__( 'Push new feedback to Teamwork as soon as it is created', 'feedback-collector' )
		);
	}

	/**
	 * Saves the Teamwork fields of the settings form (nonce already checked).
	 */
	public static function save_settings(): void {
		// phpcs:disable WordPress.Security.NonceVerification.Missing
		$s = self::settings();
		if ( ! defined( 'FBC_TEAMWORK_SITE' ) && isset( $_POST['tw_site'] ) ) {
			$site = esc_url_raw( trim( wp_unslash( $_POST['tw_site'] ) ) );
			if ( $site !== $s['site'] ) {
				$s['site']         = $site;
				$s['tags']         = array();
				$s['project_id']   = 0;
				$s['tasklist_id']  = 0;
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
			} elseif ( isset( $_POST['tw_tasklist'] ) ) {
				$list = absint( $_POST['tw_tasklist'] );
				if ( $list !== (int) $s['tasklist_id'] ) {
					$s['tasklist_id'] = $list;
					$client           = self::client();
					$lists            = $client && $project ? $client->tasklists( $project ) : array();
					$s['tasklist_name'] = is_array( $lists ) ? (string) ( $lists[ $list ] ?? '' ) : '';
				}
			}
		}
		$s['auto_push'] = ! empty( $_POST['tw_auto_push'] );
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
		echo '<h2>' . esc_html__( 'Teamwork tools', 'feedback-collector' ) . '</h2><p>';
		self::button_form( 'fbc_tw_test', __( 'Test connection', 'feedback-collector' ) );
		if ( $s['project_id'] ) {
			echo ' ';
			self::button_form(
				'fbc_tw_create_list',
				/* translators: %d: round number */
				sprintf( __( 'Create “QA – Round %d” list', 'feedback-collector' ), (int) $s['round'] + 1 )
			);
		}
		echo '</p>';
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_tw_msg'] ) ) {
			$type = isset( $_GET['fbc_tw_ok'] ) && '1' === $_GET['fbc_tw_ok'] ? 'success' : 'error';
			printf( '<div class="notice notice-%s inline"><p>%s</p></div>', esc_attr( $type ), esc_html( sanitize_text_field( wp_unslash( $_GET['fbc_tw_msg'] ) ) ) );
		}
		// phpcs:enable
	}

	/**
	 * A one-button admin-post form.
	 *
	 * @param string $action Action name.
	 * @param string $label  Button label.
	 * @param array<string, int|string> $fields Extra hidden fields.
	 */
	private static function button_form( string $action, string $label, array $fields = array(), string $class = 'secondary' ): void {
		printf( '<form method="post" action="%s" style="display:inline">', esc_url( admin_url( 'admin-post.php' ) ) );
		wp_nonce_field( $action );
		printf( '<input type="hidden" name="action" value="%s" />', esc_attr( $action ) );
		foreach ( $fields as $name => $value ) {
			printf( '<input type="hidden" name="%s" value="%s" />', esc_attr( $name ), esc_attr( (string) $value ) );
		}
		submit_button( $label, $class, 'submit', false );
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
		$s      = self::settings();
		$client = self::client();
		if ( ! $client || ! $s['project_id'] ) {
			self::back_to_settings( __( 'Choose a project first.', 'feedback-collector' ), false );
		}
		$round = (int) $s['round'] + 1;
		/* translators: 1: round number, 2: date */
		$name = sprintf( __( 'QA – Round %1$d – %2$s', 'feedback-collector' ), $round, wp_date( 'Y-m-d' ) );
		$id   = $client->create_tasklist( (int) $s['project_id'], $name );
		if ( is_wp_error( $id ) ) {
			self::back_to_settings( $id->get_error_message(), false );
		}
		$s['round']         = $round;
		$s['tasklist_id']   = $id;
		$s['tasklist_name'] = $name;
		self::save( $s );
		/* translators: %s: list name */
		self::back_to_settings( sprintf( __( 'Created “%s” and set it as the active QA list.', 'feedback-collector' ), $name ), true );
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
	 * "Sync with Teamwork now".
	 */
	public static function handle_sync(): void {
		check_admin_referer( 'fbc_tw_sync' );
		if ( ! current_user_can( CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$result = self::sync();
		$args   = is_wp_error( $result )
			? array( 'fbc_sync_err' => rawurlencode( $result->get_error_message() ) )
			: array( 'fbc_synced' => $result['changed'], 'fbc_checked' => $result['checked'] );
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
			return sprintf( '<a href="%s" target="_blank" rel="noopener">#%d</a>', esc_url( self::site() . '/app/tasks/' . (int) $item['tw_task_id'] ), (int) $item['tw_task_id'] );
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
	 * Teamwork box on the detail screen.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function detail_box( array $item ): void {
		echo '<div class="postbox"><h2>' . esc_html__( 'Teamwork', 'feedback-collector' ) . '</h2>';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_tw_err'] ) ) {
			echo '<div class="notice notice-error inline"><p>' . esc_html( sanitize_text_field( wp_unslash( $_GET['fbc_tw_err'] ) ) ) . '</p></div>'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
		if ( $item['tw_task_id'] ) {
			printf(
				'<p><a class="button" href="%s" target="_blank" rel="noopener">%s</a></p><p class="description">%s</p>',
				esc_url( self::site() . '/app/tasks/' . (int) $item['tw_task_id'] ),
				/* translators: %d: task ID */
				esc_html( sprintf( __( 'Open task #%d', 'feedback-collector' ), (int) $item['tw_task_id'] ) ),
				esc_html__( 'Completing this task in Teamwork marks this item Resolved here.', 'feedback-collector' )
			);
		} elseif ( self::ready() ) {
			if ( 'error' === $item['tw_sync_state'] ) {
				echo '<div class="notice notice-error inline"><p>' . esc_html( (string) $item['tw_sync_error'] ) . '</p></div>';
			}
			$s = self::settings();
			/* translators: %s: task list name */
			echo '<p class="description">' . esc_html( sprintf( __( 'Pushes to “%s”.', 'feedback-collector' ), $s['tasklist_name'] ?: '#' . $s['tasklist_id'] ) ) . '</p><p>';
			self::button_form( 'fbc_tw_push', 'error' === $item['tw_sync_state'] ? __( 'Retry push', 'feedback-collector' ) : __( 'Push to Teamwork', 'feedback-collector' ), array( 'id' => (int) $item['id'] ), 'primary' );
			echo '</p>';
		} else {
			printf( '<p><a href="%s">%s</a></p>', esc_url( admin_url( 'admin.php?page=' . Admin::SLUG . '-settings' ) ), esc_html__( 'Connect Teamwork and choose a QA list →', 'feedback-collector' ) );
		}
		echo '</div>';
	}

	/**
	 * "Sync now" next to the page title.
	 */
	public static function header_actions(): void {
		if ( ! self::client() ) {
			return;
		}
		printf( '<form method="post" action="%s" style="display:inline-block;margin-left:8px;vertical-align:middle">', esc_url( admin_url( 'admin-post.php' ) ) );
		wp_nonce_field( 'fbc_tw_sync' );
		echo '<input type="hidden" name="action" value="fbc_tw_sync" />';
		submit_button( __( 'Sync with Teamwork', 'feedback-collector' ), 'secondary', 'submit', false );
		$state = (array) get_option( self::STATE_OPTION, array() );
		if ( ! empty( $state['last_sync'] ) ) {
			/* translators: %s: human time difference */
			printf( ' <span class="description">%s</span>', esc_html( sprintf( __( 'Last synced %s ago', 'feedback-collector' ), human_time_diff( (int) $state['last_sync'] ) ) ) );
		}
		echo '</form>';
	}

	/**
	 * Sync result notices on the list screen.
	 */
	public static function notices(): void {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_sync_err'] ) ) {
			printf( '<div class="notice notice-error is-dismissible"><p>%s</p></div>', esc_html( sanitize_text_field( wp_unslash( $_GET['fbc_sync_err'] ) ) ) );
		} elseif ( isset( $_GET['fbc_synced'] ) ) {
			$changed = absint( $_GET['fbc_synced'] );
			$checked = absint( $_GET['fbc_checked'] ?? 0 );
			printf(
				'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
				esc_html(
					sprintf(
						/* translators: 1: changed count, 2: checked count */
						__( 'Synced with Teamwork: %1$d item(s) updated, %2$d changed task(s) checked.', 'feedback-collector' ),
						$changed,
						$checked
					)
				)
			);
		}
		// phpcs:enable
	}
}
