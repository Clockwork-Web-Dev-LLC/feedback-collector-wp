<?php
/**
 * Guest mode: one shared password for the whole site, and feedback from logged-out visitors.
 *
 * Off by default. When it is on (Feedback → Settings → Guest access) and a password is set:
 *
 * - Logged-out visitors see a password screen instead of the site. The right password sets a
 *   signed cookie (wp_fbcol_guest) that unlocks the front end for {@see self::DAYS} days and
 *   gives that browser a random guest ID.
 * - Unlocked guests get the Feedback overlay. Their first item asks for their name, which the
 *   browser remembers (cookie fbcol_guest_name) and sends with each item and reply.
 * - Guests are "submit-only": they add feedback and see, reply to and delete only their own
 *   items (matched by guest ID). They can't triage (status, priority, assignee, due date).
 * - Logged-in users never see the password screen, and their feedback works exactly as before.
 *
 * wp-admin, wp-login.php, admin-ajax, cron, REST and XML-RPC are not gated (they never reach
 * template_redirect), so team logins, integrations and the plugin's own API keep working.
 *
 * @package FeedbackCollector
 */

namespace FeedbackCollector;

defined( 'ABSPATH' ) || exit;

/**
 * Site-wide password gate and logged-out reviewer identity.
 */
final class GuestMode {

	public const OPT_ENABLED = 'fbcol_guest_mode';
	public const OPT_HASH    = 'fbcol_guest_pass_hash';
	public const OPT_KEY     = 'fbcol_guest_key';

	/** Starts with "wp" so page caches (Batcache and friends) never serve or store cached pages for it. */
	public const COOKIE = 'wp_fbcol_guest';
	/** Set by the overlay in the browser; read by nothing on the server except tests. */
	public const NAME_COOKIE = 'fbcol_guest_name';

	/** How long an unlock lasts. Each visit in the second half of that renews it. */
	public const DAYS = 30;
	/** Wrong passwords allowed per IP per window before the form locks for the rest of it. */
	public const MAX_ATTEMPTS = 10;
	public const WINDOW       = 15 * MINUTE_IN_SECONDS;
	public const NAME_MAX     = 60;
	public const MIN_PASSWORD = 4;

	/** Field names on the password form. */
	private const FIELD = 'fbcol_guest_password';

	/**
	 * Guest ID for this request once known (or issued during it).
	 *
	 * @var string|null
	 */
	private static ?string $issued = null;

	/**
	 * Hooks.
	 */
	public static function register(): void {
		add_action( 'template_redirect', array( self::class, 'gate' ), 0 );
	}

	// ------------------------------------------------------------------ settings

	/**
	 * Guest mode is switched on AND has a password. Without one it stays off.
	 */
	public static function enabled(): bool {
		return '1' === (string) get_option( self::OPT_ENABLED, '0' ) && self::has_password();
	}

	/**
	 * Whether a password has been set.
	 */
	public static function has_password(): bool {
		return '' !== (string) get_option( self::OPT_HASH, '' );
	}

	/**
	 * Stores a new password (hashed) and signs every guest out, since their cookies were
	 * signed with the old key.
	 *
	 * @param string $password Plain password.
	 */
	public static function set_password( string $password ): void {
		update_option( self::OPT_HASH, wp_hash_password( $password ), false );
		self::rotate_key();
	}

	/**
	 * Invalidates every guest cookie (everyone has to enter the password again).
	 */
	public static function rotate_key(): void {
		update_option( self::OPT_KEY, wp_generate_password( 64, false, false ), false );
	}

	/**
	 * Saves the on/off switch.
	 *
	 * @param bool $on On.
	 */
	public static function set_enabled( bool $on ): void {
		update_option( self::OPT_ENABLED, $on ? '1' : '0', false );
	}

	/**
	 * Whether a password is right.
	 *
	 * @param string $password Plain password.
	 */
	public static function check_password( string $password ): bool {
		$hash = (string) get_option( self::OPT_HASH, '' );
		return '' !== $hash && '' !== $password && wp_check_password( $password, $hash );
	}

	/**
	 * Secret the guest cookies are signed with (created on first use).
	 */
	private static function key(): string {
		$key = (string) get_option( self::OPT_KEY, '' );
		if ( '' === $key ) {
			self::rotate_key();
			$key = (string) get_option( self::OPT_KEY, '' );
		}
		return $key . wp_salt( 'auth' );
	}

	// ------------------------------------------------------------------ identity

	/**
	 * The unlocked guest's ID for this request, or null: guest mode off, a logged-in user,
	 * or no valid cookie. Logged-in users are never guests, so their behavior is unchanged.
	 */
	public static function guest_id(): ?string {
		if ( ! self::enabled() || is_user_logged_in() ) {
			return null;
		}
		if ( null !== self::$issued ) {
			return self::$issued;
		}
		$parsed = self::parse( (string) ( $_COOKIE[ self::COOKIE ] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- verified by HMAC in parse().
		return $parsed ? $parsed['id'] : null;
	}

	/**
	 * True for an unlocked, logged-out guest.
	 */
	public static function active(): bool {
		return null !== self::guest_id();
	}

	/**
	 * Builds a cookie value.
	 *
	 * @param string $id      Guest ID (32 hex).
	 * @param int    $expires Unix time.
	 */
	public static function sign( string $id, int $expires ): string {
		$payload = 'v1|' . $id . '|' . $expires;
		return 'v1.' . $id . '.' . $expires . '.' . hash_hmac( 'sha256', $payload, self::key() );
	}

	/**
	 * Verifies a cookie value.
	 *
	 * @param string $value Raw cookie.
	 * @return array{id: string, expires: int}|null
	 */
	public static function parse( string $value ): ?array {
		if ( ! preg_match( '/^v1\.([a-f0-9]{32})\.(\d{1,12})\.([a-f0-9]{64})$/', $value, $m ) ) {
			return null;
		}
		$expires = (int) $m[2];
		if ( $expires < time() ) {
			return null;
		}
		if ( ! hash_equals( self::sign( $m[1], $expires ), $value ) ) {
			return null;
		}
		return array(
			'id'      => $m[1],
			'expires' => $expires,
		);
	}

	/**
	 * Unlocks this browser: sets the signed cookie and returns the guest ID.
	 *
	 * @param string|null $id Keep this guest ID (renewal); null issues a new one.
	 */
	public static function issue( ?string $id = null ): string {
		$id      = $id && preg_match( '/^[a-f0-9]{32}$/', $id ) ? $id : bin2hex( random_bytes( 16 ) );
		$expires = time() + self::DAYS * DAY_IN_SECONDS;
		$value   = self::sign( $id, $expires );
		$_COOKIE[ self::COOKIE ] = $value;
		self::$issued            = $id;
		if ( ! headers_sent() ) {
			setcookie(
				self::COOKIE,
				$value,
				array(
					'expires'  => $expires,
					'path'     => COOKIEPATH ? COOKIEPATH : '/',
					'domain'   => COOKIE_DOMAIN ? COOKIE_DOMAIN : '',
					'secure'   => is_ssl(),
					'httponly' => true,
					'samesite' => 'Lax',
				)
			);
		}
		return $id;
	}

	/**
	 * Forgets anything issued during this request (tests switch between visitors).
	 */
	public static function reset_request(): void {
		self::$issued = null;
	}

	/**
	 * A guest's name as submitted: plain text, trimmed, at most {@see self::NAME_MAX} characters.
	 *
	 * @param mixed $raw Submitted value.
	 */
	public static function clean_name( mixed $raw ): string {
		if ( ! is_scalar( $raw ) ) {
			return '';
		}
		$name = trim( preg_replace( '/\s+/u', ' ', sanitize_text_field( (string) $raw ) ) ?? '' );
		return mb_substr( $name, 0, self::NAME_MAX );
	}

	/**
	 * Whether this REST request comes from an unlocked guest with a valid REST nonce.
	 *
	 * WordPress only checks the nonce for logged-in cookies, so it is required here explicitly:
	 * with the SameSite=Lax cookie it keeps other sites from posting feedback as a guest.
	 */
	public static function rest_allowed(): bool {
		if ( ! self::active() ) {
			return false;
		}
		$nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_WP_NONCE'] ) ) : '';
		return '' !== $nonce && false !== wp_verify_nonce( $nonce, 'wp_rest' );
	}

	/**
	 * Whether an item was filed by the current guest.
	 *
	 * @param array<string, mixed> $item Item.
	 */
	public static function owns( array $item ): bool {
		$id = self::guest_id();
		return null !== $id && '' !== (string) ( $item['guest_id'] ?? '' ) && hash_equals( (string) $item['guest_id'], $id );
	}

	// ------------------------------------------------------------------ the gate

	/**
	 * Front-end requests from logged-out visitors: unlocked guests pass, everyone else gets
	 * the password screen (template_redirect never runs for wp-admin, wp-login, REST or AJAX).
	 */
	public static function gate(): void {
		if ( ! self::enabled() || is_user_logged_in() || is_robots() ) {
			return;
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing -- a shared-password form for logged-out visitors; rate limited instead.
		if ( 'POST' === ( $_SERVER['REQUEST_METHOD'] ?? '' ) && isset( $_POST[ self::FIELD ] ) ) {
			self::handle_unlock();
			return; // Only reached in tests: handle_unlock() exits.
		}

		$parsed = self::parse( (string) ( $_COOKIE[ self::COOKIE ] ?? '' ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- verified by HMAC.
		if ( $parsed ) {
			// Sliding expiry: a guest who keeps coming back stays unlocked, with the same ID.
			if ( $parsed['expires'] - time() < ( self::DAYS * DAY_IN_SECONDS ) / 2 ) {
				self::issue( $parsed['id'] );
			}
			self::no_cache();
			return;
		}

		self::render_form( '' );
	}

	/**
	 * Checks a submitted password: unlock and reload the page, or show the form again.
	 */
	private static function handle_unlock(): void {
		$bucket = 'fbcol_guest_try_' . md5( self::client_ip() );
		$tries  = (int) get_transient( $bucket );
		if ( $tries >= self::MAX_ATTEMPTS ) {
			self::render_form( __( 'Too many attempts. Please wait a few minutes and try again.', 'feedback-collector' ), 429 );
		}
		// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- passwords are compared raw, never stored or echoed.
		$password = is_string( $_POST[ self::FIELD ] ?? null ) ? wp_unslash( $_POST[ self::FIELD ] ) : '';
		if ( ! self::check_password( $password ) ) {
			set_transient( $bucket, $tries + 1, self::WINDOW );
			self::render_form( __( 'That password isn’t right. Please try again.', 'feedback-collector' ) );
		}
		delete_transient( $bucket );
		self::issue();
		self::no_cache();
		// Back to the same page with a GET, so a reload doesn't resend the password.
		$uri = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/';
		wp_safe_redirect( wp_validate_redirect( $uri, home_url( '/' ) ), 303 );
		exit;
	}

	/**
	 * The visitor's IP for rate limiting only (never stored as-is).
	 */
	private static function client_ip(): string {
		return isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
	}

	/**
	 * Keeps page caches (and proxies) from storing a gated or unlocked page.
	 */
	private static function no_cache(): void {
		if ( function_exists( 'batcache_cancel' ) ) {
			batcache_cancel();
		}
		if ( ! headers_sent() ) {
			nocache_headers();
			header( 'X-Robots-Tag: noindex, nofollow', true );
		}
	}

	/**
	 * Prints the password screen and stops.
	 *
	 * @param string $error  Message for a failed attempt.
	 * @param int    $status HTTP status.
	 */
	private static function render_form( string $error, int $status = 401 ): void {
		self::no_cache();
		if ( ! headers_sent() ) {
			status_header( $status );
			header( 'Content-Type: text/html; charset=' . get_bloginfo( 'charset' ) );
		}
		$uri   = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '/';
		$login = wp_login_url( home_url( $uri ) );
		$brand = Branding::get();
		$logo  = (string) ( $brand['logo_url'] ?? '' );
		$color = sanitize_hex_color( (string) ( $brand['primary'] ?? '' ) ) ?: '#2271b1';

		echo '<!doctype html><html ' . get_language_attributes() . '><head><meta charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- core-escaped attributes.
		echo '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">';
		echo '<title>' . esc_html( get_bloginfo( 'name' ) ) . '</title>';
		echo '<style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f3f4f6;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1f2328;padding:16px}'
			. 'main{width:100%;max-width:380px;background:#fff;border-radius:14px;padding:32px 28px;box-shadow:0 10px 30px rgba(0,0,0,.08)}'
			. 'h1{font-size:20px;margin:0 0 6px}p{margin:0 0 18px;color:#57606a;font-size:15px}.logo{max-height:40px;max-width:180px;margin-bottom:18px}'
			. 'label{display:block;font-weight:600;font-size:14px;margin-bottom:6px}input{width:100%;font:inherit;padding:11px 12px;border-radius:8px;border:0;background:#eef0f3;outline-offset:2px}'
			. 'button{width:100%;margin-top:14px;font:inherit;font-weight:600;padding:11px;border:0;border-radius:8px;color:#fff;cursor:pointer;background:' . esc_attr( $color ) . '}'
			. '.err{background:#fde7e9;color:#8a1c24;padding:10px 12px;border-radius:8px;font-size:14px;margin-bottom:14px}.team{display:block;text-align:center;margin-top:18px;font-size:13px;color:#57606a}</style></head><body><main>';
		if ( '' !== $logo ) {
			echo '<img class="logo" src="' . esc_url( $logo ) . '" alt="">';
		}
		echo '<h1>' . esc_html( get_bloginfo( 'name' ) ) . '</h1>';
		echo '<p>' . esc_html__( 'This review site is password protected. Enter the password you were given to view it and leave feedback.', 'feedback-collector' ) . '</p>';
		echo '<form method="post" action="' . esc_url( $uri ) . '">';
		if ( '' !== $error ) {
			echo '<div class="err" role="alert">' . esc_html( $error ) . '</div>';
		}
		echo '<label for="fbcol-guest-pass">' . esc_html__( 'Password', 'feedback-collector' ) . '</label>';
		echo '<input id="fbcol-guest-pass" type="password" name="' . esc_attr( self::FIELD ) . '" autocomplete="current-password" required autofocus>';
		echo '<button type="submit">' . esc_html__( 'Enter site', 'feedback-collector' ) . '</button></form>';
		echo '<a class="team" href="' . esc_url( $login ) . '">' . esc_html__( 'Team member? Log in', 'feedback-collector' ) . '</a>';
		echo '</main></body></html>';
		exit;
	}
}
