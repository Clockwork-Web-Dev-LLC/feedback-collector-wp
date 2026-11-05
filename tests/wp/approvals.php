<?php
require __DIR__ . '/_guard.php';
/**
 * Client approval ("PIVI approved") and the tour setting: schema, REST, list filter/sort,
 * the admin column, and who may approve.
 *
 * @package FeedbackCollector
 */

use FeedbackCollector\Admin\ItemsTable;
use FeedbackCollector\Approvals;
use FeedbackCollector\GuestMode;
use FeedbackCollector\Items;
use FeedbackCollector\Tour;

global $wpdb;
$fbcol_max_id  = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbcol_users   = array();
$fbcol_backups = array();
foreach ( array( GuestMode::OPT_ENABLED, GuestMode::OPT_HASH, GuestMode::OPT_KEY, Approvals::OPT_LABEL, Tour::OPTION, 'fbcol_assignee_source' ) as $opt ) {
	$fbcol_backups[ $opt ] = get_option( $opt, null );
}
register_shutdown_function(
	static function () use ( $fbcol_max_id, &$fbcol_users, $fbcol_backups ) {
		global $wpdb;
		foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbcol_max_id ) ) as $id ) {
			Items::delete( (int) $id );
		}
		foreach ( $fbcol_backups as $opt => $value ) {
			null === $value ? delete_option( $opt ) : update_option( $opt, $value );
		}
		require_once ABSPATH . 'wp-admin/includes/user.php';
		foreach ( $fbcol_users as $uid ) {
			wp_delete_user( $uid );
		}
		echo "cleanup done\n";
	}
);
add_filter( 'pre_http_request', static fn() => new WP_Error( 'offline', 'no network in tests' ) );
update_option( 'fbcol_assignee_source', 'wordpress' );

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};
$call  = static function ( string $method, string $route, ?array $body = null ): array {
	$q = new WP_REST_Request( $method, '/feedback-collector/v1' . $route );
	if ( null !== $body ) {
		$q->set_header( 'content-type', 'application/json' );
		$q->set_body( wp_json_encode( $body ) );
	}
	$res = rest_do_request( $q );
	return array( $res->get_status(), $res->get_data() );
};
$user = static function ( string $role ) use ( &$fbcol_users ): int {
	$id            = wp_insert_user(
		array(
			'user_login'   => 'fbcol_appr_' . $role . '_' . wp_generate_password( 6, false ),
			'user_pass'    => wp_generate_password(),
			'user_email'   => 'fbc-appr-' . wp_generate_password( 6, false ) . '@example.com',
			'role'         => $role,
			'display_name' => 'Amanda ' . ucfirst( $role ),
		)
	);
	$fbcol_users[] = $id;
	return $id;
};

// Schema.
$cols = $wpdb->get_col( 'SHOW COLUMNS FROM ' . Items::table() );
$check( 'schema has approved_at and approved_by', in_array( 'approved_at', $cols, true ) && in_array( 'approved_by', $cols, true ) );
$check( 'db version is 11', '11' === get_option( 'fbcol_db_version' ) );

// Label.
delete_option( Approvals::OPT_LABEL );
$check( 'label defaults to “Approved”', 'Approved' === Approvals::label() );
Approvals::set_label( '  PIVI approved  ' );
$check( 'label saved trimmed', 'PIVI approved' === Approvals::label() );
Approvals::set_label( '<b>' . str_repeat( 'x', 80 ) );
$check( 'Anti: label stripped of tags and capped', ! str_contains( Approvals::label(), '<' ) && Approvals::LABEL_MAX === mb_strlen( Approvals::label() ) );
Approvals::set_label( '' );
$check( 'blank label restores the default', 'Approved' === Approvals::label() );
Approvals::set_label( 'PIVI approved' );

// REST as a reviewer.
$editor = $user( 'editor' );
wp_set_current_user( $editor );
$a = Items::create( array( 'type' => 'tweak', 'priority' => 'medium', 'title' => 'Fix bio typo', 'description' => '', 'page_path' => '/team/' ) );
$b = Items::create( array( 'type' => 'bug', 'priority' => 'medium', 'title' => 'Map pin wrong', 'description' => '', 'page_path' => '/team/' ) );
[ $st, $d ] = $call( 'GET', '/items/' . $a );
$check( 'new items start not approved', 200 === $st && false === $d['approved'] && '' === $d['approved_by'] );
[ $st, $d ] = $call( 'PATCH', '/items/' . $a, array( 'approved' => true ) );
$check( 'reviewer approves via PATCH', 200 === $st && true === $d['approved'] && 'Amanda Editor' === $d['approved_by'] );
$row = Items::get( $a );
$check( 'stored who and when', $editor === $row['approved_by'] && Approvals::is_approved( $row ) && 'open' === $row['status'] );
$acts = array_values( array_filter( Items::comments( $a ), static fn( $c ) => 'activity' === $c['kind'] ) );
$check( 'thread logs “marked this “PIVI approved””', 1 === count( $acts ) && str_contains( $acts[0]['body'], 'PIVI approved' ) );
$call( 'PATCH', '/items/' . $a, array( 'approved' => true ) );
$acts2 = array_filter( Items::comments( $a ), static fn( $c ) => 'activity' === $c['kind'] );
$check( 'approving again changes nothing and logs nothing', 1 === count( $acts2 ) );
[ $st ] = $call( 'PATCH', '/items/' . $a, array( 'approved' => 'yes' ) );
$check( 'Anti: non-boolean approved → 400', 400 === $st );
[ $st, $d ] = $call( 'PATCH', '/items/' . $b, array( 'approved' => true, 'status' => 'in_progress' ) );
$check( 'approve together with another change', 200 === $st && true === $d['approved'] && 'in_progress' === $d['status'] );

// Filter + sort.
$ids  = static fn( array $rows ) => array_values( array_intersect( array_column( $rows, 'id' ), array( $a, $b ) ) );
$yes  = $ids( Items::query( array( 'approved' => 'yes', 'per_page' => 500 ) )['items'] );
$call( 'PATCH', '/items/' . $b, array( 'approved' => false ) );
$no   = $ids( Items::query( array( 'approved' => 'no', 'per_page' => 500 ) )['items'] );
$yes2 = $ids( Items::query( array( 'approved' => 'yes', 'per_page' => 500 ) )['items'] );
$check( 'filter approved = yes', 2 === count( $yes ) );
$check( 'un-approve, then filter: yes has a, no has b', array( $a ) === $yes2 && array( $b ) === $no );
$check( 'un-approve clears who/when', ! Approvals::is_approved( Items::get( $b ) ) && 0 === Items::get( $b )['approved_by'] );
$check( 'sort by approved asc puts not-approved first', array( $b, $a ) === $ids( Items::query( array( 'orderby' => 'approved', 'order' => 'asc', 'per_page' => 500 ) )['items'] ) );
$check( 'sort by approved desc puts approved first', array( $a, $b ) === $ids( Items::query( array( 'orderby' => 'approved', 'order' => 'desc', 'per_page' => 500 ) )['items'] ) );
$check( 'Anti: bogus approved filter is ignored', 2 === count( $ids( Items::query( array( 'approved' => "1' OR 1=1", 'per_page' => 500 ) )['items'] ) ) );

// Bulk helper.
Approvals::set( $b, true );
$check( 'bulk approve (Approvals::set)', Approvals::is_approved( Items::get( $b ) ) );
$check( 'Anti: set on a missing item returns false', false === Approvals::set( 99999999, true ) );

// Admin column.
set_current_screen( 'toplevel_page_feedback-collector' );
$t = new ItemsTable();
$t->prepare_items();
ob_start();
$t->display();
$html = ob_get_clean();
$check( 'list has the “PIVI approved” column header', (bool) preg_match( '/<th[^>]*id=.approved.[^>]*>.*PIVI approved/s', $html ) );
$check( 'row checkbox is ticked for an approved item and names who', (bool) preg_match( '/data-id="' . $a . '" checked=.checked.[^>]*>.*?Amanda Editor/s', $html ) );
$check( 'bulk actions offer Mark / Remove “PIVI approved”', str_contains( $html, 'Mark “PIVI approved”' ) && str_contains( $html, 'Remove “PIVI approved”' ) );

// Guests can't approve.
GuestMode::set_password( 'pass-1234' );
GuestMode::set_enabled( true );
wp_set_current_user( 0 );
GuestMode::reset_request();
$_COOKIE[ GuestMode::COOKIE ] = GuestMode::sign( str_repeat( 'e', 32 ), time() + 600 );
$_SERVER['HTTP_X_WP_NONCE']  = wp_create_nonce( 'wp_rest' );
[ $st ] = $call( 'PATCH', '/items/' . $b, array( 'approved' => false ) );
$check( 'Anti: a guest can’t approve or un-approve', 401 === $st && Approvals::is_approved( Items::get( $b ) ) );
unset( $_COOKIE[ GuestMode::COOKIE ], $_SERVER['HTTP_X_WP_NONCE'] );
GuestMode::reset_request();
wp_set_current_user( $editor );

// Tour setting.
delete_option( Tour::OPTION );
$check( 'tour follows password mode until set (on)', true === Tour::enabled() );
GuestMode::set_enabled( false );
$check( 'tour follows password mode until set (off)', false === Tour::enabled() );
update_option( Tour::OPTION, '1' );
$check( 'tour explicitly on', true === Tour::enabled() );
update_option( Tour::OPTION, '0' );
GuestMode::set_enabled( true );
$check( 'tour explicitly off wins over password mode', false === Tour::enabled() );
update_option( Tour::OPTION, '1' );
$check( 'overlay config carries tour + approval label', true === FeedbackCollector\Frontend::config()['tour'] && 'PIVI approved' === FeedbackCollector\Frontend::config()['approval']['label'] );

echo "{$n[0]} passed, {$n[1]} failed\n";
