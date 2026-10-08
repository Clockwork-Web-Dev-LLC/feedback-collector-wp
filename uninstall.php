<?php
/**
 * Uninstall: screen recordings are always removed; everything else only when the site opted in
 * (Settings → Uninstall).
 *
 * Settings → "Remove all data" does the same cleanup on demand, then deactivates the plugin.
 *
 * @package FeedbackCollector
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

require_once __DIR__ . '/includes/Cleanup.php';

// Screen recordings are always deleted: they are large, and pushed tasks keep a copy in Teamwork.
FeedbackCollector\Cleanup::purge_videos();

if ( ! get_option( 'fbcol_delete_on_uninstall' ) ) {
	return;
}

FeedbackCollector\Cleanup::purge();
