<?php
/**
 * Every integration suite starts with this: refuse to run against anything but the
 * throwaway database that tests/wp/run.sh creates. Suites write mock Teamwork settings,
 * test rows and cron entries; on a real site a crash or a concurrent request could leave
 * those behind (that happened once: real Teamwork settings were overwritten by mocks).
 *
 * @package FeedbackCollector
 */

if ( ! defined( 'DB_NAME' ) || ! str_ends_with( (string) DB_NAME, '_scratch' ) ) {
	echo 'Refusing: integration tests only run against a *_scratch database (this is "' . ( defined( 'DB_NAME' ) ? DB_NAME : '?' ) . "\"). Use tests/wp/run.sh.\n";
	exit( 1 );
}
