<?php
/**
 * Admin chrome shared by every screen, in the Clockwork Companion style.
 *
 * @package FeedbackCollector\Admin
 */

namespace FeedbackCollector\Admin;

use FeedbackCollector\Branding;
use FeedbackCollector\Items;
use const FeedbackCollector\CAP;
use const FeedbackCollector\VERSION;

defined( 'ABSPATH' ) || exit;

/**
 * Header band + tab strip + body.
 */
final class Layout {

	/**
	 * Tabs the current user can see.
	 *
	 * @return array<int, array{slug: string, label: string, page: string, count?: int}>
	 */
	public static function tabs(): array {
		$tabs = array(
			array(
				'slug'  => 'feedback',
				'label' => __( 'Feedback', 'feedback-collector' ),
				'page'  => Admin::SLUG,
				'count' => Items::count_status( 'open' ),
			),
		);
		if ( current_user_can( 'manage_options' ) ) {
			$tabs[] = array(
				'slug'  => 'settings',
				'label' => __( 'Settings', 'feedback-collector' ),
				'page'  => Admin::SLUG . '-settings',
			);
			$tabs[] = array(
				'slug'  => 'branding',
				'label' => __( 'Branding', 'feedback-collector' ),
				'page'  => Admin::SLUG . '-branding',
			);
		}
		return $tabs;
	}

	/**
	 * Renders the chrome around a body callback.
	 *
	 * @param string   $active  Active tab slug.
	 * @param string   $title   Page title.
	 * @param string   $subhead Optional subheading.
	 * @param callable $body    Echoes the page content.
	 * @param callable $actions Optional: echoes buttons beside the title.
	 */
	public static function render( string $active, string $title, string $subhead, callable $body, ?callable $actions = null ): void {
		$logo  = Branding::logo_url();
		$label = Branding::text( 'product_label' );
		if ( '' === $label ) {
			$label = Branding::text( 'name' );
		}
		?>
		<div class="wrap fbc-admin" style="<?php echo esc_attr( Branding::css_vars() ); ?>">
			<header class="fbc-admin__header">
				<div class="fbc-admin__brand<?php echo '' === $logo ? ' fbc-admin__brand--text-only' : ''; ?>">
					<?php if ( '' !== $logo ) : ?>
						<img src="<?php echo esc_url( $logo ); ?>" alt="<?php echo esc_attr( Branding::text( 'name' ) ); ?>" />
					<?php endif; ?>
					<span class="fbc-admin__brand-text"><?php echo esc_html( $label ); ?></span>
				</div>
				<span class="fbc-admin__version">v<?php echo esc_html( VERSION ); ?></span>
			</header>

			<nav class="fbc-admin__tabs" aria-label="<?php echo esc_attr( Branding::text( 'name' ) ); ?>">
				<?php foreach ( self::tabs() as $tab ) : ?>
					<a class="fbc-admin__tab<?php echo $tab['slug'] === $active ? ' is-active' : ''; ?>" href="<?php echo esc_url( admin_url( 'admin.php?page=' . $tab['page'] ) ); ?>"<?php echo $tab['slug'] === $active ? ' aria-current="page"' : ''; ?>>
						<?php echo esc_html( $tab['label'] ); ?>
						<?php if ( ! empty( $tab['count'] ) ) : ?>
							<span class="fbc-count"><?php echo (int) $tab['count']; ?></span>
						<?php endif; ?>
					</a>
				<?php endforeach; ?>
			</nav>

			<div class="fbc-admin__body">
				<div class="fbc-admin__page-header">
					<div>
						<h1><?php echo esc_html( $title ); ?></h1>
						<?php if ( '' !== $subhead ) : ?>
							<p><?php echo esc_html( $subhead ); ?></p>
						<?php endif; ?>
					</div>
					<?php if ( $actions ) : ?>
						<div class="fbc-admin__page-actions"><?php $actions(); ?></div>
					<?php endif; ?>
				</div>
				<hr class="wp-header-end">
				<?php $body(); ?>
			</div>
			<?php if ( Branding::get()['show_credit'] && ! Branding::is_default() ) : ?>
				<div class="fbc-admin__credit">
					<?php
					printf(
						/* translators: %s: link to Clockwork */
						esc_html__( 'Powered by %s', 'feedback-collector' ),
						'<a href="https://clockworkwd.com" target="_blank" rel="noopener">Clockwork Feedback Collector</a>'
					);
					?>
				</div>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Opens a card.
	 *
	 * @param string $title   Card title (uppercase header), or '' for no header.
	 * @param bool   $tight   No body padding (tables).
	 * @param string $actions Optional pre-escaped HTML for the header's right side.
	 */
	public static function card_open( string $title = '', bool $tight = false, string $actions = '' ): void {
		echo '<section class="fbc-card">';
		if ( '' !== $title ) {
			echo '<div class="fbc-card__head"><h2>' . esc_html( $title ) . '</h2>' . $actions . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $actions is built from escaped parts by callers.
		}
		echo '<div class="fbc-card__body' . ( $tight ? ' fbc-card__body--tight' : '' ) . '">';
	}

	/**
	 * Closes a card.
	 */
	public static function card_close(): void {
		echo '</div></section>';
	}

	/**
	 * A type or status pill.
	 *
	 * @param string $variant Slug used for the color (bug, resolved, …).
	 * @param string $label   Visible text.
	 */
	public static function pill( string $variant, string $label ): string {
		return sprintf( '<span class="fbc-pill fbc-pill--%1$s"><span class="fbc-pill__dot" aria-hidden="true"></span>%2$s</span>', esc_attr( $variant ), esc_html( $label ) );
	}

	/**
	 * Enqueues the chrome stylesheet on our screens and keeps Companion's out.
	 *
	 * Companion loads its admin.css on any screen whose hook contains "clockwork",
	 * and that file hides every .notice and sets a :root palette. A white-label menu
	 * label (or the default brand) can put "clockwork" in our hook names, so remove it.
	 *
	 * @param string $hook Screen hook.
	 */
	public static function enqueue( string $hook ): void {
		if ( ! self::is_our_screen( $hook ) ) {
			return;
		}
		wp_dequeue_style( 'clockwork-companion-admin' );
		wp_enqueue_style( 'fbc-admin', plugins_url( 'assets/admin.css', \FeedbackCollector\PLUGIN_FILE ), array(), VERSION . '-' . filemtime( FBC_DIR . 'assets/admin.css' ) );
		if ( str_contains( $hook, Admin::SLUG . '-branding' ) ) {
			wp_enqueue_media();
			wp_enqueue_script( 'fbc-admin-branding', plugins_url( 'assets/admin-branding.js', \FeedbackCollector\PLUGIN_FILE ), array(), VERSION . '-' . filemtime( FBC_DIR . 'assets/admin-branding.js' ), true );
		}
	}

	/**
	 * Whether a screen hook belongs to this plugin.
	 *
	 * @param string $hook Screen hook.
	 */
	public static function is_our_screen( string $hook ): bool {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : '';
		return '' !== $page && str_starts_with( $page, Admin::SLUG ) && '' !== $hook;
	}
}
