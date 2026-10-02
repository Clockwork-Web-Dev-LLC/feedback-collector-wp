<?php
require __DIR__ . '/_guard.php';
// Branding: by default there is no logo and the header label ("Feedback Collector") shows as text.
use FeedbackCollector\Branding;

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};

$d = Branding::defaults();
$check( 'default header label is "Feedback Collector"', 'Feedback Collector' === $d['product_label'] );
$check( 'no logo by default', '' === $d['logo_url'] );
$check( 'Anti: no bundled logo shipped or referenced', ! file_exists( FBC_DIR . 'assets/clockwork-logo.png' ) );

$s = Branding::sanitize( array( 'name' => 'Acme QA', 'logo_url' => 'https://example.com/acme.png' ) );
$check( 'custom logo saved', 'https://example.com/acme.png' === $s['logo_url'] );
$s = Branding::sanitize( array( 'logo_url' => 'javascript:alert(1)' ) );
$check( 'Anti: script URL rejected as a logo', '' === $s['logo_url'] );
$s = Branding::sanitize( array( 'primary' => 'red; background:url(x)' ) );
$check( 'Anti: invalid color falls back to the default', $d['primary'] === $s['primary'] );

// The on/off switch. (Scratch DB only, so writing the option is safe.)
$check( 'custom branding is off by default', false === $d['enabled'] && false === Branding::sanitize( array() )['enabled'] );
$check( 'default colors are the Clockwork palette', '#6953C4' === $d['primary'] && '#2D2062' === $d['dark'] && '#7EFF83' === $d['accent'] );
update_option( Branding::OPTION, Branding::sanitize( array( 'name' => 'Acme QA', 'logo_url' => 'https://example.com/acme.png', 'primary' => '#112233' ) ), false );
$check( 'switched off: saved values kept but not applied', ! Branding::enabled() && 'Acme QA' === Branding::saved()['name'] );
update_option( Branding::OPTION, Branding::sanitize( array( 'enabled' => '1', 'name' => 'Acme QA', 'logo_url' => 'https://example.com/acme.png', 'primary' => '#112233' ) ), false );
$check( 'switched on: saved values apply', Branding::enabled() && '#112233' === Branding::saved()['primary'] && 'https://example.com/acme.png' === Branding::saved()['logo_url'] );
delete_option( Branding::OPTION );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
