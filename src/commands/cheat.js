import pc from 'picocolors';
import { CHEATS } from '../cheats/data.js';
import { header, info, warn } from '../utils/ui.js';

export async function runCheat(topic) {
  if (!topic) {
    header('Junior Instant Cheatsheet');
    info('Available built-in topics:');
    console.log();
    for (const key of Object.keys(CHEATS)) {
      console.log(`  ${pc.cyan('●')} ${pc.bold(key.padEnd(10))} ${pc.dim(`(${CHEATS[key].length} commands)`)}`);
    }
    console.log(`\nUsage: ${pc.green('junior cheat <topic>')} (e.g. ${pc.yellow('junior cheat git')})\n`);
    return;
  }

  const normalized = topic.toLowerCase().trim();
  const list = CHEATS[normalized];

  if (list) {
    header(`Cheatsheet: ${normalized.toUpperCase()}`);
    console.log();
    for (const item of list) {
      console.log(`  ${pc.green('$')} ${pc.bold(item.cmd)}`);
      console.log(`    ${pc.dim('↳ ' + item.desc)}\n`);
    }
    return;
  }

  // Fallback: try querying cht.sh via fetch (supports any language or tool, e.g. rust, tar, go)
  info(`Topic "${topic}" not in offline database. Querying community cheatsheet (cht.sh)...`);
  try {
    const res = await fetch(`https://cht.sh/${encodeURIComponent(topic)}?qT`, {
      headers: { 'User-Agent': 'curl/8.0' },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const text = await res.text();
      console.log(`\n${text.slice(0, 1500)}\n`);
      return;
    }
  } catch (err) {
    // network failed or timed out
  }

  warn(`No cheatsheet found for "${topic}".`);
  console.log(`Available offline topics: ${Object.keys(CHEATS).join(', ')}`);
}
