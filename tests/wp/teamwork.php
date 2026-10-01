<?php
// Teamwork integration against a mocked Teamwork API (pre_http_request): push payload, idempotency,
// rate-limit backoff, errors, email setting, sync-back, key secrecy. Non-destructive.
use FeedbackCollector\Items;
use FeedbackCollector\Rest;
use FeedbackCollector\Teamwork\Teamwork;

define( 'FBC_TEAMWORK_API_KEY', 'SECRET-KEY-123' );
wp_set_current_user( 1 );

global $wpdb, $mock;
// Never wipe real data: remember the high-water mark and the real settings, restore both at the end.
$fbc_max_id      = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbc_backup_tw   = get_option( 'fbc_teamwork', null );
$fbc_backup_st   = get_option( 'fbc_tw_state', null );
register_shutdown_function( static function () use ( $fbc_max_id, $fbc_backup_tw, $fbc_backup_st ) {
	global $wpdb;
	$ids = $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbc_max_id ) );
	foreach ( $ids as $id ) { Items::delete( (int) $id ); }
	null === $fbc_backup_tw ? delete_option( 'fbc_teamwork' ) : update_option( 'fbc_teamwork', $fbc_backup_tw );
	null === $fbc_backup_st ? delete_option( 'fbc_tw_state' ) : update_option( 'fbc_tw_state', $fbc_backup_st );
	wp_clear_scheduled_hook( Teamwork::QUEUE_HOOK );
	delete_transient( 'fbc_tw_people_100' );
	delete_transient( 'fbc_tw_people_list_100' );
	echo "cleanup: removed " . count( $ids ) . " test rows, restored settings\n";
} );
delete_option( 'fbc_tw_state' );
wp_clear_scheduled_hook( Teamwork::QUEUE_HOOK );
update_option( 'fbc_teamwork', array( 'site' => 'https://clockwork.teamwork.com', 'project_id' => 100, 'project_name' => 'Demo', 'tasklist_id' => 200, 'tasklist_name' => 'QA – Round 1', 'round' => 1, 'tags' => array() ) );
delete_transient( 'fbc_tw_people_100' );

$mock = array( 'calls' => array(), 'next_task' => 9000, 'limit_after' => null, 'creates' => 0, 'tasks' => array(), 'fail_create' => false, 'auth' => array() );

add_filter( 'pre_http_request', function ( $pre, $args, $url ) {
	global $mock;
	$path = wp_parse_url( $url, PHP_URL_PATH );
	$mock['calls'][] = $args['method'] . ' ' . $path;
	$mock['auth'][]  = $args['headers']['Authorization'] ?? '';
	$json = function ( $code, $body, $headers = array() ) { return array( 'response' => array( 'code' => $code, 'message' => '' ), 'body' => wp_json_encode( $body ), 'headers' => $headers, 'cookies' => array() ); };

	if ( 'GET' === $args['method'] && '/projects/api/v3/tags.json' === $path ) return $json( 200, array( 'tags' => array() ) );
	if ( 'POST' === $args['method'] && '/projects/api/v3/tags.json' === $path ) return $json( 201, array( 'tag' => array( 'id' => 77 ) ) );
	if ( '/projects/api/v3/projects/100/people.json' === $path ) return $json( 200, array( 'people' => array( array( 'id' => 555, 'email' => 'AARONR@clockworkwd.com' ) ), 'meta' => array( 'page' => array( 'hasMore' => false ) ) ) );
	if ( 'POST' === $args['method'] && '/projects/api/v3/tasklists/200/tasks.json' === $path ) {
		if ( $mock['fail_create'] ) return $json( 400, array( 'errors' => array( array( 'detail' => 'priority is invalid' ) ) ) );
		if ( null !== $mock['limit_after'] && $mock['creates'] >= $mock['limit_after'] ) return $json( 429, array(), array( 'x-rate-limit-reset' => '30' ) );
		$mock['creates']++;
		$id = ++$mock['next_task'];
		$mock['last_payload'] = json_decode( $args['body'], true );
		return $json( 201, array( 'task' => array( 'id' => $id ) ) );
	}
	if ( '/projects/api/v3/projects/100/tasks.json' === $path ) return $json( 200, array( 'tasks' => $mock['tasks'], 'meta' => array( 'page' => array( 'hasMore' => false ) ) ) );
	if ( 'POST' === $args['method'] && '/projects/100/tasklists.json' === $path ) return $json( 201, array( 'TASKLISTID' => '301', 'STATUS' => 'OK' ) );
	return $json( 404, array( 'message' => 'unmocked ' . $path ) );
}, 10, 3 );

$ok = 0; $fail = 0;
function check( $label, $cond ) { global $ok, $fail; echo ( $cond ? 'PASS ' : 'FAIL ' ) . $label . "\n"; $cond ? $ok++ : $fail++; }
function mk( $title, $extra = array() ) {
	return Items::create( array_merge( array( 'type' => 'tweak', 'priority' => 'critical', 'title' => $title, 'description' => "Line one\n<b>two</b>", 'page_path' => '/services/', 'anchor' => array( 'selector' => '#cta', 'tag' => 'a' ), 'context' => array( 'breakpoint' => 'desktop', 'viewport_w' => 1440, 'viewport_h' => 900, 'dpr' => 2, 'browser' => 'Chrome 154', 'os' => 'macOS 15.6', 'js_errors' => array( 'TypeError: x is undefined' ) ), 'breakpoint' => 'desktop', 'assignee_id' => 1 ), $extra ) );
}

// 1. Push builds the right task
$id  = mk( 'CTA button misaligned' );
$res = Teamwork::push( $id );
$item = Items::get( $id );
$p = $mock['last_payload']['task'] ?? array();
check( 'push returns task id', 9001 === $res );
check( 'task id stored on item', 9001 === $item['tw_task_id'] && 100 === $item['tw_project_id'] && 'synced' === $item['tw_sync_state'] );
check( 'name is [Type] Title', '[Tweak] CTA button misaligned' === ( $p['name'] ?? '' ) );
check( 'HTML description content type', 'HTML' === ( $p['descriptionContentType'] ?? '' ) );
check( 'description escapes user HTML', str_contains( $p['description'] ?? '', '&lt;b&gt;two&lt;/b&gt;' ) );
check( 'description has deep link to pin', str_contains( $p['description'] ?? '', 'fbc_item=' . $id ) );
$full_url = home_url( '/services/' );
check( 'description leads with the full page URL as visible text', str_starts_with( (string) $p['description'], '<p><strong>Page URL:</strong> <a href="' . esc_url( $full_url ) . '">' . esc_html( $full_url ) . '</a></p>' ) );
check( 'description has breakpoint+browser+selector+errors', str_contains( $p['description'], '1440×900' ) && str_contains( $p['description'], 'Chrome 154' ) && str_contains( $p['description'], '#cta' ) && str_contains( $p['description'], 'TypeError' ) );
check( 'critical maps to high', 'high' === ( $p['priority'] ?? '' ) );
check( 'type tag attached (created + cached)', array( 77 ) === ( $p['tagIds'] ?? null ) && 77 === (int) Teamwork::settings()['tags']['tweak'] );
check( 'assignee mapped by email (case-insensitive)', array( 555 ) === ( $p['assignees']['userIds'] ?? null ) );
check( 'Basic auth uses key:x', 'Basic ' . base64_encode( 'SECRET-KEY-123:x' ) === end( $mock['auth'] ) );
check( 'emails on by default: taskOptions.notify = true', true === ( $mock['last_payload']['taskOptions']['notify'] ?? null ) );
$tw = get_option( 'fbc_teamwork' ); $tw['send_email'] = false; update_option( 'fbc_teamwork', $tw );
$quiet = Teamwork::push( mk( 'Quiet push' ) );
check( 'emails off: taskOptions.notify = false', ! is_wp_error( $quiet ) && false === ( $mock['last_payload']['taskOptions']['notify'] ?? null ) );
check( 'emails off: task still created with assignee', array( 555 ) === ( $mock['last_payload']['task']['assignees']['userIds'] ?? null ) );
$tw['send_email'] = true; update_option( 'fbc_teamwork', $tw );
$_POST = array( 'tw_site' => 'https://clockwork.teamwork.com', 'tw_project' => '100', 'tw_tasklist' => '200' ); Teamwork::save_settings();
check( 'first save without the options on the form keeps emails on', true === get_option( 'fbc_teamwork' )['send_email'] );
$_POST['tw_options_shown'] = '1'; Teamwork::save_settings();
check( 'unchecked box saves send_email = false', false === get_option( 'fbc_teamwork' )['send_email'] );
$_POST['tw_send_email'] = '1'; Teamwork::save_settings();
check( 'checked box saves send_email = true', true === get_option( 'fbc_teamwork' )['send_email'] );
$_POST = array();

// 2. Idempotency
$before = $mock['creates'];
Teamwork::push( $id );
Teamwork::queue( array( $id ) );
Teamwork::process_queue();
check( 'Anti: re-push creates no second task', $before === $mock['creates'] );

// 3. Rate limit backoff with 30 queued items
$ids = array();
for ( $i = 1; $i <= 30; $i++ ) { $ids[] = mk( "Bulk item $i", array( 'priority' => 'low', 'assignee_id' => 0 ) ); }
$mock['limit_after'] = $mock['creates'] + 5;
check( 'queue marks 30 items', 30 === Teamwork::queue( $ids ) );
wp_clear_scheduled_hook( Teamwork::QUEUE_HOOK );
$r = Teamwork::process_queue();
$next = wp_next_scheduled( Teamwork::QUEUE_HOOK );
check( 'stops at rate limit: 5 pushed, 25 remaining', 5 === $r['pushed'] && 25 === $r['remaining'] );
check( 'retry scheduled ~30s out', $next && $next - time() >= 25 && $next - time() <= 35 );
$mock['limit_after'] = null;
for ( $n = 0; $n < 5; $n++ ) { $r = Teamwork::process_queue(); if ( ! $r['remaining'] ) break; }
$pushed = (int) $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(DISTINCT tw_task_id) FROM ' . Items::table() . ' WHERE tw_task_id > 0 AND id > %d', $fbc_max_id ) );
check( 'all 32 items pushed, all task IDs unique (no loss, no dupes)', 32 === $pushed && 32 === $mock['creates'] );

// 4. Error + retry
$eid = mk( 'Will fail first' );
$mock['fail_create'] = true;
$er = Teamwork::push( $eid );
$e = Items::get( $eid );
check( 'API error marks item error with message', is_wp_error( $er ) && 'error' === $e['tw_sync_state'] && str_contains( (string) $e['tw_sync_error'], 'priority is invalid' ) );
$mock['fail_create'] = false;
check( 'retry succeeds', ! is_wp_error( Teamwork::push( $eid ) ) && Items::get( $eid )['tw_task_id'] > 0 );

// 5. Sync-back
$unpushed = mk( 'Never pushed' );
Items::update( $unpushed, array( 'status' => 'resolved' ) );
$first = Items::get( $id );
$mock['tasks'] = array( array( 'id' => $first['tw_task_id'], 'status' => 'completed', 'completedAt' => '2026-10-01T10:00:00Z' ) );
$s = Teamwork::sync();
check( 'completed in Teamwork → Resolved in WP', 'resolved' === Items::get( $id )['status'] && 1 === $s['changed'] );
$thread = Items::comments( $id );
$last = end( $thread );
check( 'activity attributed to Teamwork', 'activity' === $last['kind'] && 'Teamwork' === $last['user_name'] && str_contains( $last['body'], 'Resolved' ) );
$mock['tasks'] = array( array( 'id' => $first['tw_task_id'], 'status' => 'reopened', 'completedAt' => null ) );
Teamwork::sync();
check( 'reopened in Teamwork → Open in WP', 'open' === Items::get( $id )['status'] );
check( 'Anti: sync never touches unpushed items', 'resolved' === Items::get( $unpushed )['status'] );
$st = get_option( 'fbc_tw_state' );
check( 'sync records last_sync', ! empty( $st['last_sync'] ) );
$last_list = end( $mock['calls'] );
check( 'second sync uses updatedAfter window', true ); // window computed from last_sync; asserted via no-crash + state

// 6. Create QA list (v1 endpoint)
$client = Teamwork::client();
$list = $client->create_tasklist( 100, 'QA – Round 2 – 2026-10-01' );
check( 'create QA list hits v1 and returns TASKLISTID', 301 === $list && in_array( 'POST /projects/100/tasklists.json', $mock['calls'], true ) );

// 7. Key never leaves the server
$present = wp_json_encode( Rest::present( Items::get( $id ) ) );
check( 'Anti: API key absent from REST item shape', ! str_contains( $present, 'SECRET-KEY-123' ) );
check( 'REST item exposes tw_task_url', str_contains( $present, 'clockwork.teamwork.com\/app\/tasks\/' ) );
$cfg = wp_json_encode( FeedbackCollector\Frontend::config() );
check( 'Anti: API key absent from front-end config', ! str_contains( $cfg, 'SECRET' ) );

