import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // 1. Replace hardcoded text-white on headings and text blocks
  content = content.replace(/<h([1-6])([^>]*?)className="([^"]*?)text-white([^"]*?)"/g, (match, level, before, prefix, suffix) => {
    return `<h${level}${before}className="${prefix}text-[var(--text-heading)]${suffix}"`;
  });

  // 2. Replace standalone text-white on non-button/badge elements
  content = content.replace(/<p([^>]*?)className="([^"]*?)text-white([^"]*?)"/g, (match, before, prefix, suffix) => {
    return `<p${before}className="${prefix}text-[var(--text-heading)]${suffix}"`;
  });
  content = content.replace(/<span([^>]*?)className="([^"]*?)text-white([^"]*?)"/g, (match, before, prefix, suffix) => {
    // Preserve if inside a solid button or badge with bg-
    if (prefix.includes('bg-[var(--brand-teal)]') || prefix.includes('bg-[var(--color-accent-fill)]') || prefix.includes('bg-emerald') || prefix.includes('bg-rose')) {
      return match;
    }
    return `<span${before}className="${prefix}text-[var(--text-heading)]${suffix}"`;
  });
  content = content.replace(/<strong([^>]*?)className="([^"]*?)text-white([^"]*?)"/g, (match, before, prefix, suffix) => {
    return `<strong${before}className="${prefix}text-[var(--text-heading)]${suffix}"`;
  });

  // 3. Replace text-slate-300 / text-slate-400 / text-slate-500
  content = content.replace(/text-slate-100/g, 'text-[var(--text-heading)]');
  content = content.replace(/text-slate-200/g, 'text-[var(--text-body)]');
  content = content.replace(/text-slate-300/g, 'text-[var(--text-body)]');
  content = content.replace(/text-slate-400/g, 'text-[var(--text-muted)]');
  content = content.replace(/text-slate-500/g, 'text-[var(--text-dim)]');

  // 4. Replace hardcoded bg-slate-950 or bg-slate-900 inputs
  content = content.replace(/bg-slate-950/g, 'bg-[var(--bg-surface)]');
  content = content.replace(/bg-slate-900/g, 'bg-[var(--bg-surface)]');
  content = content.replace(/bg-slate-800/g, 'bg-[var(--bg-subtle)]');
  content = content.replace(/border-white\/10/g, 'border-[var(--border-subtle)]');
  content = content.replace(/border-white\/20/g, 'border-[var(--border-hover)]');
  content = content.replace(/bg-white\/5/g, 'bg-[var(--bg-subtle)]');
  content = content.replace(/bg-white\/10/g, 'bg-[var(--bg-subtle)]');

  // 5. Replace legacy variable aliases
  content = content.replace(/var\(--color-bg\)/g, 'var(--bg-page)');
  content = content.replace(/var\(--color-surface\)/g, 'var(--bg-surface)');
  content = content.replace(/var\(--color-border\)/g, 'var(--border-subtle)');
  content = content.replace(/var\(--color-border-hover\)/g, 'var(--border-hover)');
  content = content.replace(/var\(--color-text-primary\)/g, 'var(--text-heading)');
  content = content.replace(/var\(--color-text-secondary\)/g, 'var(--text-body)');
  content = content.replace(/var\(--color-text-muted\)/g, 'var(--text-muted)');
  content = content.replace(/var\(--color-accent-fill\)/g, 'var(--brand-teal)');
  content = content.replace(/var\(--color-accent-hover\)/g, 'var(--brand-teal-hover)');
  content = content.replace(/var\(--color-accent\)/g, 'var(--brand-teal)');
  content = content.replace(/var\(--color-accent-muted\)/g, 'var(--brand-teal-subtle)');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Enhanced theme legibility in: ${path.basename(filePath)}`);
  }
}

function traverse(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      traverse(full);
    } else if (item.endsWith('.tsx') || (item.endsWith('.ts') && !item.endsWith('.d.ts'))) {
      processFile(full);
    }
  }
}

console.log('Running theme legibility & contrast enhancement pass...');
traverse(srcDir);
console.log('Theme enhancement pass complete!');
