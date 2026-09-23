// Copy the Crazy Games Vite output into artifacts/ and zip it with index.html
// at the archive root (Crazy Games upload layout).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist-crazygames');
const staticDir = path.join(root, 'artifacts', 'crazygames');
const zipPath = path.join(root, 'artifacts', 'ghost-garden-crazygames.zip');

const forbidden = [
  'guest-shell.js',
  'images.aiwaves.tech/alteru/guest-shell',
  'apps.apple.com',
  'Get AlterU on the App Store',
  '下载 AlterU',
  '在 AlterU 中打开',
  'Open in AlterU',
];

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('dist-crazygames/index.html is missing. Run vite build --mode crazygames first.');
  process.exit(1);
}

const indexHtml = readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!/__isCrazyGamesBuild\s*=\s*(true|"crazygames"\s*===\s*"crazygames")/.test(indexHtml)) {
  console.error('crazygames index.html did not set __isCrazyGamesBuild');
  process.exit(1);
}

const hits = [];
let guestNote = false;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const filePath = path.join(dir, name);
    if (statSync(filePath).isDirectory()) {
      walk(filePath);
      continue;
    }
    if (!/\.(html|js|css|svg|json|txt)$/i.test(name)) continue;
    const text = readFileSync(filePath, 'utf8');
    if (text.includes('Your best score stays on this device')) guestNote = true;
    for (const needle of forbidden) {
      if (text.includes(needle)) hits.push(`${path.relative(root, filePath)}: ${needle}`);
    }
  }
}
walk(dist);
if (hits.length) {
  console.error('crazygames build still contains an AlterU login wall or App Store gate:');
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
if (!guestNote) {
  console.error('crazygames build is missing the on-device leaderboard note');
  process.exit(1);
}

rmSync(staticDir, { recursive: true, force: true });
mkdirSync(staticDir, { recursive: true });
cpSync(dist, staticDir, { recursive: true });

rmSync(zipPath, { force: true });
execFileSync('zip', ['-r', '-X', zipPath, '.'], { cwd: dist, stdio: 'inherit' });

const listing = execFileSync('unzip', ['-l', zipPath], { encoding: 'utf8' });
if (!listing.split('\n').some((line) => /\sindex\.html$/.test(line) && !line.includes('/'))) {
  console.error('zip is missing index.html at the archive root');
  process.exit(1);
}

console.log(`static: ${staticDir}`);
console.log(`zip:    ${zipPath}`);
