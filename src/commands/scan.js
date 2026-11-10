import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { scanFileContent, scanStaged } from '../scanner/rules.js';
import { getStagedFiles, isGitRepo } from '../utils/git.js';
import { header, success, warn, error, info } from '../utils/ui.js';

const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'coverage',
  '.turbo',
  'vendor',
  'test',
  'tests'
]);

function walkDirectory(dir, fileList = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDirectory(fullPath, fileList);
      } else if (entry.isFile()) {
        fileList.push(fullPath);
      }
    }
  } catch (err) {
    // skip unreadable
  }
  return fileList;
}

export function runScan(options = {}) {
  header('Junior Security & Secret Leak Scanner');

  let filesToScan = [];
  if (options.staged) {
    if (!isGitRepo()) {
      error('Cannot scan staged files: current directory is not a git repository.');
      return;
    }
    filesToScan = getStagedFiles();
    info(`Scanning ${filesToScan.length} staged file(s)...`);
  } else {
    const targetDir = options.path ? path.resolve(options.path) : process.cwd();
    info(`Scanning directory recursively: ${pc.bold(path.relative(process.cwd(), targetDir) || '.')}`);
    filesToScan = walkDirectory(targetDir);
  }

  const allLeaks = [];
  let scannedCount = 0;

  for (const file of filesToScan) {
    if (!fs.existsSync(file)) continue;
    try {
      const stat = fs.statSync(file);
      if (stat.size > 1024 * 1024) continue; // skip files > 1MB
      const content = fs.readFileSync(file, 'utf-8');
      const relPath = path.relative(process.cwd(), file);
      const leaks = scanFileContent(relPath, content);
      if (leaks.length > 0) {
        allLeaks.push(...leaks);
      }
      scannedCount++;
    } catch {
      // Ignore binary files or permissions
    }
  }

  console.log(`\n${pc.dim('─'.repeat(55))}`);
  if (allLeaks.length === 0) {
    success(`Scan complete! No leaked secrets or exposed credentials found in ${scannedCount} files.`);
  } else {
    warn(`Warning: Found ${allLeaks.length} potential secret(s) or exposed credential(s)!`);
    console.log();
    for (const leak of allLeaks) {
      console.log(
        `  ${pc.red('●')} ${pc.bold(leak.file)}${leak.line ? pc.dim(`:${leak.line}`) : ''} ` +
        `→ ${pc.yellow(leak.rule)}: ${pc.cyan(leak.matched)}`
      );
    }
    console.log(`\n${pc.red('Please ensure all secrets are stored in environment variables before pushing.')}`);
    if (options.exitZero !== true) {
      process.exitCode = 1;
    }
  }
  console.log(pc.dim('─'.repeat(55)) + '\n');
}
