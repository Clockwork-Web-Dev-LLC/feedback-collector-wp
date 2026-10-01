<?php
/**
 * Plugin Name:       Clockwork Feedback Collector
 * Description:       Internal QA feedback for staging sites. Right-click any element to log a bug, tweak, change request or comment, pinned to the page, with optional push to Teamwork.
 * Version:           0.2.0
 * Requires at least: 6.5
 * Requires PHP:      8.1
 * Author:            Clockwork Web Dev
 * Author URI:        https://clockworkwd.com
 * License:           GPL-2.0-or-later
 * Text Domain:       feedback-collector
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

const VERSION     = '0.2.0';
const DB_VERSION  = '6';
const CAP         = 'fbc_review';
const PLUGIN_FILE = __FILE__;

define( 'FBC_DIR', plugin_dir_path( __FILE__ ) );
define( 'FBC_URL', plugin_dir_url( __FILE__ ) );

spl_autoload_register(
	static function ( string $class_name ): void {
		if ( ! str_starts_with( $class_name, __NAMESPACE__ . '\\' ) ) {
			return;
		}
		$relative = substr( $class_name, strlen( __NAMESPACE__ ) + 1 );
		$path     = FBC_DIR . 'includes/' . str_replace( '\\', '/', $relative ) . '.php';
		if ( is_readable( $path ) ) {
			require $path;
		}
	}
);

register_activation_hook( __FILE__, array( Install::class, 'activate' ) );
register_deactivation_hook( __FILE__, array( Teamwork\Teamwork::class, 'unschedule' ) );

add_action( 'plugins_loaded', array( Plugin::class, 'boot' ) );
