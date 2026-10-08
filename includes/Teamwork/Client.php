<?php
/**
 * Minimal Teamwork.com API client.
 *
 * Task lists can only be created through API v1; everything else uses v3.
 *
 * @package FeedbackCollector\Teamwork
 */

namespace FeedbackCollector\Teamwork;

use WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * Thin wrapper over wp_remote_request with API-key Basic auth.
 */
final class Client {

	/**
	 * Constructor.
	 *
	 * @param string $site    Base URL, e.g. https://clockwork.teamwork.com.
	 * @param string $api_key API key of the Teamwork user the plugin acts as.
	 */
	public function __construct( private string $site, private string $api_key ) {
		$this->site = untrailingslashit( $site );
	}

	/**
	 * Sends a request and decodes JSON.
	 *
	 * @param string               $method HTTP method.
	 * @param string               $path   Path starting with /.
	 * @param array<string, mixed> $query  Query args.
	 * @param array<string, mixed> $body   JSON body.
	 * @return array<string, mixed>|WP_Error
	 */
	public function request( string $method, string $path, array $query = array(), ?array $body = null ): array|WP_Error {
		$url  = add_query_arg( array_map( 'rawurlencode', array_map( 'strval', $query ) ), $this->site . $path );
		$args = array(
			'method'  => $method,
			'timeout' => 15,
			'headers' => array(
				'Authorization' => 'Basic ' . base64_encode( $this->api_key . ':x' ), // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
				'Accept'        => 'application/json',
			),
		);
		if ( null !== $body ) {
			$args['headers']['Content-Type'] = 'application/json';
			$args['body']                    = wp_json_encode( $body );
		}

		$response = wp_remote_request( $url, $args );
		if ( is_wp_error( $response ) ) {
			return new WP_Error( 'fbc_tw_http', $response->get_error_message() );
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$data = json_decode( (string) wp_remote_retrieve_body( $response ), true );

		if ( 429 === $code ) {
			return new WP_Error( 'fbc_tw_rate_limited', __( 'Teamwork rate limit reached.', 'feedback-collector' ), array( 'retry_after' => self::retry_after( $response ) ) );
		}
		if ( $code < 200 || $code >= 300 ) {
			return new WP_Error( 'fbc_tw_api', self::error_message( $code, $data ), array( 'status' => $code ) );
		}
		return is_array( $data ) ? $data : array();
	}

	/**
	 * Seconds to wait after a 429. X-Rate-Limit-Reset may be seconds or an epoch.
	 *
	 * @param array<string, mixed> $response wp_remote_* response.
	 */
	private static function retry_after( array $response ): int {
		$reset = (int) wp_remote_retrieve_header( $response, 'x-rate-limit-reset' );
		if ( $reset > 1000000000 ) {
			$reset -= time();
		}
		return max( 5, min( 120, $reset ?: 60 ) );
	}

	/**
	 * Readable message from a Teamwork error response.
	 *
	 * @param int   $code HTTP status.
	 * @param mixed $data Decoded body.
	 */
	private static function error_message( int $code, mixed $data ): string {
		$detail = '';
		if ( is_array( $data ) ) {
			if ( ! empty( $data['errors'][0]['detail'] ) ) {
				$detail = (string) $data['errors'][0]['detail'];
			} elseif ( ! empty( $data['errors'][0]['title'] ) ) {
				$detail = (string) $data['errors'][0]['title'];
			} elseif ( ! empty( $data['MESSAGE'] ) ) {
				$detail = (string) $data['MESSAGE'];
			} elseif ( ! empty( $data['message'] ) ) {
				$detail = (string) $data['message'];
			}
		}
		if ( 401 === $code ) {
			$detail = $detail ?: __( 'The API key was rejected.', 'feedback-collector' );
		}
		/* translators: 1: HTTP status, 2: detail */
		return trim( sprintf( __( 'Teamwork returned %1$d. %2$s', 'feedback-collector' ), $code, $detail ) );
	}

	/**
	 * Fetches every page of a v3 collection.
	 *
	 * @param string               $path  v3 path.
	 * @param string               $key   Collection key in the response.
	 * @param array<string, mixed> $query Extra query args.
	 * @param int                  $max   Page cap.
	 * @return array<int, array<string, mixed>>|WP_Error
	 */
	public function paginate( string $path, string $key, array $query = array(), int $max = 20 ): array|WP_Error {
		$out = array();
		for ( $page = 1; $page <= $max; $page++ ) {
			$data = $this->request(
				'GET',
				$path,
				array_merge(
					$query,
					array(
						'page'     => $page,
						'pageSize' => 250,
					)
				)
			);
			if ( is_wp_error( $data ) ) {
				return $data;
			}
			$out = array_merge( $out, (array) ( $data[ $key ] ?? array() ) );
			if ( empty( $data['meta']['page']['hasMore'] ) ) {
				break;
			}
		}
		return $out;
	}

	/**
	 * The authenticated user.
	 *
	 * @return array<string, mixed>|WP_Error
	 */
	public function me(): array|WP_Error {
		$data = $this->request( 'GET', '/projects/api/v3/me.json' );
		return is_wp_error( $data ) ? $data : (array) ( $data['person'] ?? array() );
	}

	/**
	 * Active projects as id => name.
	 *
	 * @return array<int, string>|WP_Error
	 */
	public function projects(): array|WP_Error {
		$rows = $this->paginate(
			'/projects/api/v3/projects.json',
			'projects',
			array(
				'status'  => 'active',
				'orderBy' => 'name',
			)
		);
		if ( is_wp_error( $rows ) ) {
			return $rows;
		}
		$out = array();
		foreach ( $rows as $p ) {
			$out[ (int) $p['id'] ] = (string) $p['name'];
		}
		asort( $out, SORT_NATURAL | SORT_FLAG_CASE );
		return $out;
	}

	/**
	 * Task lists in a project as id => name.
	 *
	 * @param int $project_id Project.
	 * @return array<int, string>|WP_Error
	 */
	public function tasklists( int $project_id ): array|WP_Error {
		$rows = $this->paginate( "/projects/api/v3/projects/{$project_id}/tasklists.json", 'tasklists' );
		if ( is_wp_error( $rows ) ) {
			return $rows;
		}
		$out = array();
		foreach ( $rows as $l ) {
			$out[ (int) $l['id'] ] = (string) $l['name'];
		}
		return $out;
	}

	/**
	 * Creates a task list (v1 only).
	 *
	 * @param int    $project_id Project.
	 * @param string $name       List name.
	 * @param bool   $is_private Whether the task list is private. Default false.
	 * @return int|WP_Error New task list ID.
	 */
	public function create_tasklist( int $project_id, string $name, bool $is_private = false ): int|WP_Error {
		$data = $this->request(
			'POST',
			"/projects/{$project_id}/tasklists.json",
			array(),
			array(
				'todo-list' => array(
					'name'        => $name,
					'description' => sprintf( /* translators: %s: plugin name */ __( 'QA feedback pushed from %s.', 'feedback-collector' ), \FeedbackCollector\Branding::text( 'name' ) ),
					'private'     => $is_private,
				),
			)
		);
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		$id = (int) ( $data['TASKLISTID'] ?? $data['tasklistId'] ?? 0 );
		return $id ?: new WP_Error( 'fbc_tw_api', __( 'Teamwork did not return a task list ID.', 'feedback-collector' ) );
	}

	/**
	 * People on a project, for assignee pickers.
	 *
	 * @param int $project_id Project.
	 * @return array<int, array{id: int, name: string, email: string}>|WP_Error Sorted by name.
	 */
	public function people( int $project_id ): array|WP_Error {
		$rows = $this->paginate( "/projects/api/v3/projects/{$project_id}/people.json", 'people' );
		if ( is_wp_error( $rows ) ) {
			return $rows;
		}
		$out = array();
		foreach ( $rows as $person ) {
			$name  = trim( (string) ( $person['firstName'] ?? '' ) . ' ' . (string) ( $person['lastName'] ?? '' ) );
			$out[] = array(
				'id'    => (int) $person['id'],
				'name'  => '' !== $name ? $name : (string) ( $person['email'] ?? $person['emailAddress'] ?? '#' . $person['id'] ),
				'email' => strtolower( (string) ( $person['email'] ?? $person['emailAddress'] ?? '' ) ),
			);
		}
		usort( $out, static fn( $a, $b ) => strcasecmp( $a['name'], $b['name'] ) );
		return $out;
	}

	/**
	 * People on a project, keyed by lowercase email.
	 *
	 * @param int $project_id Project.
	 * @return array<string, int>|WP_Error email => person ID.
	 */
	public function people_by_email( int $project_id ): array|WP_Error {
		$rows = $this->paginate( "/projects/api/v3/projects/{$project_id}/people.json", 'people' );
		if ( is_wp_error( $rows ) ) {
			return $rows;
		}
		$out = array();
		foreach ( $rows as $person ) {
			$email = strtolower( (string) ( $person['email'] ?? $person['emailAddress'] ?? '' ) );
			if ( '' !== $email ) {
				$out[ $email ] = (int) $person['id'];
			}
		}
		return $out;
	}

	/**
	 * Finds or creates a tag by exact name.
	 *
	 * @param string $name Tag name.
	 * @return int|WP_Error Tag ID.
	 */
	public function ensure_tag( string $name ): int|WP_Error {
		$data = $this->request(
			'GET',
			'/projects/api/v3/tags.json',
			array(
				'searchTerm' => $name,
				'pageSize'   => 100,
			)
		);
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		foreach ( (array) ( $data['tags'] ?? array() ) as $tag ) {
			if ( 0 === strcasecmp( (string) $tag['name'], $name ) ) {
				return (int) $tag['id'];
			}
		}
		$created = $this->request( 'POST', '/projects/api/v3/tags.json', array(), array( 'tag' => array( 'name' => $name ) ) );
		if ( is_wp_error( $created ) ) {
			return $created;
		}
		$id = (int) ( $created['tag']['id'] ?? 0 );
		return $id ?: new WP_Error( 'fbc_tw_api', __( 'Teamwork did not return a tag ID.', 'feedback-collector' ) );
	}

	/**
	 * Uploads a file through Teamwork's presigned flow and returns its pending-file reference,
	 * which create_task() attaches. Step 1 asks Teamwork for a signed URL; step 2 PUTs the bytes
	 * straight to storage (no Teamwork auth header on that request).
	 *
	 * @param string $path     Local file.
	 * @param string $filename Name shown in Teamwork.
	 * @return string|WP_Error Pending-file reference.
	 */
	public function upload_pending_file( string $path, string $filename ): string|WP_Error {
		$size = (int) filesize( $path );
		if ( $size < 1 ) {
			return new WP_Error( 'fbc_tw_file', __( 'The file to attach is missing.', 'feedback-collector' ) );
		}
		$data = $this->request(
			'GET',
			'/projects/api/v1/pendingfiles/presignedurl.json',
			array(
				'fileName' => $filename,
				'fileSize' => $size,
			)
		);
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		$ref = (string) ( $data['ref'] ?? '' );
		$url = (string) ( $data['url'] ?? '' );
		if ( '' === $ref || '' === $url ) {
			return new WP_Error( 'fbc_tw_file', __( 'Teamwork did not return an upload URL.', 'feedback-collector' ) );
		}
		// Recordings run to tens of megabytes: allow the memory and time to send one in a single PUT.
		if ( $size > 8 * MB_IN_BYTES ) {
			wp_raise_memory_limit( 'fbc_upload' );
		}
		$response = wp_remote_request(
			$url,
			array(
				'method'  => 'PUT',
				'timeout' => max( 30, (int) ceil( $size / MB_IN_BYTES ) * 3 ),
				'headers' => array(
					'X-Amz-Acl'      => 'public-read',
					'Content-Length' => (string) $size,
				),
				'body'    => (string) file_get_contents( $path ), // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
			)
		);
		if ( is_wp_error( $response ) ) {
			return new WP_Error( 'fbc_tw_file', $response->get_error_message() );
		}
		$code = (int) wp_remote_retrieve_response_code( $response );
		if ( $code < 200 || $code >= 300 ) {
			/* translators: %d: HTTP status */
			return new WP_Error( 'fbc_tw_file', sprintf( __( 'File upload to Teamwork failed (%d).', 'feedback-collector' ), $code ) );
		}
		return $ref;
	}

	/**
	 * Creates a task in a task list.
	 *
	 * @param int                  $tasklist_id Task list.
	 * @param array<string, mixed> $task        v3 task fields.
	 * @param bool                 $notify      Whether Teamwork emails the assignees about the new task.
	 * @param string[]             $pending     Pending-file references to attach (see upload_pending_file()).
	 * @return int|WP_Error Task ID.
	 */
	public function create_task( int $tasklist_id, array $task, bool $notify = true, array $pending = array() ): int|WP_Error {
		$body = array(
			'task'        => $task,
			// Same switch as "Notify by email" when adding a task in the Teamwork UI.
			'taskOptions' => array( 'notify' => $notify ),
		);
		if ( $pending ) {
			$body['attachments'] = array(
				'pendingFiles' => array_map(
					static fn( string $ref ): array => array( 'reference' => $ref ),
					array_values( $pending )
				),
			);
		}
		$data = $this->request( 'POST', "/projects/api/v3/tasklists/{$tasklist_id}/tasks.json", array(), $body );
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		$id = (int) ( $data['task']['id'] ?? 0 );
		return $id ?: new WP_Error( 'fbc_tw_api', __( 'Teamwork did not return a task ID.', 'feedback-collector' ) );
	}

	/**
	 * Tasks in a project changed since a time, including completed ones.
	 *
	 * @param int         $project_id    Project.
	 * @param string|null $updated_after ISO-8601 UTC, or null for all.
	 * @return array<int, array<string, mixed>>|WP_Error
	 */
	public function project_tasks( int $project_id, ?string $updated_after ): array|WP_Error {
		$query = array( 'includeCompletedTasks' => 'true' );
		if ( $updated_after ) {
			$query['updatedAfter'] = $updated_after;
		}
		return $this->paginate( "/projects/api/v3/projects/{$project_id}/tasks.json", 'tasks', $query, 40 );
	}

	/**
	 * Updates fields on a task (PATCH v3).
	 *
	 * @param int                  $task_id Task ID.
	 * @param array<string, mixed> $fields  Task fields, e.g. array( 'dueAt' => '2026-10-04' ), or null to clear one.
	 */
	public function update_task( int $task_id, array $fields ): true|WP_Error {
		$data = $this->request( 'PATCH', "/projects/api/v3/tasks/{$task_id}.json", array(), array( 'task' => $fields ) );
		return is_wp_error( $data ) ? $data : true;
	}

	/**
	 * Browser URL for a task.
	 *
	 * @param int $task_id Task.
	 */
	public function task_url( int $task_id ): string {
		return $this->site . '/app/tasks/' . $task_id;
	}

	/**
	 * Creates a comment on a task. Uses the v1 endpoint: v3 can list task comments but
	 * answers 404 "entity not found" to a POST on the same path.
	 *
	 * @param int    $task_id Task ID.
	 * @param string $body    Comment text.
	 * @return int|WP_Error Teamwork comment ID.
	 */
	public function create_task_comment( int $task_id, string $body ): int|WP_Error {
		$payload = array(
			'comment' => array(
				'body'         => $body,
				'content-type' => 'text',
			),
		);
		$data = $this->request( 'POST', "/tasks/{$task_id}/comments.json", array(), $payload );
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		$id = (int) ( $data['comment']['id'] ?? $data['commentId'] ?? $data['COMMENTID'] ?? 0 );
		return $id ?: new WP_Error( 'fbc_tw_api', __( 'Teamwork did not return a comment ID.', 'feedback-collector' ) );
	}

	/**
	 * Comments on a task.
	 *
	 * @param int $task_id Task ID.
	 * @return array<int, array<string, mixed>>|WP_Error
	 */
	public function task_comments( int $task_id ): array|WP_Error {
		return $this->paginate( "/projects/api/v3/tasks/{$task_id}/comments.json", 'comments' );
	}
}
