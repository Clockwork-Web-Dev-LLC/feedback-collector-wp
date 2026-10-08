<?php
require __DIR__ . '/_guard.php';
// API key stored encrypted in the DB (the Settings-form path, no wp-config constant). Restores settings when done.
use FeedbackCollector\Teamwork\Teamwork;
// No real network calls: every outbound request gets a canned 401.
add_filter( 'pre_http_request', static fn() => array( 'response' => array( 'code' => 401, 'message' => '' ), 'body' => '{}', 'headers' => array(), 'cookies' => array() ) );
wp_set_current_user( 1 );
$backup = get_option( 'fbcol_teamwork' );
update_option( 'fbcol_teamwork', array( 'site' => '' ) );
$_POST = array( 'tw_site' => 'https://clockwork.teamwork.com/', 'tw_key' => ' tkn.v1_TESTKEY_abc123 ' );
Teamwork::save_settings();
$s   = get_option( 'fbcol_teamwork' );
$raw = $GLOBALS['wpdb']->get_var( "SELECT option_value FROM {$GLOBALS['wpdb']->options} WHERE option_name = 'fbcol_teamwork'" );
$client = Teamwork::client();
$key = ( new ReflectionMethod( Teamwork::class, 'api_key' ) )->invoke( null );
printf( "constant defined: %s\n", defined( 'FBCOL_TEAMWORK_API_KEY' ) ? 'yes' : 'no' );
printf( "site saved: %s\n", Teamwork::site() );
printf( "%s key decrypts (trimmed)\n", 'tkn.v1_TESTKEY_abc123' === $key ? 'PASS' : 'FAIL' );
printf( "%s plaintext absent from DB row\n", str_contains( (string) $raw, 'TESTKEY' ) ? 'FAIL' : 'PASS' );
printf( "%s client built from DB key\n", $client ? 'PASS' : 'FAIL' );
$_POST = array( 'tw_site' => 'https://clockwork.teamwork.com/', 'tw_key' => '' );
Teamwork::save_settings();
$key2 = ( new ReflectionMethod( Teamwork::class, 'api_key' ) )->invoke( null );
printf( "%s blank field keeps saved key\n", 'tkn.v1_TESTKEY_abc123' === $key2 ? 'PASS' : 'FAIL' );
ob_start(); Teamwork::settings_rows(); $html = ob_get_clean();
printf( "%s settings page never echoes key\n", str_contains( $html, 'TESTKEY' ) ? 'FAIL' : 'PASS' );
printf( "%s settings page shows saved placeholder\n", str_contains( $html, 'saved — leave blank to keep' ) ? 'PASS' : 'FAIL' );
$s = get_option( 'fbcol_teamwork' ); $s['key_enc'] = base64_encode( random_bytes( 24 ) . 'garbage-ciphertext' ); update_option( 'fbcol_teamwork', $s );
ob_start(); Teamwork::settings_rows(); $html = ob_get_clean();
printf( "%s undecryptable key shows re-enter notice\n", str_contains( $html, 'can no longer be read' ) ? 'PASS' : 'FAIL' );
printf( "%s undecryptable key → no client\n", null === Teamwork::client() ? 'PASS' : 'FAIL' );
delete_transient( 'fbcol_tw_projects' );
false === $backup ? delete_option( 'fbcol_teamwork' ) : update_option( 'fbcol_teamwork', $backup );
