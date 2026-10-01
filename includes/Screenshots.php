<?php
/**
 * Screenshot storage for feedback items.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

use WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * Files live in uploads/fbc-screenshots/ with unguessable names, one per item.
 */
final class Screenshots {

	public const DIR       = 'fbc-screenshots';
	public const MAX_BYTES = 3 * MB_IN_BYTES;
	public const OPTION    = 'fbc_screenshots';

	private const MIMES = array(
		IMAGETYPE_JPEG => 'jpg',
		IMAGETYPE_PNG  => 'png',
		IMAGETYPE_WEBP => 'webp',
	);

	/**
	 * Whether reviewers' feedback captures a screenshot automatically (default on).
	 */
	public static function enabled(): bool {
		return '0' !== (string) get_option( self::OPTION, '1' );
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
	 * Public URL of an item's screenshot, or ''.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function url( array $item ): string {
		if ( empty( $item['screenshot'] ) ) {
			return '';
		}
		$uploads = wp_upload_dir( null, false );
		return trailingslashit( $uploads['baseurl'] ) . self::DIR . '/' . rawurlencode( (string) $item['screenshot'] );
	}

	/**
	 * Absolute path of an item's screenshot, or ''.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function path( array $item ): string {
		if ( empty( $item['screenshot'] ) ) {
			return '';
		}
		$path = self::dir() . '/' . basename( (string) $item['screenshot'] );
		return is_file( $path ) ? $path : '';
	}

	/**
	 * Validates image bytes and stores them for an item, replacing any previous screenshot.
	 *
	 * @param int    $item_id Item.
	 * @param string $bytes   Raw image bytes.
	 * @return string|WP_Error Stored filename.
	 */
	public static function save_bytes( int $item_id, string $bytes ): string|WP_Error {
		$item = Items::get( $item_id );
		if ( ! $item ) {
			return new WP_Error( 'fbc_not_found', __( 'Feedback item not found.', 'feedback-collector' ), array( 'status' => 404 ) );
		}
		if ( '' === $bytes || strlen( $bytes ) > self::MAX_BYTES ) {
			return new WP_Error( 'fbc_invalid', __( 'The screenshot is empty or too large.', 'feedback-collector' ), array( 'status' => 400 ) );
		}
		// Real image check: never trust the client's file name or MIME type.
		$info = getimagesizefromstring( $bytes );
		if ( ! $info || ! isset( self::MIMES[ $info[2] ] ) || $info[0] < 1 || $info[1] < 1 || $info[0] > 8000 || $info[1] > 8000 ) {
			return new WP_Error( 'fbc_invalid', __( 'The screenshot is not a valid JPEG, PNG or WebP image.', 'feedback-collector' ), array( 'status' => 400 ) );
		}

		$name = sprintf( '%d-%s.%s', $item_id, wp_generate_password( 24, false, false ), self::MIMES[ $info[2] ] );
		$path = self::dir() . '/' . $name;
		if ( false === file_put_contents( $path, $bytes ) ) { // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents
			return new WP_Error( 'fbc_io', __( 'Could not save the screenshot.', 'feedback-collector' ), array( 'status' => 500 ) );
		}

		self::delete_file( $item );
		Items::update( $item_id, array( 'screenshot' => $name ) );
		return $name;
	}

	/**
	 * Deletes an item's screenshot file (not the item).
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
	 * Removes the whole directory (uninstall).
	 */
	public static function delete_all(): void {
		$uploads = wp_upload_dir( null, false );
		$dir     = trailingslashit( $uploads['basedir'] ) . self::DIR;
		if ( ! is_dir( $dir ) ) {
			return;
		}
		foreach ( (array) glob( $dir . '/*' ) as $file ) {
			if ( is_file( (string) $file ) ) {
				wp_delete_file( (string) $file );
			}
		}
		rmdir( $dir ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_rmdir
	}
}
