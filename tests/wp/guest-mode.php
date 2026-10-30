<?php
require __DIR__ . '/_guard.php';
/**
 * Guest mode (one site password; logged-out guests leave feedback): settings, signed cookies,
 * REST permissions and ownership, names on items and replies, Teamwork attribution, and that
 * logged-in reviewers behave exactly as before with guest mode on or off.
 *
 * Run: tests/wp/run.sh. Non-destructive: removes the items, users and options it creates.
 *
 * @package FeedbackCollector
 */

use FeedbackCollector\Frontend;
use FeedbackCollector\GuestMode;
use FeedbackCollector\Items;
use FeedbackCollector\Rest;
use FeedbackCollector\Teamwork\Teamwork;
use FeedbackCollector\Videos;

if ( ! defined( 'FBCOL_TEAMWORK_API_KEY' ) ) {
	define( 'FBCOL_TEAMWORK_API_KEY', 'SECRET-KEY-123' );
}

global $wpdb, $mock;
$fbcol_max_id  = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbcol_users   = array();
$fbcol_backups = array();
foreach ( array( GuestMode::OPT_ENABLED, GuestMode::OPT_HASH, GuestMode::OPT_KEY, 'fbcol_assignee_source', 'fbcol_teamwork', 'fbcol_tw_state', 'fbcol_videos' ) as $opt ) {
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
		wp_clear_scheduled_hook( Teamwork::QUEUE_HOOK );
		require_once ABSPATH . 'wp-admin/includes/user.php';
		foreach ( $fbcol_users as $uid ) {
			wp_delete_user( $uid );
		}
		echo "cleanup done\n";
	}
);

// Never reach a real Teamwork: a mock that records comment posts and accepts task creation.
$mock = array( 'comment_bodies' => array(), 'tasks' => 0 );
add_filter(
	'pre_http_request',
	static function ( $pre, $args, $url ) {
		global $mock;
		$path = (string) wp_parse_url( $url, PHP_URL_PATH );
		$json = static fn( $code, $body ) => array( 'response' => array( 'code' => $code, 'message' => '' ), 'body' => wp_json_encode( $body ), 'headers' => array(), 'cookies' => array() );
		if ( 'POST' === $args['method'] && preg_match( '#^/tasks/(\d+)/comments\.json$#', $path ) ) {
			$mock['comment_bodies'][] = (string) $args['body'];
			return $json( 201, array( 'commentId' => '77001', 'STATUS' => 'OK' ) );
		}
		if ( 'POST' === $args['method'] && '/projects/api/v3/tasklists/200/tasks.json' === $path ) {
			++$mock['tasks'];
			$mock['last_task'] = json_decode( (string) $args['body'], true );
			return $json( 201, array( 'task' => array( 'id' => 8800 + $mock['tasks'] ) ) );
		}
		if ( 'GET' === $args['method'] && '/projects/api/v3/tags.json' === $path ) {
			return $json( 200, array( 'tags' => array() ) );
		}
		if ( 'POST' === $args['method'] && '/projects/api/v3/tags.json' === $path ) {
			return $json( 201, array( 'tag' => array( 'id' => 5 ) ) );
		}
		if ( str_contains( $path, '/people.json' ) ) {
			return $json( 200, array( 'people' => array(), 'meta' => array( 'page' => array( 'hasMore' => false ) ) ) );
		}
		return $json( 404, array( 'message' => 'unmocked ' . $path ) );
	},
	10,
	3
);
update_option( 'fbcol_assignee_source', 'wordpress' );
delete_option( 'fbcol_teamwork' );
delete_option( 'fbcol_tw_state' );

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
$make_user = static function ( string $role ) use ( &$fbcol_users ): int {
	$id            = wp_insert_user(
		array(
			'user_login' => 'fbcol_guest_t_' . $role . '_' . wp_generate_password( 6, false ),
			'user_pass'  => wp_generate_password(),
			'user_email' => 'fbc-guest-' . wp_generate_password( 6, false ) . '@example.com',
			'role'       => $role,
		)
	);
	$fbcol_users[] = $id;
	return $id;
};
// Become a logged-out visitor with (or without) a guest cookie and a REST nonce.
$as_guest = static function ( ?string $guest_id, bool $nonce = true ): void {
	wp_set_current_user( 0 );
	GuestMode::reset_request();
	unset( $_COOKIE[ GuestMode::COOKIE ], $_SERVER['HTTP_X_WP_NONCE'] );
	if ( null !== $guest_id ) {
		$_COOKIE[ GuestMode::COOKIE ] = GuestMode::sign( $guest_id, time() + 3600 );
	}
	if ( $nonce ) {
		$_SERVER['HTTP_X_WP_NONCE'] = wp_create_nonce( 'wp_rest' );
	}
};
$as_user = static function ( int $uid ): void {
	GuestMode::reset_request();
	unset( $_COOKIE[ GuestMode::COOKIE ], $_SERVER['HTTP_X_WP_NONCE'] );
	wp_set_current_user( $uid );
};

$admin  = $make_user( 'administrator' );
$editor = $make_user( 'editor' );
$sub    = $make_user( 'subscriber' );
$g1     = str_repeat( 'a1', 16 );
$g2     = str_repeat( 'b2', 16 );

// ---------------------------------------------------------------- 1. off by default
delete_option( GuestMode::OPT_ENABLED );
delete_option( GuestMode::OPT_HASH );
delete_option( GuestMode::OPT_KEY );
$check( 'off by default', ! GuestMode::enabled() );
$as_guest( $g1 );
$check( 'off: a guest cookie means nothing', null === GuestMode::guest_id() && ! Frontend::should_load() );
[ $st ] = $call( 'GET', '/items' );
$check( 'off: logged-out REST → 401', 401 === $st );
GuestMode::set_enabled( true );
$check( 'Anti: switched on without a password stays off', ! GuestMode::enabled() );

// ---------------------------------------------------------------- 2. password + cookies
GuestMode::set_password( 'peach-review' );
$check( 'on with a password', GuestMode::enabled() );
$check( 'password stored hashed, never plain', 'peach-review' !== get_option( GuestMode::OPT_HASH ) && ! str_contains( (string) get_option( GuestMode::OPT_HASH ), 'peach' ) );
$check( 'right password checks', GuestMode::check_password( 'peach-review' ) );
$check( 'Anti: wrong / empty password fails', ! GuestMode::check_password( 'peach-Review' ) && ! GuestMode::check_password( '' ) );
$good = GuestMode::sign( $g1, time() + 600 );
$check( 'signed cookie parses', array( 'id' => $g1, 'expires' => time() + 600 ) === GuestMode::parse( $good ) );
$check( 'Anti: tampered guest ID rejected', null === GuestMode::parse( str_replace( $g1, $g2, $good ) ) );
$check( 'Anti: tampered expiry rejected', null === GuestMode::parse( preg_replace( '/\.(\d+)\./', '.' . ( time() + 999999 ) . '.', $good ) ) );
$check( 'Anti: expired cookie rejected', null === GuestMode::parse( GuestMode::sign( $g1, time() - 1 ) ) );
$check( 'Anti: junk rejected', null === GuestMode::parse( 'v1.x.y.z' ) && null === GuestMode::parse( '' ) );
$as_guest( $g1 );
$check( 'valid cookie → guest', $g1 === GuestMode::guest_id() && GuestMode::active() );
$check( 'guest gets the overlay', Frontend::should_load() );
$cfg = Frontend::config();
$check( 'guest config: guest flag, no team list, no admin URL', isset( $cfg['guest'] ) && array() === $cfg['assignees']['people'] && '' === $cfg['adminUrl'] && 0 === $cfg['user']['id'] );
GuestMode::rotate_key();
GuestMode::reset_request();
$check( 'rotating the key signs every guest out', null === GuestMode::guest_id() );
$as_guest( $g1 );
GuestMode::set_password( 'second-pass' );
GuestMode::reset_request();
$check( 'changing the password signs every guest out', null === GuestMode::guest_id() );
$check( 'old password no longer works', ! GuestMode::check_password( 'peach-review' ) && GuestMode::check_password( 'second-pass' ) );
$check( 'clean_name trims, strips tags, caps length', 'Jane Doe' === GuestMode::clean_name( "  Jane \n <b>Doe</b> " ) && GuestMode::NAME_MAX === mb_strlen( GuestMode::clean_name( str_repeat( 'x', 200 ) ) ) && '' === GuestMode::clean_name( array( 'x' ) ) );

// ---------------------------------------------------------------- 3. logged-in users are never guests
$as_user( $editor );
$_COOKIE[ GuestMode::COOKIE ] = GuestMode::sign( $g1, time() + 3600 );
$check( 'logged-in editor with a guest cookie is not a guest', null === GuestMode::guest_id() );
$check( 'editor still gets the overlay as a reviewer', Frontend::should_load() && ! isset( Frontend::config()['guest'] ) );
$as_user( $sub );
$_COOKIE[ GuestMode::COOKIE ] = GuestMode::sign( $g1, time() + 3600 );
$check( 'Anti: logged-in subscriber (no review cap) gets no overlay, even with a guest cookie', ! Frontend::should_load() );
[ $st ] = $call( 'GET', '/items' );
$check( 'Anti: subscriber REST still 403', 403 === $st );

// ---------------------------------------------------------------- 4. guest REST
$as_guest( $g1, false );
[ $st ] = $call( 'GET', '/items' );
$check( 'Anti: guest without a REST nonce → 401 (cross-site requests can’t post as a guest)', 401 === $st );
$_SERVER['HTTP_X_WP_NONCE'] = 'bad-nonce';
[ $st ] = $call( 'GET', '/items' );
$check( 'Anti: guest with a bad nonce → 401', 401 === $st );
$as_guest( null );
[ $st ] = $call( 'POST', '/items', array( 'title' => 'x', 'type' => 'bug' ) );
$check( 'Anti: no cookie (locked) → 401', 401 === $st );

$as_guest( $g1 );
[ $st, $d ] = $call( 'POST', '/items', array( 'title' => 'Logo is blurry', 'type' => 'bug', 'page_path' => '/about/' ) );
$check( 'Anti: guest item without a name → 400', 400 === $st && 'guest_name' === ( $d['data']['field'] ?? '' ) );
[ $st, $d ] = $call(
	'POST',
	'/items',
	array(
		'title'       => 'Logo is blurry',
		'type'        => 'bug',
		'page_path'   => '/about/',
		'guest_name'  => '  Amanda  B. ',
		'priority'    => 'critical',
		'assignee_id' => $admin,
		'due_date'    => '2030-01-01',
	)
);
$g1_item = (int) ( $d['id'] ?? 0 );
$row     = Items::get( $g1_item );
$check( 'guest creates an item → 201', 201 === $st && $g1_item > 0 );
$check( 'stored: reporter_id 0, guest name, guest ID', 0 === $row['reporter_id'] && 'Amanda B.' === $row['reporter_name'] && $g1 === $row['guest_id'] );
$check( 'Anti: guests can’t set priority / assignee / due date', 'medium' === $row['priority'] && 0 === $row['assignee_id'] && null === $row['due_date'] );
$check( 'REST shape: reporter name + guest flag, guest ID never exposed', 'Amanda B.' === $d['reporter_name'] && true === $d['reporter_guest'] && ! isset( $d['guest_id'] ) && true === $d['can_delete'] );

$as_guest( $g2 );
[ , $d ] = $call( 'POST', '/items', array( 'title' => 'Typo in footer', 'type' => 'tweak', 'page_path' => '/about/', 'guest_name' => 'Bo' ) );
$g2_item = (int) ( $d['id'] ?? 0 );
[ $st, $d ] = $call( 'GET', '/items', null, array( 'page_path' => '/about/' ) );
$ids = array_column( $d['items'] ?? array(), 'id' );
$check( 'guest 2 lists only their own item', 200 === $st && array( $g2_item ) === $ids );
[ $st ] = $call( 'GET', '/items/' . $g1_item );
$check( 'Anti: guest 2 can’t open guest 1’s item (404, not 403)', 404 === $st );
[ $st ] = $call( 'POST', '/items/' . $g1_item . '/comments', array( 'body' => 'hi', 'guest_name' => 'Bo' ) );
$check( 'Anti: guest 2 can’t reply on guest 1’s item', 404 === $st );
[ $st ] = $call( 'DELETE', '/items/' . $g1_item );
$check( 'Anti: guest 2 can’t delete guest 1’s item', 404 === $st && null !== Items::get( $g1_item ) );

$as_guest( $g1 );
[ $st, $d ] = $call( 'GET', '/items' );
$check( 'guest 1 lists only their own (all pages)', array( $g1_item ) === array_column( $d['items'] ?? array(), 'id' ) );
[ $st, $d ] = $call( 'GET', '/items/' . $g1_item );
$check( 'guest opens their own item', 200 === $st && $g1_item === $d['id'] );
[ $st ] = $call( 'PATCH', '/items/' . $g1_item, array( 'status' => 'resolved' ) );
$check( 'Anti: guest can’t change status (PATCH is reviewers-only)', 401 === $st && 'open' === Items::get( $g1_item )['status'] );
[ $st ] = $call( 'PATCH', '/items/' . $g1_item, array( 'title' => 'renamed' ) );
$check( 'Anti: guest can’t edit fields either', 401 === $st );
[ $st ] = $call( 'GET', '/reviewers' );
$check( 'Anti: guest can’t list the team', 401 === $st );
[ $st ] = $call( 'POST', '/me/prefs', array( 'corner' => 'tl' ) );
$check( 'Anti: guest has no prefs endpoint', 401 === $st );
[ $st ] = $call( 'POST', '/items/' . $g1_item . '/comments', array( 'body' => 'Here is more detail' ) );
$check( 'Anti: guest reply without a name → 400', 400 === $st );
[ $st, $d ] = $call( 'POST', '/items/' . $g1_item . '/comments', array( 'body' => 'Here is more detail', 'guest_name' => 'Amanda B.' ) );
$last = end( $d['comments'] );
$check( 'guest replies on their own item, attributed to their name', 201 === $st && 'Amanda B.' === $last['user_name'] && true === $last['guest'] && 0 === $last['user_id'] );

// ---------------------------------------------------------------- 5. reviewers see guest items, unchanged powers
$as_user( $editor );
[ $st, $d ] = $call( 'GET', '/items', null, array( 'page_path' => '/about/' ) );
$ids = array_column( $d['items'] ?? array(), 'id' );
$check( 'reviewer sees both guests’ items', in_array( $g1_item, $ids, true ) && in_array( $g2_item, $ids, true ) );
[ $st, $d ] = $call( 'GET', '/items/' . $g1_item );
$names = array_column( $d['comments'] ?? array(), 'user_name' );
$check( 'reviewer sees the guest name on item and reply', 'Amanda B.' === $d['reporter_name'] && in_array( 'Amanda B.', $names, true ) );
$check( 'Anti: editor can’t delete a guest’s item (not theirs, not admin)', false === $d['can_delete'] );
[ $st, $d ] = $call( 'PATCH', '/items/' . $g1_item, array( 'status' => 'in_progress' ) );
$check( 'reviewer triages a guest item', 200 === $st && 'in_progress' === $d['status'] );
[ $st, $d ] = $call( 'POST', '/items/' . $g1_item . '/comments', array( 'body' => 'On it' ) );
$last = end( $d['comments'] );
$check( 'reviewer reply is still theirs (not a guest)', 201 === $st && $editor === $last['user_id'] && false === $last['guest'] );
[ $st, $d ] = $call( 'POST', '/items', array( 'title' => 'Editor item', 'type' => 'bug', 'priority' => 'high', 'page_path' => '/about/' ) );
$check( 'reviewer create unchanged: priority kept, reporter is the user', 201 === $st && 'high' === $d['priority'] && $editor === $d['reporter_id'] && false === $d['reporter_guest'] );
$editor_item = (int) $d['id'];
$check( 'reporter_label marks guests', 'Amanda B. (guest)' === Items::reporter_label( Items::get( $g1_item ) ) && get_userdata( $editor )->display_name === Items::reporter_label( Items::get( $editor_item ) ) );
$as_user( $admin );
[ , $d ] = $call( 'GET', '/items/' . $g1_item );
$check( 'admin can delete a guest item', true === $d['can_delete'] );

$as_guest( $g1 );
[ $st ] = $call( 'GET', '/items/' . $editor_item );
$check( 'Anti: guest can’t open a reviewer’s item', 404 === $st );

// ---------------------------------------------------------------- 6. recordings are per guest
update_option( Videos::OPTION, '1' );
$as_guest( $g1 );
[ $st, $d ] = $call( 'POST', '/recordings' );
$tok = (string) ( $d['token'] ?? '' );
$check( 'guest can open a recording upload', 201 === $st && 32 === strlen( $tok ) );
$q = new WP_REST_Request( 'POST', '/feedback-collector/v1/recordings/' . $tok );
$q->set_param( 'offset', 0 );
$q->set_body( "\x1A\x45\xDF\xA3" . str_repeat( 'v', 100 ) );
$res = rest_do_request( $q );
$check( 'guest appends to their own upload', 200 === $res->get_status() );
$as_guest( $g2 );
$q = new WP_REST_Request( 'POST', '/feedback-collector/v1/recordings/' . $tok );
$q->set_param( 'offset', 104 );
$q->set_body( 'zzzz' );
$check( 'Anti: another guest can’t write to that upload', 404 === rest_do_request( $q )->get_status() );
$check( 'Anti: a guest key can’t be used as a numeric user', is_wp_error( Videos::start_session( 0 ) ) && is_wp_error( Videos::start_session( 'g123' ) ) );
$as_guest( $g1 );
[ $st, $d ] = $call( 'POST', '/items', array( 'title' => 'With video', 'type' => 'bug', 'guest_name' => 'Amanda B.', 'recording' => array( 'token' => $tok, 'duration' => 3 ) ) );
$check( 'guest item carries their recording', 201 === $st && '' !== (string) ( $d['video_url'] ?? '' ) && empty( $d['video_error'] ) );

// ---------------------------------------------------------------- 7. delete own
[ $st ] = $call( 'DELETE', '/items/' . (int) $d['id'] );
$check( 'guest deletes their own item', 200 === $st && null === Items::get( (int) $d['id'] ) );

// ---------------------------------------------------------------- 8. Teamwork attribution
update_option( 'fbcol_teamwork', array( 'site' => 'https://clockwork.teamwork.com', 'project_id' => 100, 'project_name' => 'Demo', 'tasklist_id' => 200, 'tasklist_name' => 'QA – Round 1', 'round' => 1, 'tags' => array() ) );
$as_user( $admin );
$task = Teamwork::push( $g1_item );
$desc = (string) ( $mock['last_task']['task']['description'] ?? '' );
$check( 'pushed task says “Reported by: Amanda B. (guest)”', ! is_wp_error( $task ) && str_contains( $desc, 'Amanda B. (guest)' ) );
$check( 'pre-push guest reply was sent to Teamwork with the guest’s name', (bool) array_filter( $mock['comment_bodies'], static fn( $b ) => str_contains( $b, 'Amanda B. (guest)' ) && str_contains( $b, 'Here is more detail' ) ) );
$before = count( $mock['comment_bodies'] );
$as_guest( $g1 );
$call( 'POST', '/items/' . $g1_item . '/comments', array( 'body' => 'Follow-up after push', 'guest_name' => 'Amanda B.' ) );
$check( 'a guest reply on a pushed item goes to Teamwork at once', count( $mock['comment_bodies'] ) === $before + 1 && str_contains( (string) end( $mock['comment_bodies'] ), 'Amanda B. (guest)' ) );
$before = count( $mock['comment_bodies'] );
Items::add_comment( $g1_item, 'Synced from Teamwork', 'comment', 0, 99123 );
Items::add_comment( $g1_item, 'Teamwork author (no name)', 'comment', 0 );
$check( 'Anti: Teamwork-synced / nameless user-0 comments are not echoed back', count( $mock['comment_bodies'] ) === $before );
$check( 'Anti: nameless user-0 comments aren’t “pending” either', ! in_array( $g1_item, Teamwork::items_with_pending_comments(), true ) );
$as_user( $admin );
$c = Items::comments( $g1_item );
$check( 'thread names: guest, team, Teamwork', in_array( 'Amanda B.', array_column( $c, 'user_name' ), true ) && in_array( 'Teamwork', array_column( $c, 'user_name' ), true ) );

// ---------------------------------------------------------------- 9. off again
GuestMode::set_enabled( false );
$as_guest( $g1 );
[ $st ] = $call( 'GET', '/items' );
$check( 'turned off: guests lose access at once', 401 === $st && ! Frontend::should_load() );
$as_user( $editor );
[ $st ] = $call( 'GET', '/items/' . $g1_item );
$check( 'turned off: reviewers still see guest items', 200 === $st );

echo "{$n[0]} passed, {$n[1]} failed\n";
