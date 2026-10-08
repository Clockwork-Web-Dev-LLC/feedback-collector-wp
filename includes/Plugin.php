<?php
/**
 * Bootstrap.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Wires the plugin's components together.
 */
final class Plugin {

	/**
	 * Runs on plugins_loaded.
	 */
	public static function boot(): void {
		// After Teamwork registers its cron intervals, so a migration can reschedule its jobs.
		Teamwork\Teamwork::register();
		Install::maybe_upgrade();
		Rest::register();
		Frontend::register();
		if ( is_admin() ) {
			Admin\Admin::register();
		}
		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			Cli\FeedbackCommand::register();
		}
	}
}
