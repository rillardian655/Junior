import pc from 'picocolors';

export const banner = `
${pc.cyan(pc.bold('    ╔═══════════════════════════════════════════╗'))}
${pc.cyan(pc.bold('    ║'))}   ${pc.yellow(pc.bold('★ J U N I O R'))} ${pc.dim('— The Developer Swiss Army')}   ${pc.cyan(pc.bold('║'))}
${pc.cyan(pc.bold('    ╚═══════════════════════════════════════════╝'))}
`;

export function header(title) {
  console.log(`\n${pc.bold(pc.cyan('● ' + title))}`);
}

export function success(msg) {
  console.log(`${pc.green('✔')} ${msg}`);
}

export function info(msg) {
  console.log(`${pc.blue('ℹ')} ${msg}`);
}

export function warn(msg) {
  console.log(`${pc.yellow('⚠')} ${msg}`);
}

export function error(msg) {
  console.log(`${pc.red('✖')} ${msg}`);
}

export function box(lines) {
  const width = Math.max(...lines.map(l => l.replace(/\u001b\[[0-9;]*m/g, '').length), 40) + 4;
  const top = '┌' + '─'.repeat(width) + '┐';
  const bottom = '└' + '─'.repeat(width) + '┘';

  console.log(pc.dim(top));
  for (const line of lines) {
    const rawLen = line.replace(/\u001b\[[0-9;]*m/g, '').length;
    const padding = ' '.repeat(Math.max(0, width - rawLen - 2));
    console.log(`${pc.dim('│')}  ${line}${padding}${pc.dim('│')}`);
  }
  console.log(pc.dim(bottom));
}
