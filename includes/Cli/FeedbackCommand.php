<?php
/**
 * WP-CLI command suite for Feedback Collector.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector\Cli;

use FeedbackCollector\Assignees;
use FeedbackCollector\Cleanup;
use FeedbackCollector\DueDates;
use FeedbackCollector\Items;
use FeedbackCollector\Rest;
use FeedbackCollector\Rounds;
use FeedbackCollector\Teamwork\Teamwork;
use WP_CLI;
use WP_CLI\Utils;

defined( 'ABSPATH' ) || exit;

/**
 * Manages Feedback Collector items, triage, and Teamwork pushes.
 *
 * ## EXAMPLES
 *
 *     # List all unresolved feedback items
 *     $ wp feedback list --status=unresolved
 *
 *     # Create a new feedback item
 *     $ wp feedback create --title="Broken navigation link" --type=bug --priority=high
 *
 *     # Show feedback statistics
 *     $ wp feedback stats
 *
 *     # Inspect item #12
 *     $ wp feedback get 12
 *
 *     # Mark item #12 as resolved
 *     $ wp feedback update 12 --status=resolved
 *
 *     # Push item #12 to Teamwork
 *     $ wp feedback push-teamwork 12
 *
 *     # Push all unpushed items
 *     $ wp feedback push-teamwork --all
 *
 *     # Delete an item
 *     $ wp feedback delete 12 --force
 */
class FeedbackCommand {

	/**
	 * Registers the command with WP-CLI.
	 */
	public static function register(): void {
		WP_CLI::add_command( 'feedback', self::class );
	}

	/**
	 * Lists feedback items with filtering and formatting.
	 *
	 * ## OPTIONS
	 *
	 * [--status=<status>]
	 * : Filter by status: open, in_progress, ready, resolved, unresolved, or all.
	 * ---
	 * default: unresolved
	 * ---
	 *
	 * [--type=<type>]
	 * : Filter by type: bug, tweak, change, comment.
	 *
	 * [--priority=<priority>]
	 * : Filter by priority: low, medium, high, critical.
	 *
	 * [--round=<round>]
	 * : Filter by round number.
	 *
	 * [--page-path=<page-path>]
	 * : Filter by page path (e.g. /services/).
	 *
	 * [--assignee=<assignee>]
	 * : Filter by assignee ID.
	 *
	 * [--search=<search>]
	 * : Search query in title, description, or page path.
	 *
	 * [--per-page=<per-page>]
	 * : Number of items per page.
	 * ---
	 * default: 100
	 * ---
	 *
	 * [--paged=<paged>]
	 * : Page number to retrieve.
	 * ---
	 * default: 1
	 * ---
	 *
	 * [--fields=<fields>]
	 * : Comma-separated list of fields to display.
	 * ---
	 * default: id,type,status,priority,title,reporter_name,assignee_name,due_date,page_path,tw_task_id
	 * ---
	 *
	 * [--format=<format>]
	 * : Render output format: table, json, csv, yaml, ids, count.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 *   - csv
	 *   - yaml
	 *   - ids
	 *   - count
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     # List all open bugs
	 *     $ wp feedback list --status=open --type=bug
	 *
	 *     # Output only the IDs of unresolved items
	 *     $ wp feedback list --status=unresolved --format=ids
	 *
	 *     # Export items as CSV
	 *     $ wp feedback list --status=all --format=csv > feedback.csv
	 *
	 * @subcommand list
	 */
	public function list_( array $args, array $assoc_args ): void {
		$query_args = array(
			'per_page' => (int) ( $assoc_args['per_page'] ?? 100 ),
			'paged'    => (int) ( $assoc_args['paged'] ?? 1 ),
		);

		if ( isset( $assoc_args['status'] ) && 'all' !== $assoc_args['status'] ) {
			$query_args['status'] = $assoc_args['status'];
		}
		if ( isset( $assoc_args['type'] ) ) {
			$query_args['type'] = $assoc_args['type'];
		}
		if ( isset( $assoc_args['priority'] ) ) {
			$query_args['priority'] = $assoc_args['priority'];
		}
		if ( isset( $assoc_args['round'] ) ) {
			$query_args['round'] = (int) $assoc_args['round'];
		}
		if ( isset( $assoc_args['page-path'] ) ) {
			$query_args['page_path'] = $assoc_args['page-path'];
		}
		if ( isset( $assoc_args['assignee'] ) ) {
			$query_args['assignee_id'] = (int) $assoc_args['assignee'];
		}
		if ( isset( $assoc_args['search'] ) ) {
			$query_args['search'] = $assoc_args['search'];
		}

		$result = Items::query( $query_args );
		$format = $assoc_args['format'] ?? 'table';

		if ( 'count' === $format ) {
			WP_CLI::line( (string) $result['total'] );
			return;
		}

		if ( 'ids' === $format ) {
			$ids = array_column( $result['items'], 'id' );
			WP_CLI::line( implode( ' ', $ids ) );
			return;
		}

		if ( empty( $result['items'] ) ) {
			WP_CLI::line( __( 'No feedback items found matching criteria.', 'feedback-collector' ) );
			return;
		}

		$presented = array_map( array( Rest::class, 'present' ), $result['items'] );

		$fields_arg = $assoc_args['fields'] ?? 'id,type,status,priority,title,reporter_name,assignee_name,due_date,page_path,tw_task_id';
		$fields     = array_map( 'trim', explode( ',', $fields_arg ) );

		Utils\format_items( $format, $presented, $fields );
	}

	/**
	 * Creates a new feedback item from the command line.
	 *
	 * ## OPTIONS
	 *
	 * --title=<title>
	 * : The title or summary of the feedback item.
	 *
	 * [--type=<type>]
	 * : Type of feedback: bug, tweak, change, comment.
	 * ---
	 * default: bug
	 * options:
	 *   - bug
	 *   - tweak
	 *   - change
	 *   - comment
	 * ---
	 *
	 * [--priority=<priority>]
	 * : Priority: low, medium, high, critical.
	 * ---
	 * default: medium
	 * options:
	 *   - low
	 *   - medium
	 *   - high
	 *   - critical
	 * ---
	 *
	 * [--page-path=<page-path>]
	 * : Page path relative to site root.
	 * ---
	 * default: /
	 * ---
	 *
	 * [--description=<description>]
	 * : Detailed description or steps to reproduce.
	 *
	 * [--due-date=<date>]
	 * : Due date (YYYY-MM-DD).
	 *
	 * [--assignee=<assignee>]
	 * : WordPress user ID to assign.
	 *
	 * [--round=<round>]
	 * : QA round number (defaults to active round).
	 *
	 * ## EXAMPLES
	 *
	 *     $ wp feedback create --title="Header logo link broken" --type=bug --priority=high
	 *     $ wp feedback create --title="Footer copyright year out of date" --page-path=/the-future/
	 */
	public function create( array $args, array $assoc_args ): void {
		$title = trim( $assoc_args['title'] ?? '' );
		if ( '' === $title ) {
			WP_CLI::error( 'Title cannot be empty.' );
		}

		$type = $assoc_args['type'] ?? 'bug';
		if ( ! in_array( $type, array( 'bug', 'tweak', 'change', 'comment' ), true ) ) {
			WP_CLI::error( "Invalid type '{$type}'. Allowed: bug, tweak, change, comment." );
		}

		$priority = $assoc_args['priority'] ?? 'medium';
		if ( ! in_array( $priority, array( 'low', 'medium', 'high', 'critical' ), true ) ) {
			WP_CLI::error( "Invalid priority '{$priority}'. Allowed: low, medium, high, critical." );
		}

		$raw_due   = $assoc_args['due-date'] ?? '';
		$due_date  = '' === $raw_due ? null : DueDates::sanitize( $raw_due );
		$page_path = $assoc_args['page-path'] ?? '/';
		$round     = isset( $assoc_args['round'] ) ? (int) $assoc_args['round'] : Rounds::current();

		$data = array(
			'type'            => $type,
			'title'           => $title,
			'description'     => $assoc_args['description'] ?? '',
			'priority'        => $priority,
			'assignee_id'     => (int) ( $assoc_args['assignee'] ?? 0 ),
			'assignee_source' => Assignees::source(),
			'due_date'        => $due_date,
			'page_path'       => $page_path,
			'round'           => $round,
			'reporter_id'     => get_current_user_id() ?: 1,
			'context'         => array(
				'cli'        => true,
				'created_by' => 'WP-CLI',
			),
		);

		$new_id = Items::create( $data );
		if ( ! $new_id ) {
			WP_CLI::error( 'Failed to create feedback item.' );
		}

		WP_CLI::success( sprintf( 'Created feedback item #%d (%s, %s priority).', $new_id, $type, $priority ) );
	}

	/**
	 * Gets full details for a single feedback item.
	 *
	 * ## OPTIONS
	 *
	 * <id>
	 * : The ID of the feedback item.
	 *
	 * [--format=<format>]
	 * : Render output format: table, json, yaml.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 *   - yaml
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     $ wp feedback get 12
	 *     $ wp feedback get 12 --format=json
	 */
	public function get( array $args, array $assoc_args ): void {
		$id  = (int) $args[0];
		$raw = Items::get( $id );

		if ( ! $raw ) {
			WP_CLI::error( sprintf( 'Feedback item #%d not found.', $id ) );
		}

		$item     = Rest::present( $raw );
		$comments = Items::comments( $id );
		$format   = $assoc_args['format'] ?? 'table';

		if ( in_array( $format, array( 'json', 'yaml' ), true ) ) {
			$item['comments'] = $comments;
			if ( 'json' === $format ) {
				WP_CLI::line( (string) wp_json_encode( $item, JSON_PRETTY_PRINT ) );
			} else {
				Utils\format_items( 'yaml', array( $item ), array_keys( $item ) );
			}
			return;
		}

		// Table format: display key/value summary
		$fields = array(
			array( 'Field' => 'ID', 'Value' => $item['id'] ),
			array( 'Field' => 'Title', 'Value' => $item['title'] ),
			array( 'Field' => 'Type', 'Value' => $item['type'] ),
			array( 'Field' => 'Status', 'Value' => $item['status'] ),
			array( 'Field' => 'Priority', 'Value' => $item['priority'] ),
			array( 'Field' => 'Due Date', 'Value' => $item['due_date'] ?: '(none)' ),
			array( 'Field' => 'Overdue', 'Value' => $item['overdue'] ? 'Yes' : 'No' ),
			array( 'Field' => 'Round', 'Value' => $item['round'] ),
			array( 'Field' => 'Reporter', 'Value' => $item['reporter_name'] ?: '(unknown)' ),
			array( 'Field' => 'Assignee', 'Value' => $item['assignee_name'] ?: '(unassigned)' ),
			array( 'Field' => 'Page Path', 'Value' => $item['page_path'] ),
			array( 'Field' => 'Page URL', 'Value' => $item['page_url'] ),
			array( 'Field' => 'Breakpoint', 'Value' => $item['breakpoint'] ?: '(none)' ),
			array( 'Field' => 'Browser / OS', 'Value' => trim( ( $raw['browser'] ?? '' ) . ' / ' . ( $raw['os'] ?? '' ), ' /' ) ?: '(unknown)' ),
			array( 'Field' => 'Screenshot', 'Value' => $item['screenshot_url'] ?: '(none)' ),
			array( 'Field' => 'Teamwork Task', 'Value' => $item['tw_task_id'] ? "#{$item['tw_task_id']} ({$item['tw_task_url']})" : '(unpushed)' ),
			array( 'Field' => 'Created At', 'Value' => $item['created_at'] ),
			array( 'Field' => 'Comments Count', 'Value' => count( $comments ) ),
		);

		if ( ! empty( $raw['description'] ) ) {
			$fields[] = array( 'Field' => 'Description', 'Value' => $raw['description'] );
		}

		Utils\format_items( 'table', $fields, array( 'Field', 'Value' ) );

		if ( ! empty( $comments ) ) {
			WP_CLI::line( '' );
			WP_CLI::line( WP_CLI::colorize( '%GThread Comments:%n' ) );
			$thread_rows = array_map(
				static fn( array $c ) => array(
					'id'      => $c['id'],
					'author'  => $c['user_name'],
					'kind'    => $c['kind'],
					'body'    => $c['body'],
					'created' => $c['created_at'],
				),
				$comments
			);
			Utils\format_items( 'table', $thread_rows, array( 'id', 'author', 'kind', 'body', 'created' ) );
		}
	}

	/**
	 * Shows summary statistics for feedback on this site.
	 *
	 * ## OPTIONS
	 *
	 * [--format=<format>]
	 * : Render output format: table, json, yaml.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 *   - yaml
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     $ wp feedback stats
	 */
	public function stats( array $args, array $assoc_args ): void {
		$statuses = array( 'open', 'in_progress', 'ready', 'resolved' );
		$types    = array( 'bug', 'tweak', 'change', 'comment' );

		$status_counts = array();
		$total         = 0;
		foreach ( $statuses as $st ) {
			$c                    = Items::count_status( $st );
			$status_counts[ $st ] = $c;
			$total               += $c;
		}

		$unresolved = ( $status_counts['open'] ?? 0 ) + ( $status_counts['in_progress'] ?? 0 ) + ( $status_counts['ready'] ?? 0 );

		$type_counts = array();
		foreach ( $types as $t ) {
			$q                 = Items::query( array( 'type' => $t, 'per_page' => 1 ) );
			$type_counts[ $t ] = $q['total'];
		}

		$inv = Cleanup::inventory();

		$data = array(
			array( 'Metric' => 'Total Feedback Items', 'Count' => $total ),
			array( 'Metric' => '  ├─ Open', 'Count' => $status_counts['open'] ?? 0 ),
			array( 'Metric' => '  ├─ In Progress', 'Count' => $status_counts['in_progress'] ?? 0 ),
			array( 'Metric' => '  ├─ Ready for Review', 'Count' => $status_counts['ready'] ?? 0 ),
			array( 'Metric' => '  └─ Resolved', 'Count' => $status_counts['resolved'] ?? 0 ),
			array( 'Metric' => 'Total Unresolved', 'Count' => $unresolved ),
			array( 'Metric' => 'Type: Bugs', 'Count' => $type_counts['bug'] ?? 0 ),
			array( 'Metric' => 'Type: Tweaks', 'Count' => $type_counts['tweak'] ?? 0 ),
			array( 'Metric' => 'Type: Change Requests', 'Count' => $type_counts['change'] ?? 0 ),
			array( 'Metric' => 'Type: Comments / Notes', 'Count' => $type_counts['comment'] ?? 0 ),
			array( 'Metric' => 'Active QA Round', 'Count' => Rounds::current() ),
			array( 'Metric' => 'Screenshots on Disk', 'Count' => $inv['screenshots'] ),
			array( 'Metric' => 'Screen Recordings on Disk', 'Count' => $inv['videos'] ),
			array( 'Metric' => 'Unpushed Teamwork Tasks', 'Count' => $inv['unpushed'] ),
		);

		$format = $assoc_args['format'] ?? 'table';

		if ( 'table' === $format ) {
			WP_CLI::line( WP_CLI::colorize( '%B=== Feedback Collector Overview ===%n' ) );
			Utils\format_items( 'table', $data, array( 'Metric', 'Count' ) );
		} elseif ( 'json' === $format ) {
			WP_CLI::line( (string) wp_json_encode( $data, JSON_PRETTY_PRINT ) );
		} else {
			Utils\format_items( 'yaml', $data, array( 'Metric', 'Count' ) );
		}
	}

	/**
	 * Updates a feedback item's status, priority, due date, assignee, or title.
	 *
	 * ## OPTIONS
	 *
	 * <id>
	 * : The ID of the feedback item to update.
	 *
	 * [--status=<status>]
	 * : New status: open, in_progress, ready, resolved.
	 *
	 * [--priority=<priority>]
	 * : New priority: low, medium, high, critical.
	 *
	 * [--due-date=<date>]
	 * : New due date (YYYY-MM-DD or empty to clear).
	 *
	 * [--assignee=<assignee>]
	 * : WordPress user ID to assign (or 0 to unassign).
	 *
	 * [--title=<title>]
	 * : Updated title.
	 *
	 * ## EXAMPLES
	 *
	 *     $ wp feedback update 12 --status=resolved
	 *     $ wp feedback update 12 --priority=critical --due-date=2026-10-15
	 */
	public function update( array $args, array $assoc_args ): void {
		$id   = (int) $args[0];
		$item = Items::get( $id );

		if ( ! $item ) {
			WP_CLI::error( sprintf( 'Feedback item #%d not found.', $id ) );
		}

		$changes = array();

		if ( isset( $assoc_args['status'] ) ) {
			$status = $assoc_args['status'];
			if ( ! in_array( $status, array( 'open', 'in_progress', 'ready', 'resolved' ), true ) ) {
				WP_CLI::error( "Invalid status '{$status}'. Allowed: open, in_progress, ready, resolved." );
			}
			$changes['status'] = $status;
		}

		if ( isset( $assoc_args['priority'] ) ) {
			$priority = $assoc_args['priority'];
			if ( ! in_array( $priority, array( 'low', 'medium', 'high', 'critical' ), true ) ) {
				WP_CLI::error( "Invalid priority '{$priority}'. Allowed: low, medium, high, critical." );
			}
			$changes['priority'] = $priority;
		}

		if ( isset( $assoc_args['due-date'] ) ) {
			$raw_due             = $assoc_args['due-date'];
			$sanitized           = '' === $raw_due ? null : DueDates::sanitize( $raw_due );
			$changes['due_date'] = $sanitized;
		}

		if ( isset( $assoc_args['assignee'] ) ) {
			$changes['assignee_id'] = (int) $assoc_args['assignee'];
		}

		if ( isset( $assoc_args['title'] ) ) {
			$title = trim( $assoc_args['title'] );
			if ( '' === $title ) {
				WP_CLI::error( 'Title cannot be empty.' );
			}
			$changes['title'] = $title;
		}

		if ( empty( $changes ) ) {
			WP_CLI::warning( 'No fields to update.' );
			return;
		}

		$ok = Items::update( $id, $changes );
		if ( ! $ok ) {
			WP_CLI::error( sprintf( 'Failed to update feedback item #%d.', $id ) );
		}

		WP_CLI::success( sprintf( 'Feedback item #%d updated successfully.', $id ) );
	}

	/**
	 * Deletes one or more feedback items.
	 *
	 * ## OPTIONS
	 *
	 * <id>...
	 * : One or more feedback item IDs to delete.
	 *
	 * [--force]
	 * : Skip confirmation prompt.
	 *
	 * ## EXAMPLES
	 *
	 *     $ wp feedback delete 12
	 *     $ wp feedback delete 12 13 14 --force
	 */
	public function delete( array $args, array $assoc_args ): void {
		$ids   = array_map( 'intval', $args );
		$force = ! empty( $assoc_args['force'] );

		if ( ! $force ) {
			WP_CLI::confirm( sprintf( 'Are you sure you want to permanently delete %d feedback item(s)?', count( $ids ) ) );
		}

		$deleted = 0;
		foreach ( $ids as $id ) {
			if ( Items::delete( $id ) ) {
				++$deleted;
			}
		}

		WP_CLI::success( sprintf( 'Deleted %1$d of %2$d feedback item(s).', $deleted, count( $ids ) ) );
	}

	/**
	 * Pushes one item or all unpushed feedback items to Teamwork.
	 *
	 * ## OPTIONS
	 *
	 * [<id>]
	 * : Specific feedback item ID to push.
	 *
	 * [--all]
	 * : Push all unpushed items.
	 *
	 * [--round=<round>]
	 * : Filter by round when using --all.
	 *
	 * ## EXAMPLES
	 *
	 *     # Push single item
	 *     $ wp feedback push-teamwork 12
	 *
	 *     # Push all unpushed items
	 *     $ wp feedback push-teamwork --all
	 *
	 *     # Push all unpushed items in Round 2
	 *     $ wp feedback push-teamwork --all --round=2
	 *
	 * @subcommand push-teamwork
	 */
	public function push_teamwork( array $args, array $assoc_args ): void {
		if ( ! Teamwork::ready() ) {
			WP_CLI::error( 'Teamwork is not ready. Configure credentials and select a project in Feedback → Settings.' );
		}

		if ( ! empty( $args[0] ) ) {
			$id   = (int) $args[0];
			$item = Items::get( $id );
			if ( ! $item ) {
				WP_CLI::error( sprintf( 'Feedback item #%d not found.', $id ) );
			}
			if ( $item['tw_task_id'] > 0 ) {
				WP_CLI::warning( sprintf( 'Item #%1$d is already pushed to Teamwork as task #%2$d (%3$s).', $id, $item['tw_task_id'], $item['tw_task_url'] ) );
				return;
			}

			WP_CLI::line( sprintf( 'Pushing item #%d to Teamwork...', $id ) );
			$res = Teamwork::push( $id );
			if ( is_wp_error( $res ) ) {
				WP_CLI::error( sprintf( 'Failed to push item #%1$d: %2$s', $id, $res->get_error_message() ) );
			}

			$updated = Items::get( $id );
			WP_CLI::success( sprintf( 'Pushed item #%1$d to Teamwork: Task #%2$d (%3$s)', $id, $res, $updated['tw_task_url'] ?? '' ) );
			return;
		}

		if ( empty( $assoc_args['all'] ) ) {
			WP_CLI::error( 'Specify an item ID or pass --all to push all unpushed items.' );
		}

		global $wpdb;
		$where = array( 'tw_task_id = 0', "status <> 'resolved'" );
		$vals  = array( Items::table() );

		if ( isset( $assoc_args['round'] ) ) {
			$where[] = 'round = %d';
			$vals[]  = (int) $assoc_args['round'];
		}

		$where_sql = implode( ' AND ', $where );
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$unpushed_ids = $wpdb->get_col( $wpdb->prepare( "SELECT id FROM %i WHERE {$where_sql} ORDER BY id ASC", $vals ) );

		if ( empty( $unpushed_ids ) ) {
			WP_CLI::line( 'No unpushed feedback items found.' );
			return;
		}

		$count = count( $unpushed_ids );
		WP_CLI::line( sprintf( 'Pushing %d item(s) to Teamwork...', $count ) );

		$progress = Utils\make_progress_bar( 'Pushing items', $count );
		$success  = 0;
		$failed   = 0;

		foreach ( $unpushed_ids as $item_id ) {
			$res = Teamwork::push( (int) $item_id );
			if ( is_wp_error( $res ) ) {
				++$failed;
			} else {
				++$success;
			}
			$progress->tick();
		}

		$progress->finish();

		if ( $failed > 0 ) {
			WP_CLI::warning( sprintf( 'Pushed %1$d item(s), but %2$d failed.', $success, $failed ) );
		} else {
			WP_CLI::success( sprintf( 'Successfully pushed all %d item(s) to Teamwork.', $success ) );
		}
	}

	/**
	 * Sends reviewer comments that never reached Teamwork for items that are already pushed.
	 *
	 * Covers comments written before an item was pushed, and comments whose send failed.
	 * Safe to re-run: comments already in Teamwork are never sent twice.
	 *
	 * ## OPTIONS
	 *
	 * [--dry-run]
	 * : List the items and comment counts without sending anything.
	 *
	 * ## EXAMPLES
	 *
	 *     $ wp feedback push-teamwork-comments --dry-run
	 *     $ wp feedback push-teamwork-comments
	 *
	 * @subcommand push-teamwork-comments
	 */
	public function push_teamwork_comments( array $args, array $assoc_args ): void {
		$client = Teamwork::client();
		if ( ! $client ) {
			WP_CLI::error( 'Teamwork is not ready. Configure credentials and select a project in Feedback → Settings.' );
		}

		$ids = Teamwork::items_with_pending_comments();
		if ( ! $ids ) {
			WP_CLI::success( 'Every reviewer comment on a pushed item is already in Teamwork.' );
			return;
		}

		$dry    = ! empty( $assoc_args['dry-run'] );
		$sent   = 0;
		$failed = 0;
		foreach ( $ids as $id ) {
			$item    = Items::get( $id );
			$task_id = (int) $item['tw_task_id'];
			if ( $dry ) {
				$pending = count( array_filter( Items::comments( $id ), static fn( array $c ): bool => 'comment' === $c['kind'] && 0 === $c['tw_comment_id'] && $c['user_id'] > 0 ) );
				WP_CLI::line( sprintf( 'Item #%1$d → task #%2$d: %3$d comment(s) to send', $id, $task_id, $pending ) );
				continue;
			}
			$res     = Teamwork::push_pending_comments( $client, $id, $task_id );
			$sent   += $res['sent'];
			$failed += $res['failed'];
			WP_CLI::line( sprintf( 'Item #%1$d → task #%2$d: sent %3$d, failed %4$d', $id, $task_id, $res['sent'], $res['failed'] ) );
		}

		if ( $dry ) {
			WP_CLI::success( sprintf( '%d item(s) have comments to send. Run without --dry-run to send them.', count( $ids ) ) );
		} elseif ( $failed > 0 ) {
			WP_CLI::warning( sprintf( 'Sent %1$d comment(s); %2$d failed and will be retried on the next sync or run.', $sent, $failed ) );
		} else {
			WP_CLI::success( sprintf( 'Sent %d comment(s) to Teamwork.', $sent ) );
		}
	}

	/**
	 * Shows an inventory of stored feedback data, screenshots, and comments.
	 *
	 * ## OPTIONS
	 *
	 * [--format=<format>]
	 * : Render output format: table, json, yaml.
	 * ---
	 * default: table
	 * options:
	 *   - table
	 *   - json
	 *   - yaml
	 * ---
	 *
	 * ## EXAMPLES
	 *
	 *     $ wp feedback inventory
	 */
	public function inventory( array $args, array $assoc_args ): void {
		$inv  = Cleanup::inventory();
		$rows = array(
			array( 'Resource' => 'Feedback Items (Database)', 'Count' => $inv['items'] ),
			array( 'Resource' => 'Comment & Activity Rows', 'Count' => $inv['comments'] ),
			array( 'Resource' => 'Screenshots on Disk', 'Count' => $inv['screenshots'] ),
			array( 'Resource' => 'Screen Recordings on Disk', 'Count' => $inv['videos'] ),
			array( 'Resource' => 'Unpushed Active Items', 'Count' => $inv['unpushed'] ),
		);

		$format = $assoc_args['format'] ?? 'table';
		Utils\format_items( $format, $rows, array( 'Resource', 'Count' ) );
	}

	/**
	 * Purges all feedback data, tables, settings, and screenshots.
	 *
	 * ## OPTIONS
	 *
	 * [--yes]
	 * : Skip confirmation prompt.
	 *
	 * ## EXAMPLES
	 *
	 *     $ wp feedback purge
	 *     $ wp feedback purge --yes
	 */
	public function purge( array $args, array $assoc_args ): void {
		WP_CLI::confirm( 'Are you sure you want to permanently delete all Feedback Collector data, tables, settings, and screenshots?', $assoc_args );

		$res = Cleanup::purge();

		WP_CLI::line( sprintf( 'Dropped %d database table(s).', $res['tables'] ) );
		WP_CLI::line( sprintf( 'Removed %d plugin option(s).', $res['options'] ) );
		WP_CLI::line( sprintf( 'Deleted %d screenshot and recording file(s).', $res['files'] ) );

		WP_CLI::success( 'Feedback Collector data successfully purged from site.' );
	}
}
