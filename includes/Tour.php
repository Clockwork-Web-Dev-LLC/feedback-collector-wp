<?php
/**
 * The first-run walkthrough of the Feedback toolbar.
 *
 * Shown once per browser the first time someone opens Feedback mode, guests and logged-in
 * reviewers alike. It covers leaving feedback (not the admin list), and the toolbar's ? button
 * replays it. On by default in password mode, where most people are first-timers; a setting
 * turns it on or off for any site.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Tour setting.
 */
final class Tour {

	public const OPTION = 'fbcol_tour';

	/**
	 * Whether the tour runs: the saved choice, or (never saved) on exactly when password mode is on.
	 */
	public static function enabled(): bool {
		$saved = get_option( self::OPTION, null );
		if ( null === $saved || false === $saved || '' === $saved ) {
			return GuestMode::enabled();
		}
		return '1' === (string) $saved;
	}
}
