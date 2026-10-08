<?php
/**
 * White-label branding: one source for every name, logo and color the plugin shows.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Resolves branding from defaults (Clockwork), the saved option, and the
 * `fbcol_branding` filter, in that order.
 */
final class Branding {

	public const OPTION = 'fbcol_branding';

	/**
	 * What every install shows until custom branding is switched on: the plugin's own plain
	 * name, WordPress admin colors, no logo and no credit.
	 *
	 * @return array<string, string|bool>
	 */
	public static function neutral(): array {
		return array(
			'name'          => 'Feedback Collector',
			'menu_label'    => 'Feedback',
			'product_label' => 'Feedback Collector',
			'author'        => '',
			'author_uri'    => '',
			'logo_url'      => '',
			'primary'       => '#2271B1',
			'dark'          => '#1D2327',
			'accent'        => '#72AEE6',
			'show_credit'   => false,
			'enabled'       => false,
		);
	}

	/**
	 * The starting values of the Branding form once custom branding is switched on:
	 * Clockwork's look (the palette matches Clockwork Companion). Off by default.
	 *
	 * @return array<string, string|bool>
	 */
	public static function defaults(): array {
		$default_logo = '';
		if ( defined( 'PLUGIN_FILE' ) && function_exists( 'plugins_url' ) ) {
			$default_logo = plugins_url( 'assets/clockwork-logo.png', PLUGIN_FILE );
		} elseif ( defined( 'FBCOL_URL' ) ) {
			$default_logo = FBCOL_URL . 'assets/clockwork-logo.png';
		}

		return array(
			'name'          => 'Clockwork Feedback Collector',
			'menu_label'    => 'Feedback',
			'product_label' => 'Feedback Collector',
			'author'        => 'Clockwork Web Dev',
			'author_uri'    => 'https://clockworkwd.com',
			'logo_url'      => $default_logo,
			'primary'       => '#6953C4',
			'dark'          => '#2D2062',
			'accent'        => '#7EFF83',
			'show_credit'   => false,
			'enabled'       => false,
		);
	}

	/**
	 * What the Branding form holds: saved values over the defaults, whether or not
	 * custom branding is switched on (switching it off keeps them for next time).
	 *
	 * @return array<string, string|bool>
	 */
	public static function saved(): array {
		$saved = (array) get_option( self::OPTION, array() );
		return wp_parse_args( array_filter( $saved, static fn( $v ) => '' !== $v && null !== $v ), self::defaults() );
	}

	/**
	 * True when custom branding is switched on.
	 */
	public static function enabled(): bool {
		return ! empty( self::saved()['enabled'] );
	}

	/**
	 * Effective branding.
	 *
	 * @return array<string, string|bool>
	 */
	public static function get(): array {
		static $cache = null;
		if ( null !== $cache ) {
			return $cache;
		}
		// Custom branding off (the default): plain "Feedback Collector".
		$b = self::enabled() ? self::saved() : self::neutral();
		$b = (array) apply_filters( 'fbcol_branding', $b );
		$cache = $b;
		return $b;
	}

	/**
	 * One branding value as a string.
	 *
	 * @param string $key Field.
	 */
	public static function text( string $key ): string {
		return (string) ( self::get()[ $key ] ?? '' );
	}

	/**
	 * True while custom branding is on with Clockwork's look (not white-labeled further).
	 */
	public static function is_default(): bool {
		if ( ! self::enabled() ) {
			return false;
		}
		$d = self::defaults();
		$b = self::saved(); // not get(): that is cached per request
		return $b['name'] === $d['name'] && ( $b['logo_url'] === $d['logo_url'] || '' === $b['logo_url'] );
	}

	/**
	 * The active logo URL ('' without custom branding; the bundled Clockwork logo is its starting value).
	 */
	public static function logo_url(): string {
		return self::text( 'logo_url' );
	}

	/**
	 * Readable text color (#fff or near-black) for a background, by WCAG relative luminance.
	 *
	 * @param string $hex Background color.
	 */
	public static function text_on( string $hex ): string {
		$l = self::luminance( $hex );
		// Contrast against white vs. near-black (#212025, L ≈ 0.015); pick the larger.
		return ( 1.05 / ( $l + 0.05 ) ) >= ( ( $l + 0.05 ) / 0.065 ) ? '#ffffff' : '#212025';
	}

	/**
	 * WCAG relative luminance of a hex color.
	 *
	 * @param string $hex Color.
	 */
	private static function luminance( string $hex ): float {
		$hex = ltrim( $hex, '#' );
		if ( 3 === strlen( $hex ) ) {
			$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
		}
		if ( 6 !== strlen( $hex ) || ! ctype_xdigit( $hex ) ) {
			return 0.0;
		}
		$lin = static function ( int $c ): float {
			$c /= 255;
			return $c <= 0.03928 ? $c / 12.92 : ( ( $c + 0.055 ) / 1.055 ) ** 2.4;
		};
		return 0.2126 * $lin( (int) hexdec( substr( $hex, 0, 2 ) ) ) + 0.7152 * $lin( (int) hexdec( substr( $hex, 2, 2 ) ) ) + 0.0722 * $lin( (int) hexdec( substr( $hex, 4, 2 ) ) );
	}

	/**
	 * The color darkened just enough to read as text on white (WCAG AA, 4.5:1),
	 * so a light brand color like yellow still gives legible links and tabs.
	 *
	 * @param string $hex Brand color.
	 */
	public static function ink_on_white( string $hex ): string {
		$hex = ltrim( $hex, '#' );
		if ( 3 === strlen( $hex ) ) {
			$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
		}
		if ( 6 !== strlen( $hex ) || ! ctype_xdigit( $hex ) ) {
			return '#212025';
		}
		$rgb = array( (int) hexdec( substr( $hex, 0, 2 ) ), (int) hexdec( substr( $hex, 2, 2 ) ), (int) hexdec( substr( $hex, 4, 2 ) ) );
		for ( $step = 0; $step <= 20; $step++ ) {
			$candidate = sprintf( '#%02x%02x%02x', ...array_map( static fn( int $c ): int => (int) round( $c * ( 1 - $step * 0.05 ) ), $rgb ) );
			if ( 1.05 / ( self::luminance( $candidate ) + 0.05 ) >= 4.5 ) {
				return $candidate;
			}
		}
		return '#212025';
	}

	/**
	 * CSS custom properties for a wrapper's inline style (never :root, so nothing collides).
	 */
	public static function css_vars(): string {
		$b = self::get();
		return sprintf(
			'--fbc-primary:%1$s;--fbc-on-primary:%2$s;--fbc-dark:%3$s;--fbc-on-dark:%4$s;--fbc-accent:%5$s;--fbc-on-accent:%6$s;--fbc-ink:%7$s;',
			esc_attr( (string) $b['primary'] ),
			esc_attr( self::text_on( (string) $b['primary'] ) ),
			esc_attr( (string) $b['dark'] ),
			esc_attr( self::text_on( (string) $b['dark'] ) ),
			esc_attr( (string) $b['accent'] ),
			esc_attr( self::text_on( (string) $b['accent'] ) ),
			esc_attr( self::ink_on_white( (string) $b['primary'] ) )
		);
	}

	/**
	 * Branding for the front-end overlay.
	 *
	 * @return array<string, string>
	 */
	public static function overlay(): array {
		$b = self::get();
		return array(
			'name'      => (string) $b['name'],
			'label'     => '' !== (string) $b['product_label'] ? (string) $b['product_label'] : (string) $b['menu_label'],
			'logo'      => self::logo_url(),
			'primary'   => (string) $b['primary'],
			'onPrimary' => self::text_on( (string) $b['primary'] ),
			'dark'      => (string) $b['dark'],
			'onDark'    => self::text_on( (string) $b['dark'] ),
			'accent'    => (string) $b['accent'],
			'ink'       => self::ink_on_white( (string) $b['primary'] ),
		);
	}

	/**
	 * Sidebar menu icon: the Clockwork sparkle with Clockwork branding on, a plain speech bubble otherwise.
	 */
	public static function menu_icon(): string {
		if ( ! self::is_default() ) {
			return 'dashicons-format-chat';
		}
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">'
			. '<path d="M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" opacity=".35"/>'
			. '<path d="M12 4.5l1.3 4 4 1.3-4 1.3-1.3 4-1.3-4-4-1.3 4-1.3z"/>'
			. '</svg>';
		return 'data:image/svg+xml;base64,' . base64_encode( $svg ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
	}

	/**
	 * Rewrites this plugin's row on the Plugins screen with the white-label name and author.
	 *
	 * @param array<string, array<string, string>> $plugins All plugins.
	 * @return array<string, array<string, string>>
	 */
	public static function plugins_list( array $plugins ): array {
		$basename = plugin_basename( PLUGIN_FILE );
		if ( ! isset( $plugins[ $basename ] ) || ! self::enabled() ) {
			return $plugins; // Not white-labeled: the plugin header as written.
		}
		$b = self::get();
		foreach ( array( 'Name', 'Title' ) as $field ) {
			$plugins[ $basename ][ $field ] = (string) $b['name'];
		}
		$plugins[ $basename ]['Author']     = (string) $b['author'];
		$plugins[ $basename ]['AuthorName'] = (string) $b['author'];
		$plugins[ $basename ]['AuthorURI']  = (string) $b['author_uri'];
		$plugins[ $basename ]['PluginURI']  = (string) $b['author_uri'];
		return $plugins;
	}

	/**
	 * Validates a submitted branding form.
	 *
	 * @param array<string, mixed> $input Raw input (unslashed).
	 * @return array<string, string|bool>
	 */
	public static function sanitize( array $input ): array {
		$d   = self::defaults();
		$out = array();
		foreach ( array( 'name', 'menu_label', 'product_label', 'author' ) as $field ) {
			$out[ $field ] = mb_substr( sanitize_text_field( (string) ( $input[ $field ] ?? '' ) ), 0, 80 );
		}
		$out['author_uri'] = esc_url_raw( (string) ( $input['author_uri'] ?? '' ) );
		$out['logo_url']   = esc_url_raw( (string) ( $input['logo_url'] ?? '' ) );
		foreach ( array( 'primary', 'dark', 'accent' ) as $field ) {
			$out[ $field ] = (string) ( sanitize_hex_color( (string) ( $input[ $field ] ?? '' ) ) ?? '' );
			if ( '' === $out[ $field ] ) {
				$out[ $field ] = (string) $d[ $field ];
			}
		}
		$out['show_credit'] = ! empty( $input['show_credit'] );
		$out['enabled']     = ! empty( $input['enabled'] );
		return $out;
	}
}
