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

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
