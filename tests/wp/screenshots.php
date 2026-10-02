<?php
require __DIR__ . '/_guard.php';
/**
 * Screenshots: validation, storage, multipart create, replace/delete, Teamwork attachment.
 * Non-destructive: deletes only its own items (and their files) and restores options.
 *
 * @package FeedbackCollector
 */

use FeedbackCollector\Items;
use FeedbackCollector\Screenshots;
use FeedbackCollector\Teamwork\Teamwork;

global $wpdb, $fbc_mock;
wp_set_current_user( 1 );
$fbc_max     = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbc_backups = array();
foreach ( array( 'fbc_teamwork', 'fbc_tw_state', 'fbc_round', 'fbc_assignee_source', Screenshots::OPTION ) as $o ) {
	$fbc_backups[ $o ] = get_option( $o, null );
}
$fbc_tmp = array();
register_shutdown_function(
	static function () use ( $fbc_max, $fbc_backups, &$fbc_tmp ) {
		global $wpdb;
		foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbc_max ) ) as $id ) {
			Items::delete( (int) $id );
		}
		foreach ( $fbc_backups as $o => $v ) {
			null === $v ? delete_option( $o ) : update_option( $o, $v );
		}
		foreach ( $fbc_tmp as $f ) {
			if ( is_file( $f ) ) {
				unlink( $f );
			}
		}
		delete_transient( 'fbc_tw_people_list_100' );
		echo "cleanup done\n";
	}
);

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};
$jpeg  = static function ( int $w = 320, int $h = 200 ): string {
	$im = imagecreatetruecolor( $w, $h );
	imagefill( $im, 0, 0, imagecolorallocate( $im, 105, 83, 196 ) );
	ob_start();
	imagejpeg( $im, null, 80 );
	imagedestroy( $im );
	return (string) ob_get_clean();
};
$mk    = static fn( string $title ) => Items::create(
	array(
		'type'  => 'bug',
		'title' => $title,
	)
);
// Stand-in for a real HTTP upload: write bytes to a temp file and register it as $_FILES-style params.
$upload = static function ( WP_REST_Request $q, string $bytes ) use ( &$fbc_tmp ): void {
	$tmp       = wp_tempnam( 'fbc-shot' );
	$fbc_tmp[] = $tmp;
	file_put_contents( $tmp, $bytes );
	$q->set_file_params(
		array(
			'screenshot' => array(
				'name'     => 'screenshot.jpg',
				'type'     => 'image/jpeg',
				'tmp_name' => $tmp,
				'error'    => UPLOAD_ERR_OK,
				'size'     => strlen( $bytes ),
			),
		)
	);
};
add_filter( 'fbc_is_uploaded_file', '__return_true' );
delete_option( 'fbc_teamwork' );
delete_option( 'fbc_assignee_source' );

// 1. Direct storage + validation.
$id   = $mk( 'shot direct' );
$name = Screenshots::save_bytes( $id, $jpeg() );
$item = Items::get( $id );
$path = Screenshots::path( $item );
$check( 'valid JPEG is stored', is_string( $name ) && '' !== $path && is_file( $path ) );
$check( 'filename is unguessable (id + 24 random chars)', (bool) preg_match( '/^' . $id . '-[A-Za-z0-9]{24}\.jpg$/', (string) $name ) );
$check( 'directory has a blank index.php', is_file( Screenshots::dir() . '/index.php' ) );
$check( 'URL points into uploads/fbc-screenshots', str_contains( Screenshots::url( $item ), '/uploads/fbc-screenshots/' . $name ) );
$bad = Screenshots::save_bytes( $id, '<?php echo "not an image";' );
$check( 'Anti: non-image bytes are rejected', is_wp_error( $bad ) && 400 === $bad->get_error_data()['status'] );
$big = Screenshots::save_bytes( $id, str_repeat( 'x', Screenshots::MAX_BYTES + 1 ) );
$check( 'Anti: oversize bytes are rejected', is_wp_error( $big ) );
$old  = $path;
Screenshots::save_bytes( $id, $jpeg( 200, 100 ) );
$check( 'replacing deletes the previous file', ! is_file( $old ) && '' !== Screenshots::path( Items::get( $id ) ) );

// 2. Multipart create: fields in "data", image alongside; stored before fbc_item_created.
$seen = null;
add_action(
	'fbc_item_created',
	static function ( $new_id ) use ( &$seen ) {
		$seen = Items::get( (int) $new_id )['screenshot'];
	}
);
$q = new WP_REST_Request( 'POST', '/feedback-collector/v1/items' );
$q->set_body_params(
	array(
		'data' => wp_json_encode(
			array(
				'title'     => 'From multipart',
				'type'      => 'tweak',
				'page_path' => '/shots/',
			)
		),
	)
);
$upload( $q, $jpeg() );
$res = rest_do_request( $q );
$d   = $res->get_data();
$check( 'multipart create → 201 with screenshot_url', 201 === $res->get_status() && str_contains( (string) $d['screenshot_url'], '/fbc-screenshots/' ) );
$check( 'fields parsed from the JSON "data" part', 'From multipart' === $d['title'] && 'tweak' === $d['type'] );
$check( 'screenshot already stored when fbc_item_created fires (auto-push sees it)', is_string( $seen ) && '' !== $seen );

$q = new WP_REST_Request( 'POST', '/feedback-collector/v1/items' );
$q->set_body_params(
	array(
		// Simulated raw JSON from browser containing quotes in selector and text:
		'data' => wp_json_encode(
			array(
				'title'       => 'Padding missing for header',
				'description' => 'The "WordPress" header should bump down 20px',
				'type'        => 'bug',
				'anchor'      => array(
					'selector' => 'div[data-id="2525c78"] > img',
					'tag'      => 'img',
				),
			)
		),
	)
);
$upload( $q, $jpeg() );
$res = rest_do_request( $q );
$d   = $res->get_data();
$check( 'multipart create with quotes in selector/text succeeds (201)', 201 === $res->get_status() && 'Padding missing for header' === ( $d['title'] ?? '' ) );


$q = new WP_REST_Request( 'POST', '/feedback-collector/v1/items' );
$q->set_body_params( array( 'data' => wp_json_encode( array( 'title' => 'Bad image', 'type' => 'bug' ) ) ) );
$upload( $q, 'definitely not a jpeg' );
$res = rest_do_request( $q );
$d   = $res->get_data();
$check( 'bad image: feedback still saved (201) with screenshot_error', 201 === $res->get_status() && ! empty( $d['screenshot_error'] ) && '' === $d['screenshot_url'] );

remove_all_filters( 'fbc_is_uploaded_file' );
$q = new WP_REST_Request( 'POST', '/feedback-collector/v1/items' );
$q->set_body_params( array( 'data' => wp_json_encode( array( 'title' => 'Not a real upload', 'type' => 'bug' ) ) ) );
$upload( $q, $jpeg() );
$d = rest_do_request( $q )->get_data();
$check( 'Anti: a temp file that is not a genuine HTTP upload is refused', ! empty( $d['screenshot_error'] ) && '' === $d['screenshot_url'] );
add_filter( 'fbc_is_uploaded_file', '__return_true' );

// 3. Replace + delete endpoints, delete with item.
$rid = $mk( 'replace me' );
$q   = new WP_REST_Request( 'POST', "/feedback-collector/v1/items/$rid/screenshot" );
$upload( $q, $jpeg() );
$res = rest_do_request( $q );
$check( 'POST /items/{id}/screenshot stores one', 200 === $res->get_status() && '' !== $res->get_data()['screenshot_url'] );
$file = Screenshots::path( Items::get( $rid ) );
$res  = rest_do_request( new WP_REST_Request( 'DELETE', "/feedback-collector/v1/items/$rid/screenshot" ) );
$check( 'DELETE /items/{id}/screenshot removes file and field', 200 === $res->get_status() && '' === $res->get_data()['screenshot_url'] && ! is_file( $file ) );
$did = $mk( 'deleted with item' );
Screenshots::save_bytes( $did, $jpeg() );
$dfile = Screenshots::path( Items::get( $did ) );
Items::delete( $did );
$check( 'deleting an item deletes its screenshot', '' !== $dfile && ! is_file( $dfile ) );

// 4. Teamwork attachment.
$fbc_mock = array(
	'put'     => 200,
	'payload' => null,
	'puts'    => array(),
);
add_filter(
	'pre_http_request',
	static function ( $pre, $args, $url ) {
		global $fbc_mock;
		$path = (string) wp_parse_url( $url, PHP_URL_PATH );
		$json = static fn( $c, $b ) => array( 'response' => array( 'code' => $c, 'message' => '' ), 'body' => wp_json_encode( $b ), 'headers' => array(), 'cookies' => array() );
		if ( '/projects/api/v1/pendingfiles/presignedurl.json' === $path ) {
			return $json( 200, array( 'ref' => 'tf_abc123', 'url' => 'https://s3.example.com/upload?sig=1' ) );
		}
		if ( 'PUT' === $args['method'] && str_starts_with( $url, 'https://s3.example.com/' ) ) {
			$fbc_mock['puts'][] = array(
				'auth' => $args['headers']['Authorization'] ?? null,
				'acl'  => $args['headers']['X-Amz-Acl'] ?? null,
				'len'  => strlen( (string) $args['body'] ),
			);
			return $json( $fbc_mock['put'], array() );
		}
		if ( 'POST' === $args['method'] && preg_match( '#/tasklists/(\d+)/tasks\.json$#', $path ) ) {
			$fbc_mock['payload'] = json_decode( (string) $args['body'], true );
			return $json( 201, array( 'task' => array( 'id' => 9900 + count( $fbc_mock['puts'] ) ) ) );
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
	'fbc_teamwork',
	array_merge(
		get_option( 'fbc_teamwork' ),
		array(
			'project_id'  => 100,
			'tasklist_id' => 200,
			'round_lists' => array( FeedbackCollector\Rounds::current() => array( 'id' => 200, 'name' => 'QA' ) ),
			'tags'        => array( 'bug' => 1 ),
		)
	)
);
$tid = $mk( 'push with shot' );
Screenshots::save_bytes( $tid, $jpeg() );
$res = Teamwork::push( $tid );
$check( 'push with screenshot succeeds', ! is_wp_error( $res ) );
$check( 'screenshot PUT to storage without Teamwork auth, public-read ACL, full bytes', 1 === count( $fbc_mock['puts'] ) && null === $fbc_mock['puts'][0]['auth'] && 'public-read' === $fbc_mock['puts'][0]['acl'] && $fbc_mock['puts'][0]['len'] > 100 );
$check( 'task created with attachments.pendingFiles = [tf_abc123]', array( array( 'reference' => 'tf_abc123' ) ) === ( $fbc_mock['payload']['attachments']['pendingFiles'] ?? null ) );
$check( 'task description links to the screenshot', str_contains( (string) $fbc_mock['payload']['task']['description'], '/fbc-screenshots/' ) );

$fbc_mock['put'] = 500;
$fid             = $mk( 'push with failing upload' );
Screenshots::save_bytes( $fid, $jpeg() );
$res = Teamwork::push( $fid );
$check( 'a failed screenshot upload never blocks the push', ! is_wp_error( $res ) && ! isset( $fbc_mock['payload']['attachments'] ) );
$notes = array_column( Items::comments( $fid ), 'body' );
$check( 'the failed attachment is noted on the item', (bool) array_filter( $notes, static fn( $b ) => str_contains( $b, 'screenshot was not attached' ) ) );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
