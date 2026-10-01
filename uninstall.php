<?php
/**
 * Uninstall: data is removed only when the site opted in.
 *
 * @package FeedbackCollector
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

if ( ! get_option( 'fbc_delete_on_uninstall' ) ) {
	return;
}

global $wpdb;
// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}fbc_comments" );
$wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}fbc_items" );
// phpcs:enable

foreach ( array( 'fbc_db_version', 'fbc_delete_on_uninstall', 'fbc_review_roles', 'fbc_teamwork' ) as $option ) {
	delete_option( $option );
}

foreach ( wp_roles()->role_objects as $role ) {
	$role->remove_cap( 'fbc_review' );
}
