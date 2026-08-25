import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

function fixBgWhite(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // In className, replace pure `bg-white` with `bg-[var(--bg-surface)]` (except toggle switch thumbs `after:bg-white`)
  content = content.replace(/className="([^"]*?)"/g, (match, classList) => {
    let newClassList = classList;
    
    // Replace hover:bg-white with hover:bg-[var(--bg-subtle)]
    newClassList = newClassList.replace(/\bhover:bg-white\b/g, 'hover:bg-[var(--bg-subtle)]');
    newClassList = newClassList.replace(/\bhover:bg-white\/20\b/g, 'hover:bg-[var(--bg-subtle)]');
    
    // Replace bg-white with bg-[var(--bg-surface)] if it is a card/container background
    // (do not touch after:bg-white or stroke/fill)
    const tokens = newClassList.split(/\s+/);
    const modifiedTokens = tokens.map(t => {
      if (t === 'bg-white') {
        return 'bg-[var(--bg-surface)]';
      }
      return t;
    });
    
    newClassList = modifiedTokens.join(' ');
    if (newClassList !== classList) {
      changed = true;
      return `className="${newClassList}"`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed bg-white in: ${path.basename(filePath)}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      traverse(full);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixBgWhite(full);
    }
  }
}

traverse(srcDir);
console.log('All bg-white hardcoded cards fixed to dynamic semantic theme surfaces!');
