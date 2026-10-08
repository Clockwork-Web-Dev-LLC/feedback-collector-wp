<?php
require __DIR__ . '/_guard.php';
// WP-CLI Command Suite: tests for `wp feedback` commands and output formatting.
use FeedbackCollector\Cli\FeedbackCommand;
use FeedbackCollector\Items;

global $wpdb;
$fbcol_max = (int) $wpdb->get_var( 'SELECT COALESCE(MAX(id),0) FROM ' . Items::table() );
register_shutdown_function(
	static function () use ( $fbcol_max ) {
		global $wpdb;
		foreach ( $wpdb->get_col( $wpdb->prepare( 'SELECT id FROM ' . Items::table() . ' WHERE id > %d', $fbcol_max ) ) as $id ) {
			Items::delete( (int) $id );
		}
		echo "cleanup done\n";
	}
);

$n     = array( 0, 0 );
$check = static function ( string $label, bool $ok ) use ( &$n ): void {
	echo ( $ok ? 'PASS ' : 'FAIL ' ) . $label . "\n";
	++$n[ $ok ? 0 : 1 ];
};

// 1. Class exists
$check( 'FeedbackCommand class exists', class_exists( FeedbackCommand::class ) );

// 2. Command is registered
FeedbackCommand::register();
$check( 'FeedbackCommand registered in WP-CLI', class_exists( 'WP_CLI' ) );

// 3. Create an item via CLI
$create_out = WP_CLI::runcommand( 'feedback create --title="Test CLI Item" --type=bug --priority=high --page-path=/test-cli', array( 'return' => true ) );
$created_ok = (bool) preg_match( '/Created feedback item #(\d+)/', (string) $create_out, $matches );
$item_id    = $created_ok ? (int) $matches[1] : 0;
$check( 'wp feedback create creates item', $created_ok && $item_id > 0 );

// 4. List items via CLI with JSON format
$list_json = WP_CLI::runcommand( 'feedback list --status=all --format=json', array( 'return' => true ) );
$list_data = json_decode( (string) $list_json, true );
$found     = false;
if ( is_array( $list_data ) ) {
	foreach ( $list_data as $row ) {
		if ( isset( $row['id'] ) && (int) $row['id'] === $item_id ) {
			$found = true;
			break;
		}
	}
}
$check( 'wp feedback list contains created item', $found );

// 5. Get item details via CLI with JSON format
$get_json = WP_CLI::runcommand( "feedback get {$item_id} --format=json", array( 'return' => true ) );
$get_data = json_decode( (string) $get_json, true );
$check( 'wp feedback get returns correct item data', is_array( $get_data ) && (int) ( $get_data['id'] ?? 0 ) === $item_id && 'Test CLI Item' === ( $get_data['title'] ?? '' ) );

// 6. Update item via CLI
$update_out = WP_CLI::runcommand( "feedback update {$item_id} --status=resolved --priority=critical", array( 'return' => true ) );
$item_after = Items::get( $item_id );
$check( 'wp feedback update changes status and priority', is_array( $item_after ) && 'resolved' === $item_after['status'] && 'critical' === $item_after['priority'] );

// 7. Stats command
$stats_json = WP_CLI::runcommand( 'feedback stats --format=json', array( 'return' => true ) );
$stats_data = json_decode( (string) $stats_json, true );
$check( 'wp feedback stats returns metrics list', is_array( $stats_data ) && count( $stats_data ) > 5 );

// 8. Inventory command
$inv_json = WP_CLI::runcommand( 'feedback inventory --format=json', array( 'return' => true ) );
$inv_data = json_decode( (string) $inv_json, true );
$check( 'wp feedback inventory returns resource counts', is_array( $inv_data ) && count( $inv_data ) >= 4 );

// 9. Delete item via CLI
$del_out  = WP_CLI::runcommand( "feedback delete {$item_id} --force", array( 'return' => true ) );
$item_del = Items::get( $item_id );
$check( 'wp feedback delete deletes item', null === $item_del );

printf( "\n%d passed, %d failed\n", $n[0], $n[1] );
