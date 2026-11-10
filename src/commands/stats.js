import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { getRepoStats, isGitRepo } from '../utils/git.js';
import { header, box } from '../utils/ui.js';

const EXT_LANG_MAP = {
  '.js': 'JavaScript',
  '.mjs': 'JavaScript',
  '.cjs': 'JavaScript',
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript (React)',
  '.jsx': 'JavaScript (React)',
  '.py': 'Python',
  '.dart': 'Dart / Flutter',
  '.rs': 'Rust',
  '.go': 'Go',
  '.json': 'JSON',
  '.html': 'HTML',
  '.css': 'CSS',
  '.md': 'Markdown',
  '.sh': 'Shell Script',
  '.yml': 'YAML',
  '.yaml': 'YAML'
};

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

export function runStats() {
  header('Junior Project & Repository Insights');

  // 1. Git stats
  const gitStats = getRepoStats();
  if (gitStats) {
    console.log(pc.bold('Git Repository:'));
    console.log(`  ${pc.cyan('●')} Branch:        ${pc.bold(gitStats.branch)}`);
    console.log(`  ${pc.cyan('●')} Total Commits: ${pc.bold(gitStats.commitCount)}`);
    if (gitStats.lastCommit) {
      console.log(`  ${pc.cyan('●')} Last Commit:   ${pc.dim(gitStats.lastCommit)}`);
    }
    if (gitStats.contributors.length > 0) {
      console.log(`  ${pc.cyan('●')} Contributors:  ${gitStats.contributors.join(', ')}`);
    }
    console.log();
  }

  // 2. Lines of code by language
  const counts = {};
  let totalFiles = 0;
  let totalLines = 0;

  function countDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (IGNORE_DIRS.has(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          countDir(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const lang = EXT_LANG_MAP[ext];
          if (!lang) continue;

          totalFiles++;
          try {
            const stat = fs.statSync(fullPath);
            if (stat.size > 1024 * 512) continue;
            const content = fs.readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n').length;
            totalLines += lines;
            counts[lang] = (counts[lang] || 0) + lines;
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    }
  }

  countDir(process.cwd());

  console.log(pc.bold('Codebase Metrics:'));
  console.log(`  ${pc.cyan('●')} Total Tracked Files: ${pc.bold(totalFiles)}`);
  console.log(`  ${pc.cyan('●')} Total Lines of Code: ${pc.bold(totalLines.toLocaleString())}\n`);

  if (Object.keys(counts).length > 0) {
    console.log(pc.bold('Breakdown by Language:'));
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    for (const [lang, lines] of sorted) {
      const pct = ((lines / totalLines) * 100).toFixed(1);
      const barLen = Math.round((lines / totalLines) * 20);
      const bar = pc.green('█'.repeat(barLen)) + pc.dim('░'.repeat(Math.max(0, 20 - barLen)));
      console.log(`  ${lang.padEnd(20)} ${bar}  ${String(lines).padStart(6)} lines (${pct}%)`);
    }
    console.log();
  }
}
