<?php
/**
 * Admin screens: list, detail, settings, branding.
 *
 * @package FeedbackCollector\Admin
 */

namespace FeedbackCollector\Admin;

use FeedbackCollector\Assignees;
use FeedbackCollector\Branding;
use FeedbackCollector\Items;
use FeedbackCollector\Rest;
use FeedbackCollector\Rounds;
use const FeedbackCollector\CAP;
use const FeedbackCollector\PLUGIN_FILE;

defined( 'ABSPATH' ) || exit;

/**
 * Registers and renders the admin UI.
 */
final class Admin {

	public const SLUG = 'feedback-collector';

	/**
	 * Hooks.
	 */
	public static function register(): void {
		add_action( 'admin_menu', array( self::class, 'menu' ) );
		add_action( 'admin_post_fbc_update', array( self::class, 'handle_update' ) );
		add_action( 'admin_post_fbc_comment', array( self::class, 'handle_comment' ) );
		add_action( 'admin_post_fbc_settings', array( self::class, 'handle_settings' ) );
		add_action( 'admin_post_fbc_branding', array( self::class, 'handle_branding' ) );
		add_action( 'admin_post_fbc_start_round', array( self::class, 'handle_start_round' ) );
		add_action( 'admin_post_fbc_purge', array( self::class, 'handle_purge' ) );
		add_action( 'admin_post_fbc_export_csv', array( self::class, 'handle_export_csv' ) );
		// Late, so Clockwork Companion's stylesheet is already enqueued and can be removed.
		add_action( 'admin_enqueue_scripts', array( Layout::class, 'enqueue' ), 100 );
		add_filter( 'all_plugins', array( Branding::class, 'plugins_list' ) );
		add_action( 'after_plugin_row_' . plugin_basename( PLUGIN_FILE ), array( self::class, 'plugin_row_warning' ), 10, 0 );
	}

	/**
	 * Menu entries.
	 */
	public static function menu(): void {
		$open  = Items::count_status( 'open' );
		$badge = $open ? sprintf( ' <span class="awaiting-mod count-%1$d"><span class="pending-count">%1$d</span></span>', $open ) : '';
		$label = Branding::text( 'menu_label' );
		$name  = Branding::text( 'name' );

		$hook = add_menu_page( $name, esc_html( $label ) . $badge, CAP, self::SLUG, array( self::class, 'render_list' ), Branding::menu_icon(), 58 );
		add_submenu_page( self::SLUG, $name, __( 'All Feedback', 'feedback-collector' ), CAP, self::SLUG, array( self::class, 'render_list' ) );
		add_submenu_page( self::SLUG, $name . ' — ' . __( 'Settings', 'feedback-collector' ), __( 'Settings', 'feedback-collector' ), 'manage_options', self::SLUG . '-settings', array( self::class, 'render_settings' ) );
		add_submenu_page( self::SLUG, $name . ' — ' . __( 'Branding', 'feedback-collector' ), __( 'Branding', 'feedback-collector' ), 'manage_options', self::SLUG . '-branding', array( self::class, 'render_branding' ) );

		add_action( 'load-' . $hook, array( self::class, 'process_bulk' ) );
	}

	/**
	 * Detail URL for an item.
	 *
	 * @param int $id Item ID.
	 */
	public static function item_url( int $id ): string {
		return add_query_arg(
			array(
				'page' => self::SLUG,
				'item' => $id,
			),
			admin_url( 'admin.php' )
		);
	}

	/**
	 * Front-end deep link that opens the item's pin.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function view_on_page_url( array $item ): string {
		return add_query_arg( 'fbc_item', (int) $item['id'], Items::page_url( $item ) );
	}

	/**
	 * Handles bulk actions before any output.
	 */
	public static function process_bulk(): void {
		if ( empty( $_REQUEST['ids'] ) || ! current_user_can( CAP ) ) {
			return;
		}
		check_admin_referer( 'bulk-feedback' );

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$action = sanitize_key( wp_unslash( $_REQUEST['action'] ?? '' ) );
		if ( '-1' === $action || '' === $action ) {
			$action = sanitize_key( wp_unslash( $_REQUEST['action2'] ?? '' ) );
		}
		$ids = array_map( 'absint', (array) wp_unslash( $_REQUEST['ids'] ) );

		$done = 0;
		if ( str_starts_with( $action, 'status_' ) ) {
			$status = substr( $action, 7 );
			if ( in_array( $status, Items::STATUSES, true ) ) {
				foreach ( $ids as $id ) {
					$done += Items::update( $id, array( 'status' => $status ) ) ? 1 : 0;
				}
			}
		} elseif ( 'delete' === $action ) {
			foreach ( $ids as $id ) {
				$item = Items::get( $id );
				if ( $item && Rest::can_delete( $item ) ) {
					$done += Items::delete( $id ) ? 1 : 0;
				}
			}
		} else {
			$done = (int) apply_filters( 'fbc_handle_bulk_action', 0, $action, $ids );
		}

		$back = remove_query_arg( array( 'ids', 'action', 'action2', '_wpnonce', '_wp_http_referer' ), wp_get_referer() ?: admin_url( 'admin.php?page=' . self::SLUG ) );
		wp_safe_redirect( add_query_arg( 'fbc_done', $done, $back ) );
		exit;
	}

	/**
	 * List screen, or a detail screen when ?item= is set.
	 */
	public static function render_list(): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$item_id = isset( $_GET['item'] ) ? absint( $_GET['item'] ) : 0;
		if ( $item_id ) {
			self::render_detail( $item_id );
			return;
		}

		$table = new ItemsTable();
		$table->prepare_items();

		$current = Rounds::current();
		Layout::render(
			'feedback',
			__( 'Feedback', 'feedback-collector' ),
			/* translators: %d: current QA round */
			sprintf( __( 'QA Round %d is in progress. Turn on Feedback mode from the admin bar to add more.', 'feedback-collector' ), $current ),
			static function () use ( $table, $current ): void {
				// phpcs:disable WordPress.Security.NonceVerification.Recommended
				if ( isset( $_GET['fbc_done'] ) ) {
					$n = absint( $_GET['fbc_done'] );
					/* translators: %d: number of items */
					printf( '<div class="notice notice-success is-dismissible"><p>%s</p></div>', esc_html( sprintf( _n( '%d item updated.', '%d items updated.', $n, 'feedback-collector' ), $n ) ) );
				}
				if ( isset( $_GET['fbc_round_started'] ) ) {
					$msg = sprintf(
						/* translators: %d: round number */
						__( 'Round %d started. New feedback goes into this round.', 'feedback-collector' ),
						absint( $_GET['fbc_round_started'] )
					);
					if ( isset( $_GET['fbc_round_tw'] ) ) {
						$msg .= ' ' . ( '1' === $_GET['fbc_round_tw']
							? __( 'Its Teamwork QA list was created and is now active.', 'feedback-collector' )
							: __( 'The Teamwork QA list could not be created; create it in Settings.', 'feedback-collector' ) );
					}
					printf( '<div class="notice notice-success is-dismissible"><p>%s</p></div>', esc_html( $msg ) );
				}
				// phpcs:enable
				do_action( 'fbc_list_notices' );

				// Per-round summary: what's left from earlier rounds at a glance. Each chip filters the list.
				$active_round = (int) ( ItemsTable::filters()['round'] ?? 0 );
				echo '<nav class="fbc-rounds" aria-label="' . esc_attr__( 'QA rounds', 'feedback-collector' ) . '">';
				printf(
					'<a class="fbc-round%s" href="%s">%s</a>',
					0 === $active_round ? ' is-active' : '',
					esc_url( remove_query_arg( array( 'fbc_round', 'paged' ) ) ),
					esc_html__( 'All rounds', 'feedback-collector' )
				);
				foreach ( Rounds::summary() as $round => $counts ) {
					printf(
						'<a class="fbc-round%1$s" href="%2$s"><strong>%3$s</strong> <span>%4$s</span></a>',
						$round === $active_round ? ' is-active' : '',
						esc_url( add_query_arg( 'fbc_round', $round, remove_query_arg( 'paged' ) ) ),
						esc_html(
							$round === $current
								/* translators: %d: round number */
								? sprintf( __( 'Round %d · current', 'feedback-collector' ), $round )
								/* translators: %d: round number */
								: sprintf( __( 'Round %d', 'feedback-collector' ), $round )
						),
						esc_html(
							sprintf(
								/* translators: 1: open count, 2: resolved count */
								__( '%1$d open · %2$d resolved', 'feedback-collector' ),
								$counts['open'],
								$counts['resolved']
							)
						)
					);
				}
				echo '</nav>';

				Layout::card_open( '', true );
				echo '<form method="get">';
				printf( '<input type="hidden" name="page" value="%s" />', esc_attr( self::SLUG ) );
				$table->search_box( __( 'Search feedback', 'feedback-collector' ), 'fbc-search' );
				$table->display();
				echo '</form>';
				Layout::card_close();
			},
			static function () use ( $current ): void {
				do_action( 'fbc_list_header_actions' );
				if ( current_user_can( 'manage_options' ) ) {
					printf( '<form method="post" action="%s">', esc_url( admin_url( 'admin-post.php' ) ) );
					wp_nonce_field( 'fbc_start_round' );
					echo '<input type="hidden" name="action" value="fbc_start_round" />';
					printf(
						'<button type="submit" class="button button-primary" onclick="return confirm(%1$s)">%2$s</button>',
						esc_attr( wp_json_encode( sprintf( /* translators: %d: next round */ __( 'Start QA Round %d? New feedback will go into the new round. Existing items keep their round.', 'feedback-collector' ), $current + 1 ) ) ),
						/* translators: %d: next round number */
						esc_html( sprintf( __( 'Start Round %d', 'feedback-collector' ), $current + 1 ) )
					);
					echo '</form>';
				}
			}
		);
	}

	/**
	 * Detail screen.
	 *
	 * @param int $id Item ID.
	 */
	private static function render_detail( int $id ): void {
		$item = Items::get( $id );
		if ( ! $item ) {
			Layout::render(
				'feedback',
				__( 'Not found', 'feedback-collector' ),
				'',
				static function (): void {
					echo '<div class="fbc-callout fbc-callout--muted">' . esc_html__( 'This feedback item no longer exists.', 'feedback-collector' ) . '</div>';
				}
			);
			return;
		}

		$labels = Items::labels();
		Layout::render(
			'feedback',
			sprintf( '#%d %s', $item['id'], $item['title'] ),
			'',
			static function () use ( $item, $labels ): void {
				$ctx      = is_array( $item['context'] ) ? $item['context'] : array();
				$anchor   = is_array( $item['anchor'] ) ? $item['anchor'] : array();
				$reporter = get_userdata( $item['reporter_id'] );

				printf( '<a class="fbc-admin__back" href="%s">&larr; %s</a>', esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ), esc_html__( 'All feedback', 'feedback-collector' ) );
				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				if ( isset( $_GET['fbc_saved'] ) ) {
					echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Saved.', 'feedback-collector' ) . '</p></div>';
				}

				echo '<div class="fbc-grid"><div>';

				Layout::card_open( __( 'Description', 'feedback-collector' ), false, Layout::pill( $item['type'], $labels['type'][ $item['type'] ] ?? $item['type'] ) . ' ' . Layout::pill( $item['status'], $labels['status'][ $item['status'] ] ?? $item['status'] ) );
				echo '<p class="fbc-desc">' . ( '' !== $item['description'] ? esc_html( $item['description'] ) : '<em>' . esc_html__( 'No description.', 'feedback-collector' ) . '</em>' ) . '</p>';
				printf( '<p><a class="button button-primary" href="%s" target="_blank" rel="noopener">%s</a></p>', esc_url( self::view_on_page_url( $item ) ), esc_html__( 'View on page', 'feedback-collector' ) );
				Layout::card_close();

				$shot = \FeedbackCollector\Screenshots::url( $item );
				if ( '' !== $shot ) {
					Layout::card_open( __( 'Screenshot', 'feedback-collector' ) );
					printf(
						'<a href="%1$s" target="_blank" rel="noopener" class="fbc-shot"><img src="%1$s" alt="%2$s" /></a>',
						esc_url( $shot ),
						esc_attr__( 'Screenshot of the page when this feedback was filed', 'feedback-collector' )
					);
					Layout::card_close();
				}

				Layout::card_open( __( 'Thread', 'feedback-collector' ) );
				$thread = Items::comments( $item['id'] );
				if ( $thread ) {
					echo '<ul class="fbc-thread">';
					foreach ( $thread as $c ) {
						printf(
							'<li class="%1$s"><strong>%2$s</strong><span class="when">%3$s</span><div class="fbc-desc">%4$s</div></li>',
							esc_attr( $c['kind'] ),
							esc_html( $c['user_name'] ),
							esc_html( get_date_from_gmt( gmdate( 'Y-m-d H:i:s', strtotime( $c['created_at'] ) ), get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) ),
							esc_html( $c['body'] )
						);
					}
					echo '</ul>';
				}
				printf( '<form method="post" action="%s">', esc_url( admin_url( 'admin-post.php' ) ) );
				wp_nonce_field( 'fbc_comment_' . $item['id'] );
				printf( '<input type="hidden" name="action" value="fbc_comment" /><input type="hidden" name="id" value="%d" />', (int) $item['id'] );
				echo '<p><textarea name="body" rows="3" class="large-text" required placeholder="' . esc_attr__( 'Reply…', 'feedback-collector' ) . '"></textarea></p>';
				submit_button( __( 'Add reply', 'feedback-collector' ), 'secondary', 'submit', false );
				echo '</form>';
				Layout::card_close();

				$rows = array(
					__( 'Page', 'feedback-collector' )     => '<a href="' . esc_url( Items::page_url( $item ) ) . '" target="_blank" rel="noopener">' . esc_html( $item['page_path'] ) . '</a>',
					__( 'Page title', 'feedback-collector' ) => esc_html( $item['page_title'] ),
					__( 'Breakpoint', 'feedback-collector' ) => esc_html( trim( ( $ctx['breakpoint'] ?? '' ) . ' · ' . ( $ctx['viewport_w'] ?? '?' ) . '×' . ( $ctx['viewport_h'] ?? '?' ) . ' @' . ( $ctx['dpr'] ?? 1 ) . 'x', ' ·' ) . ( ! empty( $ctx['preview'] ) ? ' · ' . $ctx['preview'] . ' ' . __( 'device preview', 'feedback-collector' ) : '' ) ),
					__( 'Browser', 'feedback-collector' )  => esc_html( trim( ( $ctx['browser'] ?? '' ) . ' · ' . ( $ctx['os'] ?? '' ), ' ·' ) ),
					__( 'Element', 'feedback-collector' )  => $anchor ? '<code>' . esc_html( $anchor['selector'] ?? '' ) . '</code>' : esc_html__( 'Whole page', 'feedback-collector' ),
					__( 'Element text', 'feedback-collector' ) => esc_html( $anchor['text'] ?? '' ),
					__( 'Post', 'feedback-collector' )     => ! empty( $ctx['post_id'] ) ? '<a href="' . esc_url( (string) get_edit_post_link( (int) $ctx['post_id'] ) ) . '">' . esc_html( ( $ctx['post_type'] ?? '' ) . ' #' . $ctx['post_id'] ) . '</a>' : '—',
					__( 'Theme', 'feedback-collector' )    => esc_html( $ctx['theme'] ?? '' ),
					__( 'Reporter', 'feedback-collector' ) => esc_html( $reporter ? $reporter->display_name : '' ),
					__( 'Created', 'feedback-collector' )  => esc_html( get_date_from_gmt( $item['created_at'], get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) ),
				);
				if ( ! empty( $ctx['js_errors'] ) ) {
					$rows[ __( 'JS errors', 'feedback-collector' ) ] = '<code>' . implode( '</code><br><code>', array_map( 'esc_html', $ctx['js_errors'] ) ) . '</code>';
				}
				Layout::card_open( __( 'Captured context', 'feedback-collector' ) );
				echo '<dl class="fbc-defs">';
				foreach ( $rows as $label => $html ) {
					printf( '<dt>%s</dt><dd>%s</dd>', esc_html( $label ), $html ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
				}
				echo '</dl>';
				Layout::card_close();

				echo '</div><div>';

				Layout::card_open( __( 'Triage', 'feedback-collector' ) );
				printf( '<form method="post" action="%s">', esc_url( admin_url( 'admin-post.php' ) ) );
				wp_nonce_field( 'fbc_update_' . $item['id'] );
				printf( '<input type="hidden" name="action" value="fbc_update" /><input type="hidden" name="id" value="%d" />', (int) $item['id'] );
				foreach ( array(
					'status'   => array( __( 'Status', 'feedback-collector' ), $labels['status'], $item['status'] ),
					'priority' => array( __( 'Priority', 'feedback-collector' ), $labels['priority'], $item['priority'] ),
					'type'     => array( __( 'Type', 'feedback-collector' ), $labels['type'], $item['type'] ),
				) as $field => $def ) {
					echo '<p><label><strong>' . esc_html( $def[0] ) . '</strong><br />' . self::select( $field, $def[1], (string) $def[2] ) . '</label></p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- select() escapes.
				}
				$assignees = Assignees::options();
				$source    = 'teamwork' === $assignees['source'] ? __( 'Teamwork', 'feedback-collector' ) : __( 'WordPress', 'feedback-collector' );
				echo '<p><strong>' . esc_html__( 'Assignee', 'feedback-collector' ) . '</strong> <span class="fbc-bp">' . esc_html( $source ) . '</span><br />';
				if ( Assignees::locked( $item ) ) {
					$name = Assignees::name( $item );
					echo esc_html( '' !== $name ? $name : __( 'Unassigned', 'feedback-collector' ) ) . '<br /><span class="description">' . esc_html__( 'In Teamwork now: change the assignee there.', 'feedback-collector' ) . '</span>';
				} else {
					$people = array( '0' => __( 'Unassigned', 'feedback-collector' ) );
					foreach ( $assignees['people'] as $r ) {
						$people[ (string) $r['id'] ] = $r['name'];
					}
					echo self::select( 'assignee_id', $people, (string) Assignees::selected( $item ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- select() escapes.
					if ( '' !== $assignees['error'] ) {
						echo '<br /><span class="description">' . esc_html( $assignees['error'] ) . '</span>';
					} elseif ( ! empty( $assignees['fallback'] ) ) {
						printf(
							'<br /><span class="description">%s <a href="%s">%s</a></span>',
							esc_html__( 'Showing WordPress users until Teamwork is connected.', 'feedback-collector' ),
							esc_url( admin_url( 'admin.php?page=' . self::SLUG . '-settings' ) ),
							esc_html__( 'Connect Teamwork', 'feedback-collector' )
						);
					}
				}
				echo '</p>';
				submit_button( __( 'Save', 'feedback-collector' ), 'primary', 'submit', false );
				echo '</form>';
				Layout::card_close();

				do_action( 'fbc_detail_sidebar', $item );

				echo '</div></div>';
			}
		);
	}

	/**
	 * Escaped select element.
	 *
	 * @param string                $name     Field.
	 * @param array<string, string> $options  value => label.
	 * @param string                $selected Current.
	 */
	private static function select( string $name, array $options, string $selected ): string {
		$html = sprintf( '<select name="%s">', esc_attr( $name ) );
		foreach ( $options as $value => $label ) {
			$html .= sprintf( '<option value="%s"%s>%s</option>', esc_attr( (string) $value ), selected( (string) $value, $selected, false ), esc_html( $label ) );
		}
		return $html . '</select>';
	}

	/**
	 * Saves the triage form.
	 */
	public static function handle_update(): void {
		$id = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
		check_admin_referer( 'fbc_update_' . $id );
		if ( ! current_user_can( CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$changes = array();
		foreach ( array(
			'status'   => Items::STATUSES,
			'priority' => Items::PRIORITIES,
			'type'     => Items::TYPES,
		) as $field => $allowed ) {
			$value = isset( $_POST[ $field ] ) ? sanitize_key( wp_unslash( $_POST[ $field ] ) ) : '';
			if ( in_array( $value, $allowed, true ) ) {
				$changes[ $field ] = $value;
			}
		}
		$item = Items::get( $id );
		if ( $item && isset( $_POST['assignee_id'] ) && ! Assignees::locked( $item ) ) {
			$wanted = absint( $_POST['assignee_id'] );
			if ( Assignees::selected( $item ) !== $wanted ) {
				$assignee = Assignees::resolve( $wanted );
				if ( ! is_wp_error( $assignee ) ) {
					$changes = array_merge( $changes, $assignee );
				}
			}
		}
		Items::update( $id, $changes );
		wp_safe_redirect( add_query_arg( 'fbc_saved', 1, self::item_url( $id ) ) );
		exit;
	}

	/**
	 * Saves a reply from the detail screen.
	 */
	public static function handle_comment(): void {
		$id = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
		check_admin_referer( 'fbc_comment_' . $id );
		if ( ! current_user_can( CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$body = isset( $_POST['body'] ) ? sanitize_textarea_field( wp_unslash( $_POST['body'] ) ) : '';
		if ( '' !== $body && Items::get( $id ) ) {
			Items::add_comment( $id, $body );
		}
		wp_safe_redirect( self::item_url( $id ) );
		exit;
	}

	/**
	 * Settings screen.
	 */
	public static function render_settings(): void {
		Layout::render(
			'settings',
			__( 'Settings', 'feedback-collector' ),
			__( 'Who can leave feedback, what happens on uninstall, and the Teamwork connection.', 'feedback-collector' ),
			static function (): void {
				$roles   = (array) get_option( 'fbc_review_roles', array( 'administrator', 'editor' ) );
				$cleanup = (bool) get_option( 'fbc_delete_on_uninstall' );

				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				if ( isset( $_GET['fbc_saved'] ) ) {
					echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved.', 'feedback-collector' ) . '</p></div>';
				}

				printf( '<form method="post" action="%s">', esc_url( admin_url( 'admin-post.php' ) ) );
				wp_nonce_field( 'fbc_settings' );
				echo '<input type="hidden" name="action" value="fbc_settings" />';

				Layout::card_open( __( 'Reviewers', 'feedback-collector' ) );
				echo '<table class="form-table" role="presentation">';
				echo '<tr><th scope="row">' . esc_html__( 'Who can leave feedback', 'feedback-collector' ) . '</th><td><fieldset>';
				foreach ( wp_roles()->get_names() as $slug => $name ) {
					$locked = 'administrator' === $slug;
					printf(
						'<label><input type="checkbox" name="roles[]" value="%1$s"%2$s%3$s /> %4$s</label><br />',
						esc_attr( $slug ),
						checked( $locked || in_array( $slug, $roles, true ), true, false ),
						disabled( $locked, true, false ),
						esc_html( translate_user_role( $name ) )
					);
				}
				echo '<p class="description">' . esc_html__( 'Reviewers see the Feedback toggle in the admin bar and can be assigned items.', 'feedback-collector' ) . '</p></fieldset></td></tr>';
				$pref    = Assignees::preference();
				$tw_note = 'teamwork' === $pref && 'wordpress' === Assignees::source()
					? '<p class="description">' . esc_html__( 'Teamwork isn’t connected with a project yet, so WordPress users are used until it is.', 'feedback-collector' ) . '</p>'
					: '';
				printf(
					'<tr><th scope="row">%1$s</th><td><fieldset><label><input type="radio" name="assignee_source" value="teamwork"%2$s /> %3$s</label><br /><label><input type="radio" name="assignee_source" value="wordpress"%4$s /> %5$s</label><p class="description">%6$s</p>%7$s</fieldset></td></tr>',
					esc_html__( 'Assign feedback to', 'feedback-collector' ),
					checked( $pref, 'teamwork', false ),
					esc_html__( 'Teamwork project members (recommended)', 'feedback-collector' ),
					checked( $pref, 'wordpress', false ),
					esc_html__( 'WordPress users on this site', 'feedback-collector' ),
					esc_html__( 'Who appears in the Assignee dropdowns. With Teamwork, the person you pick is assigned on the Teamwork task directly; once pushed, change the assignee in Teamwork.', 'feedback-collector' ),
					$tw_note // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
				);
				printf(
					'<tr><th scope="row">%1$s</th><td><label><input type="checkbox" name="screenshots" value="1"%2$s /> %3$s</label><p class="description">%4$s</p></td></tr>',
					esc_html__( 'Screenshots', 'feedback-collector' ),
					checked( \FeedbackCollector\Screenshots::enabled(), true, false ),
					esc_html__( 'Attach a screenshot of what the reviewer sees to each new item', 'feedback-collector' ),
					esc_html__( 'Captured in the browser, with typed form values masked. Stored in uploads/fbc-screenshots and attached to the Teamwork task.', 'feedback-collector' )
				);
				printf(
					'<tr><th scope="row">%1$s</th><td><label><input type="checkbox" name="delete_on_uninstall" value="1"%2$s /> %3$s</label></td></tr>',
					esc_html__( 'Uninstall', 'feedback-collector' ),
					checked( $cleanup, true, false ),
					esc_html__( 'Delete all feedback data when the plugin is deleted', 'feedback-collector' )
				);
				echo '</table>';
				Layout::card_close();

				Layout::card_open( __( 'Teamwork', 'feedback-collector' ) );
				echo '<table class="form-table" role="presentation">';
				do_action( 'fbc_settings_rows' );
				echo '</table>';
				Layout::card_close();

				submit_button();
				echo '</form>';
				do_action( 'fbc_settings_after' );
				self::render_remove_card();
			}
		);
	}

	/**
	 * Saves settings and syncs the review capability onto roles.
	 */
	public static function handle_settings(): void {
		check_admin_referer( 'fbc_settings' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$valid = array_keys( wp_roles()->get_names() );
		$roles = array_values( array_intersect( array_map( 'sanitize_key', (array) wp_unslash( $_POST['roles'] ?? array() ) ), $valid ) );
		$roles = array_unique( array_merge( array( 'administrator' ), $roles ) );

		foreach ( wp_roles()->role_objects as $slug => $role ) {
			if ( in_array( $slug, $roles, true ) ) {
				$role->add_cap( CAP );
			} else {
				$role->remove_cap( CAP );
			}
		}
		update_option( 'fbc_review_roles', $roles, false );
		update_option( 'fbc_delete_on_uninstall', ! empty( $_POST['delete_on_uninstall'] ), false );
		update_option( \FeedbackCollector\Screenshots::OPTION, empty( $_POST['screenshots'] ) ? '0' : '1', false );
		update_option( Assignees::OPTION, isset( $_POST['assignee_source'] ) && 'wordpress' === $_POST['assignee_source'] ? 'wordpress' : 'teamwork', false );

		do_action( 'fbc_save_settings' );

		wp_safe_redirect( add_query_arg( 'fbc_saved', 1, admin_url( 'admin.php?page=' . self::SLUG . '-settings' ) ) );
		exit;
	}

	/**
	 * Branding (white-label) screen.
	 */
	public static function render_branding(): void {
		Layout::render(
			'branding',
			__( 'Branding', 'feedback-collector' ),
			__( 'White-label the plugin: the name, logo and colors shown in wp-admin, on the Plugins screen, in the on-page toolbar and in Teamwork tasks.', 'feedback-collector' ),
			static function (): void {
				$b = Branding::get();
				$d = Branding::defaults();

				// phpcs:ignore WordPress.Security.NonceVerification.Recommended
				if ( isset( $_GET['fbc_saved'] ) ) {
					echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Branding saved.', 'feedback-collector' ) . '</p></div>';
				}
				if ( has_filter( 'fbc_branding' ) ) {
					echo '<div class="fbc-callout">' . esc_html__( 'Some values are being set in code with the fbc_branding filter and override what you save here.', 'feedback-collector' ) . '</div>';
				}

				printf( '<form method="post" action="%s">', esc_url( admin_url( 'admin-post.php' ) ) );
				wp_nonce_field( 'fbc_branding' );
				echo '<input type="hidden" name="action" value="fbc_branding" />';

				$text = static function ( string $key, string $label, string $help = '' ) use ( $b, $d ): void {
					printf(
						'<tr><th scope="row"><label for="fbc-b-%1$s">%2$s</label></th><td><input type="text" class="regular-text" id="fbc-b-%1$s" name="branding[%1$s]" value="%3$s" placeholder="%4$s" />%5$s</td></tr>',
						esc_attr( $key ),
						esc_html( $label ),
						esc_attr( (string) $b[ $key ] ),
						esc_attr( (string) $d[ $key ] ),
						'' !== $help ? '<p class="description">' . esc_html( $help ) . '</p>' : ''
					);
				};

				Layout::card_open( __( 'Names', 'feedback-collector' ) );
				echo '<table class="form-table" role="presentation">';
				$text( 'name', __( 'Plugin name', 'feedback-collector' ), __( 'Shown on the Plugins screen, page titles and in Teamwork tasks.', 'feedback-collector' ) );
				$text( 'product_label', __( 'Header label', 'feedback-collector' ), __( 'Shown beside the logo in the header band.', 'feedback-collector' ) );
				$text( 'menu_label', __( 'Menu label', 'feedback-collector' ), __( 'The wp-admin sidebar item and the admin-bar toggle.', 'feedback-collector' ) );
				$text( 'author', __( 'Author', 'feedback-collector' ), __( 'Shown on the Plugins screen.', 'feedback-collector' ) );
				printf(
					'<tr><th scope="row"><label for="fbc-b-author_uri">%1$s</label></th><td><input type="url" class="regular-text" id="fbc-b-author_uri" name="branding[author_uri]" value="%2$s" placeholder="%3$s" /></td></tr>',
					esc_html__( 'Author URL', 'feedback-collector' ),
					esc_attr( (string) $b['author_uri'] ),
					esc_attr( (string) $d['author_uri'] )
				);
				echo '</table>';
				Layout::card_close();

				$logo = Branding::logo_url();
				Layout::card_open( __( 'Logo & colors', 'feedback-collector' ) );
				echo '<table class="form-table" role="presentation">';
				printf(
					'<tr><th scope="row"><label for="fbc-b-logo_url">%1$s</label></th><td><input type="url" class="regular-text" id="fbc-b-logo_url" name="branding[logo_url]" value="%2$s" placeholder="%3$s" /> <button type="button" class="button" id="fbc-b-logo-pick">%4$s</button><p class="description">%5$s</p><div class="fbc-logo-preview" id="fbc-b-logo-preview">%6$s</div></td></tr>',
					esc_html__( 'Logo', 'feedback-collector' ),
					esc_attr( (string) $b['logo_url'] ),
					esc_attr__( 'Clockwork logo', 'feedback-collector' ),
					esc_html__( 'Choose…', 'feedback-collector' ),
					esc_html__( 'Sits on the header color below, so use a light logo on a dark header (or change the header color). Leave empty for the Clockwork logo; a different plugin name with no logo shows the header label as text.', 'feedback-collector' ),
					'' !== $logo ? '<img src="' . esc_url( $logo ) . '" alt="" />' : '<em>' . esc_html__( 'No logo: the header label shows as text', 'feedback-collector' ) . '</em>'
				);
				foreach ( array(
					'primary' => array( __( 'Primary color', 'feedback-collector' ), __( 'Buttons, links, active tabs, pins outline.', 'feedback-collector' ) ),
					'dark'    => array( __( 'Header color', 'feedback-collector' ), __( 'Header band and the on-page toolbar.', 'feedback-collector' ) ),
					'accent'  => array( __( 'Accent color', 'feedback-collector' ), __( 'The stripe under the header and small highlights. Text never sits on it.', 'feedback-collector' ) ),
				) as $key => $def ) {
					printf(
						'<tr><th scope="row"><label for="fbc-b-%1$s">%2$s</label></th><td><input type="text" class="small-text code" id="fbc-b-%1$s" name="branding[%1$s]" value="%3$s" pattern="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?" style="width:7em" /><span class="fbc-swatch" style="background:%3$s"></span><p class="description">%4$s</p></td></tr>',
						esc_attr( $key ),
						esc_html( $def[0] ),
						esc_attr( (string) $b[ $key ] ),
						esc_html( $def[1] . ' ' . sprintf( /* translators: %s: hex color */ __( 'Default %s.', 'feedback-collector' ), $d[ $key ] ) )
					);
				}
				printf(
					'<tr><th scope="row">%1$s</th><td><label><input type="checkbox" name="branding[show_credit]" value="1"%2$s /> %3$s</label></td></tr>',
					esc_html__( 'Credit', 'feedback-collector' ),
					checked( (bool) $b['show_credit'], true, false ),
					esc_html__( 'Show “Powered by Clockwork Feedback Collector” at the bottom of these screens when white-labeled', 'feedback-collector' )
				);
				echo '</table>';
				Layout::card_close();

				echo '<p class="submit">';
				submit_button( __( 'Save branding', 'feedback-collector' ), 'primary', 'submit', false );
				echo ' <button type="submit" class="button" name="reset" value="1">' . esc_html__( 'Reset to Clockwork defaults', 'feedback-collector' ) . '</button></p>';
				echo '</form>';
				?>
				<script>
				( function () {
					var pick = document.getElementById( 'fbc-b-logo-pick' );
					var input = document.getElementById( 'fbc-b-logo_url' );
					var preview = document.getElementById( 'fbc-b-logo-preview' );
					if ( ! pick || ! window.wp || ! wp.media ) { if ( pick ) { pick.style.display = 'none'; } return; }
					var frame;
					pick.addEventListener( 'click', function () {
						frame = frame || wp.media( { title: pick.textContent, library: { type: 'image' }, multiple: false } );
						frame.off( 'select' ).on( 'select', function () {
							var url = frame.state().get( 'selection' ).first().get( 'url' );
							input.value = url;
							var img = document.createElement( 'img' );
							img.src = url;
							img.alt = '';
							preview.replaceChildren( img );
						} );
						frame.open();
					} );
				} )();
				</script>
				<?php
			}
		);
	}

	/**
	 * "Remove all data" card at the bottom of Settings (the done-with-QA cleanup).
	 */
	private static function render_remove_card(): void {
		$inv = \FeedbackCollector\Cleanup::inventory();
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_purge_error'] ) ) {
			echo '<div class="notice notice-error"><p>' . esc_html__( 'Type DELETE in the box to confirm.', 'feedback-collector' ) . '</p></div>';
		}
		Layout::card_open( __( 'Remove all data', 'feedback-collector' ) );
		echo '<p>' . esc_html__( 'Done with QA on this site? This deletes everything the plugin created, then deactivates it so you can delete it from the Plugins screen:', 'feedback-collector' ) . '</p><ul class="ul-disc">';
		/* translators: 1: item count, 2: reply count */
		echo '<li>' . esc_html( sprintf( __( '%1$d feedback items and %2$d replies (the database tables)', 'feedback-collector' ), $inv['items'], $inv['comments'] ) ) . '</li>';
		/* translators: %d: screenshot count */
		echo '<li>' . esc_html( sprintf( __( '%d screenshots in uploads/fbc-screenshots', 'feedback-collector' ), $inv['screenshots'] ) ) . '</li>';
		echo '<li>' . esc_html__( 'All settings (including the Teamwork key and branding), cached Teamwork data, scheduled sync jobs, and the reviewer capability on every role', 'feedback-collector' ) . '</li></ul>';
		echo '<p class="description">' . esc_html__( 'Tasks already in Teamwork are not touched.', 'feedback-collector' ) . '</p>';
		if ( $inv['unpushed'] ) {
			echo '<div class="fbc-callout">' . esc_html(
				sprintf(
					/* translators: %d: count */
					_n( '%d unresolved item has not been pushed to Teamwork and will be lost.', '%d unresolved items have not been pushed to Teamwork and will be lost.', $inv['unpushed'], 'feedback-collector' ),
					$inv['unpushed']
				)
			) . '</div>';
		}
		printf( '<form method="post" action="%s" class="fbc-remove-form">', esc_url( admin_url( 'admin-post.php' ) ) );
		wp_nonce_field( 'fbc_purge' );
		echo '<input type="hidden" name="action" value="fbc_purge" />';
		printf(
			'<p><label for="fbc-purge-confirm">%1$s</label><br /><input type="text" id="fbc-purge-confirm" name="confirm" autocomplete="off" class="regular-text" placeholder="DELETE" /></p>',
			esc_html__( 'Type DELETE to confirm. This cannot be undone.', 'feedback-collector' )
		);
		submit_button( __( 'Remove all data and deactivate', 'feedback-collector' ), 'delete fbc-danger', 'submit', false );
		echo '</form>';
		Layout::card_close();
	}

	/**
	 * Removes all plugin data, then deactivates the plugin.
	 */
	public static function handle_purge(): void {
		check_admin_referer( 'fbc_purge' );
		if ( ! current_user_can( 'manage_options' ) || ! current_user_can( 'activate_plugins' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$confirm = isset( $_POST['confirm'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['confirm'] ) ) ) : '';
		if ( 'DELETE' !== $confirm ) {
			wp_safe_redirect( add_query_arg( 'fbc_purge_error', 1, admin_url( 'admin.php?page=' . self::SLUG . '-settings' ) ) );
			exit;
		}
		\FeedbackCollector\Cleanup::purge();
		deactivate_plugins( plugin_basename( PLUGIN_FILE ) );
		wp_safe_redirect( admin_url( 'plugins.php?deactivate=true' ) );
		exit;
	}

	/**
	 * Starts the next QA round (and its Teamwork list when connected).
	 */
	public static function handle_start_round(): void {
		check_admin_referer( 'fbc_start_round' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		$result = Rounds::start_next();
		$args   = array(
			'page'              => self::SLUG,
			'fbc_round_started' => $result['round'],
		);
		if ( null !== $result['teamwork'] ) {
			$args['fbc_round_tw'] = is_wp_error( $result['teamwork'] ) ? '0' : '1';
		}
		wp_safe_redirect( add_query_arg( $args, admin_url( 'admin.php' ) ) );
		exit;
	}

	/**
	 * Saves or resets branding.
	 */
	public static function handle_branding(): void {
		check_admin_referer( 'fbc_branding' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}
		if ( ! empty( $_POST['reset'] ) ) {
			delete_option( Branding::OPTION );
		} else {
			$input = isset( $_POST['branding'] ) && is_array( $_POST['branding'] ) ? wp_unslash( $_POST['branding'] ) : array(); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Branding::sanitize() sanitizes every field.
			update_option( Branding::OPTION, Branding::sanitize( $input ), false );
		}
		wp_safe_redirect( add_query_arg( 'fbc_saved', 1, admin_url( 'admin.php?page=' . self::SLUG . '-branding' ) ) );
		exit;
	}

	/**
	 * Exports feedback items as a CSV file matching active filters.
	 */
	public static function handle_export_csv(): void {
		check_admin_referer( 'fbc_export_csv' );
		if ( ! current_user_can( CAP ) ) {
			wp_die( esc_html__( 'Not allowed.', 'feedback-collector' ), 403 );
		}

		$filters = array_filter( ItemsTable::filters(), static fn( $v ) => '' !== $v );
		if ( isset( $filters['assignee_id'] ) && 'teamwork' === Assignees::source() ) {
			$filters['tw_assignee_id'] = $filters['assignee_id'];
			unset( $filters['assignee_id'] );
		}

		$filename = sprintf( 'feedback-export-%s.csv', gmdate( 'Y-m-d-His' ) );

		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
		header( 'Pragma: no-cache' );
		header( 'Expires: 0' );

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fopen
		$out = fopen( 'php://output', 'w' );
		if ( false === $out ) {
			exit;
		}

		// UTF-8 BOM for Microsoft Excel compatibility.
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		fwrite( $out, "\xEF\xBB\xBF" );

		fputcsv(
			$out,
			array(
				'#',
				'Round',
				'Type',
				'Status',
				'Priority',
				'Title',
				'Description',
				'Page Path',
				'Page URL',
				'Breakpoint',
				'Viewport',
				'Browser',
				'OS',
				'Reporter',
				'Assignee',
				'Teamwork Task ID',
				'Teamwork Task URL',
				'Created At',
				'Updated At',
			)
		);

		$paged = 1;
		do {
			$query_args = array_merge(
				$filters,
				array(
					'orderby'  => 'id',
					'order'    => 'asc',
					'per_page' => 500,
					'paged'    => $paged,
				)
			);
			$result = Items::query( $query_args );

			foreach ( $result['items'] as $item ) {
				$reporter      = get_userdata( (int) $item['reporter_id'] );
				$reporter_name = $reporter ? $reporter->display_name : ( (string) ( $item['reporter_email'] ?? '' ) );
				$assignee_name = Assignees::name( $item );
				$tw_task_id    = (int) ( $item['tw_task_id'] ?? 0 );
				$tw_url        = $tw_task_id > 0 ? (string) apply_filters( 'fbc_teamwork_task_url', '', $tw_task_id ) : '';

				fputcsv(
					$out,
					array(
						(int) $item['id'],
						(int) $item['round'],
						(string) $item['type'],
						(string) $item['status'],
						(string) $item['priority'],
						(string) $item['title'],
						(string) $item['description'],
						(string) $item['page_path'],
						Items::page_url( $item ),
						(string) ( $item['breakpoint'] ?? '' ),
						(string) ( $item['viewport'] ?? '' ),
						(string) ( $item['browser'] ?? '' ),
						(string) ( $item['os'] ?? '' ),
						$reporter_name,
						$assignee_name,
						$tw_task_id > 0 ? $tw_task_id : '',
						$tw_url,
						(string) $item['created_at'],
						(string) $item['updated_at'],
					)
				);
			}

			$paged++;
		} while ( count( $result['items'] ) === 500 && ( ( $paged - 1 ) * 500 ) < $result['total'] );

		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_fclose
		fclose( $out );
		exit;
	}

	/**
	 * Warns on the Plugins screen while unresolved, unpushed items remain,
	 * since the plugin is removed before go-live.
	 */
	public static function plugin_row_warning(): void {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$pending = (int) $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM %i WHERE tw_task_id = 0 AND status != %s', Items::table(), 'resolved' ) );
		if ( ! $pending ) {
			return;
		}
		printf(
			'<tr class="plugin-update-tr active"><td colspan="4" class="plugin-update colspanchange"><div class="notice inline notice-warning notice-alt"><p>%s <a href="%s">%s</a></p></div></td></tr>',
			esc_html(
				sprintf(
					/* translators: %d: number of items */
					_n( '%d unresolved feedback item has not been pushed to Teamwork. Removing this plugin deletes it from view.', '%d unresolved feedback items have not been pushed to Teamwork. Removing this plugin deletes them from view.', $pending, 'feedback-collector' ),
					$pending
				)
			),
			esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ),
			esc_html__( 'Review feedback', 'feedback-collector' )
		);
	}
}
