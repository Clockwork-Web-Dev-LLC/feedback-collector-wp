<?php
// Assignee source tests against a mocked Teamwork API. Non-destructive: deletes only
// rows it creates and restores every option it touches.
use FeedbackCollector\Assignees;
use FeedbackCollector\Items;
use FeedbackCollector\Rest;
use FeedbackCollector\Teamwork\Teamwork;

global $wpdb, $mock;
wp_set_current_user( 1 );
$max     = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$backups = array();
foreach ( array( 'fbc_teamwork', 'fbc_tw_state', Assignees::OPTION ) as $o ) {
	$backups[ $o ] = get_option( $o, null );
}
register_shutdown_function( static function () use ( $max, $backups ) {
	global $wpdb;
	foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $max ) ) as $id ) {
		Items::delete( (int) $id );
	}
	foreach ( $backups as $o => $v ) {
		null === $v ? delete_option( $o ) : update_option( $o, $v );
	}
	delete_transient( 'fbc_tw_people_list_100' );
	delete_transient( 'fbc_tw_people_100' );
	echo "cleanup done\n";
} );

delete_transient( 'fbc_tw_people_list_100' ); // never trust a cache another suite may have left
$mock = array( 'calls' => array(), 'payload' => null );
add_filter( 'pre_http_request', function ( $pre, $args, $url ) {
	global $mock;
	$path = wp_parse_url( $url, PHP_URL_PATH );
	$mock['calls'][] = $args['method'] . ' ' . $path;
	$json = fn( $c, $b ) => array( 'response' => array( 'code' => $c, 'message' => '' ), 'body' => wp_json_encode( $b ), 'headers' => array(), 'cookies' => array() );
	if ( '/projects/api/v3/projects/100/people.json' === $path ) {
		return $json( 200, array( 'people' => array(
			array( 'id' => 556, 'firstName' => 'Sam', 'lastName' => 'Roe', 'email' => 'sam@example.com' ),
			array( 'id' => 555, 'firstName' => 'Pat', 'lastName' => 'Lee', 'email' => 'AaronR@clockworkwd.com' ),
		), 'meta' => array( 'page' => array( 'hasMore' => false ) ) ) );
	}
	if ( '/projects/api/v3/tags.json' === $path ) return $json( 200, array( 'tags' => array( array( 'id' => 77, 'name' => 'Bug' ) ) ) );
	if ( 'POST' === $args['method'] && '/projects/api/v3/tasklists/200/tasks.json' === $path ) {
		$mock['payload'] = json_decode( $args['body'], true );
		return $json( 201, array( 'task' => array( 'id' => 7001 ) ) );
	}
	return $json( 404, array() );
}, 10, 3 );

$n = array( 0, 0 );
$check = function ( string $label, bool $ok ) use ( &$n ) { echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n"; $n[ $ok ? 0 : 1 ]++; };
$rest = function ( string $m, string $r, ?array $body = null ) {
	$q = new WP_REST_Request( $m, '/feedback-collector/v1' . $r );
	if ( $body ) { $q->set_header( 'content-type', 'application/json' ); $q->set_body( wp_json_encode( $body ) ); }
	$res = rest_do_request( $q );
	return array( $res->get_status(), $res->get_data() );
};

// 1. Not connected: falls back to WordPress users even though Teamwork is preferred.
delete_option( 'fbc_teamwork' );
delete_option( Assignees::OPTION );
$check( 'default preference is teamwork', 'teamwork' === Assignees::preference() );
$check( 'not connected → source wordpress', 'wordpress' === Assignees::source() );
$opts = Assignees::options();
$check( 'not connected → WP reviewers listed', 'wordpress' === $opts['source'] && in_array( 1, array_column( $opts['people'], 'id' ), true ) );

// 2. Connected with a project: Teamwork people.
update_option( 'fbc_teamwork', array( 'site' => 'https://x.teamwork.com', 'key_enc' => '', 'project_id' => 100, 'tasklist_id' => 200, 'tasklist_name' => 'QA', 'send_email' => true, 'tags' => array( 'bug' => 77 ) ) );
add_filter( 'fbc_test_key', '__return_true' );
// Supply a key without touching wp-config: encrypt one into the option via the settings handler.
$_POST = array( 'tw_key' => 'fake-key' ); Teamwork::save_settings(); $_POST = array();
$s = get_option( 'fbc_teamwork' ); $s['project_id'] = 100; $s['tasklist_id'] = 200; update_option( 'fbc_teamwork', $s );
$check( 'connected → source teamwork', 'teamwork' === Assignees::source() );
$opts = Assignees::options();
$check( 'Teamwork people listed, sorted by name', array( 'Pat Lee', 'Sam Roe' ) === array_column( $opts['people'], 'name' ) );
$check( 'me() matches current WP user by email (case-insensitive)', 555 === Assignees::me() );
$check( 'overlay config carries assignees', 'teamwork' === FeedbackCollector\Frontend::config()['assignees']['source'] );

// 3. Create with a Teamwork assignee.
[ $st, $d ] = $rest( 'POST', '/items', array( 'title' => 'Hero overlaps nav', 'type' => 'bug', 'assignee_id' => 556 ) );
$id = (int) ( $d['id'] ?? 0 );
$row = Items::get( $id );
$check( 'create with TW person → 201', 201 === $st );
$check( 'stores tw_assignee_id + name, leaves WP assignee empty', 556 === $row['tw_assignee_id'] && 'Sam Roe' === $row['tw_assignee_name'] && 0 === $row['assignee_id'] );
$check( 'REST shape: assignee_id/name from Teamwork', 556 === $d['assignee_id'] && 'Sam Roe' === $d['assignee_name'] && false === $d['assignee_locked'] );
[ $st ] = $rest( 'POST', '/items', array( 'title' => 'x', 'type' => 'bug', 'assignee_id' => 999 ) );
$check( 'Anti: person not on project → 400', 400 === $st );

// 4. Reassign before push → activity entry.
[ $st, $d ] = $rest( 'PATCH', "/items/$id", array( 'assignee_id' => 555 ) );
$acts = array_column( array_filter( $d['comments'] ?? array(), fn( $c ) => 'activity' === $c['kind'] ), 'body' );
$check( 'reassign before push → 200 + "assigned to Pat Lee"', 200 === $st && in_array( 'assigned to Pat Lee', $acts, true ) );

// 5. Push uses the Teamwork person directly.
$mock['calls'] = array();
$res = Teamwork::push( $id );
$check( 'push succeeds', ! is_wp_error( $res ) );
$check( 'task assignees.userIds = [555] (the picked person)', array( 555 ) === ( $mock['payload']['task']['assignees']['userIds'] ?? null ) );

// 6. After push, the assignee is owned by Teamwork.
[ $st, $d ] = $rest( 'GET', "/items/$id" );
$check( 'pushed item reports assignee_locked', true === $d['assignee_locked'] );
[ $st ] = $rest( 'PATCH', "/items/$id", array( 'assignee_id' => 556 ) );
$check( 'Anti: changing a pushed item\'s assignee → 400', 400 === $st );
[ $st ] = $rest( 'PATCH', "/items/$id", array( 'assignee_id' => 555, 'status' => 'in_progress' ) );
$check( 'same assignee + other field change still allowed', 200 === $st );

// 7. Filter by Teamwork assignee.
[ $st, $d ] = $rest( 'GET', '/items&assignee_id=555' );
$q = new WP_REST_Request( 'GET', '/feedback-collector/v1/items' ); $q->set_param( 'assignee_id', 555 );
$ids = array_column( rest_do_request( $q )->get_data()['items'], 'id' );
$check( 'assignee filter matches Teamwork assignee', in_array( $id, $ids, true ) );

// 8. Switch to WordPress users.
update_option( Assignees::OPTION, 'wordpress' );
$check( 'preference wordpress → source wordpress', 'wordpress' === Assignees::source() );
[ $st, $d ] = $rest( 'POST', '/items', array( 'title' => 'WP-assigned', 'type' => 'tweak', 'assignee_id' => 1 ) );
$check( 'WP mode: assign WP user 1 → 201', 201 === $st && 1 === Items::get( (int) $d['id'] )['assignee_id'] );
[ $st ] = $rest( 'POST', '/items', array( 'title' => 'x', 'type' => 'tweak', 'assignee_id' => 556 ) );
$check( 'Anti: WP mode rejects a Teamwork person ID', 400 === $st );
$check( 'Teamwork-assigned item still shows its name in WP mode', 'Pat Lee' === Assignees::name( Items::get( $id ) ) );
$check( 'nothing is locked in WP mode', false === Assignees::locked( Items::get( $id ) ) );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
