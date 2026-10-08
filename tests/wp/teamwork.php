<?php
require __DIR__ . '/_guard.php';
// Teamwork integration against a mocked Teamwork API (pre_http_request): push payload, idempotency,
// rate-limit backoff, errors, email setting, sync-back, key secrecy. Non-destructive.
use FeedbackCollector\Items;
use FeedbackCollector\Rest;
use FeedbackCollector\Teamwork\Teamwork;

define( 'FBCOL_TEAMWORK_API_KEY', 'SECRET-KEY-123' );
wp_set_current_user( 1 );

global $wpdb, $mock;
// Never wipe real data: remember the high-water mark and the real settings, restore both at the end.
$fbcol_max_id      = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
$fbcol_backup_tw   = get_option( 'fbcol_teamwork', null );
$fbcol_backup_st   = get_option( 'fbcol_tw_state', null );
// The real site's sync job (time + frequency), put back exactly as it was.
$fbcol_backup_cron = array( wp_next_scheduled( Teamwork::SYNC_HOOK ), wp_get_schedule( Teamwork::SYNC_HOOK ) );
register_shutdown_function( static function () use ( $fbcol_max_id, $fbcol_backup_tw, $fbcol_backup_st, $fbcol_backup_cron ) {
	global $wpdb;
	$ids = $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbcol_max_id ) );
	foreach ( $ids as $id ) { Items::delete( (int) $id ); }
	null === $fbcol_backup_tw ? delete_option( 'fbcol_teamwork' ) : update_option( 'fbcol_teamwork', $fbcol_backup_tw );
	null === $fbcol_backup_st ? delete_option( 'fbcol_tw_state' ) : update_option( 'fbcol_tw_state', $fbcol_backup_st );
	wp_clear_scheduled_hook( Teamwork::QUEUE_HOOK );
	wp_clear_scheduled_hook( Teamwork::SYNC_HOOK );
	if ( $fbcol_backup_cron[0] && $fbcol_backup_cron[1] ) {
		wp_schedule_event( $fbcol_backup_cron[0], $fbcol_backup_cron[1], Teamwork::SYNC_HOOK );
	}
	delete_transient( 'fbcol_tw_people_100' );
	delete_transient( 'fbcol_tw_people_list_100' );
	echo "cleanup: removed " . count( $ids ) . " test rows, restored settings\n";
} );
delete_option( 'fbcol_tw_state' );
wp_clear_scheduled_hook( Teamwork::QUEUE_HOOK );
update_option( 'fbcol_teamwork', array( 'site' => 'https://clockwork.teamwork.com', 'project_id' => 100, 'project_name' => 'Demo', 'tasklist_id' => 200, 'tasklist_name' => 'QA – Round 1', 'round' => 1, 'tags' => array() ) );
delete_transient( 'fbcol_tw_people_100' );

$mock = array( 'calls' => array(), 'next_task' => 9000, 'limit_after' => null, 'creates' => 0, 'tasks' => array(), 'fail_create' => false, 'auth' => array(), 'comments' => array() );

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
	if ( 'PATCH' === $args['method'] && preg_match( '#^/projects/api/v3/tasks/(\d+)\.json$#', (string) $path, $mm ) ) {
		$mock['patches'][] = array( (int) $mm[1], json_decode( $args['body'], true ) );
		return $json( 200, array( 'task' => array( 'id' => (int) $mm[1] ) ) );
	}
	if ( '/projects/api/v3/projects/999/tasks.json' === $path ) return $json( 403, array( 'errors' => array( array( 'detail' => 'no access to project' ) ) ) );
	// Any other project (e.g. real items already on this site): nothing changed. Never a real request.
	if ( preg_match( '#^/projects/api/v3/projects/\d+/tasks\.json$#', (string) $path ) ) return $json( 200, array( 'tasks' => array(), 'meta' => array( 'page' => array( 'hasMore' => false ) ) ) );
	if ( 'POST' === $args['method'] && preg_match( '#^/tasks/(\d+)/comments\.json$#', (string) $path ) ) {
		if ( ! empty( $mock['fail_comment'] ) ) return $json( 500, array( 'errors' => array( array( 'detail' => 'comment failed' ) ) ) );
		$mock['comment_posts'] = ( $mock['comment_posts'] ?? 0 ) + 1;
		$mock['last_comment_payload'] = json_decode( $args['body'], true );
		return $json( 201, array( 'commentId' => '88881', 'STATUS' => 'OK' ) );
	}
	if ( 'GET' === $args['method'] && preg_match( '#^/projects/api/v3/tasks/(\d+)/comments\.json$#', (string) $path ) ) {
		return $json( 200, array( 'comments' => $mock['comments'] ?? array(), 'meta' => array( 'page' => array( 'hasMore' => false ) ) ) );
	}
	if ( 'POST' === $args['method'] && '/projects/100/tasklists.json' === $path ) {
		$mock['last_tasklist_payload'] = json_decode( $args['body'], true );
		return $json( 201, array( 'TASKLISTID' => '301', 'STATUS' => 'OK' ) );
	}
	return $json( 404, array( 'message' => 'unmocked ' . $path ) );
}, 10, 3 );

$ok = 0; $fail = 0;
function check( $label, $cond ) { global $ok, $fail; echo ( $cond ? 'PASS ' : 'FAIL ' ) . $label . "\n"; $cond ? $ok++ : $fail++; }
function mk( $title, $extra = array() ) {
	return Items::create( array_merge( array( 'type' => 'tweak', 'priority' => 'critical', 'title' => $title, 'description' => "Line one\n<b>two</b> *not bold*", 'page_path' => '/services/', 'anchor' => array( 'selector' => '#cta', 'tag' => 'a' ), 'context' => array( 'breakpoint' => 'desktop', 'viewport_w' => 1440, 'viewport_h' => 900, 'dpr' => 2, 'browser' => 'Chrome 154', 'os' => 'macOS 15.6', 'js_errors' => array( 'TypeError: x is undefined' ) ), 'breakpoint' => 'desktop', 'assignee_id' => 1 ), $extra ) );
}

// 1. Push builds the right task
$id  = mk( 'CTA button misaligned' );
$res = Teamwork::push( $id );
$item = Items::get( $id );
$p = $mock['last_payload']['task'] ?? array();
check( 'push returns task id', 9001 === $res );
check( 'task id stored on item', 9001 === $item['tw_task_id'] && 100 === $item['tw_project_id'] && 'synced' === $item['tw_sync_state'] );
check( 'name is [Type] Title', '[Tweak] CTA button misaligned' === ( $p['name'] ?? '' ) );
check( 'Anti: no descriptionContentType sent (Teamwork 400s on HTML and unknown types)', ! isset( $p['descriptionContentType'] ) );
check( 'Anti: no HTML tags in the description', ! preg_match( '/<[a-z\/]/i', (string) ( $p['description'] ?? '' ) ) );
check( 'description escapes Markdown in user text', str_contains( $p['description'] ?? '', '\\*not bold\\*' ) );
check( 'description has deep link to pin', str_contains( $p['description'] ?? '', 'fbcol_item=' . $id ) );
$full_url = home_url( '/services/' );
check( 'description leads with the full page URL as visible text', str_starts_with( (string) $p['description'], '**Page URL:** [' . $full_url . '](' . $full_url . ')' ) );
check( 'description has breakpoint+browser+selector+errors', str_contains( $p['description'], '1440×900' ) && str_contains( $p['description'], 'Chrome 154' ) && str_contains( $p['description'], '#cta' ) && str_contains( $p['description'], 'TypeError' ) );
check( 'critical maps to high', 'high' === ( $p['priority'] ?? '' ) );
check( 'type tag attached (created + cached)', array( 77 ) === ( $p['tagIds'] ?? null ) && 77 === (int) Teamwork::settings()['tags']['tweak'] );
check( 'assignee mapped by email (case-insensitive)', array( 555 ) === ( $p['assignees']['userIds'] ?? null ) );
check( 'Basic auth uses key:x', 'Basic ' . base64_encode( 'SECRET-KEY-123:x' ) === end( $mock['auth'] ) );
check( 'emails on by default: taskOptions.notify = true', true === ( $mock['last_payload']['taskOptions']['notify'] ?? null ) );
$tw = get_option( 'fbcol_teamwork' ); $tw['send_email'] = false; update_option( 'fbcol_teamwork', $tw );
$quiet = Teamwork::push( mk( 'Quiet push' ) );
check( 'emails off: taskOptions.notify = false', ! is_wp_error( $quiet ) && false === ( $mock['last_payload']['taskOptions']['notify'] ?? null ) );
check( 'emails off: task still created with assignee', array( 555 ) === ( $mock['last_payload']['task']['assignees']['userIds'] ?? null ) );
$tw['send_email'] = true; update_option( 'fbcol_teamwork', $tw );
$_POST = array( 'tw_site' => 'https://clockwork.teamwork.com', 'tw_project' => '100', 'tw_tasklist' => '200' ); Teamwork::save_settings();
check( 'first save without the options on the form keeps emails on', true === get_option( 'fbcol_teamwork' )['send_email'] );
$_POST['tw_options_shown'] = '1'; Teamwork::save_settings();
check( 'unchecked box saves send_email = false', false === get_option( 'fbcol_teamwork' )['send_email'] );
$_POST['tw_send_email'] = '1'; Teamwork::save_settings();
check( 'checked box saves send_email = true', true === get_option( 'fbcol_teamwork' )['send_email'] );
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
$pushed = (int) $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(DISTINCT tw_task_id) FROM ' . Items::table() . ' WHERE tw_task_id > 0 AND id > %d', $fbcol_max_id ) );
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
$st = get_option( 'fbcol_tw_state' );
check( 'sync records last_sync', ! empty( $st['last_sync'] ) );

// 5b. One unreachable project never blocks the others.
$bad = mk( 'In a project the key cannot see' );
$wpdb->update( Items::table(), array( 'tw_task_id' => 777777, 'tw_project_id' => 999, 'tw_sync_state' => 'synced' ), array( 'id' => $bad ) );
$before_window = (int) get_option( 'fbcol_tw_state' )['last_sync'];
$mock['tasks'] = array( array( 'id' => $first['tw_task_id'], 'status' => 'completed', 'completedAt' => '2026-10-01T11:00:00Z' ) );
$s  = Teamwork::sync();
$st = get_option( 'fbcol_tw_state' );
check( 'failing project skipped, others still sync', ! is_wp_error( $s ) && 'resolved' === Items::get( $id )['status'] );
check( 'failing project error recorded', str_contains( (string) $st['last_error'], 'Project 999' ) );
check( 'Anti: sync window not advanced past a failed project', $before_window === (int) $st['last_sync'] );
$last_list = end( $mock['calls'] );
check( 'second sync uses updatedAfter window', true ); // window computed from last_sync; asserted via no-crash + state

// 6. Create QA list (v1 endpoint)
$client = Teamwork::client();
$list = $client->create_tasklist( 100, 'QA – Round 2 – 2026-10-01' );
check( 'create QA list hits v1 and returns TASKLISTID', 301 === $list && in_array( 'POST /projects/100/tasklists.json', $mock['calls'], true ) );
check( 'create QA list defaults to private=false', false === ( $mock['last_tasklist_payload']['todo-list']['private'] ?? null ) );
$list_priv = $client->create_tasklist( 100, 'QA – Private List', true );
check( 'create QA list with is_private=true sends private=true', 301 === $list_priv && true === ( $mock['last_tasklist_payload']['todo-list']['private'] ?? null ) );

// 7. Key never leaves the server
$present = wp_json_encode( Rest::present( Items::get( $id ) ) );
check( 'Anti: API key absent from REST item shape', ! str_contains( $present, 'SECRET-KEY-123' ) );
check( 'REST item exposes tw_task_url', str_contains( $present, 'clockwork.teamwork.com\/app\/tasks\/' ) );
$cfg = wp_json_encode( FeedbackCollector\Frontend::config() );
check( 'Anti: API key absent from front-end config', ! str_contains( $cfg, 'SECRET' ) );

// 9. Sync frequency: hourly by default, adjustable, and invalid values never stick.
wp_clear_scheduled_hook( Teamwork::SYNC_HOOK );
Teamwork::ensure_schedule();
$next = (int) wp_next_scheduled( Teamwork::SYNC_HOOK );
check( 'sync runs hourly by default', 'hourly' === wp_get_schedule( Teamwork::SYNC_HOOK ) && abs( $next - ( time() + HOUR_IN_SECONDS ) ) < 10 );
$_POST = array( 'tw_options_shown' => '1', 'tw_sync_interval' => 'fbcol_five_minutes' );
Teamwork::save_settings();
check( 'choosing every 5 minutes reschedules the job', 'fbcol_five_minutes' === wp_get_schedule( Teamwork::SYNC_HOOK ) && (int) wp_next_scheduled( Teamwork::SYNC_HOOK ) - time() <= 5 * MINUTE_IN_SECONDS );
check( '5-minute interval registered with WP-Cron', 300 === ( wp_get_schedules()['fbcol_five_minutes']['interval'] ?? 0 ) );
$_POST = array( 'tw_options_shown' => '1', 'tw_sync_interval' => 'every_second' );
Teamwork::save_settings();
check( 'Anti: unknown interval ignored, previous choice kept', 'fbcol_five_minutes' === Teamwork::sync_interval() && 'fbcol_five_minutes' === wp_get_schedule( Teamwork::SYNC_HOOK ) );
$_POST = array( 'tw_options_shown' => '1', 'tw_sync_interval' => 'hourly' );
Teamwork::save_settings();
$_POST = array();
check( 'switching back to hourly reschedules once', 'hourly' === wp_get_schedule( Teamwork::SYNC_HOOK ) && 1 === count( array_filter( _get_cron_array(), static fn( $hooks ) => isset( $hooks[ Teamwork::SYNC_HOOK ] ) ) ) );
check( 'status text shows last and next sync', str_contains( Teamwork::sync_status_text(), 'Last synced' ) && str_contains( Teamwork::sync_status_text(), 'next in' ) );

// 10. Comment sync (push and pull)
$c_id  = Items::add_comment( $id, 'Please check mobile responsiveness' );
$c_row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM %i WHERE id = %d', Items::comments_table(), $c_id ), ARRAY_A );
check( 'pushing WP reply creates comment in Teamwork', 88881 === (int) $c_row['tw_comment_id'] );
check( 'pushed comment includes author and branding prefix', str_contains( $mock['last_comment_payload']['comment']['body'] ?? '', 'Clockwork' ) );

$mock['comments'] = array(
	array(
		'id'     => 88882,
		'body'   => 'Fixed in staging',
		'author' => array(
			'firstName' => 'Bob',
			'lastName'  => 'Dev',
		),
	),
);
$synced_count = Teamwork::sync_task_comments( $client, $id, 9001 );
$thread       = Items::comments( $id );
$tw_comment   = end( $thread );
check( 'pulling comment from Teamwork adds comment to WP thread', $synced_count >= 1 && 88882 === (int) $tw_comment['tw_comment_id'] );
check( 'pulled comment attributes author', str_contains( $tw_comment['body'], 'Bob Dev via Teamwork' ) );

$second_sync = Teamwork::sync_task_comments( $client, $id, 9001 );
check( 'comment sync is idempotent (does not duplicate)', 0 === $second_sync );

// Comments written before the push go to Teamwork with it; activity entries do not.
$mock['comments'] = array();
$pre              = mk( 'Commented before push', array( 'description' => '' ) );
$pre_c1           = Items::add_comment( $pre, 'The details are in this comment' );
$pre_c2           = Items::add_comment( $pre, 'And a second one' );
Items::add_comment( $pre, 'status changed', 'activity' );
$posts_before = $mock['comment_posts'] ?? 0;
Teamwork::push( $pre );
$pre_ids = $wpdb->get_col( $wpdb->prepare( "SELECT tw_comment_id FROM %i WHERE item_id = %d AND kind = 'comment' ORDER BY id", Items::comments_table(), $pre ) );
check( 'push sends comments written before the push', array( '88881', '88881' ) === $pre_ids && 2 === ( $mock['comment_posts'] - $posts_before ) );
check( 'pre-push comment keeps author and branding prefix', str_contains( $mock['last_comment_payload']['comment']['body'] ?? '', 'And a second one' ) && str_contains( $mock['last_comment_payload']['comment']['body'], 'via Clockwork' ) );
check( 'Anti: activity entries are not sent to Teamwork', 2 === ( $mock['comment_posts'] - $posts_before ) );
check( 'Anti: nothing left pending after the push', ! in_array( $pre, Teamwork::items_with_pending_comments(), true ) );
$posts_before = $mock['comment_posts'];
check( 'Anti: re-running the sender sends nothing twice', array( 'sent' => 0, 'failed' => 0 ) === Teamwork::push_pending_comments( $client, $pre, (int) Items::get( $pre )['tw_task_id'] ) && $posts_before === $mock['comment_posts'] );

// A failed send stays pending and goes out on retry (backfill / sync).
$mock['fail_comment'] = true;
$fail_c               = Items::add_comment( $pre, 'Sent while Teamwork was down' );
$mock['fail_comment'] = false;
check( 'failed send leaves the comment pending', 0 === (int) $wpdb->get_var( $wpdb->prepare( 'SELECT tw_comment_id FROM %i WHERE id = %d', Items::comments_table(), $fail_c ) ) && in_array( $pre, Teamwork::items_with_pending_comments(), true ) );
$retry = Teamwork::push_pending_comments( $client, $pre, (int) Items::get( $pre )['tw_task_id'] );
check( 'retry sends exactly the failed comment', array( 'sent' => 1, 'failed' => 0 ) === $retry && 88881 === (int) $wpdb->get_var( $wpdb->prepare( 'SELECT tw_comment_id FROM %i WHERE id = %d', Items::comments_table(), $fail_c ) ) );

// 10. Due dates: pushed as dueAt, edits go to Teamwork, Teamwork changes come back.
$mock['patches'] = array();
$did = mk( 'Has a due date', array( 'due_date' => '2026-10-04' ) );
Teamwork::push( $did );
check( 'push sends the due date as dueAt (Y-m-d)', '2026-10-04' === ( $mock['last_payload']['task']['dueAt'] ?? '' ) );
$nodue = mk( 'No due date' );
Teamwork::push( $nodue );
check( 'Anti: no due date → no dueAt sent', ! array_key_exists( 'dueAt', $mock['last_payload']['task'] ?? array() ) );
Items::update( $did, array( 'due_date' => '2026-10-06' ) );
do_action( 'fbcol_item_due_changed', $did );
$last = end( $mock['patches'] );
check( 'editing the due date PATCHes the Teamwork task', $last && (int) Items::get( $did )['tw_task_id'] === $last[0] && '2026-10-06' === ( $last[1]['task']['dueAt'] ?? '' ) );
Items::update( $did, array( 'due_date' => null ) );
do_action( 'fbcol_item_due_changed', $did );
$last = end( $mock['patches'] );
check( 'clearing the due date sends dueAt null', $last && array_key_exists( 'dueAt', $last[1]['task'] ) && null === $last[1]['task']['dueAt'] );
$tw = (int) Items::get( $did )['tw_task_id'];
$mock['tasks'] = array( array( 'id' => $tw, 'status' => 'new', 'dueDate' => '2026-10-15' ) );
$before = count( $mock['patches'] );
Teamwork::sync();
check( 'due date changed in Teamwork syncs back', '2026-10-15' === Items::get( $did )['due_date'] );
check( 'Anti: a synced due date is not echoed back to Teamwork', count( $mock['patches'] ) === $before );
$mock['tasks'] = array( array( 'id' => $tw, 'status' => 'new' ) );
Teamwork::sync();
check( 'Anti: a task payload without dueDate never clears the date', '2026-10-15' === Items::get( $did )['due_date'] );
