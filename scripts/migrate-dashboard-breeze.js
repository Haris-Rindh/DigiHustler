import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dashDir = path.resolve(__dirname, '../src/components/dashboard');

function cleanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      cleanDir(full);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf-8');

      content = content.replace(/bg-breeze-dark/g, 'bg-[var(--bg-page)]');
      content = content.replace(/bg-breeze-surface/g, 'bg-[var(--bg-surface)]');
      content = content.replace(/bg-breeze-elevated/g, 'bg-[var(--bg-subtle)]');
      content = content.replace(/border-breeze-border/g, 'border-[var(--border-subtle)]');
      content = content.replace(/bg-breeze-teal/g, 'bg-[var(--brand-teal)]');
      content = content.replace(/hover:bg-breeze-teal-hover/g, 'hover:bg-[var(--brand-teal-hover)]');
      content = content.replace(/text-breeze-teal/g, 'text-[var(--brand-teal)]');
      content = content.replace(/text-breeze-sky/g, 'text-[var(--brand-teal)]');
      content = content.replace(/text-breeze-mist/g, 'text-[var(--text-body)]');
      content = content.replace(/text-breeze-white/g, 'text-[var(--text-heading)]');
      content = content.replace(/border-breeze-teal/g, 'border-[var(--brand-teal)]');

      fs.writeFileSync(full, content, 'utf-8');
      console.log(`Cleaned dashboard breeze tokens in: ${file}`);
    }
  }
}

console.log('Migrating legacy breeze-* tokens in dashboard...');
cleanDir(dashDir);
console.log('Dashboard migration complete!');
