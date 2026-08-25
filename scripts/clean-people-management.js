import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const peopleDir = path.resolve(__dirname, '../src/components/dashboard/PeopleManagement');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace text-white on inputs, textareas, selects
  content = content.replace(/className="([^"]*?)text-white([^"]*?)"/g, (match, prefix, suffix) => {
    // Keep text-white only if inside a button or solid colored pill
    if (
      prefix.includes('bg-[var(--brand-teal)]') ||
      prefix.includes('bg-emerald') ||
      prefix.includes('bg-rose') ||
      prefix.includes('bg-cyan') ||
      prefix.includes('btn-')
    ) {
      return match;
    }
    return `className="${prefix}text-[var(--text-heading)]${suffix}"`;
  });

  // Replace hover:text-white
  content = content.replace(/hover:text-white/g, 'hover:text-[var(--text-heading)]');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Cleaned: ${path.basename(filePath)}`);
}

const files = fs.readdirSync(peopleDir);
for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    cleanFile(path.join(peopleDir, file));
  }
}
console.log('People Management cleaning complete!');
