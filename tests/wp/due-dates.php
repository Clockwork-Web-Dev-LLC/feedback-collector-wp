<?php
require __DIR__ . '/_guard.php';
// Due dates: default N days out, per-reviewer batches, REST, overdue. Scratch DB only.
use FeedbackCollector\DueDates;
use FeedbackCollector\Items;

global $wpdb;
$fbc_max = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$users   = array();
register_shutdown_function(
	static function () use ( $fbc_max, &$users ) {
		global $wpdb;
		foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbc_max ) ) as $id ) {
			Items::delete( (int) $id );
		}
		require_once ABSPATH . 'wp-admin/includes/user.php';
		foreach ( $users as $u ) {
			wp_delete_user( $u );
		}
		echo "cleanup done\n";
	}
);
add_filter( 'pre_http_request', static fn() => new WP_Error( 'fbc_test_offline', 'Network disabled in tests' ) );
update_option( 'fbc_assignee_source', 'wordpress' );

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};
$call = static function ( string $method, string $route, ?array $body = null ): array {
	$q = new WP_REST_Request( $method, '/feedback-collector/v1' . $route );
	if ( null !== $body ) {
		$q->set_header( 'content-type', 'application/json' );
		$q->set_body( wp_json_encode( $body ) );
	}
	$r = rest_do_request( $q );
	return array( $r->get_status(), $r->get_data() );
};
$mk_user = static function () use ( &$users ): int {
	$id      = wp_insert_user( array( 'user_login' => 'fbc_due_' . wp_generate_password( 6, false ), 'user_pass' => wp_generate_password(), 'user_email' => 'due-' . wp_generate_password( 6, false ) . '@example.com', 'role' => 'administrator' ) );
	$users[] = $id;
	return $id;
};
foreach ( array( DueDates::OPT_DEFAULT, DueDates::OPT_DAYS, DueDates::OPT_HOURS ) as $o ) {
	delete_option( $o );
}

// Defaults.
$check( 'defaults: on, 3 days, 3-hour batches', DueDates::on_by_default() && 3 === DueDates::days() && 3 === DueDates::batch_hours() );
$t0 = strtotime( '2026-10-01 09:00:00 ' . wp_timezone_string() );
$check( 'fresh date is 3 days out (site timezone)', '2026-10-04' === DueDates::fresh( $t0 ) );
$check( 'dates validated (2026-02-30 rejected)', null === DueDates::sanitize( '2026-02-30' ) && '2026-02-28' === DueDates::sanitize( '2026-02-28' ) && null === DueDates::sanitize( '10/04/2026' ) );

// Batches.
$a = $mk_user();
$b = $mk_user();
$check( 'no batch yet → suggests the fresh date', '2026-10-04' === DueDates::suggest( $a, $t0 ) );
DueDates::remember( $a, '2026-10-04', $t0 );
$check( 'within the window → same date (2h later)', '2026-10-04' === DueDates::suggest( $a, $t0 + 2 * HOUR_IN_SECONDS ) );
DueDates::remember( $a, '2026-10-09', $t0 + 2 * HOUR_IN_SECONDS );
$check( 'mid-batch change carries forward', '2026-10-09' === DueDates::suggest( $a, $t0 + 2 * HOUR_IN_SECONDS + 60 ) );
$check( 'Anti: a mid-batch change does not extend the window (3h after the first item it resets)', null === DueDates::batch( $a, $t0 + 3 * HOUR_IN_SECONDS ) && '2026-10-09' !== DueDates::suggest( $a, $t0 + 3 * HOUR_IN_SECONDS ) );
$check( 'Anti: batches are per reviewer', '2026-10-04' === DueDates::suggest( $b, $t0 + HOUR_IN_SECONDS ) && null === DueDates::batch( $b, $t0 ) );
update_option( DueDates::OPT_HOURS, 0 );
DueDates::remember( $b, '2026-12-25', $t0 );
$check( 'batch window 0 → every item gets its own fresh date', '2026-10-04' === DueDates::suggest( $b, $t0 + 60 ) );
delete_option( DueDates::OPT_HOURS );
update_option( DueDates::OPT_DAYS, 7 );
$check( 'days setting changes the default', '2026-10-08' === DueDates::fresh( $t0 ) );
delete_option( DueDates::OPT_DAYS );

// REST.
wp_set_current_user( $b );
delete_user_meta( $b, DueDates::BATCH_META );
[ $s, $d ] = $call( 'POST', '/items', array( 'title' => 'due one', 'type' => 'bug', 'due_date' => '2026-10-20' ) );
$check( 'create with a due date → stored and returned', 201 === $s && '2026-10-20' === $d['due_date'] );
$check( 'create starts the reviewer\'s batch; due_next suggests that date', '2026-10-20' === ( $d['due_next']['suggest'] ?? '' ) && ( $d['due_next']['batchUntil'] ?? 0 ) > time() );
$first = (int) $d['id'];
[ $s, $d ] = $call( 'POST', '/items', array( 'title' => 'no date', 'type' => 'bug' ) );
$check( 'create without a date → no due date', 201 === $s && null === $d['due_date'] );
[ $s ] = $call( 'POST', '/items', array( 'title' => 'bad', 'type' => 'bug', 'due_date' => '2026-13-01' ) );
$check( 'Anti: invalid due date → 400', 400 === $s );
[ $s, $d ] = $call( 'PATCH', "/items/$first", array( 'due_date' => '2026-10-22' ) );
$check( 'edit due date → saved and logged', 200 === $s && '2026-10-22' === $d['due_date'] && str_contains( (string) end( $d['comments'] )['body'], 'due date' ) );
$check( 'editing mid-batch carries forward', '2026-10-22' === DueDates::suggest( $b ) );
[ $s, $d ] = $call( 'PATCH', "/items/$first", array( 'due_date' => null ) );
$check( 'clear due date', 200 === $s && null === $d['due_date'] && 'removed the due date' === end( $d['comments'] )['body'] );

// Overdue.
$yesterday = wp_date( 'Y-m-d', time() - DAY_IN_SECONDS );
$check( 'past due + open → overdue', DueDates::overdue( array( 'due_date' => $yesterday, 'status' => 'open' ) ) );
$check( 'Anti: resolved is never overdue', ! DueDates::overdue( array( 'due_date' => $yesterday, 'status' => 'resolved' ) ) );
$check( 'Anti: due today is not overdue', ! DueDates::overdue( array( 'due_date' => wp_date( 'Y-m-d' ), 'status' => 'open' ) ) );
[ , $d ] = $call( 'GET', '/items', null );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
