<?php
/**
 * Uninstall: data is removed only when the site opted in (Settings → Uninstall).
 *
 * Settings → "Remove all data" does the same cleanup on demand, then deactivates the plugin.
 *
 * @package FeedbackCollector
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

if ( ! get_option( 'fbc_delete_on_uninstall' ) ) {
	return;
}

require_once __DIR__ . '/includes/Cleanup.php';
FeedbackCollector\Cleanup::purge();
