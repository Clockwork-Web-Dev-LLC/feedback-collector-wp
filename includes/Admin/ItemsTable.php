<?php
/**
 * Admin list table for feedback items.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector\Admin;

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
			'id'       => '#',
			'title'    => __( 'Title', 'feedback-collector' ),
			'type'     => __( 'Type', 'feedback-collector' ),
			'status'   => __( 'Status', 'feedback-collector' ),
			'priority' => __( 'Priority', 'feedback-collector' ),
			'assignee' => __( 'Assignee', 'feedback-collector' ),
			'page'     => __( 'Page', 'feedback-collector' ),
			'reporter' => __( 'Reporter', 'feedback-collector' ),
			'created'  => __( 'Created', 'feedback-collector' ),
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
			'id'       => array( 'id', true ),
			'title'    => array( 'title', false ),
			'status'   => array( 'status', false ),
			'priority' => array( 'priority', true ),
			'created'  => array( 'created', true ),
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
		return apply_filters( 'fbc_bulk_actions', $actions );
	}

	/**
	 * Current filter values from the query string.
	 *
	 * @return array<string, string>
	 */
	public static function filters(): array {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		return array(
			'type'        => isset( $_GET['fbc_type'] ) ? sanitize_key( wp_unslash( $_GET['fbc_type'] ) ) : '',
			'status'      => isset( $_GET['fbc_status'] ) ? sanitize_key( wp_unslash( $_GET['fbc_status'] ) ) : '',
			'assignee_id' => isset( $_GET['fbc_assignee'] ) && '' !== $_GET['fbc_assignee'] ? (string) absint( $_GET['fbc_assignee'] ) : '',
			'page_path'   => isset( $_GET['fbc_page'] ) ? sanitize_text_field( wp_unslash( $_GET['fbc_page'] ) ) : '',
			'search'      => isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '',
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
		$result   = Items::query(
			array_merge(
				array_filter( self::filters(), static fn( $v ) => '' !== $v ),
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
		$this->dropdown( 'fbc_type', __( 'All types', 'feedback-collector' ), $labels['type'], $f['type'] );
		$this->dropdown( 'fbc_status', __( 'All statuses', 'feedback-collector' ), $labels['status'], $f['status'] );

		$people = array( '0' => __( 'Unassigned', 'feedback-collector' ) );
		foreach ( Rest::reviewer_list() as $r ) {
			$people[ (string) $r['id'] ] = $r['name'];
		}
		$this->dropdown( 'fbc_assignee', __( 'Any assignee', 'feedback-collector' ), $people, $f['assignee_id'] );

		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$paths = $wpdb->get_col( $wpdb->prepare( 'SELECT DISTINCT page_path FROM %i ORDER BY page_path ASC LIMIT 300', Items::table() ) );
		$this->dropdown( 'fbc_page', __( 'All pages', 'feedback-collector' ), array_combine( $paths, $paths ) ?: array(), $f['page_path'] );

		submit_button( __( 'Filter', 'feedback-collector' ), '', 'filter_action', false );
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
		$detail = Admin::item_url( (int) $item['id'] );
		$view   = Admin::view_on_page_url( $item );
		$out    = sprintf( '<strong><a class="row-title" href="%s">%s</a></strong>', esc_url( $detail ), esc_html( $item['title'] ) );
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
				return sprintf( '<span class="fbc-badge fbc-type-%1$s">%2$s</span>', esc_attr( $item['type'] ), esc_html( $labels['type'][ $item['type'] ] ?? $item['type'] ) );
			case 'status':
				return sprintf( '<span class="fbc-badge fbc-status-%1$s">%2$s</span>', esc_attr( $item['status'] ), esc_html( $labels['status'][ $item['status'] ] ?? $item['status'] ) );
			case 'priority':
				return esc_html( $labels['priority'][ $item['priority'] ] ?? $item['priority'] );
			case 'assignee':
				$u = $item['assignee_id'] ? get_userdata( (int) $item['assignee_id'] ) : false;
				return $u ? esc_html( $u->display_name ) : '<span aria-hidden="true">—</span>';
			case 'page':
				return sprintf( '<code>%s</code>%s', esc_html( $item['page_path'] ), $item['breakpoint'] ? ' <span class="fbc-bp">' . esc_html( $item['breakpoint'] ) . '</span>' : '' );
			case 'reporter':
				$u = get_userdata( (int) $item['reporter_id'] );
				return $u ? esc_html( $u->display_name ) : '—';
			case 'created':
				return esc_html( get_date_from_gmt( $item['created_at'], get_option( 'date_format' ) . ' ' . get_option( 'time_format' ) ) );
			case 'teamwork':
				return (string) apply_filters( 'fbc_teamwork_column', '<span aria-hidden="true">—</span>', $item );
		}
		return '';
	}

	/**
	 * Empty state.
	 */
	public function no_items(): void {
		esc_html_e( 'No feedback yet. Visit the site, turn on Feedback mode from the admin bar, and right-click anything.', 'feedback-collector' );
	}
}
