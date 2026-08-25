import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../src/components/public');

function cleanPublicFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Text colors
  content = content.replace(/text-gray-900/g, 'text-[var(--text-heading)]');
  content = content.replace(/text-gray-800/g, 'text-[var(--text-heading)]');
  content = content.replace(/text-gray-700/g, 'text-[var(--text-body)]');
  content = content.replace(/text-gray-600/g, 'text-[var(--text-body)]');
  content = content.replace(/text-gray-500/g, 'text-[var(--text-muted)]');
  content = content.replace(/text-gray-400/g, 'text-[var(--text-dim)]');

  // Background colors
  content = content.replace(/bg-gray-50\/70/g, 'bg-[var(--bg-surface)]');
  content = content.replace(/bg-gray-50\/50/g, 'bg-[var(--bg-surface)]');
  content = content.replace(/bg-gray-50/g, 'bg-[var(--bg-subtle)]');
  content = content.replace(/bg-gray-100/g, 'bg-[var(--bg-subtle)]');

  // Borders
  content = content.replace(/border-gray-100/g, 'border-[var(--border-subtle)]');
  content = content.replace(/border-gray-200\/80/g, 'border-[var(--border-subtle)]');
  content = content.replace(/border-gray-200/g, 'border-[var(--border-subtle)]');
  content = content.replace(/border-gray-300/g, 'border-[var(--border-hover)]');

  // Sections with hardcoded bg-white
  content = content.replace(/<section className="bg-white/g, '<section className="bg-[var(--bg-page)]');
  content = content.replace(/<article className="bg-white/g, '<article className="bg-[var(--bg-page)]');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Cleaned public file: ${path.basename(filePath)}`);
}

const files = fs.readdirSync(publicDir);
for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    cleanPublicFile(path.join(publicDir, file));
  }
}
console.log('Public files cleaned successfully!');
