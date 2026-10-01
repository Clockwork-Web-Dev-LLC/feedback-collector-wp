#!/bin/sh
# Runs the WordPress integration tests against a local WordPress install with this
# plugin active. Every suite cleans up after itself (only its own rows; settings restored).
#
#   tests/wp/run.sh                   # uses `wp` on PATH and the current directory's WordPress
#   WP="php wp-cli.phar --path=/path/to/wp" tests/wp/run.sh
#
# Never point this at a real staging or production site: suites replace HTTP calls with
# mocks but still write (and then delete) test items.
set -u
WP="${WP:-wp}"
DIR="$(cd "$(dirname "$0")" && pwd)"
failed=0
for suite in rest teamwork assignees rounds api-key-storage; do
	echo "== $suite"
	out="$($WP eval-file "$DIR/$suite.php" 2>&1)"
	echo "$out" | grep -E '^(FAIL|cleanup)|passed|Fatal|Error' || true
	passes=$(echo "$out" | grep -c '^PASS')
	fails=$(echo "$out" | grep -c '^FAIL')
	echo "   $passes passed, $fails failed"
	if [ "$fails" -gt 0 ] || echo "$out" | grep -q -E 'Fatal error|Parse error'; then failed=1; fi
done
exit $failed
