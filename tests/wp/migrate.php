<?php
require __DIR__ . '/_guard.php';
/**
 * 0.3 → 0.4: everything stored under fbc_ is renamed to fbcol_ without losing anything.
 * Turns the current install back into the 0.3 layout, runs the migration, and checks the result.
 * Leaves the database as it found it (the migration itself is the restore).
 *
 * @package FeedbackCollector
 */

use FeedbackCollector\Cleanup;
use FeedbackCollector\Frontend;
use FeedbackCollector\Items;
use FeedbackCollector\Migrate;
use FeedbackCollector\Teamwork\Teamwork;

global $wpdb;
wp_set_current_user( 1 );
$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};
$has_table = static fn( string $t ) => (bool) $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->prefix . $t ) );

// A real item and reply to follow through the rename.
$id = Items::create(
	array(
		'type'  => 'bug',
		'title' => 'Survives the rename',
	)
);
Items::add_comment( $id, 'a reply', 'comment' );
update_option( 'fbcol_round', 4 );
update_option( 'fbcol_teamwork', array( 'site' => 'https://x.teamwork.com', 'key_enc' => 'abc' ) );
update_user_meta( 1, 'fbcol_prefs', array( 'corner' => 'tl' ) );
$check( 'fresh installs need no migration', ! Migrate::needed() );

// ---------------------------------------------------------------- back to the 0.3 layout
// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.DirectDatabaseQuerySchemaChange
foreach ( array( 'items', 'comments' ) as $t ) {
	$wpdb->query( $wpdb->prepare( 'RENAME TABLE %i TO %i', $wpdb->prefix . 'fbcol_' . $t, $wpdb->prefix . 'fbc_' . $t ) );
}
$saved = array();
foreach ( Cleanup::OPTIONS as $opt ) {
	$v = get_option( $opt, null );
	if ( null !== $v ) {
		$saved[ $opt ] = $v;
		update_option( Migrate::legacy( $opt ), $v, 'fbcol_db_version' !== $opt );
		delete_option( $opt );
	}
}
$wpdb->update( $wpdb->usermeta, array( 'meta_key' => 'fbc_prefs' ), array( 'meta_key' => 'fbcol_prefs' ) );
wp_cache_flush();
$roles_with_cap = array();
foreach ( wp_roles()->role_objects as $slug => $role ) {
	if ( $role->has_cap( 'fbcol_review' ) ) {
		$roles_with_cap[] = $slug;
		$role->add_cap( 'fbc_review' );
		$role->remove_cap( 'fbcol_review' );
	}
}
wp_clear_scheduled_hook( Teamwork::SYNC_HOOK );
$when = time() + 600;
wp_schedule_event( $when, 'fbcol_fifteen_minutes', 'fbc_tw_sync' );
set_transient( 'fbc_tw_projects', array( 'stale' ), 60 );
// phpcs:enable

$check( 'the 0.3 layout is detected', Migrate::needed() );

// ---------------------------------------------------------------- migrate
Migrate::run();
wp_cache_flush();

$check( 'tables renamed: fbc_items/fbc_comments → fbcol_items/fbcol_comments', $has_table( 'fbcol_items' ) && $has_table( 'fbcol_comments' ) && ! $has_table( 'fbc_items' ) && ! $has_table( 'fbc_comments' ) );
$item = Items::get( $id );
$check( 'the item and its reply are intact', $item && 'Survives the rename' === $item['title'] && in_array( 'a reply', array_column( Items::comments( $id ), 'body' ), true ) );
$moved = true;
foreach ( $saved as $opt => $v ) {
	$moved = $moved && get_option( $opt ) == $v && false === get_option( Migrate::legacy( $opt ) ); // phpcs:ignore Universal.Operators.StrictComparisons
}
$check( 'every option moved with its value (' . count( $saved ) . ' options), none left under fbc_', $moved && count( $saved ) >= 3 );
$check( 'Teamwork settings came across (connection kept)', 'https://x.teamwork.com' === ( get_option( 'fbcol_teamwork' )['site'] ?? '' ) );
$check( 'user preferences moved', array( 'corner' => 'tl' ) === get_user_meta( 1, 'fbcol_prefs', true ) && '' === get_user_meta( 1, 'fbc_prefs', true ) );
$caps_ok = (bool) $roles_with_cap;
foreach ( $roles_with_cap as $slug ) {
	$caps_ok = $caps_ok && get_role( $slug )->has_cap( 'fbcol_review' ) && ! get_role( $slug )->has_cap( 'fbc_review' );
}
$check( 'the reviewer capability moved on every role (' . implode( ', ', $roles_with_cap ) . ')', $caps_ok );
$check( 'the sync job kept its time and interval under the new hook', $when === wp_next_scheduled( 'fbcol_tw_sync' ) && 'fbcol_fifteen_minutes' === wp_get_schedule( 'fbcol_tw_sync' ) && ! wp_next_scheduled( 'fbc_tw_sync' ) );
$check( 'old cached Teamwork lists dropped', false === get_transient( 'fbc_tw_projects' ) );
$check( 'migration done: not needed again', ! Migrate::needed() );
Migrate::run();
$check( 'running it twice changes nothing', Items::get( $id )['title'] === 'Survives the rename' && $has_table( 'fbcol_items' ) );

// ---------------------------------------------------------------- 0.3 names still honoured
$_GET['fbc_item'] = (string) $id;
$check( 'an old ?fbc_item= link from a Teamwork task still opens its pin', $id === Frontend::config()['openItem'] );
unset( $_GET['fbc_item'] );
define( 'FBC_TEAMWORK_SITE', 'https://legacy.teamwork.com' );
$check( 'an old FBC_TEAMWORK_SITE constant in wp-config still works', 'https://legacy.teamwork.com' === Teamwork::site() );

Items::delete( $id );
printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
echo "cleanup done\n";
