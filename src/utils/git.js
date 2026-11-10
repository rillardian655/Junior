import { execSync } from 'node:child_process';

function runGit(cmd) {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return null;
  }
}

export function isGitRepo() {
  return runGit('rev-parse --is-inside-work-tree') === 'true';
}

export function getCurrentBranch() {
  return runGit('branch --show-current') || 'HEAD';
}

export function getStagedFiles() {
  const output = runGit('diff --cached --name-only');
  return output ? output.split('\n').filter(Boolean) : [];
}

export function getUnstagedFiles() {
  const output = runGit('diff --name-only');
  return output ? output.split('\n').filter(Boolean) : [];
}

export function getUntrackedFiles() {
  const output = runGit('ls-files --others --exclude-standard');
  return output ? output.split('\n').filter(Boolean) : [];
}

export function stageAll() {
  runGit('add -A');
}

export function commit(message) {
  // Escape quotes safely
  const escaped = message.replace(/"/g, '\\"');
  try {
    execSync(`git commit -m "${escaped}"`, { encoding: 'utf-8', stdio: 'inherit' });
    return true;
  } catch (err) {
    return false;
  }
}

export function getRepoStats() {
  if (!isGitRepo()) return null;

  const commitCount = runGit('rev-list --count HEAD') || '0';
  const contributors = runGit('shortlog -sn --all') || '';
  const lastCommit = runGit('log -1 --pretty=format:"%h - %s (%cr) <%an>"') || '';
  const branch = getCurrentBranch();

  return {
    branch,
    commitCount: parseInt(commitCount, 10) || 0,
    contributors: contributors ? contributors.split('\n').filter(Boolean) : [],
    lastCommit
  };
}
