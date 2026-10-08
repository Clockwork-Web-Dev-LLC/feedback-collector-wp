<?php
/**
 * One-time move from the 0.3 names (fbc_) to the fbcol_ prefix.
 *
 * WordPress.org asks for a prefix of at least four characters, so 0.4 renamed every table,
 * option, user-meta key, scheduled job and the capability. Sites that ran 0.3 or earlier
 * keep everything: this renames it all in place on the first load after the update.
 *
 * Self-contained (no other plugin classes beyond Cleanup's name lists), so uninstall can
 * use the legacy lists too.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Renames the old fbc_ data to fbcol_.
 */
final class Migrate {

	private const OLD = 'fbc_';
	private const NEW = 'fbcol_';

	/** Plugin tables (without $wpdb->prefix). */
	private const TABLES = array( 'items', 'comments' );

	/**
	 * Whether this site still has 0.3-era data (its schema version lives under the old name).
	 */
	public static function needed(): bool {
		return false !== get_option( self::OLD . 'db_version' );
	}

	/**
	 * The 0.3 name of an fbcol_ identifier.
	 *
	 * @param string $name New name.
	 */
	public static function legacy( string $name ): string {
		return str_starts_with( $name, self::NEW ) ? self::OLD . substr( $name, strlen( self::NEW ) ) : $name;
	}

	/**
	 * Renames everything. Safe to run more than once: anything already moved is left alone,
	 * and nothing under a new name is ever overwritten.
	 */
	public static function run(): void {
		global $wpdb;

		// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.DirectDatabaseQuerySchemaChange
		foreach ( self::TABLES as $table ) {
			$old = $wpdb->prefix . self::OLD . $table;
			$new = $wpdb->prefix . self::NEW . $table;
			if ( $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $old ) ) && ! $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $new ) ) ) {
				$wpdb->query( $wpdb->prepare( 'RENAME TABLE %i TO %i', $old, $new ) );
			}
		}

		foreach ( Cleanup::OPTIONS as $new ) {
			$old   = self::legacy( $new );
			$value = get_option( $old, null );
			if ( null === $value ) {
				continue;
			}
			if ( false === get_option( $new ) ) {
				$autoload = (string) $wpdb->get_var( $wpdb->prepare( "SELECT autoload FROM {$wpdb->options} WHERE option_name = %s", $old ) );
				add_option( $new, $value, '', in_array( $autoload, array( 'yes', 'on', 'auto', 'auto-on' ), true ) );
			}
			delete_option( $old );
		}

		foreach ( Cleanup::USER_META as $new ) {
			$wpdb->update( $wpdb->usermeta, array( 'meta_key' => $new ), array( 'meta_key' => self::legacy( $new ) ) ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		}
		wp_cache_flush_group( 'user_meta' );

		// Cached Teamwork lists are rebuilt on demand; just drop the old copies.
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$wpdb->esc_like( '_transient_' . self::OLD . 'tw_' ) . '%',
				$wpdb->esc_like( '_transient_timeout_' . self::OLD . 'tw_' ) . '%'
			)
		);
		// phpcs:enable

		// Scheduled jobs: same time and interval under the new hook (the interval names moved too).
		foreach ( Cleanup::CRON_HOOKS as $new ) {
			$old  = self::legacy( $new );
			$next = wp_next_scheduled( $old );
			$freq = wp_get_schedule( $old );
			wp_clear_scheduled_hook( $old );
			if ( ! $next || wp_next_scheduled( $new ) ) {
				continue;
			}
			$freq = $freq ? str_replace( self::OLD, self::NEW, $freq ) : '';
			if ( '' !== $freq && isset( wp_get_schedules()[ $freq ] ) ) {
				wp_schedule_event( $next, $freq, $new );
			} else {
				wp_schedule_single_event( $next, $new );
			}
		}

		foreach ( wp_roles()->role_objects as $role ) {
			if ( $role->has_cap( self::OLD . 'review' ) ) {
				$role->add_cap( CAP );
				$role->remove_cap( self::OLD . 'review' );
			}
		}
		// Individual users granted the capability directly.
		foreach ( get_users(
			array(
				'capability' => self::OLD . 'review',
				'fields'     => 'all',
			)
		) as $user ) {
			if ( isset( $user->caps[ self::OLD . 'review' ] ) ) {
				$user->add_cap( CAP );
				$user->remove_cap( self::OLD . 'review' );
			}
		}
	}
}
