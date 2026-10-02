<?php
/**
 * Per-reviewer overlay preferences (toolbar corner, hover highlight), stored on the
 * WordPress user so they follow the reviewer across browsers and computers.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Reviewer preferences.
 */
final class UserPrefs {

	public const META    = 'fbc_prefs';
	public const CORNERS = array( 'tl', 'tr', 'bl', 'br' );

	/**
	 * Saved preferences; a key is absent until the reviewer has chosen it.
	 *
	 * @param int $user_id User.
	 * @return array{corner?: string, highlight?: bool}
	 */
	public static function get( int $user_id ): array {
		$raw = $user_id ? get_user_meta( $user_id, self::META, true ) : array();
		return self::clean( is_array( $raw ) ? $raw : array() );
	}

	/**
	 * Merges valid values into the reviewer's saved preferences.
	 *
	 * @param int                  $user_id User.
	 * @param array<string, mixed> $changes corner and/or highlight.
	 * @return array{corner?: string, highlight?: bool}
	 */
	public static function update( int $user_id, array $changes ): array {
		$prefs = array_merge( self::get( $user_id ), self::clean( $changes ) );
		update_user_meta( $user_id, self::META, $prefs );
		return $prefs;
	}

	/**
	 * Keeps only known keys with valid values.
	 *
	 * @param array<string, mixed> $in Input.
	 * @return array{corner?: string, highlight?: bool}
	 */
	private static function clean( array $in ): array {
		$out = array();
		if ( isset( $in['corner'] ) && in_array( $in['corner'], self::CORNERS, true ) ) {
			$out['corner'] = (string) $in['corner'];
		}
		if ( array_key_exists( 'highlight', $in ) && is_bool( $in['highlight'] ) ) {
			$out['highlight'] = $in['highlight'];
		}
		return $out;
	}
}
