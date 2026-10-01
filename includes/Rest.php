<?php
/**
 * REST API: feedback-collector/v1.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

defined( 'ABSPATH' ) || exit;

/**
 * Registers and handles the REST routes.
 */
final class Rest {

	public const NS = 'feedback-collector/v1';

	/**
	 * Hooks route registration.
	 */
	public static function register(): void {
		add_action( 'rest_api_init', array( self::class, 'routes' ) );
	}

	/**
	 * Registers all routes.
	 */
	public static function routes(): void {
		$can = array( self::class, 'can_review' );

		register_rest_route(
			self::NS,
			'/items',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( self::class, 'list_items' ),
					'permission_callback' => $can,
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( self::class, 'create_item' ),
					'permission_callback' => $can,
				),
			)
		);

		register_rest_route(
			self::NS,
			'/items/(?P<id>\d+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( self::class, 'get_item' ),
					'permission_callback' => $can,
				),
				array(
					'methods'             => 'PATCH',
					'callback'            => array( self::class, 'update_item' ),
					'permission_callback' => $can,
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( self::class, 'delete_item' ),
					'permission_callback' => $can,
				),
			)
		);

		register_rest_route(
			self::NS,
			'/items/(?P<id>\d+)/comments',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( self::class, 'create_comment' ),
				'permission_callback' => $can,
			)
		);

		register_rest_route(
			self::NS,
			'/items/(?P<id>\d+)/screenshot',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( self::class, 'upload_screenshot' ),
					'permission_callback' => $can,
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( self::class, 'delete_screenshot' ),
					'permission_callback' => $can,
				),
			)
		);

		register_rest_route(
			self::NS,
			'/reviewers',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( self::class, 'reviewers' ),
				'permission_callback' => $can,
			)
		);
	}

	/**
	 * Every route requires the review capability. Cookie-authenticated
	 * requests without a valid nonce arrive as user 0 and fail here.
	 */
	public static function can_review(): bool|WP_Error {
		if ( current_user_can( CAP ) ) {
			return true;
		}
		return new WP_Error( 'fbc_forbidden', __( 'You do not have access to feedback.', 'feedback-collector' ), array( 'status' => is_user_logged_in() ? 403 : 401 ) );
	}

	/**
	 * GET /items
	 *
	 * @param WP_REST_Request $request Request.
	 */
	public static function list_items( WP_REST_Request $request ): WP_REST_Response {
		$args = array(
			'per_page' => 500,
			'orderby'  => 'id',
			'order'    => 'asc',
		);
		$path = (string) $request->get_param( 'page_path' );
		if ( '' !== $path ) {
			$args['page_path'] = $path;
		}
		foreach ( array( 'type', 'status' ) as $field ) {
			$value = $request->get_param( $field );
			if ( $value ) {
				$args[ $field ] = array_map( 'sanitize_key', (array) $value );
			}
		}
		if ( null !== $request->get_param( 'assignee_id' ) ) {
			$field          = 'teamwork' === Assignees::source() ? 'tw_assignee_id' : 'assignee_id';
			$args[ $field ] = absint( $request->get_param( 'assignee_id' ) );
		}
		if ( $request->get_param( 'round' ) ) {
			$args['round'] = absint( $request->get_param( 'round' ) );
		}
		if ( $request->get_param( 'breakpoint' ) ) {
			$args['breakpoint'] = sanitize_key( (string) $request->get_param( 'breakpoint' ) );
		}

		$result = Items::query( $args );
		return new WP_REST_Response(
			array(
				'items' => array_map( array( self::class, 'present' ), $result['items'] ),
				'total' => $result['total'],
			)
		);
	}

	/**
	 * GET /items/{id}
	 *
	 * @param WP_REST_Request $request Request.
	 */
	public static function get_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$item = Items::get( (int) $request['id'] );
		if ( ! $item ) {
			return self::not_found();
		}
		$out             = self::present( $item );
		$out['comments'] = Items::comments( $item['id'] );
		return new WP_REST_Response( $out );
	}

	/**
	 * POST /items
	 *
	 * @param WP_REST_Request $request Request.
	 */
	public static function create_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$p     = self::payload( $request );
		$title = sanitize_text_field( (string) ( $p['title'] ?? '' ) );
		$type  = sanitize_key( (string) ( $p['type'] ?? '' ) );

		if ( '' === $title ) {
			return self::invalid( 'title', __( 'A title is required.', 'feedback-collector' ) );
		}
		if ( ! in_array( $type, Items::TYPES, true ) ) {
			return self::invalid( 'type', __( 'Unknown feedback type.', 'feedback-collector' ) );
		}
		$priority = sanitize_key( (string) ( $p['priority'] ?? 'medium' ) );
		if ( ! in_array( $priority, Items::PRIORITIES, true ) ) {
			return self::invalid( 'priority', __( 'Unknown priority.', 'feedback-collector' ) );
		}
		$assignee = Assignees::resolve( absint( $p['assignee_id'] ?? 0 ) );
		if ( is_wp_error( $assignee ) ) {
			return self::invalid( 'assignee_id', $assignee->get_error_message() );
		}

		$context    = self::sanitize_context( is_array( $p['context'] ?? null ) ? $p['context'] : array() );
		$breakpoint = $context['breakpoint'] ?? '';

		$id = Items::create(
			$assignee + array(
				'type'        => $type,
				'priority'    => $priority,
				'title'       => mb_substr( $title, 0, 255 ),
				'description' => sanitize_textarea_field( (string) ( $p['description'] ?? '' ) ),
				'page_path'   => (string) ( $p['page_path'] ?? '/' ),
				'page_query'  => mb_substr( sanitize_text_field( (string) ( $p['page_query'] ?? '' ) ), 0, 2048 ),
				'page_title'  => mb_substr( sanitize_text_field( (string) ( $p['page_title'] ?? '' ) ), 0, 255 ),
				'anchor'      => is_array( $p['anchor'] ?? null ) ? self::sanitize_anchor( $p['anchor'] ) : null,
				'context'     => $context,
				'breakpoint'  => $breakpoint,
			)
		);
		if ( ! $id ) {
			return new WP_Error( 'fbc_db', __( 'Could not save feedback.', 'feedback-collector' ), array( 'status' => 500 ) );
		}

		// Stored before fbc_item_created fires, so an auto-push already has the screenshot.
		// A bad image never loses the feedback itself: the item is kept and the error reported.
		$shot_error = '';
		$bytes      = self::uploaded_screenshot( $request );
		if ( is_wp_error( $bytes ) ) {
			$shot_error = $bytes->get_error_message();
		} elseif ( null !== $bytes ) {
			$saved = Screenshots::save_bytes( $id, $bytes );
			if ( is_wp_error( $saved ) ) {
				$shot_error = $saved->get_error_message();
			}
		}

		do_action( 'fbc_item_created', $id );

		$out = self::present( Items::get( $id ) );
		if ( '' !== $shot_error ) {
			$out['screenshot_error'] = $shot_error;
		}
		$response = new WP_REST_Response( $out );
		$response->set_status( 201 );
		return $response;
	}

	/**
	 * POST /items/{id}/screenshot — replace an item's screenshot (e.g. after annotating).
	 *
	 * @param WP_REST_Request $request Request.
	 */
	public static function upload_screenshot( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$item = Items::get( (int) $request['id'] );
		if ( ! $item ) {
			return self::not_found();
		}
		$bytes = self::uploaded_screenshot( $request );
		if ( null === $bytes ) {
			return self::invalid( 'screenshot', __( 'No screenshot was uploaded.', 'feedback-collector' ) );
		}
		if ( is_wp_error( $bytes ) ) {
			return self::invalid( 'screenshot', $bytes->get_error_message() );
		}
		$saved = Screenshots::save_bytes( $item['id'], $bytes );
		if ( is_wp_error( $saved ) ) {
			return $saved;
		}
		return new WP_REST_Response( self::present( Items::get( $item['id'] ) ) );
	}

	/**
	 * DELETE /items/{id}/screenshot
	 *
	 * @param WP_REST_Request $request Request.
	 */
	public static function delete_screenshot( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$item = Items::get( (int) $request['id'] );
		if ( ! $item ) {
			return self::not_found();
		}
		Screenshots::delete_file( $item );
		Items::update( $item['id'], array( 'screenshot' => '' ) );
		return new WP_REST_Response( self::present( Items::get( $item['id'] ) ) );
	}

	/**
	 * Request fields: JSON body, or multipart where the fields arrive as a JSON "data" part
	 * next to the screenshot file.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return array<string, mixed>
	 */
	private static function payload( WP_REST_Request $request ): array {
		$json = $request->get_json_params();
		if ( is_array( $json ) && $json ) {
			return $json;
		}
		$body = $request->get_body_params();
		if ( isset( $body['data'] ) && is_string( $body['data'] ) ) {
			$decoded = json_decode( wp_unslash( $body['data'] ), true );
			return is_array( $decoded ) ? $decoded : array();
		}
		return is_array( $body ) ? $body : array();
	}

	/**
	 * Bytes of an uploaded "screenshot" file part; null when none was sent.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return string|WP_Error|null
	 */
	private static function uploaded_screenshot( WP_REST_Request $request ): string|WP_Error|null {
		$file = $request->get_file_params()['screenshot'] ?? null;
		if ( ! is_array( $file ) || ! isset( $file['tmp_name'] ) ) {
			return null;
		}
		if ( UPLOAD_ERR_OK !== (int) ( $file['error'] ?? UPLOAD_ERR_NO_FILE ) ) {
			return new WP_Error( 'fbc_invalid', __( 'The screenshot upload failed.', 'feedback-collector' ) );
		}
		$tmp = (string) $file['tmp_name'];
		/** Filters whether a temp file is a genuine HTTP upload (tests stand in for PHP's check). */
		if ( ! apply_filters( 'fbc_is_uploaded_file', is_uploaded_file( $tmp ), $tmp ) ) {
			return new WP_Error( 'fbc_invalid', __( 'The screenshot upload failed.', 'feedback-collector' ) );
		}
		if ( filesize( $tmp ) > Screenshots::MAX_BYTES ) {
			return new WP_Error( 'fbc_invalid', __( 'The screenshot is too large.', 'feedback-collector' ) );
		}
		$bytes = file_get_contents( $tmp ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		return false === $bytes ? new WP_Error( 'fbc_invalid', __( 'The screenshot upload failed.', 'feedback-collector' ) ) : $bytes;
	}

	/**
	 * PATCH /items/{id}
	 *
	 * @param WP_REST_Request $request Request.
	 */
	public static function update_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$id   = (int) $request['id'];
		$item = Items::get( $id );
		if ( ! $item ) {
			return self::not_found();
		}
		$p       = $request->get_json_params() ?: $request->get_body_params();
		$changes = array();

		if ( array_key_exists( 'title', $p ) ) {
			$title = sanitize_text_field( (string) $p['title'] );
			if ( '' === $title ) {
				return self::invalid( 'title', __( 'A title is required.', 'feedback-collector' ) );
			}
			$changes['title'] = mb_substr( $title, 0, 255 );
		}
		if ( array_key_exists( 'description', $p ) ) {
			$changes['description'] = sanitize_textarea_field( (string) $p['description'] );
		}
		foreach ( array(
			'status'   => Items::STATUSES,
			'priority' => Items::PRIORITIES,
			'type'     => Items::TYPES,
		) as $field => $allowed ) {
			if ( array_key_exists( $field, $p ) ) {
				$value = sanitize_key( (string) $p[ $field ] );
				if ( ! in_array( $value, $allowed, true ) ) {
					/* translators: %s: field name */
					return self::invalid( $field, sprintf( __( 'Invalid %s.', 'feedback-collector' ), $field ) );
				}
				$changes[ $field ] = $value;
			}
		}
		if ( array_key_exists( 'assignee_id', $p ) ) {
			$wanted = absint( $p['assignee_id'] );
			if ( Assignees::selected( $item ) !== $wanted ) {
				if ( Assignees::locked( $item ) ) {
					return self::invalid( 'assignee_id', __( 'This item is in Teamwork now; change the assignee there.', 'feedback-collector' ) );
				}
				$assignee = Assignees::resolve( $wanted );
				if ( is_wp_error( $assignee ) ) {
					return self::invalid( 'assignee_id', $assignee->get_error_message() );
				}
				$changes = array_merge( $changes, $assignee );
			}
		}
		if ( array_key_exists( 'anchor', $p ) ) {
			$changes['anchor'] = is_array( $p['anchor'] ) ? self::sanitize_anchor( $p['anchor'] ) : null;
		}

		if ( ! Items::update( $id, $changes ) ) {
			return new WP_Error( 'fbc_db', __( 'Could not update feedback.', 'feedback-collector' ), array( 'status' => 500 ) );
		}
		$out             = self::present( Items::get( $id ) );
		$out['comments'] = Items::comments( $id );
		return new WP_REST_Response( $out );
	}

	/**
	 * DELETE /items/{id} — reporter or administrator only.
	 *
	 * @param WP_REST_Request $request Request.
	 */
	public static function delete_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$item = Items::get( (int) $request['id'] );
		if ( ! $item ) {
			return self::not_found();
		}
		if ( ! self::can_delete( $item ) ) {
			return new WP_Error( 'fbc_forbidden', __( 'Only the reporter or an administrator can delete this.', 'feedback-collector' ), array( 'status' => 403 ) );
		}
		Items::delete( $item['id'] );
		return new WP_REST_Response(
			array(
				'deleted' => true,
				'id'      => $item['id'],
			)
		);
	}

	/**
	 * POST /items/{id}/comments
	 *
	 * @param WP_REST_Request $request Request.
	 */
	public static function create_comment( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$item = Items::get( (int) $request['id'] );
		if ( ! $item ) {
			return self::not_found();
		}
		$p    = $request->get_json_params() ?: $request->get_body_params();
		$body = sanitize_textarea_field( (string) ( $p['body'] ?? '' ) );
		if ( '' === $body ) {
			return self::invalid( 'body', __( 'Write something first.', 'feedback-collector' ) );
		}
		Items::add_comment( $item['id'], $body );
		$response = new WP_REST_Response( array( 'comments' => Items::comments( $item['id'] ) ) );
		$response->set_status( 201 );
		return $response;
	}

	/**
	 * GET /reviewers — users who can be assigned.
	 */
	public static function reviewers(): WP_REST_Response {
		return new WP_REST_Response( Assignees::options() );
	}

	/**
	 * Users holding the review capability.
	 *
	 * @return array<int, array{id: int, name: string}>
	 */
	public static function reviewer_list(): array {
		$users = get_users(
			array(
				'capability' => CAP,
				'fields'     => array( 'ID', 'display_name' ),
				'orderby'    => 'display_name',
			)
		);
		return array_map(
			static fn( $u ) => array(
				'id'   => (int) $u->ID,
				'name' => $u->display_name,
			),
			$users
		);
	}

	/**
	 * Public shape of an item.
	 *
	 * @param array<string, mixed> $item Hydrated item.
	 * @return array<string, mixed>
	 */
	public static function present( array $item ): array {
		$reporter = get_userdata( $item['reporter_id'] );
		$out      = array(
			'id'              => $item['id'],
			'type'            => $item['type'],
			'status'          => $item['status'],
			'priority'        => $item['priority'],
			'title'           => $item['title'],
			'description'     => $item['description'],
			'page_path'       => $item['page_path'],
			'page_query'      => $item['page_query'],
			'page_title'      => $item['page_title'],
			'page_url'        => Items::page_url( $item ),
			'anchor'          => $item['anchor'],
			'context'         => $item['context'],
			'breakpoint'      => $item['breakpoint'],
			'round'           => (int) $item['round'],
			'screenshot_url'  => Screenshots::url( $item ),
			'reporter_id'     => $item['reporter_id'],
			'reporter_name'   => $reporter ? $reporter->display_name : '',
			'assignee_id'     => Assignees::selected( $item ),
			'assignee_name'   => Assignees::name( $item ),
			'assignee_locked' => Assignees::locked( $item ),
			'tw_task_id'      => $item['tw_task_id'],
			'tw_sync_state'   => $item['tw_sync_state'],
			'created_at'      => mysql_to_rfc3339( $item['created_at'] ),
			'updated_at'      => mysql_to_rfc3339( $item['updated_at'] ),
			'can_delete'      => self::can_delete( $item ),
		);
		return (array) apply_filters( 'fbc_present_item', $out, $item );
	}

	/**
	 * Delete rule: reporter or administrator.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function can_delete( array $item ): bool {
		return current_user_can( 'manage_options' ) || get_current_user_id() === (int) $item['reporter_id'];
	}

	/**
	 * Whitelists anchor fields.
	 *
	 * @param array<string, mixed> $a Raw anchor.
	 * @return array<string, mixed>
	 */
	private static function sanitize_anchor( array $a ): array {
		$str = static fn( $v, int $max ) => is_string( $v ) ? mb_substr( wp_check_invalid_utf8( $v ), 0, $max ) : null;
		$num = static fn( $v ) => is_numeric( $v ) ? (float) $v : 0.0;
		return array(
			'id'       => $str( $a['id'] ?? null, 200 ),
			'selector' => (string) $str( $a['selector'] ?? '', 2000 ),
			'xpath'    => (string) $str( $a['xpath'] ?? '', 2000 ),
			'text'     => $str( $a['text'] ?? null, 120 ),
			'tag'      => sanitize_key( (string) ( $a['tag'] ?? '' ) ),
			'offsetX'  => max( 0.0, min( 1.0, $num( $a['offsetX'] ?? 0 ) ) ),
			'offsetY'  => max( 0.0, min( 1.0, $num( $a['offsetY'] ?? 0 ) ) ),
			'docX'     => $num( $a['docX'] ?? 0 ),
			'docY'     => $num( $a['docY'] ?? 0 ),
		);
	}

	/**
	 * Whitelists captured context fields.
	 *
	 * @param array<string, mixed> $c Raw context.
	 * @return array<string, mixed>
	 */
	private static function sanitize_context( array $c ): array {
		$text   = static fn( $v, int $max = 200 ) => mb_substr( sanitize_text_field( (string) $v ), 0, $max );
		$bp     = sanitize_key( (string) ( $c['breakpoint'] ?? '' ) );
		$errors = array();
		foreach ( array_slice( (array) ( $c['js_errors'] ?? array() ), 0, 20 ) as $err ) {
			$errors[] = $text( $err, 500 );
		}
		return array(
			'viewport_w' => absint( $c['viewport_w'] ?? 0 ),
			'viewport_h' => absint( $c['viewport_h'] ?? 0 ),
			'dpr'        => is_numeric( $c['dpr'] ?? null ) ? round( (float) $c['dpr'], 2 ) : 1,
			'breakpoint' => in_array( $bp, array( 'mobile', 'tablet', 'desktop' ), true ) ? $bp : '',
			'browser'    => $text( $c['browser'] ?? '' ),
			'os'         => $text( $c['os'] ?? '' ),
			'user_agent' => $text( $c['user_agent'] ?? '', 500 ),
			'post_id'    => absint( $c['post_id'] ?? 0 ),
			'post_type'  => sanitize_key( (string) ( $c['post_type'] ?? '' ) ),
			'theme'      => sanitize_key( (string) ( $c['theme'] ?? '' ) ),
			'js_errors'  => $errors,
			// Set when filed from the device preview (a phone/tablet/laptop frame), not a real device.
			'preview'    => mb_substr( sanitize_text_field( (string) ( $c['preview'] ?? '' ) ), 0, 60 ),
		);
	}

	/**
	 * 400 helper.
	 *
	 * @param string $field   Field name.
	 * @param string $message Message.
	 */
	private static function invalid( string $field, string $message ): WP_Error {
		return new WP_Error(
			'fbc_invalid',
			$message,
			array(
				'status' => 400,
				'field'  => $field,
			)
		);
	}

	/**
	 * 404 helper.
	 */
	private static function not_found(): WP_Error {
		return new WP_Error( 'fbc_not_found', __( 'Feedback item not found.', 'feedback-collector' ), array( 'status' => 404 ) );
	}
}
