// Builds the WordPress.org release: build/feedback-collector/ and build/feedback-collector-<version>.zip.
// Only what ships goes in; sources, tests and tooling stay in the repository (readme.txt links to it).
// Usage: bun run package
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');
const SLUG = 'feedback-collector';
const SHIP = ['feedback-collector.php', 'uninstall.php', 'readme.txt', 'includes', 'assets', 'dist', 'languages'];

const header = readFileSync(join(root, 'feedback-collector.php'), 'utf8');
const version = header.match(/^\s*\*\s*Version:\s*(\S+)/m)?.[1];
const stable = readFileSync(join(root, 'readme.txt'), 'utf8').match(/^Stable tag:\s*(\S+)/m)?.[1];
const constant = header.match(/const VERSION\s*=\s*'([^']+)'/)?.[1];
if (!version || version !== stable || version !== constant) {
  console.error(`Version mismatch: header ${version}, readme Stable tag ${stable}, VERSION constant ${constant}.`);
  process.exit(1);
}

const run = (cmd: string[]) => {
  const p = Bun.spawnSync(cmd, { cwd: root, stdout: 'inherit', stderr: 'inherit' });
  if (p.exitCode !== 0) process.exit(p.exitCode ?? 1);
};

run(['bun', 'run', 'build']);

const out = join(root, 'build');
const dir = join(out, SLUG);
rmSync(out, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
for (const item of SHIP) {
  if (!existsSync(join(root, item))) {
    console.error(`Missing ${item}`);
    process.exit(1);
  }
  cpSync(join(root, item), join(dir, item), { recursive: true, filter: (src) => !/(^|\/)\.[^/]+$/.test(src) });
}

const zip = `${SLUG}-${version}.zip`;
const z = Bun.spawnSync(['zip', '-rqX', zip, SLUG], { cwd: out, stdout: 'inherit', stderr: 'inherit' });
if (z.exitCode !== 0) process.exit(z.exitCode ?? 1);
console.log(`build/${zip}`);
