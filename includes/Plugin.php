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
		add_action( 'init', array( self::class, 'load_textdomain' ) );
		Install::maybe_upgrade();
		Rest::register();
		Frontend::register();
		Teamwork\Teamwork::register();
		if ( is_admin() ) {
			Admin\Admin::register();
		}
	}

	/**
	 * Loads translations from the languages/ directory.
	 */
	public static function load_textdomain(): void {
		load_plugin_textdomain( 'feedback-collector', false, dirname( plugin_basename( PLUGIN_FILE ) ) . '/languages' );
	}
}
