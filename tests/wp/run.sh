#!/bin/sh
# Runs the WordPress integration tests against a THROWAWAY COPY of a local WordPress
# database, never the database itself. Each run:
#   1. drops and recreates the scratch database (so a killed run heals itself next time),
#   2. copies the real database into it,
#   3. runs every suite with FBC_DB_NAME pointing at the copy,
#   4. drops the copy.
# Nothing a suite does — mock settings, test rows, cron changes, a crash or a kill -9
# mid-run, or a browser request landing during the run — can touch the real site.
#
# One-time setup on the test site (see tests/wp/README.md):
#   wp-config.php:  define( 'DB_NAME', 'fbc_test_scratch' === getenv( 'FBC_DB_NAME' ) ? 'fbc_test_scratch' : 'fbc_test' );
#   MySQL:          GRANT ALL PRIVILEGES ON `fbc_test_scratch`.* TO '<db user>'@'localhost';
#
#   tests/wp/run.sh                                  # uses `wp` on PATH and the current directory's WordPress
#   WP="php wp-cli.phar --path=/path/to/wp" tests/wp/run.sh
set -u
WP="${WP:-wp}"
SCRATCH="${FBC_SCRATCH_DB:-fbc_test_scratch}"
DIR="$(cd "$(dirname "$0")" && pwd)"

case "$SCRATCH" in
	*_scratch) ;;
	*) echo "Refusing: scratch database name must end in _scratch (got '$SCRATCH')."; exit 2 ;;
esac

# The real DB name (no FBC_DB_NAME), and proof that wp-config honours the switch.
REAL="$(env -u FBC_DB_NAME $WP eval 'echo DB_NAME;' 2>/dev/null)"
if [ -z "$REAL" ] || [ "$REAL" = "$SCRATCH" ]; then
	echo "Refusing: could not read the real DB_NAME (got '$REAL')."; exit 2
fi

drop_scratch() { env -u FBC_DB_NAME $WP db query "DROP DATABASE IF EXISTS \`$SCRATCH\`" >/dev/null 2>&1; }
trap drop_scratch EXIT INT TERM

echo "== preparing $SCRATCH (copy of $REAL)"
drop_scratch
env -u FBC_DB_NAME $WP db query "CREATE DATABASE \`$SCRATCH\`" || { echo "Could not create $SCRATCH (grant missing?)"; exit 2; }
env -u FBC_DB_NAME $WP db export - --set-gtid-purged=OFF 2>/dev/null | FBC_DB_NAME="$SCRATCH" $WP db import - >/dev/null || { echo "Could not copy $REAL into $SCRATCH"; exit 2; }

GOT="$(FBC_DB_NAME="$SCRATCH" $WP eval 'echo DB_NAME;' 2>/dev/null)"
if [ "$GOT" != "$SCRATCH" ]; then
	echo "Refusing: wp-config ignored FBC_DB_NAME (connected to '$GOT'). See the setup notes at the top of this file."; exit 2
fi

failed=0
for suite in rest teamwork assignees rounds screenshots api-key-storage branding due-dates cli; do
	echo "== $suite"
	out="$(FBC_DB_NAME="$SCRATCH" $WP eval-file "$DIR/$suite.php" 2>&1)"
	echo "$out" | grep -E '^(FAIL|cleanup|Refusing)|passed|Fatal|Error' || true
	passes=$(echo "$out" | grep -c '^PASS')
	fails=$(echo "$out" | grep -c '^FAIL')
	echo "   $passes passed, $fails failed"
	if [ "$fails" -gt 0 ] || [ "$passes" -eq 0 ] || echo "$out" | grep -q -E 'Fatal error|Parse error|Refusing'; then failed=1; fi
done
exit $failed
