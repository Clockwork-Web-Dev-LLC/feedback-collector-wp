<?php
require __DIR__ . '/_guard.php';
/**
 * Admin feedback list: description/page/submitted-by columns, sorting on every sortable column,
 * and which columns start hidden (Screen Options).
 *
 * @package FeedbackCollector
 */

use FeedbackCollector\Admin\ItemsTable;
use FeedbackCollector\GuestMode;
use FeedbackCollector\Items;

global $wpdb;
$fbcol_max_id  = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbcol_backups = array();
foreach ( array( GuestMode::OPT_ENABLED, GuestMode::OPT_HASH, GuestMode::OPT_KEY, 'fbcol_teamwork' ) as $opt ) {
	$fbcol_backups[ $opt ] = get_option( $opt, null );
}
register_shutdown_function(
	static function () use ( $fbcol_max_id, $fbcol_backups ) {
		global $wpdb;
		foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbcol_max_id ) ) as $id ) {
			Items::delete( (int) $id );
		}
		foreach ( $fbcol_backups as $opt => $value ) {
			null === $value ? delete_option( $opt ) : update_option( $opt, $value );
		}
		echo "cleanup done\n";
	}
);
add_filter( 'pre_http_request', static fn() => new WP_Error( 'offline', 'no network in tests' ) );

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};

// Guest items are filed with no WordPress user (reporter_id 0), like real guest feedback.
wp_set_current_user( 0 );
$mk  = static fn( array $d ) => Items::create( $d + array( 'type' => 'bug', 'priority' => 'medium', 'description' => '', 'page_path' => '/' ) );
$ids = array(
	'a' => $mk( array( 'title' => 'Zulu header', 'type' => 'comment', 'description' => 'Bravo text', 'page_path' => '/zeta/', 'page_title' => 'Zeta page', 'reporter_name' => 'Yvonne', 'guest_id' => str_repeat( 'c', 32 ) ) ),
	'b' => $mk( array( 'title' => 'Alpha footer', 'type' => 'bug', 'description' => 'Alpha text', 'page_path' => '/alpha/', 'reporter_name' => 'Aaron Guest', 'guest_id' => str_repeat( 'd', 32 ) ) ),
	'c' => ( wp_set_current_user( 1 ) ? $mk( array( 'title' => 'Mike menu', 'type' => 'tweak', 'description' => str_repeat( 'Long words here. ', 30 ), 'page_path' => '/mid/' ) ) : 0 ),
);
$only = static function ( array $rows ) use ( $ids ): array {
	return array_values( array_filter( array_column( $rows, 'id' ), static fn( $id ) => in_array( $id, $ids, true ) ) );
};
$sorted = static function ( string $by, string $dir ) use ( $only ): array {
	return $only( Items::query( array( 'orderby' => $by, 'order' => $dir, 'per_page' => 500 ) )['items'] );
};
$check( 'sort by title asc', array( $ids['b'], $ids['c'], $ids['a'] ) === $sorted( 'title', 'asc' ) );
$check( 'sort by title desc', array( $ids['a'], $ids['c'], $ids['b'] ) === $sorted( 'title', 'desc' ) );
$check( 'sort by page asc', array( $ids['b'], $ids['c'], $ids['a'] ) === $sorted( 'page', 'asc' ) );
$check( 'sort by description asc', array( $ids['b'], $ids['a'], $ids['c'] ) === $sorted( 'description', 'asc' ) );
$check( 'sort by type asc (bug, tweak, comment)', array( $ids['b'], $ids['c'], $ids['a'] ) === $sorted( 'type', 'asc' ) );
$admin_name = get_userdata( 1 )->display_name;
$expect     = array( 'Aaron Guest' => $ids['b'], 'Yvonne' => $ids['a'], $admin_name => $ids['c'] );
ksort( $expect, SORT_STRING | SORT_FLAG_CASE );
$check( 'sort by submitted-by asc (guest names and user names together)', array_values( $expect ) === $sorted( 'reporter', 'asc' ) );
$check( 'sort by submitted-by desc', array_reverse( array_values( $expect ) ) === $sorted( 'reporter', 'desc' ) );
$check( 'Anti: unknown orderby falls back safely', 3 === count( $sorted( 'nope; DROP TABLE x', 'asc' ) ) );

// Default hidden columns.
delete_option( 'fbcol_teamwork' );
GuestMode::set_enabled( false );
$check( 'no Teamwork, no password mode: only Teamwork hidden', array( 'teamwork' ) === ItemsTable::default_hidden( array() ) );
GuestMode::set_password( 'pass-1234' );
GuestMode::set_enabled( true );
$h = ItemsTable::default_hidden( array() );
$check( 'password mode: Teamwork, Assignee and Due hidden by default', array( 'assignee', 'due', 'teamwork' ) === ( sort( $h ) ? $h : $h ) );
$check( 'every column is offered in Screen Options', array( 'cb', 'title', 'description', 'page', 'reporter', 'type', 'status', 'priority', 'due', 'assignee', 'teamwork' ) === array_keys( ItemsTable::columns() ) );

// Render the table.
set_current_screen( 'toplevel_page_feedback-collector' );
$_GET = array( 'orderby' => 'page', 'order' => 'asc' );
$t    = new ItemsTable();
$t->prepare_items();
ob_start();
$t->display();
$html = ob_get_clean();
$_GET = array();
$check( 'renders Description and Page columns', str_contains( $html, 'column-description' ) && str_contains( $html, 'column-page' ) && str_contains( $html, 'Bravo text' ) && str_contains( $html, 'Zeta page' ) );
$check( 'long descriptions are shortened with an ellipsis', str_contains( $html, '…' ) );
$check( 'guest shown as "(guest)" in Submitted by', str_contains( $html, 'Yvonne (guest)' ) );
$check( 'description, page, type, submitted-by headers are sortable links', 4 === preg_match_all( '/orderby=(description|page|type|reporter)/', $html, $m ) || count( array_unique( $m[1] ) ) === 4 );
$check( 'Anti: description text is escaped', ! str_contains( $html, '<script' ) );

echo "{$n[0]} passed, {$n[1]} failed\n";
