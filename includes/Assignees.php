<?php
/**
 * Who feedback can be assigned to: Teamwork project members (default) or WordPress users.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

use FeedbackCollector\Teamwork\Teamwork;
use WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * One source of truth for assignee pickers, validation and display names.
 */
final class Assignees {

	public const OPTION = 'fbc_assignee_source';

	/**
	 * The configured preference: 'teamwork' (default) or 'wordpress'.
	 */
	public static function preference(): string {
		return 'wordpress' === get_option( self::OPTION, 'teamwork' ) ? 'wordpress' : 'teamwork';
	}

	/**
	 * The source actually in use. Teamwork needs a connection and a project;
	 * until then pickers fall back to WordPress users.
	 */
	public static function source(): string {
		if ( 'teamwork' !== self::preference() ) {
			return 'wordpress';
		}
		$s = Teamwork::settings();
		return ( Teamwork::client() && $s['project_id'] ) ? 'teamwork' : 'wordpress';
	}

	/**
	 * Teamwork people on the selected project, cached for an hour.
	 *
	 * @param bool $refresh Bypass the cache.
	 * @return array<int, array{id: int, name: string, email: string}>|WP_Error
	 */
	public static function teamwork_people( bool $refresh = false ): array|WP_Error {
		$client = Teamwork::client();
		$s      = Teamwork::settings();
		if ( ! $client || ! $s['project_id'] ) {
			return new WP_Error( 'fbc_tw_not_ready', __( 'Teamwork is not connected.', 'feedback-collector' ) );
		}
		$key = 'fbc_tw_people_list_' . (int) $s['project_id'];
		if ( ! $refresh ) {
			$cached = get_transient( $key );
			if ( is_array( $cached ) ) {
				return $cached;
			}
		}
		$people = $client->people( (int) $s['project_id'] );
		if ( ! is_wp_error( $people ) ) {
			set_transient( $key, $people, HOUR_IN_SECONDS );
		}
		return $people;
	}

	/**
	 * Picker options for the active source.
	 *
	 * @return array{source: string, people: array<int, array{id: int, name: string}>, error: string}
	 */
	public static function options(): array {
		if ( 'teamwork' === self::source() ) {
			$people = self::teamwork_people();
			if ( is_wp_error( $people ) ) {
				return array(
					'source' => 'teamwork',
					'people' => array(),
					'error'  => $people->get_error_message(),
				);
			}
			return array(
				'source' => 'teamwork',
				'people' => array_map(
					static fn( $p ) => array(
						'id'   => $p['id'],
						'name' => $p['name'],
					),
					$people
				),
				'error'  => '',
			);
		}
		return array(
			'source' => 'wordpress',
			'people' => Rest::reviewer_list(),
			'error'  => '',
		);
	}

	/**
	 * The current WordPress user's ID in the active source (Teamwork: matched by email), or 0.
	 */
	public static function me(): int {
		if ( 'teamwork' !== self::source() ) {
			return get_current_user_id();
		}
		$people = self::teamwork_people();
		if ( is_wp_error( $people ) ) {
			return 0;
		}
		$email = strtolower( (string) wp_get_current_user()->user_email );
		foreach ( $people as $p ) {
			if ( '' !== $email && $p['email'] === $email ) {
				return $p['id'];
			}
		}
		return 0;
	}

	/**
	 * Resolves a submitted assignee ID for the active source into item fields.
	 * 0 clears the assignee.
	 *
	 * @param int $id Submitted ID.
	 * @return array<string, int|string>|WP_Error Item fields to store.
	 */
	public static function resolve( int $id ): array|WP_Error {
		if ( 'teamwork' === self::source() ) {
			if ( 0 === $id ) {
				return array(
					'tw_assignee_id'   => 0,
					'tw_assignee_name' => '',
				);
			}
			$people = self::teamwork_people();
			if ( is_wp_error( $people ) ) {
				return $people;
			}
			foreach ( $people as $p ) {
				if ( $p['id'] === $id ) {
					return array(
						'tw_assignee_id'   => $p['id'],
						'tw_assignee_name' => mb_substr( $p['name'], 0, 190 ),
					);
				}
			}
			return new WP_Error( 'fbc_invalid', __( 'That person is not on the Teamwork project.', 'feedback-collector' ), array( 'status' => 400 ) );
		}
		if ( $id && ! user_can( $id, CAP ) ) {
			return new WP_Error( 'fbc_invalid', __( 'That user cannot be assigned feedback.', 'feedback-collector' ), array( 'status' => 400 ) );
		}
		return array( 'assignee_id' => $id );
	}

	/**
	 * Display name for an item's assignee, whichever source it was assigned from.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function name( array $item ): string {
		if ( ! empty( $item['tw_assignee_id'] ) ) {
			return (string) $item['tw_assignee_name'];
		}
		if ( ! empty( $item['assignee_id'] ) ) {
			$user = get_userdata( (int) $item['assignee_id'] );
			return $user ? $user->display_name : '';
		}
		return '';
	}

	/**
	 * The item's assignee ID in the active source (for preselecting pickers).
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function selected( array $item ): int {
		return 'teamwork' === self::source() ? (int) $item['tw_assignee_id'] : (int) $item['assignee_id'];
	}

	/**
	 * Once pushed, Teamwork owns the assignee (like status), so it can't be changed here.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function locked( array $item ): bool {
		return 'teamwork' === self::source() && ! empty( $item['tw_task_id'] );
	}
}
