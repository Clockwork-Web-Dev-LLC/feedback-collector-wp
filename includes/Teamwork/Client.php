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
			$data = $this->request( 'GET', $path, array_merge( $query, array( 'page' => $page, 'pageSize' => 250 ) ) );
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
		$rows = $this->paginate( '/projects/api/v3/projects.json', 'projects', array( 'status' => 'active', 'orderBy' => 'name' ) );
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
	 * @return int|WP_Error New task list ID.
	 */
	public function create_tasklist( int $project_id, string $name ): int|WP_Error {
		$data = $this->request(
			'POST',
			"/projects/{$project_id}/tasklists.json",
			array(),
			array(
				'todo-list' => array(
					'name'        => $name,
					'description' => __( 'QA feedback pushed from the Feedback Collector WordPress plugin.', 'feedback-collector' ),
					'private'     => false,
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
		$data = $this->request( 'GET', '/projects/api/v3/tags.json', array( 'searchTerm' => $name, 'pageSize' => 100 ) );
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
	 * Creates a task in a task list.
	 *
	 * @param int                  $tasklist_id Task list.
	 * @param array<string, mixed> $task        v3 task fields.
	 * @return int|WP_Error Task ID.
	 */
	public function create_task( int $tasklist_id, array $task ): int|WP_Error {
		$data = $this->request( 'POST', "/projects/api/v3/tasklists/{$tasklist_id}/tasks.json", array(), array( 'task' => $task ) );
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
	 * Browser URL for a task.
	 *
	 * @param int $task_id Task.
	 */
	public function task_url( int $task_id ): string {
		return $this->site . '/app/tasks/' . $task_id;
	}
}
