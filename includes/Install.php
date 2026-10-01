<?php
/**
 * Activation, schema and capability setup.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Creates and upgrades the plugin tables.
 */
final class Install {

	/**
	 * Runs on plugin activation.
	 */
	public static function activate(): void {
		self::create_tables();
		self::grant_default_caps();
		update_option( 'fbc_db_version', DB_VERSION, false );
	}

	/**
	 * Re-runs dbDelta when the stored schema version is behind.
	 */
	public static function maybe_upgrade(): void {
		if ( get_option( 'fbc_db_version' ) !== DB_VERSION ) {
			self::create_tables();
			update_option( 'fbc_db_version', DB_VERSION, false );
		}
	}

	/**
	 * Grants the review capability to administrators and editors.
	 */
	public static function grant_default_caps(): void {
		foreach ( array( 'administrator', 'editor' ) as $role_name ) {
			$role = get_role( $role_name );
			if ( $role && ! $role->has_cap( CAP ) ) {
				$role->add_cap( CAP );
			}
		}
	}

	/**
	 * Creates both tables with dbDelta.
	 */
	public static function create_tables(): void {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$charset = $wpdb->get_charset_collate();
		$items   = $wpdb->prefix . 'fbc_items';
		$comments = $wpdb->prefix . 'fbc_comments';

		dbDelta(
			"CREATE TABLE {$items} (
				id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
				type varchar(20) NOT NULL DEFAULT 'bug',
				status varchar(20) NOT NULL DEFAULT 'open',
				priority varchar(10) NOT NULL DEFAULT 'medium',
				title varchar(255) NOT NULL DEFAULT '',
				description longtext NOT NULL,
				page_path varchar(2048) NOT NULL DEFAULT '/',
				page_hash char(32) NOT NULL DEFAULT '',
				page_query varchar(2048) NOT NULL DEFAULT '',
				page_title varchar(255) NOT NULL DEFAULT '',
				anchor longtext NULL,
				context longtext NULL,
				breakpoint varchar(10) NOT NULL DEFAULT '',
				reporter_id bigint(20) unsigned NOT NULL DEFAULT 0,
				assignee_id bigint(20) unsigned NOT NULL DEFAULT 0,
				tw_task_id bigint(20) unsigned NOT NULL DEFAULT 0,
				tw_project_id bigint(20) unsigned NOT NULL DEFAULT 0,
				tw_sync_state varchar(20) NOT NULL DEFAULT '',
				tw_sync_error text NULL,
				created_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
				updated_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
				PRIMARY KEY  (id),
				KEY page_hash (page_hash),
				KEY status (status),
				KEY assignee_id (assignee_id)
			) {$charset};"
		);

		dbDelta(
			"CREATE TABLE {$comments} (
				id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
				item_id bigint(20) unsigned NOT NULL,
				user_id bigint(20) unsigned NOT NULL DEFAULT 0,
				kind varchar(20) NOT NULL DEFAULT 'comment',
				body longtext NOT NULL,
				created_at datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
				PRIMARY KEY  (id),
				KEY item_id (item_id)
			) {$charset};"
		);
	}
}
