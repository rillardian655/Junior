import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { header, success, warn, info } from '../utils/ui.js';

const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'coverage',
  '.turbo',
  'vendor'
]);

// Matches comment tags such as TODO, FIXME, BUG, HACK, etc.
const TAG_REGEX = /(?:\/\/|#|\/\*|\*)\s*(TODO|FIXME|BUG|HACK|NOTE|OPTIMIZE)(?:\s*[:(]|\s+)(.*?)(?:\*\/|$)/i;

const TAG_COLORS = {
  TODO: (s) => pc.yellow(s),
  FIXME: (s) => pc.red(s),
  BUG: (s) => pc.bold(pc.red(s)),
  HACK: (s) => pc.magenta(s),
  NOTE: (s) => pc.blue(s),
  OPTIMIZE: (s) => pc.cyan(s)
};

function walkCodeFiles(dir, fileList = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkCodeFiles(fullPath, fileList);
      } else if (entry.isFile()) {
        fileList.push(fullPath);
      }
    }
  } catch (err) {
    // Ignore unreadable
  }
  return fileList;
}

export function runTodo(options = {}) {
  header('Junior Code Annotations & TODO Scanner');

  const targetDir = options.path ? path.resolve(options.path) : process.cwd();
  const files = walkCodeFiles(targetDir);

  const results = new Map();
  let totalCount = 0;

  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    try {
      const stat = fs.statSync(file);
      if (stat.size > 1024 * 512) continue; // skip files > 512KB

      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      const relPath = path.relative(process.cwd(), file);

      lines.forEach((line, index) => {
        if (line.includes('TAG_REGEX')) return;
        const match = line.match(TAG_REGEX);
        if (match) {
          const tag = match[1].toUpperCase();
          const desc = (match[2] || '').trim();
          if (!results.has(relPath)) {
            results.set(relPath, []);
          }
          results.get(relPath).push({
            tag,
            desc,
            line: index + 1
          });
          totalCount++;
        }
      });
    } catch {
      // Skip binary
    }
  }

  if (totalCount === 0) {
    success('Clean codebase! No TODO, FIXME, or BUG annotations found.');
    return;
  }

  warn(`Found ${totalCount} annotation(s) across ${results.size} file(s):\n`);

  for (const [file, items] of results.entries()) {
    console.log(`  ${pc.bold(pc.underline(file))}`);
    for (const item of items) {
      const colorFn = TAG_COLORS[item.tag] || ((s) => pc.yellow(s));
      console.log(
        `    ${pc.dim(`Line ${String(item.line).padStart(3)}:`)} ` +
        `[${colorFn(item.tag)}] ${pc.dim(item.desc || '')}`
      );
    }
    console.log();
  }

  console.log(pc.dim('─'.repeat(50)));
  info(`Total: ${totalCount} task(s) awaiting attention.`);
}
