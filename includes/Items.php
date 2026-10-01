<?php
/**
 * Item and comment storage.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Repository for feedback items and their threads.
 */
final class Items {

	public const TYPES      = array( 'bug', 'tweak', 'change', 'comment' );
	public const STATUSES   = array( 'open', 'in_progress', 'ready_for_review', 'resolved' );
	public const PRIORITIES = array( 'low', 'medium', 'high', 'critical' );

	/**
	 * Human labels for enum values.
	 *
	 * @return array<string, array<string, string>>
	 */
	public static function labels(): array {
		return array(
			'type'     => array(
				'bug'     => __( 'Bug', 'feedback-collector' ),
				'tweak'   => __( 'Tweak', 'feedback-collector' ),
				'change'  => __( 'Change Request', 'feedback-collector' ),
				'comment' => __( 'Comment', 'feedback-collector' ),
			),
			'status'   => array(
				'open'             => __( 'Open', 'feedback-collector' ),
				'in_progress'      => __( 'In Progress', 'feedback-collector' ),
				'ready_for_review' => __( 'Ready for Review', 'feedback-collector' ),
				'resolved'         => __( 'Resolved', 'feedback-collector' ),
			),
			'priority' => array(
				'low'      => __( 'Low', 'feedback-collector' ),
				'medium'   => __( 'Medium', 'feedback-collector' ),
				'high'     => __( 'High', 'feedback-collector' ),
				'critical' => __( 'Critical', 'feedback-collector' ),
			),
		);
	}

	/**
	 * Items table name.
	 */
	public static function table(): string {
		global $wpdb;
		return $wpdb->prefix . 'fbc_items';
	}

	/**
	 * Comments table name.
	 */
	public static function comments_table(): string {
		global $wpdb;
		return $wpdb->prefix . 'fbc_comments';
	}

	/**
	 * Normalizes a URL path so the same page always hashes the same.
	 *
	 * @param string $path Raw path, possibly a full URL.
	 */
	public static function normalize_path( string $path ): string {
		$parsed = wp_parse_url( $path, PHP_URL_PATH );
		$path   = is_string( $parsed ) ? $parsed : '/';
		$home   = wp_parse_url( home_url( '/' ), PHP_URL_PATH );
		$home   = is_string( $home ) ? untrailingslashit( $home ) : '';
		if ( '' !== $home && str_starts_with( $path, $home ) ) {
			$path = substr( $path, strlen( $home ) );
		}
		$path = '/' . ltrim( $path, '/' );
		return '/' === $path ? '/' : trailingslashit( $path );
	}

	/**
	 * Fetches one item.
	 *
	 * @param int $id Item ID.
	 * @return array<string, mixed>|null
	 */
	public static function get( int $id ): ?array {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM %i WHERE id = %d', self::table(), $id ), ARRAY_A );
		return $row ? self::hydrate( $row ) : null;
	}

	/**
	 * Lists items with optional filters.
	 *
	 * @param array<string, mixed> $args Filters: page_path, type, status, assignee_id, search, orderby, order, per_page, paged.
	 * @return array{items: array<int, array<string, mixed>>, total: int}
	 */
	public static function query( array $args = array() ): array {
		global $wpdb;

		$where  = array( '1=1' );
		$params = array();

		if ( ! empty( $args['page_path'] ) ) {
			$where[]  = 'page_hash = %s';
			$params[] = md5( self::normalize_path( (string) $args['page_path'] ) );
		}
		foreach ( array(
			'type'     => self::TYPES,
			'status'   => self::STATUSES,
			'priority' => self::PRIORITIES,
		) as $field => $allowed ) {
			if ( ! empty( $args[ $field ] ) ) {
				$values = array_values( array_intersect( (array) $args[ $field ], $allowed ) );
				if ( $values ) {
					$where[] = $field . ' IN (' . implode( ',', array_fill( 0, count( $values ), '%s' ) ) . ')';
					$params  = array_merge( $params, $values );
				}
			}
		}
		if ( isset( $args['assignee_id'] ) && '' !== $args['assignee_id'] ) {
			$where[]  = 'assignee_id = %d';
			$params[] = (int) $args['assignee_id'];
		}
		if ( ! empty( $args['search'] ) ) {
			$like     = '%' . $wpdb->esc_like( (string) $args['search'] ) . '%';
			$where[]  = '(title LIKE %s OR description LIKE %s)';
			$params[] = $like;
			$params[] = $like;
		}

		$orderby_map = array(
			'id'       => 'id',
			'created'  => 'created_at',
			'priority' => "FIELD(priority,'critical','high','medium','low')",
			'status'   => "FIELD(status,'open','in_progress','ready_for_review','resolved')",
			'title'    => 'title',
		);
		$orderby     = $orderby_map[ $args['orderby'] ?? 'id' ] ?? 'id';
		$order       = 'asc' === strtolower( (string) ( $args['order'] ?? 'desc' ) ) ? 'ASC' : 'DESC';
		if ( 'priority' === ( $args['orderby'] ?? '' ) ) {
			// FIELD() ranks critical first, so flip so "desc" means most urgent first.
			$order = 'ASC' === $order ? 'DESC' : 'ASC';
		}

		$per_page = max( 1, min( 500, (int) ( $args['per_page'] ?? 200 ) ) );
		$paged    = max( 1, (int) ( $args['paged'] ?? 1 ) );
		$offset   = ( $paged - 1 ) * $per_page;

		$where_sql = implode( ' AND ', $where );
		$table     = self::table();

		$count_sql = "SELECT COUNT(*) FROM {$table} WHERE {$where_sql}";
		$list_sql  = "SELECT * FROM {$table} WHERE {$where_sql} ORDER BY {$orderby} {$order}, id DESC LIMIT %d OFFSET %d";

		// phpcs:disable WordPress.DB.DirectDatabaseQuery, WordPress.DB.PreparedSQL.NotPrepared
		$total = (int) ( $params ? $wpdb->get_var( $wpdb->prepare( $count_sql, $params ) ) : $wpdb->get_var( $count_sql ) );
		$rows  = $wpdb->get_results( $wpdb->prepare( $list_sql, array_merge( $params, array( $per_page, $offset ) ) ), ARRAY_A );
		// phpcs:enable

		return array(
			'items' => array_map( array( self::class, 'hydrate' ), $rows ?: array() ),
			'total' => $total,
		);
	}

	/**
	 * Counts items by status.
	 *
	 * @param string $status Status slug.
	 */
	public static function count_status( string $status ): int {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		return (int) $wpdb->get_var( $wpdb->prepare( 'SELECT COUNT(*) FROM %i WHERE status = %s', self::table(), $status ) );
	}

	/**
	 * Creates an item. Input must already be validated.
	 *
	 * @param array<string, mixed> $data Item fields.
	 * @return int New item ID, or 0 on failure.
	 */
	public static function create( array $data ): int {
		global $wpdb;
		$now  = current_time( 'mysql', true );
		$path = self::normalize_path( (string) ( $data['page_path'] ?? '/' ) );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$ok = $wpdb->insert(
			self::table(),
			array(
				'type'        => $data['type'],
				'status'      => 'open',
				'priority'    => $data['priority'] ?? 'medium',
				'title'       => $data['title'],
				'description' => $data['description'] ?? '',
				'page_path'   => $path,
				'page_hash'   => md5( $path ),
				'page_query'  => $data['page_query'] ?? '',
				'page_title'  => $data['page_title'] ?? '',
				'anchor'      => isset( $data['anchor'] ) ? wp_json_encode( $data['anchor'] ) : null,
				'context'     => isset( $data['context'] ) ? wp_json_encode( $data['context'] ) : null,
				'breakpoint'  => $data['breakpoint'] ?? '',
				'reporter_id' => get_current_user_id(),
				'assignee_id' => (int) ( $data['assignee_id'] ?? 0 ),
				'created_at'  => $now,
				'updated_at'  => $now,
			)
		);
		return $ok ? (int) $wpdb->insert_id : 0;
	}

	/**
	 * Updates an item and logs status/assignee changes to its thread.
	 *
	 * @param int                  $id      Item ID.
	 * @param array<string, mixed> $changes Validated fields to change.
	 */
	public static function update( int $id, array $changes ): bool {
		global $wpdb;
		$before = self::get( $id );
		if ( ! $before ) {
			return false;
		}

		$allowed = array( 'title', 'description', 'status', 'priority', 'assignee_id', 'type', 'anchor', 'tw_task_id', 'tw_project_id', 'tw_sync_state', 'tw_sync_error' );
		$row     = array_intersect_key( $changes, array_flip( $allowed ) );
		if ( array_key_exists( 'anchor', $row ) ) {
			$row['anchor'] = null === $row['anchor'] ? null : wp_json_encode( $row['anchor'] );
		}
		if ( ! $row ) {
			return true;
		}
		$row['updated_at'] = current_time( 'mysql', true );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$ok = false !== $wpdb->update( self::table(), $row, array( 'id' => $id ) );

		if ( $ok ) {
			$labels = self::labels();
			if ( isset( $row['status'] ) && $row['status'] !== $before['status'] ) {
				self::add_comment(
					$id,
					sprintf(
						/* translators: 1: old status, 2: new status */
						__( 'changed status from %1$s to %2$s', 'feedback-collector' ),
						$labels['status'][ $before['status'] ] ?? $before['status'],
						$labels['status'][ $row['status'] ] ?? $row['status']
					),
					'activity',
					array_key_exists( '_actor_id', $changes ) ? (int) $changes['_actor_id'] : null
				);
			}
			if ( isset( $row['assignee_id'] ) && (int) $row['assignee_id'] !== (int) $before['assignee_id'] ) {
				$user = get_userdata( (int) $row['assignee_id'] );
				self::add_comment(
					$id,
					$user
						/* translators: %s: user display name */
						? sprintf( __( 'assigned to %s', 'feedback-collector' ), $user->display_name )
						: __( 'removed the assignee', 'feedback-collector' ),
					'activity'
				);
			}
		}
		return $ok;
	}

	/**
	 * Deletes an item and its thread.
	 *
	 * @param int $id Item ID.
	 */
	public static function delete( int $id ): bool {
		global $wpdb;
		// phpcs:disable WordPress.DB.DirectDatabaseQuery
		$wpdb->delete( self::comments_table(), array( 'item_id' => $id ) );
		$ok = (bool) $wpdb->delete( self::table(), array( 'id' => $id ) );
		// phpcs:enable
		return $ok;
	}

	/**
	 * Adds a reply or activity entry to an item's thread.
	 *
	 * @param int      $item_id Item ID.
	 * @param string   $body    Comment body (already sanitized).
	 * @param string   $kind    'comment' or 'activity'.
	 * @param int|null $user_id Author; null means the current user, 0 means Teamwork sync.
	 */
	public static function add_comment( int $item_id, string $body, string $kind = 'comment', ?int $user_id = null ): int {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$ok = $wpdb->insert(
			self::comments_table(),
			array(
				'item_id'    => $item_id,
				'user_id'    => $user_id ?? get_current_user_id(),
				'kind'       => 'activity' === $kind ? 'activity' : 'comment',
				'body'       => $body,
				'created_at' => current_time( 'mysql', true ),
			)
		);
		return $ok ? (int) $wpdb->insert_id : 0;
	}

	/**
	 * Lists an item's thread, oldest first.
	 *
	 * @param int $item_id Item ID.
	 * @return array<int, array<string, mixed>>
	 */
	public static function comments( int $item_id ): array {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$rows = $wpdb->get_results( $wpdb->prepare( 'SELECT * FROM %i WHERE item_id = %d ORDER BY id ASC', self::comments_table(), $item_id ), ARRAY_A );
		return array_map(
			static function ( array $row ): array {
				$user = get_userdata( (int) $row['user_id'] );
				return array(
					'id'         => (int) $row['id'],
					'kind'       => $row['kind'],
					'body'       => $row['body'],
					'user_id'    => (int) $row['user_id'],
					'user_name'  => $user ? $user->display_name : ( 0 === (int) $row['user_id'] ? 'Teamwork' : __( 'Unknown', 'feedback-collector' ) ),
					'created_at' => mysql_to_rfc3339( $row['created_at'] ),
				);
			},
			$rows ?: array()
		);
	}

	/**
	 * Decodes JSON columns and casts numbers.
	 *
	 * @param array<string, mixed> $row Raw DB row.
	 * @return array<string, mixed>
	 */
	public static function hydrate( array $row ): array {
		foreach ( array( 'id', 'reporter_id', 'assignee_id', 'tw_task_id', 'tw_project_id' ) as $int_field ) {
			$row[ $int_field ] = (int) $row[ $int_field ];
		}
		$row['anchor']  = $row['anchor'] ? json_decode( (string) $row['anchor'], true ) : null;
		$row['context'] = $row['context'] ? json_decode( (string) $row['context'], true ) : null;
		unset( $row['page_hash'] );
		return $row;
	}
}
