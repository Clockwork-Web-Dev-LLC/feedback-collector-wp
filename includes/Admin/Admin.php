<?php
/**
 * Admin screens: list, detail, settings.
 *
 * @package FeedbackCollector\Admin
 */

namespace FeedbackCollector\Admin;

use FeedbackCollector\Items;
use FeedbackCollector\Rest;
use const FeedbackCollector\CAP;
use const FeedbackCollector\PLUGIN_FILE;
use const FeedbackCollector\VERSION;

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
		add_action( 'admin_enqueue_scripts', array( self::class, 'styles' ) );
		add_action( 'after_plugin_row_' . plugin_basename( PLUGIN_FILE ), array( self::class, 'plugin_row_warning' ), 10, 0 );
	}

	/**
	 * Menu entries.
	 */
	public static function menu(): void {
		$open  = Items::count_status( 'open' );
		$badge = $open ? sprintf( ' <span class="awaiting-mod count-%1$d"><span class="pending-count">%1$d</span></span>', $open ) : '';

		$hook = add_menu_page(
			__( 'Feedback', 'feedback-collector' ),
			__( 'Feedback', 'feedback-collector' ) . $badge,
			CAP,
			self::SLUG,
			array( self::class, 'render_list' ),
			'dashicons-format-chat',
			58
		);
		add_submenu_page( self::SLUG, __( 'All Feedback', 'feedback-collector' ), __( 'All Feedback', 'feedback-collector' ), CAP, self::SLUG, array( self::class, 'render_list' ) );
		add_submenu_page( self::SLUG, __( 'Feedback Settings', 'feedback-collector' ), __( 'Settings', 'feedback-collector' ), 'manage_options', self::SLUG . '-settings', array( self::class, 'render_settings' ) );

		add_action( 'load-' . $hook, array( self::class, 'process_bulk' ) );
	}

	/**
	 * Admin styles, only on our screens.
	 *
	 * @param string $hook Screen hook.
	 */
	public static function styles( string $hook ): void {
		if ( ! str_contains( $hook, self::SLUG ) ) {
			return;
		}
		wp_register_style( 'fbc-admin', false, array(), VERSION );
		wp_enqueue_style( 'fbc-admin' );
		wp_add_inline_style(
			'fbc-admin',
			'.fbc-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:12px;line-height:18px;background:#f0f0f1;color:#1d2327;white-space:nowrap}
			.fbc-type-bug{background:#fcf0f1;color:#8a2424}.fbc-type-tweak{background:#fcf9e8;color:#6e4e00}.fbc-type-change{background:#f0f6fc;color:#0a4b78}.fbc-type-comment{background:#f6f0fc;color:#5b2a86}
			.fbc-status-open{background:#fff;border:1px solid #c3c4c7}.fbc-status-in_progress{background:#f0f6fc;color:#0a4b78}.fbc-status-ready_for_review{background:#fcf9e8;color:#6e4e00}.fbc-status-resolved{background:#edfaef;color:#005c12}
			.fbc-bp{color:#646970;font-size:11px}.fbc-detail{display:grid;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);gap:20px;max-width:1200px}
			.fbc-detail .postbox{padding:0 16px 12px}.fbc-meta th{text-align:left;padding:4px 12px 4px 0;color:#646970;font-weight:500;vertical-align:top;white-space:nowrap}.fbc-meta td{padding:4px 0;word-break:break-word}
			.fbc-thread li{border-left:3px solid #c3c4c7;padding:4px 10px;margin:0 0 10px}.fbc-thread li.activity{border-color:#dcdcde;color:#646970;font-size:12px}
			.fbc-desc{white-space:pre-wrap}@media (max-width:960px){.fbc-detail{grid-template-columns:1fr}}'
		);
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
		$url = home_url( $item['page_path'] ) . ( $item['page_query'] ? '?' . $item['page_query'] : '' );
		return add_query_arg( 'fbc_item', (int) $item['id'], $url );
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

		echo '<div class="wrap"><h1 class="wp-heading-inline">' . esc_html__( 'Feedback', 'feedback-collector' ) . '</h1>';
		do_action( 'fbc_list_header_actions' );
		echo '<hr class="wp-header-end">';

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_done'] ) ) {
			/* translators: %d: number of items */
			printf( '<div class="notice notice-success is-dismissible"><p>%s</p></div>', esc_html( sprintf( _n( '%d item updated.', '%d items updated.', absint( $_GET['fbc_done'] ), 'feedback-collector' ), absint( $_GET['fbc_done'] ) ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}
		do_action( 'fbc_list_notices' );

		echo '<form method="get">';
		printf( '<input type="hidden" name="page" value="%s" />', esc_attr( self::SLUG ) );
		$table->search_box( __( 'Search feedback', 'feedback-collector' ), 'fbc-search' );
		$table->display();
		echo '</form></div>';
	}

	/**
	 * Detail screen.
	 *
	 * @param int $id Item ID.
	 */
	private static function render_detail( int $id ): void {
		$item = Items::get( $id );
		echo '<div class="wrap">';
		printf( '<p><a href="%s">&larr; %s</a></p>', esc_url( admin_url( 'admin.php?page=' . self::SLUG ) ), esc_html__( 'All feedback', 'feedback-collector' ) );
		if ( ! $item ) {
			echo '<div class="notice notice-error"><p>' . esc_html__( 'Feedback item not found.', 'feedback-collector' ) . '</p></div></div>';
			return;
		}

		$labels   = Items::labels();
		$ctx      = is_array( $item['context'] ) ? $item['context'] : array();
		$anchor   = is_array( $item['anchor'] ) ? $item['anchor'] : array();
		$reporter = get_userdata( $item['reporter_id'] );

		printf(
			'<h1>#%1$d %2$s <span class="fbc-badge fbc-type-%3$s">%4$s</span></h1>',
			(int) $item['id'],
			esc_html( $item['title'] ),
			esc_attr( $item['type'] ),
			esc_html( $labels['type'][ $item['type'] ] ?? $item['type'] )
		);
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_saved'] ) ) {
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Saved.', 'feedback-collector' ) . '</p></div>';
		}

		echo '<div class="fbc-detail"><div>';

		echo '<div class="postbox"><h2>' . esc_html__( 'Description', 'feedback-collector' ) . '</h2>';
		echo '<div class="fbc-desc">' . ( '' !== $item['description'] ? esc_html( $item['description'] ) : '<em>' . esc_html__( 'No description.', 'feedback-collector' ) . '</em>' ) . '</div>';
		printf( '<p><a class="button button-primary" href="%s" target="_blank" rel="noopener">%s</a></p>', esc_url( self::view_on_page_url( $item ) ), esc_html__( 'View on page', 'feedback-collector' ) );
		echo '</div>';

		echo '<div class="postbox"><h2>' . esc_html__( 'Thread', 'feedback-collector' ) . '</h2><ul class="fbc-thread">';
		foreach ( Items::comments( $item['id'] ) as $c ) {
			printf(
				'<li class="%1$s"><strong>%2$s</strong> <span class="fbc-bp">%3$s</span><div class="fbc-desc">%4$s</div></li>',
				esc_attr( $c['kind'] ),
				esc_html( $c['user_name'] ),
				esc_html( get_date_from_gmt( gmdate( 'Y-m-d H:i:s', strtotime( $c['created_at'] ) ), get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) ),
				esc_html( $c['body'] )
			);
		}
		echo '</ul>';
		printf( '<form method="post" action="%s">', esc_url( admin_url( 'admin-post.php' ) ) );
		wp_nonce_field( 'fbc_comment_' . $item['id'] );
		printf( '<input type="hidden" name="action" value="fbc_comment" /><input type="hidden" name="id" value="%d" />', (int) $item['id'] );
		echo '<textarea name="body" rows="3" class="large-text" required></textarea>';
		submit_button( __( 'Add reply', 'feedback-collector' ), 'secondary', 'submit', false );
		echo '</form></div>';

		echo '</div><div>';

		printf( '<div class="postbox"><h2>%s</h2><form method="post" action="%s">', esc_html__( 'Triage', 'feedback-collector' ), esc_url( admin_url( 'admin-post.php' ) ) );
		wp_nonce_field( 'fbc_update_' . $item['id'] );
		printf( '<input type="hidden" name="action" value="fbc_update" /><input type="hidden" name="id" value="%d" />', (int) $item['id'] );
		echo '<p><label>' . esc_html__( 'Status', 'feedback-collector' ) . '<br />' . self::select( 'status', $labels['status'], $item['status'] ) . '</label></p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<p><label>' . esc_html__( 'Priority', 'feedback-collector' ) . '<br />' . self::select( 'priority', $labels['priority'], $item['priority'] ) . '</label></p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo '<p><label>' . esc_html__( 'Type', 'feedback-collector' ) . '<br />' . self::select( 'type', $labels['type'], $item['type'] ) . '</label></p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		$people = array( '0' => __( 'Unassigned', 'feedback-collector' ) );
		foreach ( Rest::reviewer_list() as $r ) {
			$people[ (string) $r['id'] ] = $r['name'];
		}
		echo '<p><label>' . esc_html__( 'Assignee', 'feedback-collector' ) . '<br />' . self::select( 'assignee_id', $people, (string) $item['assignee_id'] ) . '</label></p>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		submit_button( __( 'Save', 'feedback-collector' ), 'primary', 'submit', false );
		echo '</form>';
		do_action( 'fbc_detail_sidebar', $item );
		echo '</div>';

		$rows = array(
			__( 'Page', 'feedback-collector' )         => '<a href="' . esc_url( home_url( $item['page_path'] ) ) . '" target="_blank" rel="noopener">' . esc_html( $item['page_path'] . ( $item['page_query'] ? '?' . $item['page_query'] : '' ) ) . '</a>',
			__( 'Page title', 'feedback-collector' )   => esc_html( $item['page_title'] ),
			__( 'Breakpoint', 'feedback-collector' )   => esc_html( trim( ( $ctx['breakpoint'] ?? '' ) . ' · ' . ( $ctx['viewport_w'] ?? '?' ) . '×' . ( $ctx['viewport_h'] ?? '?' ) . ' @' . ( $ctx['dpr'] ?? 1 ) . 'x', ' ·' ) ),
			__( 'Browser', 'feedback-collector' )      => esc_html( $ctx['browser'] ?? '' ),
			__( 'OS', 'feedback-collector' )           => esc_html( $ctx['os'] ?? '' ),
			__( 'Element', 'feedback-collector' )      => $anchor ? '<code>' . esc_html( $anchor['selector'] ?? '' ) . '</code>' : esc_html__( 'Page note', 'feedback-collector' ),
			__( 'Element text', 'feedback-collector' ) => esc_html( $anchor['text'] ?? '' ),
			__( 'Post', 'feedback-collector' )         => ! empty( $ctx['post_id'] ) ? '<a href="' . esc_url( (string) get_edit_post_link( (int) $ctx['post_id'] ) ) . '">' . esc_html( ( $ctx['post_type'] ?? '' ) . ' #' . $ctx['post_id'] ) . '</a>' : '—',
			__( 'Theme', 'feedback-collector' )        => esc_html( $ctx['theme'] ?? '' ),
			__( 'Reporter', 'feedback-collector' )     => esc_html( $reporter ? $reporter->display_name : '' ),
			__( 'Created', 'feedback-collector' )      => esc_html( get_date_from_gmt( $item['created_at'], get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) ),
		);
		if ( ! empty( $ctx['js_errors'] ) ) {
			$rows[ __( 'JS errors', 'feedback-collector' ) ] = '<code>' . implode( '</code><br><code>', array_map( 'esc_html', $ctx['js_errors'] ) ) . '</code>';
		}
		echo '<div class="postbox"><h2>' . esc_html__( 'Captured context', 'feedback-collector' ) . '</h2><table class="fbc-meta">';
		foreach ( $rows as $label => $html ) {
			printf( '<tr><th>%s</th><td>%s</td></tr>', esc_html( $label ), $html ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above.
		}
		echo '</table></div>';

		echo '</div></div></div>';
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
		if ( isset( $_POST['assignee_id'] ) ) {
			$assignee = absint( $_POST['assignee_id'] );
			if ( 0 === $assignee || user_can( $assignee, CAP ) ) {
				$changes['assignee_id'] = $assignee;
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
		$roles   = (array) get_option( 'fbc_review_roles', array( 'administrator', 'editor' ) );
		$cleanup = (bool) get_option( 'fbc_delete_on_uninstall' );

		echo '<div class="wrap"><h1>' . esc_html__( 'Feedback Settings', 'feedback-collector' ) . '</h1>';
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_saved'] ) ) {
			echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved.', 'feedback-collector' ) . '</p></div>';
		}
		printf( '<form method="post" action="%s">', esc_url( admin_url( 'admin-post.php' ) ) );
		wp_nonce_field( 'fbc_settings' );
		echo '<input type="hidden" name="action" value="fbc_settings" /><table class="form-table" role="presentation">';

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

		printf(
			'<tr><th scope="row">%1$s</th><td><label><input type="checkbox" name="delete_on_uninstall" value="1"%2$s /> %3$s</label></td></tr>',
			esc_html__( 'Uninstall', 'feedback-collector' ),
			checked( $cleanup, true, false ),
			esc_html__( 'Delete all feedback data when the plugin is deleted', 'feedback-collector' )
		);

		do_action( 'fbc_settings_rows' );
		echo '</table>';
		submit_button();
		echo '</form>';
		do_action( 'fbc_settings_after' );
		echo '</div>';
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

		do_action( 'fbc_save_settings' );

		wp_safe_redirect( add_query_arg( 'fbc_saved', 1, admin_url( 'admin.php?page=' . self::SLUG . '-settings' ) ) );
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
