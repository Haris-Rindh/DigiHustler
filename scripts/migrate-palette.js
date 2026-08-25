import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

const replacements = [
  // Primary backgrounds & surfaces
  { from: /bg-\[#071e26\]/g, to: 'bg-[var(--color-bg)]' },
  { from: /bg-\[#0d2833\]/g, to: 'bg-[var(--color-surface)]' },
  { from: /bg-\[#0a2530\]/g, to: 'bg-[var(--color-surface)]' },
  { from: /bg-\[#071e26\]\/([0-9]+)/g, to: 'bg-[var(--color-bg)]' },
  { from: /bg-\[#0d2833\]\/([0-9]+)/g, to: 'bg-[var(--color-surface)]' },

  // Borders
  { from: /border-\[#1e4a5d\]/g, to: 'border-[var(--color-border)]' },
  { from: /border-\[#1e4a5d\]\/([0-9]+)/g, to: 'border-[var(--color-border)]' },
  { from: /hover:border-\[#1e4a5d\]/g, to: 'hover:border-[var(--color-border-hover)]' },

  // Accents (Sea Teal)
  { from: /bg-\[#1a7a8c\] hover:bg-\[#156575\]/g, to: 'bg-[var(--color-accent-fill)] hover:bg-[var(--color-accent-hover)]' },
  { from: /hover:bg-\[#156575\]/g, to: 'hover:bg-[var(--color-accent-hover)]' },
  { from: /bg-\[#1a7a8c\]/g, to: 'bg-[var(--color-accent-fill)]' },
  { from: /text-\[#1a7a8c\]/g, to: 'text-[var(--color-accent)]' },
  { from: /border-\[#1a7a8c\]/g, to: 'border-[var(--color-accent)]' },
  { from: /focus:border-\[#1a7a8c\]/g, to: 'focus:border-[var(--color-accent)]' },
  { from: /focus:ring-\[#1a7a8c\]/g, to: 'focus:ring-[var(--color-accent)]' },
  { from: /ring-\[#1a7a8c\]/g, to: 'ring-[var(--color-accent)]' },
  { from: /accent-\[#1a7a8c\]/g, to: 'accent-[var(--color-accent)]' },
  { from: /shadow-\[#1a7a8c\]\/([0-9]+)/g, to: 'shadow-md' },

  // Secondary text & sky tags (Soft Periwinkle / Cool Mist)
  { from: /text-\[#bde0fe\]/g, to: 'text-[var(--color-text-primary)]' },
  { from: /border-\[#bde0fe\]/g, to: 'border-[var(--color-soft-periwinkle)]' },
  { from: /ring-\[#bde0fe\]/g, to: 'ring-[var(--color-soft-periwinkle)]' },

  // Radial Timeline / Vivid gradients
  { from: /from-\[#1a7a8c\] to-\[#0ea5e9\]/g, to: 'from-[#022B3A] via-[#1F7A8C] to-[#E1E5F2]' },
  { from: /from-\[#0ea5e9\] via-\[#1a7a8c\] to-\[#0284c7\]/g, to: 'from-[#1F7A8C] to-[#022B3A]' },
  { from: /from-\[#bde0fe\] via-\[#8ecae6\] to-\[#1a7a8c\]/g, to: 'from-[#1F7A8C] to-[#022B3A]' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || (file.endsWith('.ts') && !file.endsWith('.d.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      for (const { from, to } of replacements) {
        if (from.test(content)) {
          content = content.replace(from, to);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated tokens in: ${file}`);
      }
    }
  }
}

console.log('Starting palette token migration across src/...');
processDirectory(srcDir);
console.log('Token migration complete!');
