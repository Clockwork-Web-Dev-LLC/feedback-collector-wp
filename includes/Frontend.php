<?php
/**
 * Front-end overlay loader and admin bar toggle.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

use WP_Admin_Bar;

defined( 'ABSPATH' ) || exit;

/**
 * Loads the overlay only for reviewers, never for visitors.
 */
final class Frontend {

	/**
	 * Hooks.
	 */
	public static function register(): void {
		add_action( 'template_redirect', array( self::class, 'deep_link_login' ), 1 );
		add_action( 'wp_enqueue_scripts', array( self::class, 'enqueue' ) );
		add_action( 'wp_head', array( self::class, 'early_error_collector' ), 1 );
		add_action( 'admin_bar_menu', array( self::class, 'admin_bar' ), 90 );
	}

	/**
	 * Whether the overlay should load on this request.
	 */
	public static function should_load(): bool {
		if ( is_admin() || ! is_user_logged_in() || ! current_user_can( CAP ) ) {
			return false;
		}
		if ( is_customize_preview() || wp_is_json_request() || is_feed() || is_embed() ) {
			return false;
		}
		return ! self::in_builder();
	}

	/**
	 * Detects page-builder editor/preview frames, where the overlay would get in the way.
	 */
	public static function in_builder(): bool {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		$markers = array( 'elementor-preview', 'fl_builder', 'fl_builder_ui', 'et_fb', 'ct_builder', 'bricks', 'brizy-edit-iframe', 'vcv-editable', 'vc_editable' );
		foreach ( $markers as $marker ) {
			if ( isset( $_GET[ $marker ] ) ) {
				return true;
			}
		}
		// phpcs:enable
		return false;
	}

	/**
	 * A logged-out click on a deep link goes through wp-login and comes back.
	 */
	public static function deep_link_login(): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['fbc_item'] ) && ! is_user_logged_in() ) {
			auth_redirect();
		}
	}

	/**
	 * Enqueues the overlay bundle and its config.
	 */
	public static function enqueue(): void {
		if ( ! self::should_load() ) {
			return;
		}
		$file = FBC_DIR . 'dist/overlay.js';
		if ( ! is_readable( $file ) ) {
			return;
		}

		wp_enqueue_script(
			'fbc-overlay',
			FBC_URL . 'dist/overlay.js',
			array(),
			VERSION . '-' . filemtime( $file ),
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
		wp_add_inline_script( 'fbc-overlay', 'window.fbcConfig = ' . wp_json_encode( self::config() ) . ';', 'before' );
		// Attached here, during wp_enqueue_scripts, because by the time admin_bar_menu runs
		// the admin-bar stylesheet has already been printed and late inline CSS is dropped.
		wp_add_inline_style(
			'admin-bar',
			'#wpadminbar #wp-admin-bar-fbc-toggle .ab-icon:before{top:3px}#wpadminbar #wp-admin-bar-fbc-toggle.fbc-on>.ab-item{background:#2271b1;color:#fff}#wpadminbar .fbc-ab-count{display:inline-block;min-width:18px;padding:0 5px;border-radius:9px;background:#d63638;color:#fff;font-size:11px;line-height:18px;text-align:center}'
		);
	}

	/**
	 * Starts collecting JS errors before the deferred overlay bundle loads,
	 * so errors thrown during page load are attached to new feedback.
	 */
	public static function early_error_collector(): void {
		if ( ! self::should_load() ) {
			return;
		}
		wp_print_inline_script_tag(
			'(function(){if(window.__fbcErrors)return;var e=window.__fbcErrors=[];function p(m){e.push(String(m).slice(0,500));if(e.length>20)e.shift();}' .
			'addEventListener("error",function(v){if(v.message)p(v.message+(v.filename?" ("+v.filename+":"+v.lineno+")":""));});' .
			'addEventListener("unhandledrejection",function(v){var r=v.reason;p("Unhandled rejection: "+(r&&r.message?r.message:r));});})();',
			array( 'id' => 'fbc-early-errors' )
		);
	}

	/**
	 * Data passed to the overlay.
	 *
	 * @return array<string, mixed>
	 */
	public static function config(): array {
		$queried = get_queried_object();
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$open = isset( $_GET['fbc_item'] ) ? absint( $_GET['fbc_item'] ) : 0;
		$user = wp_get_current_user();

		return array(
			'restUrl'   => esc_url_raw( rest_url( Rest::NS ) ),
			'nonce'     => wp_create_nonce( 'wp_rest' ),
			'homePath'  => (string) wp_parse_url( home_url( '/' ), PHP_URL_PATH ),
			'pagePath'  => Items::normalize_path( isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/' ),
			'adminUrl'  => esc_url_raw( admin_url( 'admin.php?page=feedback-collector' ) ),
			'user'      => array(
				'id'      => (int) $user->ID,
				'name'    => $user->display_name,
				'isAdmin' => current_user_can( 'manage_options' ),
			),
			'assignees' => Assignees::options() + array( 'me' => Assignees::me() ),
			'round'     => Rounds::current(),
			'assetsUrl' => FBC_URL . 'dist/',
			'version'   => VERSION,
			'shots'     => Screenshots::enabled(),
			'labels'    => Items::labels(),
			'page'      => array(
				'postId'   => $queried instanceof \WP_Post ? (int) $queried->ID : 0,
				'postType' => $queried instanceof \WP_Post ? $queried->post_type : '',
				'theme'    => get_stylesheet(),
			),
			'brand'     => Branding::overlay(),
			'openItem'  => $open,
		);
	}

	/**
	 * Adds the Feedback toggle to the admin bar.
	 *
	 * @param WP_Admin_Bar $bar Admin bar.
	 */
	public static function admin_bar( WP_Admin_Bar $bar ): void {
		if ( ! self::should_load() ) {
			return;
		}
		$open = Items::count_status( 'open' );
		$bar->add_node(
			array(
				'id'    => 'fbc-toggle',
				'title' => '<span class="ab-icon dashicons dashicons-format-chat" aria-hidden="true"></span><span class="ab-label">' . esc_html( Branding::text( 'menu_label' ) ) . '</span>' . ( $open ? ' <span class="fbc-ab-count">' . (int) $open . '</span>' : '' ),
				'href'  => '#fbc-toggle',
				'meta'  => array( 'title' => sprintf( /* translators: %s: plugin name */ __( 'Toggle %s (Alt+Shift+F)', 'feedback-collector' ), Branding::text( 'name' ) ) ),
			)
		);
		$bar->add_node(
			array(
				'parent' => 'fbc-toggle',
				'id'     => 'fbc-all',
				'title'  => esc_html__( 'All feedback', 'feedback-collector' ),
				'href'   => admin_url( 'admin.php?page=feedback-collector' ),
			)
		);
	}
}
