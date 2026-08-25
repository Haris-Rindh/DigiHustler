import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dashDir = path.resolve(__dirname, '../src/components/dashboard');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace text-white on inputs, textareas, selects
  content = content.replace(/className="([^"]*?)text-white([^"]*?)"/g, (match, prefix, suffix) => {
    // Keep text-white ONLY if inside a solid colored button (bg-[var(--brand-teal)], bg-purple, bg-indigo, bg-emerald, bg-rose)
    if (
      prefix.includes('bg-[var(--brand-teal)]') ||
      prefix.includes('bg-purple-') ||
      prefix.includes('bg-indigo-') ||
      prefix.includes('bg-emerald-') ||
      prefix.includes('bg-rose-') ||
      prefix.includes('btn-')
    ) {
      return match;
    }
    return `className="${prefix}text-[var(--text-heading)]${suffix}"`;
  });

  // Replace hover:text-white with hover:text-[var(--text-heading)]
  content = content.replace(/hover:text-white/g, 'hover:text-[var(--text-heading)]');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Cleaned dashboard file: ${path.basename(filePath)}`);
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      traverse(full);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      cleanFile(full);
    }
  }
}

traverse(dashDir);
console.log('Dashboard inputs cleaned!');
