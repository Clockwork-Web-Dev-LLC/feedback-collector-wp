<?php
/**
 * Due dates: the suggested date for new feedback, and the per-reviewer "batch" that
 * keeps a QA session's items on one date.
 *
 * A reviewer filing a burst of items gets the same due date on all of them: the
 * first item starts a batch (due N days out), and every item they file within the
 * next H hours reuses that date. Changing the date mid-batch carries forward. After
 * H hours the batch ends and the next item starts a fresh one.
 *
 * Teamwork due dates are day-only, so these are dates (Y-m-d), in the site's timezone.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Due date settings, suggestions and batches.
 */
final class DueDates {

	public const OPT_DEFAULT = 'fbc_due_default';
	public const OPT_DAYS    = 'fbc_due_days';
	public const OPT_HOURS   = 'fbc_due_batch_hours';
	public const BATCH_META  = 'fbc_due_batch';

	public const DEFAULT_DAYS  = 3;
	public const DEFAULT_HOURS = 3;

	/**
	 * Whether "Set date?" starts ticked in the composer.
	 */
	public static function on_by_default(): bool {
		return '0' !== (string) get_option( self::OPT_DEFAULT, '1' );
	}

	/**
	 * Days from creation to the default due date (0–365).
	 */
	public static function days(): int {
		return max( 0, min( 365, (int) get_option( self::OPT_DAYS, self::DEFAULT_DAYS ) ) );
	}

	/**
	 * Hours a batch lasts after its first item (0 = no batches; every item gets its own date).
	 */
	public static function batch_hours(): int {
		return max( 0, min( 72, (int) get_option( self::OPT_HOURS, self::DEFAULT_HOURS ) ) );
	}

	/**
	 * A valid Y-m-d date, or null.
	 *
	 * @param mixed $value Input.
	 */
	public static function sanitize( mixed $value ): ?string {
		$value = is_string( $value ) ? trim( $value ) : '';
		if ( ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $value, $m ) || ! checkdate( (int) $m[2], (int) $m[3], (int) $m[1] ) ) {
			return null;
		}
		return $value;
	}

	/**
	 * The default date for something created at $now: N days out, in the site's timezone.
	 *
	 * @param int|null $now Unix time.
	 */
	public static function fresh( ?int $now = null ): string {
		return wp_date( 'Y-m-d', ( $now ?? time() ) + self::days() * DAY_IN_SECONDS );
	}

	/**
	 * The reviewer's active batch, or null when there isn't one (or it has run out).
	 *
	 * @param int      $user_id User.
	 * @param int|null $now     Unix time.
	 * @return array{date: string, started: int, until: int}|null
	 */
	public static function batch( int $user_id, ?int $now = null ): ?array {
		$hours = self::batch_hours();
		$b     = get_user_meta( $user_id, self::BATCH_META, true );
		if ( ! $hours || ! is_array( $b ) || ! self::sanitize( $b['date'] ?? '' ) ) {
			return null;
		}
		$until = (int) ( $b['started'] ?? 0 ) + $hours * HOUR_IN_SECONDS;
		if ( $until <= ( $now ?? time() ) ) {
			return null;
		}
		return array(
			'date'    => (string) $b['date'],
			'started' => (int) $b['started'],
			'until'   => $until,
		);
	}

	/**
	 * The date to suggest for the reviewer's next item.
	 *
	 * @param int      $user_id User.
	 * @param int|null $now     Unix time.
	 */
	public static function suggest( int $user_id, ?int $now = null ): string {
		$batch = self::batch( $user_id, $now );
		return $batch ? $batch['date'] : self::fresh( $now );
	}

	/**
	 * Records a due date the reviewer just used: starts a batch, or (mid-batch)
	 * moves the batch to this date without extending it.
	 *
	 * @param int      $user_id User.
	 * @param string   $date    Y-m-d.
	 * @param int|null $now     Unix time.
	 */
	public static function remember( int $user_id, string $date, ?int $now = null ): void {
		if ( ! $user_id || ! self::batch_hours() || ! self::sanitize( $date ) ) {
			return;
		}
		$now   = $now ?? time();
		$batch = self::batch( $user_id, $now );
		update_user_meta(
			$user_id,
			self::BATCH_META,
			array(
				'date'    => $date,
				'started' => $batch ? $batch['started'] : $now,
			)
		);
	}

	/**
	 * Front-end config for the composer.
	 *
	 * @param int $user_id User.
	 * @return array<string, mixed>
	 */
	public static function client_config( int $user_id ): array {
		$batch = self::batch( $user_id );
		return array(
			'onByDefault' => self::on_by_default(),
			'days'        => self::days(),
			'hours'       => self::batch_hours(),
			'suggest'     => self::suggest( $user_id ),
			'batchUntil'  => $batch ? $batch['until'] : 0,
			'today'       => wp_date( 'Y-m-d' ),
		);
	}

	/**
	 * True when an open item's due date has passed (site timezone).
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function overdue( array $item ): bool {
		$due = self::sanitize( (string) ( $item['due_date'] ?? '' ) );
		return $due && 'resolved' !== ( $item['status'] ?? '' ) && $due < wp_date( 'Y-m-d' );
	}

	/**
	 * A due date for display, e.g. "Oct 4, 2026".
	 *
	 * @param string|null $date Y-m-d.
	 */
	public static function label( ?string $date ): string {
		$date = self::sanitize( (string) $date );
		if ( ! $date ) {
			return '';
		}
		$ts = ( new \DateTimeImmutable( $date, wp_timezone() ) )->getTimestamp();
		return wp_date( get_option( 'date_format' ) ?: 'M j, Y', $ts );
	}
}
