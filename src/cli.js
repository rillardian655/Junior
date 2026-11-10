import { Command } from 'commander';
import { banner } from './utils/ui.js';
import { runCommit } from './commands/commit.js';
import { runScan } from './commands/scan.js';
import { runCheat } from './commands/cheat.js';
import { runTodo } from './commands/todo.js';
import { runStats } from './commands/stats.js';
import { runMock } from './commands/mock.js';

export function createCli() {
  const program = new Command();

  program
    .name('junior')
    .description('The Developer Swiss-Army Knife & Mock API Server')
    .version('1.0.0')
    .addHelpText('beforeAll', banner);

  // 1. Commit
  program
    .command('commit')
    .description('Interactive conventional commit generator with pre-commit security check')
    .action(async () => {
      await runCommit();
    });

  // 2. Scan
  program
    .command('scan')
    .description('Scan codebase or staged files for leaked secrets, tokens, and credentials')
    .option('-s, --staged', 'Scan only staged git files')
    .option('-p, --path <path>', 'Custom directory to scan', '.')
    .option('--exit-zero', 'Do not exit with error code even if secrets are found')
    .action((opts) => {
      runScan(opts);
    });

  // 3. Cheat
  program
    .command('cheat [topic]')
    .description('Instant cheatsheet viewer (git, docker, chmod, linux, curl, http, regex)')
    .action(async (topic) => {
      await runCheat(topic);
    });

  // 4. Todo
  program
    .command('todo')
    .description('Scan project for TODO, FIXME, BUG, and HACK annotations with line numbers')
    .option('-p, --path <path>', 'Custom directory to scan', '.')
    .action((opts) => {
      runTodo(opts);
    });

  // 5. Stats
  program
    .command('stats')
    .description('Display repository metrics, lines of code breakdown, and git insights')
    .action(() => {
      runStats();
    });

  // 6. Mock API
  program
    .command('mock [file]')
    .description('Start instant zero-config mock REST API server with web dashboard')
    .option('-p, --port <port>', 'Port number to listen on', '3000')
    .option('-d, --delay <ms>', 'Artificial response latency in ms', '0')
    .option('-e, --error-rate <rate>', 'Simulated error rate (0.0 to 1.0)', '0')
    .option('-r, --read-only', 'Disallow data mutations')
    .action((file, opts) => {
      runMock(file, opts);
    });

  return program;
}
