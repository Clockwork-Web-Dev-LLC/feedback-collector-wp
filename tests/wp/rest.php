<?php
require __DIR__ . '/_guard.php';
/**
 * REST API: validation, sanitization, page scoping, threads and permissions.
 *
 * Run: wp eval-file tests/wp/rest.php  (or tests/wp/run.sh)
 * Non-destructive: deletes only the items and users it creates.
 *
 * @package FeedbackCollector
 */

use FeedbackCollector\Items;

global $wpdb;
$fbc_max_id   = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbc_users    = array();
$fbc_backup_s = get_option( 'fbc_assignee_source', null );
// Never touch a real Teamwork account from a test: block all outbound HTTP, and use
// WordPress users as assignees even if this site has Teamwork connected.
add_filter( 'pre_http_request', static fn() => new WP_Error( 'fbc_test_offline', 'Network disabled in tests' ) );
update_option( 'fbc_assignee_source', 'wordpress' );
register_shutdown_function(
	static function () use ( $fbc_max_id, &$fbc_users, $fbc_backup_s ) {
		global $wpdb;
		foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbc_max_id ) ) as $id ) {
			Items::delete( (int) $id );
		}
		null === $fbc_backup_s ? delete_option( 'fbc_assignee_source' ) : update_option( 'fbc_assignee_source', $fbc_backup_s );
		require_once ABSPATH . 'wp-admin/includes/user.php';
		foreach ( $fbc_users as $uid ) {
			wp_delete_user( $uid );
		}
		echo "cleanup done\n";
	}
);

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};
$call  = static function ( string $method, string $route, ?array $body = null, array $params = array() ): array {
	$q = new WP_REST_Request( $method, '/feedback-collector/v1' . $route );
	foreach ( $params as $k => $v ) {
		$q->set_param( $k, $v );
	}
	if ( null !== $body ) {
		$q->set_header( 'content-type', 'application/json' );
		$q->set_body( wp_json_encode( $body ) );
	}
	$res = rest_do_request( $q );
	return array( $res->get_status(), $res->get_data() );
};
$make_user = static function ( string $role ) use ( &$fbc_users ): int {
	$id          = wp_insert_user(
		array(
			'user_login' => 'fbc_test_' . $role . '_' . wp_generate_password( 6, false ),
			'user_pass'  => wp_generate_password(),
			'user_email' => 'fbc-test-' . wp_generate_password( 6, false ) . '@example.com',
			'role'       => $role,
		)
	);
	$fbc_users[] = $id;
	return $id;
};

wp_set_current_user( 1 );

// Validation.
[ $s ] = $call( 'POST', '/items', array( 'title' => '', 'type' => 'bug' ) );
$check( 'empty title → 400', 400 === $s );
[ $s ] = $call( 'POST', '/items', array( 'title' => 'Bad', 'type' => 'nope' ) );
$check( 'unknown type → 400', 400 === $s );

// Create + sanitize.
[ $s, $d ] = $call(
	'POST',
	'/items',
	array(
		'title'       => 'Button misaligned <script>alert(1)</script>',
		'type'        => 'tweak',
		'description' => "Line1\n<script>alert(2)</script>",
		'page_path'   => '/rest-test-page/',
		'anchor'      => array( 'selector' => '#x', 'tag' => 'a', 'offsetX' => 5 ),
		'context'     => array( 'breakpoint' => 'desktop', 'viewport_w' => 1440, 'js_errors' => array( 'e1' ) ),
	)
);
$id = (int) ( $d['id'] ?? 0 );
$check( 'create → 201', 201 === $s && $id > 0 );
$check( 'script tags stripped from title and description', ! str_contains( (string) $d['title'] . $d['description'], '<script' ) );
$check( 'anchor offset clamped to 1', 1.0 === (float) $d['anchor']['offsetX'] );

// Updates + enums.
[ $s ] = $call( 'PATCH', "/items/$id", array( 'status' => 'done' ) );
$check( 'invalid status → 400', 400 === $s );
[ $s, $d ] = $call( 'PATCH', "/items/$id", array( 'status' => 'in_progress', 'assignee_id' => 1 ) );
$check( 'valid status + assignee → 200', 200 === $s && 'in_progress' === $d['status'] );
$check( 'status and assignee changes logged as activity', 2 === count( array_filter( (array) ( $d['comments'] ?? array() ), static fn( $c ) => 'activity' === $c['kind'] ) ) );

// Stale assignee list: the page picked from Teamwork people, the server now uses WordPress users.
[ $s, $d ] = $call( 'POST', '/items', array( 'title' => 'stale list', 'type' => 'bug', 'assignee_id' => 1, 'assignee_source' => 'teamwork' ) );
$check( 'Anti: assignee picked from a list the server no longer uses → 409, nothing created', 409 === $s && 'fbc_assignee_list_changed' === ( $d['code'] ?? '' ) );
[ $s, $d ] = $call( 'POST', '/items', array( 'title' => 'same list', 'type' => 'bug', 'assignee_id' => 1, 'assignee_source' => 'wordpress' ) );
$check( 'assignee from the list the server uses → 201', 201 === $s && 1 === (int) $d['assignee_id'] );
[ $s ] = $call( 'PATCH', "/items/$id", array( 'assignee_id' => 424242, 'assignee_source' => 'teamwork' ) );
$check( 'Anti: PATCH with a stale assignee list → 409', 409 === $s );
[ $s ] = $call( 'POST', '/items', array( 'title' => 'unassigned', 'type' => 'bug', 'assignee_id' => 0, 'assignee_source' => 'teamwork' ) );
$check( 'unassigned is fine whatever list the page had', 201 === $s );

// Page scoping.
[ , $d ] = $call( 'GET', '/items', null, array( 'page_path' => '/rest-test-page/' ) );
$check( 'list by page path finds the item', in_array( $id, array_column( $d['items'], 'id' ), true ) );
[ , $d ] = $call( 'GET', '/items', null, array( 'page_path' => '/some-other-page/' ) );
$check( 'Anti: item does not leak onto other pages', ! in_array( $id, array_column( $d['items'], 'id' ), true ) );

// Breakpoint filter + device-preview label.
[ $s, $d ] = $call( 'POST', '/items', array( 'title' => 'phone item', 'type' => 'bug', 'page_path' => '/rest-test-page/', 'context' => array( 'breakpoint' => 'mobile', 'viewport_w' => 390, 'preview' => 'Phone 390×844 <b>x</b>' ) ) );
$phone = (int) $d['id'];
$check( 'device-preview label stored, tags stripped', 'Phone 390×844 x' === $d['context']['preview'] );
[ , $d ] = $call( 'GET', '/items', null, array( 'page_path' => '/rest-test-page/', 'breakpoint' => 'mobile' ) );
$check( 'breakpoint filter returns only mobile items', array( $phone ) === array_column( $d['items'], 'id' ) );

// Thread.
[ $s, $d ] = $call( 'POST', "/items/$id/comments", array( 'body' => 'reply' ) );
$check( 'reply → 201 and appended', 201 === $s && 'reply' === end( $d['comments'] )['body'] );

// Permissions.
$editor     = $make_user( 'editor' );
$subscriber = $make_user( 'subscriber' );
[ $s ] = $call( 'PATCH', "/items/$id", array( 'assignee_id' => $subscriber ) );
$check( 'Anti: assigning a non-reviewer → 400', 400 === $s );
wp_set_current_user( $editor );
[ $s ] = $call( 'DELETE', "/items/$id" );
$check( 'editor cannot delete another reporter\'s item → 403', 403 === $s );
[ $s, $d ] = $call( 'POST', '/items', array( 'title' => 'editor item', 'type' => 'comment' ) );
[ $s ] = $call( 'DELETE', '/items/' . (int) $d['id'] );
$check( 'editor can delete own item → 200', 200 === $s );
wp_set_current_user( $subscriber );
[ $s ] = $call( 'GET', '/items' );
$check( 'Anti: subscriber → 403', 403 === $s );
wp_set_current_user( 0 );
[ $s ] = $call( 'GET', '/items' );
$check( 'Anti: logged out → 401', 401 === $s );
wp_set_current_user( 1 );
[ $s ] = $call( 'DELETE', "/items/$id" );
$check( 'admin can delete → 200', 200 === $s );
[ $s ] = $call( 'GET', '/items/999999999' );
$check( 'missing item → 404', 404 === $s );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
