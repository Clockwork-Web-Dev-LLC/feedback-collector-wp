<?php
/**
 * Removes every trace of the plugin from the site.
 *
 * Self-contained (no other plugin classes), so uninstall.php can use it too: WordPress runs
 * uninstall without loading the plugin.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Tables, options, cached Teamwork data, scheduled jobs, the capability and screenshot files.
 */
final class Cleanup {

	/** Every option the plugin writes. */
	public const OPTIONS = array(
		'fbc_db_version',
		'fbc_delete_on_uninstall',
		'fbc_review_roles',
		'fbc_teamwork',
		'fbc_tw_state',
		'fbc_branding',
		'fbc_assignee_source',
		'fbc_round',
		'fbc_screenshots',
	);

	/** Every WP-Cron hook the plugin schedules. */
	public const CRON_HOOKS = array( 'fbc_tw_sync', 'fbc_tw_queue' );

	/**
	 * What a purge would remove, for the confirmation screen.
	 *
	 * @return array{items: int, comments: int, screenshots: int, unpushed: int}
	 */
	public static function inventory(): array {
		global $wpdb;
		$items    = $wpdb->prefix . 'fbc_items';
		$comments = $wpdb->prefix . 'fbc_comments';
		// phpcs:disable WordPress.DB.DirectDatabaseQuery
		$has   = (bool) $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $items ) );
		$count = static fn( string $sql ) => $has ? (int) $wpdb->get_var( $sql ) : 0; // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		$out   = array(
			'items'       => $count( $wpdb->prepare( 'SELECT COUNT(*) FROM %i', $items ) ),
			'comments'    => $count( $wpdb->prepare( 'SELECT COUNT(*) FROM %i', $comments ) ),
			'screenshots' => count( self::screenshot_files() ),
			'unpushed'    => $count( $wpdb->prepare( 'SELECT COUNT(*) FROM %i WHERE tw_task_id = 0 AND status <> %s', $items, 'resolved' ) ),
		);
		// phpcs:enable
		return $out;
	}

	/**
	 * Deletes everything. Safe to run more than once.
	 *
	 * @return array{tables: int, options: int, transients: int, files: int} What was removed.
	 */
	public static function purge(): array {
		global $wpdb;
		$removed = array(
			'tables'     => 0,
			'options'    => 0,
			'transients' => 0,
			'files'      => 0,
		);

		// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.DirectDatabaseQuerySchemaChange
		foreach ( array( 'fbc_comments', 'fbc_items' ) as $table ) {
			$name = $wpdb->prefix . $table;
			if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $name ) ) ) {
				$wpdb->query( $wpdb->prepare( 'DROP TABLE %i', $name ) );
				++$removed['tables'];
			}
		}

		foreach ( self::OPTIONS as $option ) {
			if ( false !== get_option( $option ) ) {
				delete_option( $option );
				++$removed['options'];
			}
		}

		// Cached Teamwork projects and people lists (fbc_tw_*), including their timeouts.
		$removed['transients'] = (int) $wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$wpdb->esc_like( '_transient_fbc_tw_' ) . '%',
				$wpdb->esc_like( '_transient_timeout_fbc_tw_' ) . '%'
			)
		);
		// phpcs:enable
		wp_cache_flush_group( 'transient' );

		foreach ( self::CRON_HOOKS as $hook ) {
			wp_clear_scheduled_hook( $hook );
		}

		foreach ( wp_roles()->role_objects as $role ) {
			$role->remove_cap( 'fbc_review' );
		}

		foreach ( self::screenshot_files() as $file ) {
			wp_delete_file( $file );
			++$removed['files'];
		}
		$dir = self::screenshot_dir();
		if ( is_dir( $dir ) ) {
			foreach ( (array) glob( $dir . '/{,.}*', GLOB_BRACE ) as $leftover ) {
				if ( is_file( (string) $leftover ) ) {
					wp_delete_file( (string) $leftover );
				}
			}
			rmdir( $dir ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_rmdir
		}

		return $removed;
	}

	/**
	 * Screenshot folder path.
	 */
	private static function screenshot_dir(): string {
		$uploads = wp_upload_dir( null, false );
		return trailingslashit( $uploads['basedir'] ) . 'fbc-screenshots';
	}

	/**
	 * Image files in the screenshot folder.
	 *
	 * @return string[]
	 */
	private static function screenshot_files(): array {
		$dir = self::screenshot_dir();
		if ( ! is_dir( $dir ) ) {
			return array();
		}
		return array_values( array_filter( (array) glob( $dir . '/*.{jpg,png,webp}', GLOB_BRACE ), 'is_file' ) );
	}
}
