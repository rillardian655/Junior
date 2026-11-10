import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { MockStore } from '../mock/store.js';
import { createMockApp } from '../mock/server.js';
import { header, success, warn, info } from '../utils/ui.js';

export function runMock(fileArg, options = {}) {
  header('Junior Mock REST API Server');

  const defaultFile = path.resolve(process.cwd(), fileArg || 'db.json');

  // Check if file exists, if not scaffold starter data
  if (!fs.existsSync(defaultFile)) {
    const samplePath = path.resolve(import.meta.dirname, '../../sample/db.json');
    if (fs.existsSync(samplePath)) {
      fs.copyFileSync(samplePath, defaultFile);
      success(`Created starter database at ${pc.bold(path.basename(defaultFile))}`);
    } else {
      fs.writeFileSync(defaultFile, JSON.stringify({ users: [], posts: [] }, null, 2), 'utf-8');
      success(`Initialized empty database at ${pc.bold(path.basename(defaultFile))}`);
    }
  }

  const port = parseInt(options.port, 10) || 3000;
  const delay = parseInt(options.delay, 10) || 0;
  const errorRate = parseFloat(options.errorRate) || 0;
  const readOnly = Boolean(options.readOnly);

  const store = new MockStore(defaultFile, { readOnly });
  const { app } = createMockApp(store, { port, delay, errorRate });

  const server = app.listen(port, () => {
    const resources = store.getResources();

    console.log();
    console.log(`  ${pc.bold(pc.green('●'))} ${pc.bold('Server Status:')}   ${pc.green('Running online')}`);
    console.log(`  ${pc.bold(pc.cyan('●'))} ${pc.bold('Local URL:')}        ${pc.underline(`http://localhost:${port}`)}`);
    console.log(`  ${pc.bold(pc.magenta('●'))} ${pc.bold('Web Dashboard:')}    ${pc.underline(`http://localhost:${port}/_junior`)}`);
    console.log(`  ${pc.bold(pc.yellow('●'))} ${pc.bold('Database File:')}    ${path.relative(process.cwd(), defaultFile)} ${readOnly ? pc.red('(READ-ONLY)') : ''}`);
    if (delay > 0) console.log(`  ${pc.bold(pc.blue('●'))} ${pc.bold('Default Delay:')}    ${delay}ms`);
    if (errorRate > 0) console.log(`  ${pc.bold(pc.red('●'))} ${pc.bold('Chaos Error:')}     ${(errorRate * 100).toFixed(0)}% failure rate`);

    console.log(`\n  ${pc.bold('Available REST Collections:')}`);
    for (const res of resources) {
      console.log(`    ${pc.cyan('GET / POST')}          ${pc.white(`/api/${res}`)}`);
      console.log(`    ${pc.cyan('GET / PUT / DEL')}     ${pc.white(`/api/${res}/:id`)}`);
    }

    console.log(`\n  ${pc.dim('Press Ctrl+C to stop the server.')}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      warn(`Port ${port} is already in use. Try passing --port <another_port>`);
    } else {
      console.error(err);
    }
  });

  return server;
}
