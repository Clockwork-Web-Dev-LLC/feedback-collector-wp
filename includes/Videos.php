<?php
/**
 * Screen recordings for feedback items.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

use WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * Files live in uploads/fbc-videos/ with unguessable names, one per item.
 *
 * The browser uploads a recording while it is still being made: it opens a session
 * (an empty "rec-{user}-{token}.part" file), appends a small piece every couple of seconds,
 * and names the token when it creates the item, which moves the file onto the item.
 * Every piece stays far below PHP's upload limits, whatever the recording's length.
 */
final class Videos {

	public const DIR         = 'fbc-videos';
	public const OPTION      = 'fbc_videos';
	public const OPT_MAX     = 'fbc_video_max_seconds';
	public const DEFAULT_MAX = 180;
	/** Hard ceiling for one recording, whatever the length setting. */
	public const MAX_BYTES = 200 * MB_IN_BYTES;
	/** Largest single upload piece. */
	public const CHUNK_MAX = 8 * MB_IN_BYTES;
	/** Unfinished sessions older than this are swept. */
	private const STALE = 12 * HOUR_IN_SECONDS;
	/** Every WebM file starts with the EBML magic number. */
	private const MAGIC      = "\x1A\x45\xDF\xA3";
	private const MAX_EVENTS = 300;
	private const KINDS      = array( 'click', 'error' );

	/**
	 * Whether reviewers can record their screen (default on).
	 */
	public static function enabled(): bool {
		return '0' !== (string) get_option( self::OPTION, '1' );
	}

	/**
	 * Longest recording in seconds (default 3 minutes).
	 */
	public static function max_seconds(): int {
		return max( 10, min( 600, (int) get_option( self::OPT_MAX, self::DEFAULT_MAX ) ) );
	}

	/**
	 * Absolute directory, created with a blank index.php so it can't be listed.
	 */
	public static function dir(): string {
		$uploads = wp_upload_dir( null, false );
		$dir     = trailingslashit( $uploads['basedir'] ) . self::DIR;
		if ( ! is_dir( $dir ) ) {
			wp_mkdir_p( $dir );
		}
		if ( ! file_exists( $dir . '/index.php' ) ) {
			file_put_contents( $dir . '/index.php', "<?php\n// Silence is golden.\n" ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
		}
		return $dir;
	}

	/**
	 * Public URL of an item's recording, or '' (also when the file is gone).
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function url( array $item ): string {
		if ( '' === self::path( $item ) ) {
			return '';
		}
		$uploads = wp_upload_dir( null, false );
		return trailingslashit( $uploads['baseurl'] ) . self::DIR . '/' . rawurlencode( (string) $item['video'] );
	}

	/**
	 * Absolute path of an item's recording, or ''.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function path( array $item ): string {
		if ( empty( $item['video'] ) ) {
			return '';
		}
		$path = self::dir() . '/' . basename( (string) $item['video'] );
		return is_file( $path ) ? $path : '';
	}

	// ------------------------------------------------------------------ upload sessions

	/**
	 * Opens an upload session for a user and sweeps abandoned ones.
	 *
	 * @param int $user_id Reviewer.
	 * @return string|WP_Error Session token.
	 */
	public static function start_session( int $user_id ): string|WP_Error {
		self::sweep();
		$token = wp_generate_password( 32, false, false );
		if ( false === file_put_contents( self::session_path( $user_id, $token ), '' ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
			return new WP_Error( 'fbc_io', __( 'Could not start the recording upload.', 'feedback-collector' ), array( 'status' => 500 ) );
		}
		return $token;
	}

	/**
	 * Appends one piece at a byte offset. Re-sending a piece that already arrived is harmless
	 * (the browser retries after a dropped connection); a gap is refused with the current size
	 * so the browser knows where it stands.
	 *
	 * @param int    $user_id Reviewer.
	 * @param string $token   Session token.
	 * @param int    $offset  Where this piece starts.
	 * @param string $bytes   The piece.
	 * @return int|WP_Error Bytes stored so far.
	 */
	public static function append( int $user_id, string $token, int $offset, string $bytes ): int|WP_Error {
		$path = self::session_file( $user_id, $token );
		if ( '' === $path ) {
			return self::no_session();
		}
		$len = strlen( $bytes );
		if ( $len < 1 || $len > self::CHUNK_MAX ) {
			return new WP_Error( 'fbc_invalid', __( 'That piece of the recording is empty or too large.', 'feedback-collector' ), array( 'status' => 400 ) );
		}
		clearstatcache( true, $path );
		$size = (int) filesize( $path );
		if ( $offset < $size && $offset + $len <= $size ) {
			return $size; // Already stored.
		}
		if ( $offset !== $size ) {
			return new WP_Error(
				'fbc_offset',
				__( 'A piece of the recording is out of order.', 'feedback-collector' ),
				array(
					'status' => 409,
					'size'   => $size,
				)
			);
		}
		if ( 0 === $offset && ! str_starts_with( $bytes, self::MAGIC ) ) {
			return new WP_Error( 'fbc_invalid', __( 'The recording is not a WebM video.', 'feedback-collector' ), array( 'status' => 400 ) );
		}
		if ( $size + $len > self::MAX_BYTES ) {
			return new WP_Error( 'fbc_too_large', __( 'The recording is too large.', 'feedback-collector' ), array( 'status' => 413 ) );
		}
		if ( false === file_put_contents( $path, $bytes, FILE_APPEND | LOCK_EX ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
			return new WP_Error( 'fbc_io', __( 'Could not save the recording.', 'feedback-collector' ), array( 'status' => 500 ) );
		}
		return $size + $len;
	}

	/**
	 * Throws a session away (the reviewer discarded the recording).
	 *
	 * @param int    $user_id Reviewer.
	 * @param string $token   Session token.
	 */
	public static function discard( int $user_id, string $token ): void {
		$path = self::session_file( $user_id, $token );
		if ( '' !== $path ) {
			wp_delete_file( $path );
		}
	}

	/**
	 * Moves a finished session onto an item, replacing any recording it had.
	 *
	 * @param int                  $item_id  Item.
	 * @param int                  $user_id  Reviewer who owns the session.
	 * @param string               $token    Session token.
	 * @param int                  $duration Length in seconds.
	 * @param array<int, mixed>    $events   What happened during the recording (see sanitize_events()).
	 * @return string|WP_Error Stored filename.
	 */
	public static function attach( int $item_id, int $user_id, string $token, int $duration, array $events = array() ): string|WP_Error {
		$item = Items::get( $item_id );
		if ( ! $item ) {
			return new WP_Error( 'fbc_not_found', __( 'Feedback item not found.', 'feedback-collector' ), array( 'status' => 404 ) );
		}
		$path = self::session_file( $user_id, $token );
		if ( '' === $path ) {
			return self::no_session();
		}
		clearstatcache( true, $path );
		$head = (string) file_get_contents( $path, false, null, 0, 4 ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		if ( self::MAGIC !== $head ) {
			wp_delete_file( $path );
			return new WP_Error( 'fbc_invalid', __( 'The recording is empty or not a WebM video.', 'feedback-collector' ), array( 'status' => 400 ) );
		}

		$name = sprintf( '%d-%s.webm', $item_id, wp_generate_password( 24, false, false ) );
		if ( ! rename( $path, self::dir() . '/' . $name ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.rename_rename
			return new WP_Error( 'fbc_io', __( 'Could not save the recording.', 'feedback-collector' ), array( 'status' => 500 ) );
		}

		self::delete_file( $item );
		$max = self::max_seconds();
		Items::update(
			$item_id,
			array(
				'video'          => $name,
				'video_duration' => max( 0, min( $max + 5, $duration ) ),
				'video_events'   => self::sanitize_events( $events, $max ),
			)
		);
		return $name;
	}

	/**
	 * Whitelists the event timeline: [{ t: milliseconds, kind: click|error, label }].
	 *
	 * @param array<int, mixed> $events      Raw events.
	 * @param int               $max_seconds Recording length cap.
	 * @return array<int, array{t: int, kind: string, label: string}>
	 */
	public static function sanitize_events( array $events, int $max_seconds ): array {
		$out = array();
		foreach ( $events as $e ) {
			if ( ! is_array( $e ) || ! in_array( $e['kind'] ?? '', self::KINDS, true ) || ! is_string( $e['label'] ?? null ) ) {
				continue;
			}
			$label = mb_substr( sanitize_text_field( $e['label'] ), 0, 200 );
			if ( '' === $label ) {
				continue;
			}
			$out[] = array(
				't'     => max( 0, min( ( $max_seconds + 5 ) * 1000, (int) ( $e['t'] ?? 0 ) ) ),
				'kind'  => $e['kind'],
				'label' => $label,
			);
			if ( count( $out ) >= self::MAX_EVENTS ) {
				break;
			}
		}
		usort( $out, static fn( $a, $b ) => $a['t'] <=> $b['t'] );
		return $out;
	}

	/**
	 * "m:ss" for a number of seconds.
	 *
	 * @param int $seconds Seconds.
	 */
	public static function clock( int $seconds ): string {
		return sprintf( '%d:%02d', intdiv( $seconds, 60 ), $seconds % 60 );
	}

	/**
	 * Deletes an item's recording file (not the item).
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function delete_file( array $item ): void {
		$path = self::path( $item );
		if ( '' !== $path ) {
			wp_delete_file( $path );
		}
	}

	/**
	 * Removes unfinished uploads nobody came back for.
	 */
	public static function sweep(): void {
		foreach ( (array) glob( self::dir() . '/rec-*.part' ) as $file ) {
			if ( is_file( (string) $file ) && filemtime( (string) $file ) < time() - self::STALE ) {
				wp_delete_file( (string) $file );
			}
		}
	}

	/**
	 * Where a session's file lives (it may not exist).
	 *
	 * @param int    $user_id Reviewer.
	 * @param string $token   Session token.
	 */
	private static function session_path( int $user_id, string $token ): string {
		return self::dir() . sprintf( '/rec-%d-%s.part', $user_id, $token );
	}

	/**
	 * A session's file when the token is well-formed and belongs to this user, else ''.
	 *
	 * @param int    $user_id Reviewer.
	 * @param string $token   Session token.
	 */
	private static function session_file( int $user_id, string $token ): string {
		if ( $user_id < 1 || ! preg_match( '/^[A-Za-z0-9]{32}$/', $token ) ) {
			return '';
		}
		$path = self::session_path( $user_id, $token );
		return is_file( $path ) ? $path : '';
	}

	/**
	 * The error for an unknown, expired or someone else's session.
	 */
	private static function no_session(): WP_Error {
		return new WP_Error( 'fbc_no_session', __( 'That recording upload has expired. Record it again.', 'feedback-collector' ), array( 'status' => 404 ) );
	}
}
