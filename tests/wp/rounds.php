<?php
require __DIR__ . '/_guard.php';
/**
 * QA rounds: one counter, per-round Teamwork lists, push routing, summary, REST.
 * Non-destructive: deletes only its own rows and restores the options it touches.
 *
 * @package FeedbackCollector
 */

use FeedbackCollector\Items;
use FeedbackCollector\Rounds;
use FeedbackCollector\Teamwork\Teamwork;

global $wpdb, $fbc_mock;
wp_set_current_user( 1 );
$fbc_max     = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbc_backups = array();
foreach ( array( 'fbc_teamwork', 'fbc_tw_state', 'fbc_round', 'fbc_assignee_source' ) as $o ) {
	$fbc_backups[ $o ] = get_option( $o, null );
}
register_shutdown_function(
	static function () use ( $fbc_max, $fbc_backups ) {
		global $wpdb;
		foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbc_max ) ) as $id ) {
			Items::delete( (int) $id );
		}
		foreach ( $fbc_backups as $o => $v ) {
			null === $v ? delete_option( $o ) : update_option( $o, $v );
		}
		delete_transient( 'fbc_tw_people_list_100' );
		echo "cleanup done\n";
	}
);

$fbc_mock = array(
	'lists'   => 300,
	'creates' => array(),
);
add_filter(
	'pre_http_request',
	static function ( $pre, $args, $url ) {
		global $fbc_mock;
		$path = (string) wp_parse_url( $url, PHP_URL_PATH );
		$json = static fn( $c, $b ) => array( 'response' => array( 'code' => $c, 'message' => '' ), 'body' => wp_json_encode( $b ), 'headers' => array(), 'cookies' => array() );
		if ( 'POST' === $args['method'] && '/projects/100/tasklists.json' === $path ) {
			return $json( 201, array( 'TASKLISTID' => (string) ++$fbc_mock['lists'] ) );
		}
		if ( 'POST' === $args['method'] && preg_match( '#/tasklists/(\d+)/tasks\.json$#', $path, $m ) ) {
			$fbc_mock['creates'][] = (int) $m[1];
			return $json( 201, array( 'task' => array( 'id' => 8000 + count( $fbc_mock['creates'] ) ) ) );
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

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};
$mk    = static fn( string $title ) => Items::create(
	array(
		'type'  => 'bug',
		'title' => $title,
	)
);

// 1. Counter.
delete_option( 'fbc_round' );
delete_option( 'fbc_teamwork' );
delete_option( 'fbc_assignee_source' );
$check( 'fresh site starts at Round 1', 1 === Rounds::current() );
delete_option( 'fbc_round' );
update_option( 'fbc_teamwork', array( 'round' => 3 ) );
$check( 'adopts a pre-existing Teamwork round number once', 3 === Rounds::current() && 3 === (int) get_option( 'fbc_round' ) );
delete_option( 'fbc_teamwork' );
update_option( 'fbc_round', 1 );

// 2. Without Teamwork.
$a = $mk( 'round one item' );
$check( 'new items get the current round', 1 === Items::get( $a )['round'] );
$r = Rounds::start_next();
$check( 'start_next without Teamwork → Round 2, no Teamwork call', 2 === $r['round'] && null === $r['teamwork'] && 2 === Rounds::current() );
$b = $mk( 'round two item' );
$check( 'items filed after the switch get Round 2', 2 === Items::get( $b )['round'] );
$check( 'earlier items keep their round', 1 === Items::get( $a )['round'] );

// 3. Summary + REST.
$sum = Rounds::summary();
$check( 'summary lists rounds newest first', array( 2, 1 ) === array_slice( array_keys( $sum ), 0, 2 ) );
$check( 'summary counts open items per round', $sum[2]['open'] >= 1 && $sum[1]['open'] >= 1 );
$q = new WP_REST_Request( 'GET', '/feedback-collector/v1/items' );
$q->set_param( 'round', 1 );
$ids = array_column( rest_do_request( $q )->get_data()['items'], 'id' );
$check( 'REST round filter returns only that round', in_array( $a, $ids, true ) && ! in_array( $b, $ids, true ) );
$q   = new WP_REST_Request( 'GET', '/feedback-collector/v1/items/' . $b );
$check( 'REST item shape includes round', 2 === rest_do_request( $q )->get_data()['round'] );

// 4. With Teamwork: per-round lists and routing.
$_POST = array( 'tw_site' => 'https://x.teamwork.com', 'tw_key' => 'fake-key' );
Teamwork::save_settings();
$_POST            = array();
$s                = get_option( 'fbc_teamwork' );
$s['project_id']  = 100;
$s['tasklist_id'] = 200;
$s['round_lists'] = array( 1 => array( 'id' => 200, 'name' => 'QA – Round 1' ) );
$s['send_email']  = false;
$s['tags']        = array( 'bug' => 1 );
update_option( 'fbc_teamwork', $s );

$check( 'Round 2 has no list yet → not ready', ! Teamwork::ready() );
$err = Teamwork::push( $b );
$check( 'Anti: pushing a Round 2 item with no Round 2 list fails clearly', is_wp_error( $err ) && 'fbc_tw_no_round_list' === $err->get_error_code() );
$new = Teamwork::create_round_list( 2 );
$s   = get_option( 'fbc_teamwork' );
$check( 'create_round_list maps Round 2 and makes it active', 301 === $new && 301 === (int) $s['round_lists'][2]['id'] && 301 === (int) $s['tasklist_id'] && str_starts_with( $s['tasklist_name'], 'QA – Round 2' ) );
$check( 'ready once the current round has a list', Teamwork::ready() );

update_option(
	'fbc_teamwork',
	array_merge(
		get_option( 'fbc_teamwork' ),
		array( 'tw_sync_state' => '' )
	)
);
$wpdb->update( Items::table(), array( 'tw_sync_state' => '' ), array( 'id' => $a ) );
Teamwork::push( $a );
Teamwork::push( $b );
$check( 'Round 1 item pushes to the Round 1 list (200), not the active one', 200 === ( $fbc_mock['creates'][0] ?? 0 ) );
$check( 'Round 2 item pushes to the Round 2 list (301)', 301 === ( $fbc_mock['creates'][1] ?? 0 ) );

$r = Rounds::start_next();
$s = get_option( 'fbc_teamwork' );
$check( 'start_next with Teamwork creates and activates the Round 3 list', 3 === $r['round'] && 302 === $r['teamwork'] && 302 === (int) $s['round_lists'][3]['id'] && 302 === (int) $s['tasklist_id'] );
$check( 'earlier round lists are kept', 200 === (int) $s['round_lists'][1]['id'] && 301 === (int) $s['round_lists'][2]['id'] );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
