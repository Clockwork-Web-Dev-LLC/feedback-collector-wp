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
		Install::maybe_upgrade();
		Rest::register();
		Frontend::register();
		Teamwork\Teamwork::register();
		if ( is_admin() ) {
			Admin\Admin::register();
		}
	}
}
