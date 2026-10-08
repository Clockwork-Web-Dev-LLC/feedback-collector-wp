<?php
/**
 * Admin list table for feedback items.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector\Admin;

use FeedbackCollector\Assignees;
use FeedbackCollector\DueDates;
use FeedbackCollector\Items;
use FeedbackCollector\Rest;

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Filterable, sortable list of feedback.
 */
final class ItemsTable extends \WP_List_Table {

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct(
			array(
				'singular' => 'feedback',
				'plural'   => 'feedback',
				'ajax'     => false,
			)
		);
	}

	/**
	 * Column definitions.
	 *
	 * @return array<string, string>
	 */
	public function get_columns(): array {
		return array(
			'cb'       => '<input type="checkbox" />',
			'title'    => __( 'Feedback', 'feedback-collector' ),
			'type'     => __( 'Type', 'feedback-collector' ),
			'status'   => __( 'Status', 'feedback-collector' ),
			'priority' => __( 'Priority', 'feedback-collector' ),
			'due'      => __( 'Due', 'feedback-collector' ),
			'assignee' => __( 'Assignee', 'feedback-collector' ),
			'teamwork' => __( 'Teamwork', 'feedback-collector' ),
		);
	}

	/**
	 * Sortable columns.
	 *
	 * @return array<string, array{0: string, 1: bool}>
	 */
	protected function get_sortable_columns(): array {
		return array(
			'title'    => array( 'id', true ),
			'status'   => array( 'status', false ),
			'priority' => array( 'priority', true ),
			'due'      => array( 'due', false ),
		);
	}

	/**
	 * Bulk actions.
	 *
	 * @return array<string, string>
	 */
	protected function get_bulk_actions(): array {
		$actions = array();
		foreach ( Items::labels()['status'] as $slug => $label ) {
			/* translators: %s: status label */
			$actions[ 'status_' . $slug ] = sprintf( __( 'Mark %s', 'feedback-collector' ), $label );
		}
		$actions['delete'] = __( 'Delete', 'feedback-collector' );
		return apply_filters( 'fbcol_bulk_actions', $actions );
	}

	/**
	 * Current filter values from the query string.
	 *
	 * @return array<string, string>
	 */
	public static function filters(): array {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		$get = static function ( string $key1, string $key2 = '' ): string {
			if ( isset( $_GET[ $key1 ] ) ) {
				return sanitize_text_field( wp_unslash( (string) $_GET[ $key1 ] ) );
			}
			if ( '' !== $key2 && isset( $_GET[ $key2 ] ) ) {
				return sanitize_text_field( wp_unslash( (string) $_GET[ $key2 ] ) );
			}
			return '';
		};
		return array(
			'type'        => sanitize_key( $get( 'fbcol_type', 'type' ) ),
			'status'      => sanitize_key( $get( 'fbcol_status', 'status' ) ),
			'assignee_id' => '' !== $get( 'fbcol_assignee', 'assignee_id' ) ? (string) absint( $get( 'fbcol_assignee', 'assignee_id' ) ) : '',
			'page_path'   => sanitize_text_field( $get( 'fbcol_page', 'page_path' ) ),
			'search'      => sanitize_text_field( $get( 's', 'search' ) ),
			'round'       => absint( $get( 'fbcol_round', 'round' ) ) ? (string) absint( $get( 'fbcol_round', 'round' ) ) : '',
			'breakpoint'  => sanitize_key( $get( 'fbcol_bp', 'breakpoint' ) ),
		);
		// phpcs:enable
	}

	/**
	 * Loads rows.
	 */
	public function prepare_items(): void {
		$this->_column_headers = array( $this->get_columns(), array(), $this->get_sortable_columns(), 'title' );

		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		$orderby = isset( $_GET['orderby'] ) ? sanitize_key( wp_unslash( $_GET['orderby'] ) ) : 'id';
		$order   = isset( $_GET['order'] ) ? sanitize_key( wp_unslash( $_GET['order'] ) ) : 'desc';
		// phpcs:enable

		$per_page = 20;
		$filters  = array_filter( self::filters(), static fn( $v ) => '' !== $v );
		// The assignee filter holds an ID from the active source (Teamwork person or WP user).
		if ( isset( $filters['assignee_id'] ) && 'teamwork' === Assignees::source() ) {
			$filters['tw_assignee_id'] = $filters['assignee_id'];
			unset( $filters['assignee_id'] );
		}
		$result = Items::query(
			array_merge(
				$filters,
				array(
					'orderby'  => $orderby,
					'order'    => $order,
					'per_page' => $per_page,
					'paged'    => $this->get_pagenum(),
				)
			)
		);

		$this->items = $result['items'];
		$this->set_pagination_args(
			array(
				'total_items' => $result['total'],
				'per_page'    => $per_page,
			)
		);
	}

	/**
	 * Filter dropdowns above the table.
	 *
	 * @param string $which top|bottom.
	 */
	protected function extra_tablenav( $which ): void {
		if ( 'top' !== $which ) {
			return;
		}
		$f      = self::filters();
		$labels = Items::labels();
		echo '<div class="alignleft actions">';
		$this->dropdown( 'fbcol_type', __( 'All types', 'feedback-collector' ), $labels['type'], $f['type'] );
		$this->dropdown( 'fbcol_status', __( 'All statuses', 'feedback-collector' ), $labels['status'], $f['status'] );

		$people = array( '0' => __( 'Unassigned', 'feedback-collector' ) );
		foreach ( Assignees::options()['people'] as $r ) {
			$people[ (string) $r['id'] ] = $r['name'];
		}
		$this->dropdown( 'fbcol_assignee', __( 'Any assignee', 'feedback-collector' ), $people, $f['assignee_id'] );

		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$paths = $wpdb->get_col( $wpdb->prepare( 'SELECT DISTINCT page_path FROM %i ORDER BY page_path ASC LIMIT 300', Items::table() ) );
		$this->dropdown( 'fbcol_page', __( 'All pages', 'feedback-collector' ), array_combine( $paths, $paths ) ?: array(), $f['page_path'] );

		$rounds = array();
		foreach ( \FeedbackCollector\Rounds::all() as $round ) {
			/* translators: %d: round number */
			$rounds[ (string) $round ] = sprintf( __( 'Round %d', 'feedback-collector' ), $round );
		}
		$this->dropdown( 'fbcol_round', __( 'All rounds', 'feedback-collector' ), $rounds, $f['round'] );
		$this->dropdown(
			'fbcol_bp',
			__( 'All breakpoints', 'feedback-collector' ),
			array(
				'mobile'  => __( 'Mobile', 'feedback-collector' ),
				'tablet'  => __( 'Tablet', 'feedback-collector' ),
				'desktop' => __( 'Desktop', 'feedback-collector' ),
			),
			$f['breakpoint']
		);

		submit_button( __( 'Filter', 'feedback-collector' ), '', 'filter_action', false );

		$export_url = add_query_arg(
			array_merge(
				array( 'action' => 'fbcol_export_csv' ),
				array_filter( self::filters(), static fn( $v ) => '' !== $v ),
				array( '_wpnonce' => wp_create_nonce( 'fbcol_export_csv' ) )
			),
			admin_url( 'admin-post.php' )
		);
		printf(
			' <a href="%s" class="button button-secondary fbc-export-csv">%s</a>',
			esc_url( $export_url ),
			esc_html__( 'Export CSV', 'feedback-collector' )
		);
		echo '</div>';
	}

	/**
	 * Renders a filter select.
	 *
	 * @param string                $name     Query var.
	 * @param string                $all      Label for the empty option.
	 * @param array<string, string> $options  value => label.
	 * @param string                $selected Current value.
	 */
	private function dropdown( string $name, string $all, array $options, string $selected ): void {
		printf( '<select name="%s"><option value="">%s</option>', esc_attr( $name ), esc_html( $all ) );
		foreach ( $options as $value => $label ) {
			printf( '<option value="%s"%s>%s</option>', esc_attr( (string) $value ), selected( (string) $value, $selected, false ), esc_html( $label ) );
		}
		echo '</select> ';
	}

	/**
	 * Checkbox column.
	 *
	 * @param array<string, mixed> $item Row.
	 */
	protected function column_cb( $item ): string {
		return sprintf( '<input type="checkbox" name="ids[]" value="%d" />', (int) $item['id'] );
	}

	/**
	 * Title column with row actions.
	 *
	 * @param array<string, mixed> $item Row.
	 */
	protected function column_title( array $item ): string {
		$detail   = Admin::item_url( (int) $item['id'] );
		$view     = Admin::view_on_page_url( $item );
		$reporter = get_userdata( (int) $item['reporter_id'] );
		$created  = strtotime( $item['created_at'] . ' UTC' );
		$meta     = array_filter(
			array(
				/* translators: %d: round number */
				esc_html( sprintf( __( 'Round %d', 'feedback-collector' ), (int) $item['round'] ) ),
				esc_html( $item['page_path'] ),
				esc_html( (string) $item['breakpoint'] ),
				$reporter ? esc_html( $reporter->display_name ) : '',
				sprintf(
					'<time datetime="%1$s" title="%2$s">%3$s</time>',
					esc_attr( gmdate( 'c', $created ) ),
					esc_attr( get_date_from_gmt( $item['created_at'], get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) ),
					/* translators: %s: human time difference */
					esc_html( sprintf( __( '%s ago', 'feedback-collector' ), human_time_diff( $created ) ) )
				),
			)
		);
		$out      = sprintf(
			'<span class="fbc-row-id">#%1$d</span><strong><a class="row-title" href="%2$s">%3$s</a></strong><div class="fbc-row-meta">%4$s</div>',
			(int) $item['id'],
			esc_url( $detail ),
			esc_html( $item['title'] ),
			implode( ' · ', $meta )
		);
		return $out . $this->row_actions(
			array(
				'details' => sprintf( '<a href="%s">%s</a>', esc_url( $detail ), esc_html__( 'Details', 'feedback-collector' ) ),
				'view'    => sprintf( '<a href="%s" target="_blank" rel="noopener">%s</a>', esc_url( $view ), esc_html__( 'View on page', 'feedback-collector' ) ),
			)
		);
	}

	/**
	 * Remaining columns.
	 *
	 * @param array<string, mixed> $item        Row.
	 * @param string               $column_name Column.
	 */
	protected function column_default( $item, $column_name ): string {
		$labels = Items::labels();
		switch ( $column_name ) {
			case 'id':
				return '#' . (int) $item['id'];
			case 'type':
				return Layout::pill( $item['type'], $labels['type'][ $item['type'] ] ?? $item['type'] );
			case 'status':
				return Layout::pill( $item['status'], $labels['status'][ $item['status'] ] ?? $item['status'] );
			case 'priority':
				return esc_html( $labels['priority'][ $item['priority'] ] ?? $item['priority'] );
			case 'due':
				$label = DueDates::label( $item['due_date'] ?? null );
				if ( '' === $label ) {
					return '<span aria-hidden="true">—</span>';
				}
				return DueDates::overdue( $item )
					? '<span class="fbc-overdue" title="' . esc_attr__( 'Overdue', 'feedback-collector' ) . '">' . esc_html( $label ) . '</span>'
					: esc_html( $label );
			case 'assignee':
				$name = Assignees::name( $item );
				return '' !== $name ? esc_html( $name ) : '<span aria-hidden="true">—</span>';
			case 'page':
				return sprintf( '<code>%s</code>%s', esc_html( $item['page_path'] ), $item['breakpoint'] ? ' <span class="fbc-bp">' . esc_html( $item['breakpoint'] ) . '</span>' : '' );
			case 'reporter':
				$u = get_userdata( (int) $item['reporter_id'] );
				return $u ? esc_html( $u->display_name ) : '—';
			case 'created':
				return esc_html( get_date_from_gmt( $item['created_at'], get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) );
			case 'teamwork':
				return (string) apply_filters( 'fbcol_teamwork_column', '<span aria-hidden="true">—</span>', $item );
		}
		return '';
	}

	/**
	 * Plain rows (no zebra striping), so the card reads like Companion's tables.
	 *
	 * @return string[]
	 */
	protected function get_table_classes(): array {
		return array( 'widefat', 'fixed', 'fbc-table', $this->_args['plural'] );
	}

	/**
	 * Empty state.
	 */
	public function no_items(): void {
		esc_html_e( 'No feedback yet. Visit the site, turn on Feedback mode from the admin bar, and right-click anything.', 'feedback-collector' );
	}
}
