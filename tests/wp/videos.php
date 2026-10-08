<?php
require __DIR__ . '/_guard.php';
/**
 * Screen recordings: upload sessions (pieces at offsets, ownership, ordering), create with a
 * recording, delete with the item, Teamwork attachment + timeline, and cleanup on uninstall.
 * Non-destructive: deletes only its own items (and their files) and restores options.
 *
 * @package FeedbackCollector
 */

use FeedbackCollector\Cleanup;
use FeedbackCollector\Items;
use FeedbackCollector\Videos;
use FeedbackCollector\Teamwork\Teamwork;

global $wpdb, $fbcol_mock;
wp_set_current_user( 1 );
$fbcol_max     = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbcol_backups = array();
foreach ( array( 'fbcol_teamwork', 'fbcol_tw_state', 'fbcol_round', 'fbcol_assignee_source', 'fbcol_screenshots', Videos::OPTION, Videos::OPT_MAX ) as $o ) {
	$fbcol_backups[ $o ] = get_option( $o, null );
}
register_shutdown_function(
	static function () use ( $fbcol_max, $fbcol_backups ) {
		global $wpdb;
		foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbcol_max ) ) as $id ) {
			Items::delete( (int) $id );
		}
		foreach ( $fbcol_backups as $o => $v ) {
			null === $v ? delete_option( $o ) : update_option( $o, $v );
		}
		delete_transient( 'fbcol_tw_people_list_100' );
		echo "cleanup done\n";
	}
);

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};
$webm  = "\x1A\x45\xDF\xA3" . str_repeat( 'v', 2000 );
$post  = static function ( string $route, ?string $body = null, array $query = array(), string $method = 'POST' ) {
	$q = new WP_REST_Request( $method, '/feedback-collector/v1' . $route );
	if ( null !== $body ) {
		$q->set_body( $body );
		$q->set_header( 'Content-Type', 'application/octet-stream' );
	}
	foreach ( $query as $k => $v ) {
		$q->set_query_params( array( $k => $v ) );
	}
	return rest_do_request( $q );
};
$start = static function () use ( $post ): string {
	return (string) ( $post( '/recordings' )->get_data()['token'] ?? '' );
};
$session_file = static fn( int $user, string $token ) => Videos::dir() . "/rec-$user-$token.part";
delete_option( 'fbcol_teamwork' );
delete_option( 'fbcol_assignee_source' );
update_option( Videos::OPTION, '1' );
delete_option( Videos::OPT_MAX );

// 1. Settings.
$check( 'recordings are on by default, 3 minutes', Videos::enabled() && 180 === Videos::max_seconds() );
update_option( Videos::OPT_MAX, 99999 );
$check( 'Anti: the length setting is capped at 10 minutes', 600 === Videos::max_seconds() );
delete_option( Videos::OPT_MAX );

// 2. Upload sessions.
$res   = $post( '/recordings' );
$token = (string) ( $res->get_data()['token'] ?? '' );
$check( 'POST /recordings → 201 with a 32-char token and the length limit', 201 === $res->get_status() && (bool) preg_match( '/^[A-Za-z0-9]{32}$/', $token ) && 180 === $res->get_data()['max_seconds'] );
$check( 'the session is an empty .part file named for the user', is_file( $session_file( 1, $token ) ) && 0 === filesize( $session_file( 1, $token ) ) );
$check( 'the video folder has a blank index.php', is_file( Videos::dir() . '/index.php' ) );

$res = $post( "/recordings/$token", substr( $webm, 0, 1000 ), array( 'offset' => 0 ) );
$check( 'first piece stored', 200 === $res->get_status() && 1000 === $res->get_data()['size'] );
$res = $post( "/recordings/$token", substr( $webm, 0, 1000 ), array( 'offset' => 0 ) );
$check( 're-sending a stored piece is harmless (no duplicate bytes)', 200 === $res->get_status() && 1000 === $res->get_data()['size'] );
$res = $post( "/recordings/$token", 'xyz', array( 'offset' => 1500 ) );
$check( 'Anti: a gap is refused with 409 and the current size', 409 === $res->get_status() && 1000 === ( $res->get_data()['data']['size'] ?? null ) );
$res = $post( "/recordings/$token", substr( $webm, 1000 ), array( 'offset' => 1000 ) );
$check( 'next piece appended at its offset', 200 === $res->get_status() && strlen( $webm ) === $res->get_data()['size'] );

$bad = $start();
$res = $post( "/recordings/$bad", '<?php echo 1;', array( 'offset' => 0 ) );
$check( 'Anti: a recording that does not start like WebM is refused', 400 === $res->get_status() );

$check( 'Anti: oversize pieces are refused', is_wp_error( Videos::append( 1, $bad, 0, "\x1A\x45\xDF\xA3" . str_repeat( 'x', Videos::CHUNK_MAX ) ) ) );

// Another reviewer can't write to (or attach) this session.
$other = (int) ( get_users( array( 'exclude' => array( 1 ), 'number' => 1, 'fields' => 'ID' ) )[0] ?? 0 );
if ( ! $other ) {
	$other = wp_insert_user( array( 'user_login' => 'fbcol_video_other_' . wp_generate_password( 6, false ), 'user_pass' => wp_generate_password(), 'role' => 'editor' ) );
}
$foreign = Videos::append( (int) $other, $token, strlen( $webm ), 'more' );
$check( 'Anti: another user cannot append to someone else\'s session (404)', is_wp_error( $foreign ) && 404 === $foreign->get_error_data()['status'] );

// 3. Create an item with the recording.
$seen = null;
add_action(
	'fbcol_item_created',
	static function ( $new_id ) use ( &$seen ) {
		$seen = Items::get( (int) $new_id )['video'];
	}
);
$q = new WP_REST_Request( 'POST', '/feedback-collector/v1/items' );
$q->set_header( 'Content-Type', 'application/json' );
$q->set_body(
	wp_json_encode(
		array(
			'title'     => 'Checkout breaks',
			'type'      => 'bug',
			'page_path' => '/checkout/',
			'recording' => array(
				'token'    => $token,
				'duration' => 83,
				'events'   => array(
					array( 't' => 51000, 'kind' => 'error', 'label' => 'x is not defined' ),
					array( 't' => 42000, 'kind' => 'click', 'label' => '"Pay now" (button.pay)' ),
					array( 't' => 1000, 'kind' => 'evil', 'label' => 'dropped' ),
					array( 't' => 2000, 'kind' => 'click', 'label' => '<script>alert(1)</script>' ),
				),
			),
		)
	)
);
$res  = rest_do_request( $q );
$d    = $res->get_data();
$item = Items::get( (int) $d['id'] );
$check( 'create with a recording → 201 with video_url and duration', 201 === $res->get_status() && str_contains( (string) $d['video_url'], '/uploads/fbc-videos/' ) && 83 === $d['video_duration'] );
$check( 'the session file became the item\'s .webm (id + 24 random chars)', (bool) preg_match( '/^' . $item['id'] . '-[A-Za-z0-9]{24}\.webm$/', (string) $item['video'] ) && ! is_file( $session_file( 1, $token ) ) && strlen( $webm ) === filesize( Videos::path( $item ) ) );
$check( 'recording already stored when fbcol_item_created fires (auto-push sees it)', is_string( $seen ) && '' !== $seen );
$check(
	'timeline is whitelisted and sorted by time',
	array(
		array( 't' => 42000, 'kind' => 'click', 'label' => '"Pay now" (button.pay)' ),
		array( 't' => 51000, 'kind' => 'error', 'label' => 'x is not defined' ),
	) === array_values( array_filter( $d['video_events'], static fn( $e ) => 2000 !== $e['t'] ) )
);
$check( 'Anti: markup in a timeline label is stripped', ! str_contains( wp_json_encode( $d['video_events'] ), '<script' ) );

$q = new WP_REST_Request( 'POST', '/feedback-collector/v1/items' );
$q->set_header( 'Content-Type', 'application/json' );
$q->set_body( wp_json_encode( array( 'title' => 'Stale token', 'type' => 'bug', 'recording' => array( 'token' => str_repeat( 'Z', 32 ), 'duration' => 5 ) ) ) );
$res = rest_do_request( $q );
$check( 'unknown token: feedback still saved (201) with video_error', 201 === $res->get_status() && ! empty( $res->get_data()['video_error'] ) && '' === $res->get_data()['video_url'] );

// 4. Discard + sweep.
$gone = $start();
$post( "/recordings/$gone", $webm, array( 'offset' => 0 ) );
$res = $post( "/recordings/$gone", null, array(), 'DELETE' );
$check( 'DELETE /recordings/{token} removes the partial upload', 200 === $res->get_status() && ! is_file( $session_file( 1, $gone ) ) );
$stale = $start();
touch( $session_file( 1, $stale ), time() - 13 * HOUR_IN_SECONDS );
$start();
$check( 'abandoned uploads older than 12 hours are swept', ! is_file( $session_file( 1, $stale ) ) );

update_option( Videos::OPTION, '0' );
$check( 'Anti: no new recordings while the setting is off (403)', 403 === $post( '/recordings' )->get_status() );
update_option( Videos::OPTION, '1' );

// 5. Deleting the item deletes the file.
$vpath = Videos::path( $item );
Items::delete( (int) $item['id'] );
$check( 'deleting an item deletes its recording', '' !== $vpath && ! is_file( $vpath ) );

// 6. Teamwork: attached, linked, timeline in the description.
$fbcol_mock = array(
	'put'     => 200,
	'payload' => null,
	'puts'    => array(),
);
add_filter(
	'pre_http_request',
	static function ( $pre, $args, $url ) {
		global $fbcol_mock;
		$path = (string) wp_parse_url( $url, PHP_URL_PATH );
		$json = static fn( $c, $b ) => array( 'response' => array( 'code' => $c, 'message' => '' ), 'body' => wp_json_encode( $b ), 'headers' => array(), 'cookies' => array() );
		if ( '/projects/api/v1/pendingfiles/presignedurl.json' === $path ) {
			return $json( 200, array( 'ref' => 'tf_vid' . count( $fbcol_mock['puts'] ), 'url' => 'https://s3.example.com/upload?sig=1' ) );
		}
		if ( 'PUT' === $args['method'] && str_starts_with( $url, 'https://s3.example.com/' ) ) {
			$fbcol_mock['puts'][] = array(
				'auth' => $args['headers']['Authorization'] ?? null,
				'len'  => strlen( (string) $args['body'] ),
			);
			return $json( $fbcol_mock['put'], array() );
		}
		if ( 'POST' === $args['method'] && preg_match( '#/tasklists/(\d+)/tasks\.json$#', $path ) ) {
			$fbcol_mock['payload'] = json_decode( (string) $args['body'], true );
			return $json( 201, array( 'task' => array( 'id' => 9800 + count( $fbcol_mock['puts'] ) ) ) );
		}
		if ( '/projects/api/v3/tags.json' === $path ) {
			return $json( 200, array( 'tags' => array( array( 'id' => 1, 'name' => 'Bug' ) ) ) );
		}
		if ( str_contains( $path, '/people.json' ) ) {
			return $json( 200, array( 'people' => array(), 'meta' => array( 'page' => array( 'hasMore' => false ) ) ) );
		}
		return $json( 404, array() );
	},
	10,
	3
);
$_POST = array( 'tw_site' => 'https://x.teamwork.com', 'tw_key' => 'fake-key' );
Teamwork::save_settings();
$_POST = array();
update_option(
	'fbcol_teamwork',
	array_merge(
		get_option( 'fbcol_teamwork' ),
		array(
			'project_id'  => 100,
			'tasklist_id' => 200,
			'round_lists' => array( FeedbackCollector\Rounds::current() => array( 'id' => 200, 'name' => 'QA' ) ),
			'tags'        => array( 'bug' => 1 ),
		)
	)
);
$tid = Items::create( array( 'type' => 'bug', 'title' => 'push with video' ) );
$tok = $start();
$post( "/recordings/$tok", $webm, array( 'offset' => 0 ) );
Videos::attach( $tid, 1, $tok, 95, array( array( 't' => 42000, 'kind' => 'click', 'label' => '"Pay now" (button.pay)' ) ) );
$res  = Teamwork::push( $tid );
$desc = (string) ( $fbcol_mock['payload']['task']['description'] ?? '' );
$check( 'push with a recording succeeds', ! is_wp_error( $res ) );
$check( 'recording PUT to storage without Teamwork auth, full bytes', 1 === count( $fbcol_mock['puts'] ) && null === $fbcol_mock['puts'][0]['auth'] && strlen( $webm ) === $fbcol_mock['puts'][0]['len'] );
$check( 'task has the recording attached', array( array( 'reference' => 'tf_vid0' ) ) === ( $fbcol_mock['payload']['attachments']['pendingFiles'] ?? null ) );
$check( 'description links to the recording with its length', str_contains( $desc, 'watch video (1:35)' ) && str_contains( $desc, '/fbc-videos/' ) );
$check( 'description lists the timeline', str_contains( $desc, '0:42 · clicked `"Pay now" (button.pay)`' ) );

$fbcol_mock['put'] = 500;
$fid             = Items::create( array( 'type' => 'bug', 'title' => 'push with failing video upload' ) );
$tok             = $start();
$post( "/recordings/$tok", $webm, array( 'offset' => 0 ) );
Videos::attach( $fid, 1, $tok, 10 );
$res = Teamwork::push( $fid );
$check( 'a failed recording upload never blocks the push', ! is_wp_error( $res ) && ! isset( $fbcol_mock['payload']['attachments'] ) );
$notes = array_column( Items::comments( $fid ), 'body' );
$check( 'the failed attachment is noted on the item', (bool) array_filter( $notes, static fn( $b ) => str_contains( $b, 'recording was not attached' ) ) );

// 7. Cleanup: inventory and purge_videos (what uninstall always runs).
$inv = Cleanup::inventory();
$check( 'inventory counts recordings and their size', $inv['videos'] >= 2 && $inv['video_bytes'] >= 2 * strlen( $webm ) );
$leftover = $start();
$removed  = Cleanup::purge_videos();
$vdir = trailingslashit( wp_upload_dir( null, false )['basedir'] ) . Videos::DIR; // not Videos::dir(), which recreates it
$check( 'purge_videos deletes every recording and partial upload, and the folder', $removed >= 2 && ! is_dir( $vdir ) );
$check( 'items whose file is gone report no video_url', '' === FeedbackCollector\Rest::present( Items::get( $tid ) )['video_url'] );
$check( 'uninstall.php always deletes recordings, before the keep-data check', (bool) preg_match( '/purge_videos\(\);.*fbcol_delete_on_uninstall/s', (string) file_get_contents( FBCOL_DIR . 'uninstall.php' ) ) );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
