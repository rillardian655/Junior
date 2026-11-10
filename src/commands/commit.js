import { select, input, confirm } from '@inquirer/prompts';
import pc from 'picocolors';
import { isGitRepo, getStagedFiles, getUnstagedFiles, getUntrackedFiles, stageAll, commit } from '../utils/git.js';
import { scanStaged } from '../scanner/rules.js';
import { header, success, warn, error, info } from '../utils/ui.js';

const COMMIT_TYPES = [
  { value: 'feat', label: 'feat:     ✨ A new feature' },
  { value: 'fix', label: 'fix:      🐛 A bug fix' },
  { value: 'docs', label: 'docs:     📝 Documentation changes' },
  { value: 'refactor', label: 'refactor: ♻️  Code refactoring' },
  { value: 'perf', label: 'perf:     ⚡ Performance improvements' },
  { value: 'test', label: 'test:     ✅ Adding or updating tests' },
  { value: 'style', label: 'style:    💄 Code style, formatting, whitespace' },
  { value: 'chore', label: 'chore:    🔧 Tooling, dependencies, config' },
  { value: 'ci', label: 'ci:       🚀 CI/CD pipelines & GitHub Actions' },
  { value: 'revert', label: 'revert:   ⏪ Revert a previous commit' }
];

export async function runCommit(options = {}) {
  header('Junior Interactive Commit');

  if (!isGitRepo()) {
    error('Current directory is not a git repository.');
    process.exit(1);
  }

  let staged = getStagedFiles();
  const unstaged = getUnstagedFiles();
  const untracked = getUntrackedFiles();

  if (staged.length === 0) {
    if (unstaged.length === 0 && untracked.length === 0) {
      warn('No changes detected in repository (working tree clean).');
      return;
    }

    warn('No changes are currently staged for commit.');
    console.log(pc.dim(`  Unstaged files: ${unstaged.length}, Untracked files: ${untracked.length}`));

    const shouldStage = await confirm({
      message: 'Would you like to stage all changes now (git add -A)?',
      default: true
    });

    if (shouldStage) {
      stageAll();
      staged = getStagedFiles();
      success(`Staged ${staged.length} files.`);
    } else {
      info('Aborted. Please stage files using "git add <files>" and try again.');
      return;
    }
  }

  // Quick security scan of staged files before committing
  const leaks = scanStaged(staged);
  if (leaks.length > 0) {
    warn(`Junior Secret Scanner detected ${leaks.length} potential secret(s) in staged files:`);
    for (const leak of leaks) {
      console.log(`  ${pc.red('✖')} [${leak.rule}] in ${pc.bold(leak.file)}: ${pc.dim(leak.matched)}`);
    }

    const proceed = await confirm({
      message: 'Potential sensitive data detected! Do you still want to proceed?',
      default: false
    });

    if (!proceed) {
      error('Commit cancelled for safety. Remove sensitive credentials before committing.');
      return;
    }
  }

  // 1. Select type
  const type = await select({
    message: 'Select commit type:',
    choices: COMMIT_TYPES.map(t => ({ name: t.label, value: t.value }))
  });

  // 2. Scope (optional)
  const scope = await input({
    message: 'Scope (optional, e.g. cli, api, auth, docs):',
    default: ''
  });

  // 3. Short description
  const description = await input({
    message: 'Commit message (short, imperative tense):',
    validate: (val) => val.trim().length > 0 ? true : 'Description cannot be empty.'
  });

  // 4. Breaking change
  const isBreaking = await confirm({
    message: 'Does this commit introduce BREAKING CHANGES?',
    default: false
  });

  // Format message
  const breakingMarker = isBreaking ? '!' : '';
  const scopePart = scope.trim() ? `(${scope.trim()})` : '';
  const firstLine = `${type}${scopePart}${breakingMarker}: ${description.trim()}`;

  let fullMessage = firstLine;
  if (isBreaking) {
    fullMessage += '\n\nBREAKING CHANGE: ' + description.trim();
  }

  console.log('\n' + pc.bold('Commit Preview:'));
  console.log(pc.cyan('─'.repeat(50)));
  console.log(pc.green(fullMessage));
  console.log(pc.cyan('─'.repeat(50)) + '\n');

  const confirmCommit = await confirm({
    message: 'Confirm commit?',
    default: true
  });

  if (confirmCommit) {
    const ok = commit(fullMessage);
    if (ok) {
      success('Commit created successfully! 🎉');
    } else {
      error('Failed to create commit.');
    }
  } else {
    info('Commit aborted.');
  }
}
