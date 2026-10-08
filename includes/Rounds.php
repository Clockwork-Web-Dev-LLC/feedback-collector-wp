<?php
/**
 * QA rounds: one counter for the whole plugin, with or without Teamwork.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

use FeedbackCollector\Teamwork\Teamwork;
use WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * Every item belongs to the round that was current when it was filed.
 */
final class Rounds {

	public const OPTION = 'fbcol_round';

	/**
	 * The current round (≥ 1). On first use it adopts the round number of any
	 * Teamwork QA list created before rounds existed, so the two never disagree.
	 */
	public static function current(): int {
		$round = (int) get_option( self::OPTION, 0 );
		if ( $round < 1 ) {
			$legacy = (int) ( get_option( 'fbcol_teamwork', array() )['round'] ?? 0 );
			$round  = max( 1, $legacy );
			update_option( self::OPTION, $round, false );
		}
		return $round;
	}

	/**
	 * Rounds that exist, newest first.
	 *
	 * @return int[]
	 */
	public static function all(): array {
		return range( self::current(), 1 );
	}

	/**
	 * Moves to the next round. With Teamwork connected, also creates and activates
	 * that round's QA list.
	 *
	 * @return array{round: int, teamwork: int|WP_Error|null} New round, and the new list ID, an error, or null without Teamwork.
	 */
	public static function start_next(): array {
		$next = self::current() + 1;
		update_option( self::OPTION, $next, false );
		$teamwork = null;
		if ( Teamwork::client() && Teamwork::settings()['project_id'] ) {
			$teamwork = Teamwork::create_round_list( $next );
		}
		return array(
			'round'    => $next,
			'teamwork' => $teamwork,
		);
	}

	/**
	 * Open / resolved counts per round.
	 *
	 * @return array<int, array{open: int, resolved: int}> Keyed by round, newest first.
	 */
	public static function summary(): array {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$rows = $wpdb->get_results( $wpdb->prepare( "SELECT round, SUM(status <> 'resolved') AS open_count, SUM(status = 'resolved') AS resolved_count FROM %i GROUP BY round", Items::table() ), ARRAY_A );
		$out  = array();
		foreach ( self::all() as $round ) {
			$out[ $round ] = array(
				'open'     => 0,
				'resolved' => 0,
			);
		}
		foreach ( (array) $rows as $row ) {
			$out[ (int) $row['round'] ] = array(
				'open'     => (int) $row['open_count'],
				'resolved' => (int) $row['resolved_count'],
			);
		}
		krsort( $out );
		return $out;
	}
}
