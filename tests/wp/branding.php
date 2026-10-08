<?php
require __DIR__ . '/_guard.php';
// Branding: off by default (plain "Feedback Collector", no logo, no credit); switching it on starts from Clockwork's look.
use FeedbackCollector\Branding;

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};

delete_option( Branding::OPTION );
$d = Branding::defaults();
$g = Branding::get();
$check( 'fresh install: custom branding is off', ! Branding::enabled() );
$check( 'fresh install: plain "Feedback Collector", no logo, no credit, no author', 'Feedback Collector' === $g['name'] && 'Feedback Collector' === $g['product_label'] && '' === $g['logo_url'] && false === $g['show_credit'] && '' === $g['author'] );
$check( 'Anti: no Clockwork name, logo or link anywhere until branding is switched on', ! str_contains( strtolower( wp_json_encode( $g ) . wp_json_encode( Branding::overlay() ) ), 'clockwork' ) && ! Branding::is_default() );
$plugins = Branding::plugins_list( array( plugin_basename( FeedbackCollector\PLUGIN_FILE ) => array( 'Name' => 'Feedback Collector', 'Author' => 'Aaron Reimann' ) ) );
$check( 'fresh install: the Plugins screen shows the plugin header untouched', 'Aaron Reimann' === reset( $plugins )['Author'] );
$check( 'switching branding on starts from Clockwork\'s look (logo and palette)', '' !== $d['logo_url'] && str_ends_with( (string) $d['logo_url'], 'assets/clockwork-logo.png' ) );
$check( 'bundled Clockwork logo shipped', file_exists( FBCOL_DIR . 'assets/clockwork-logo.png' ) );

$s = Branding::sanitize( array( 'name' => 'Acme QA', 'logo_url' => 'https://example.com/acme.png' ) );
$check( 'custom logo saved', 'https://example.com/acme.png' === $s['logo_url'] );
$s = Branding::sanitize( array( 'logo_url' => 'javascript:alert(1)' ) );
$check( 'Anti: script URL rejected as a logo', '' === $s['logo_url'] );
$s = Branding::sanitize( array( 'primary' => 'red; background:url(x)' ) );
$check( 'Anti: invalid color falls back to the default', $d['primary'] === $s['primary'] );

// The on/off switch. (Scratch DB only, so writing the option is safe.)
$check( 'the credit link is opt-in', false === $d['show_credit'] );
$check( 'the starting palette is Clockwork\'s', '#6953C4' === $d['primary'] && '#2D2062' === $d['dark'] && '#7EFF83' === $d['accent'] );
update_option( Branding::OPTION, Branding::sanitize( array( 'enabled' => '', 'name' => 'Acme QA', 'logo_url' => 'https://example.com/acme.png', 'primary' => '#112233' ) ), false );
$check( 'switched off: saved values kept but not applied', ! Branding::enabled() && 'Acme QA' === Branding::saved()['name'] );
update_option( Branding::OPTION, Branding::sanitize( array( 'enabled' => '1', 'name' => 'Acme QA', 'logo_url' => 'https://example.com/acme.png', 'primary' => '#112233' ) ), false );
$check( 'switched on: saved values apply', Branding::enabled() && '#112233' === Branding::saved()['primary'] && 'https://example.com/acme.png' === Branding::saved()['logo_url'] );
update_option( Branding::OPTION, array( 'enabled' => true ), false );
$check( 'one click: switched on with nothing else saved gives the full Clockwork look', Branding::enabled() && Branding::is_default() && str_ends_with( (string) Branding::saved()['logo_url'], 'clockwork-logo.png' ) );
delete_option( Branding::OPTION );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
