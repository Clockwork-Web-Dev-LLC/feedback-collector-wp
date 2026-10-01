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

// Screenshots (the plugin's classes aren't loaded during uninstall, so this is inline).
$fbc_uploads = wp_upload_dir( null, false );
$fbc_dir     = trailingslashit( $fbc_uploads['basedir'] ) . 'fbc-screenshots';
if ( is_dir( $fbc_dir ) ) {
	foreach ( (array) glob( $fbc_dir . '/*' ) as $fbc_file ) {
		if ( is_file( (string) $fbc_file ) ) {
			wp_delete_file( (string) $fbc_file );
		}
	}
	rmdir( $fbc_dir ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_rmdir
}

foreach ( array( 'fbc_db_version', 'fbc_delete_on_uninstall', 'fbc_review_roles', 'fbc_teamwork', 'fbc_tw_state', 'fbc_branding', 'fbc_assignee_source', 'fbc_round', 'fbc_screenshots' ) as $option ) {
	delete_option( $option );
}

foreach ( wp_roles()->role_objects as $fbc_role ) {
	$fbc_role->remove_cap( 'fbc_review' );
}
