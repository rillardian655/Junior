import fs from 'node:fs';
import path from 'node:path';

export const SECRET_RULES = [
  {
    name: 'AWS Access Key ID',
    regex: /\b(AKIA[0-9A-Z]{16})\b/g
  },
  {
    name: 'GitHub Personal Access Token',
    regex: /\b(gh[pousr]_[0-9a-zA-Z]{36,255})\b/g
  },
  {
    name: 'OpenAI API Key',
    regex: /\b(sk-[a-zA-Z0-9]{32,56})\b/g
  },
  {
    name: 'Google API Key',
    regex: /\b(AIza[0-9A-Za-z\-_]{35})\b/g
  },
  {
    name: 'Slack Webhook',
    regex: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]+\/B[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+/g
  },
  {
    name: 'Stripe Secret Key',
    regex: /\b(sk_live_[0-9a-zA-Z]{24,})\b/g
  },
  {
    name: 'Private Key Block',
    regex: /-----BEGIN (?:RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----/g
  },
  {
    name: 'Generic Hardcoded Secret/Token',
    regex: /(?:secret|password|token|apikey|api_key)\s*[:=]\s*["']([A-Za-z0-9_\-\.]{20,})["']/gi
  }
];

export const SENSITIVE_FILENAMES = [
  /^\.env(?:\..+)?$/,
  /^id_rsa(?:\.pub)?$/,
  /\.pem$/,
  /\.key$/,
  /credentials\.json$/
];

export function scanFileContent(filePath, content) {
  const leaks = [];

  // Check file name
  const basename = path.basename(filePath);
  for (const pattern of SENSITIVE_FILENAMES) {
    if (pattern.test(basename)) {
      leaks.push({
        file: filePath,
        rule: 'Sensitive File Name',
        matched: basename,
        line: 0
      });
      break;
    }
  }

  // Check content line by line
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // Skip comments in lockfiles or mock samples
    if (filePath.endsWith('.lock') || filePath.includes('node_modules')) return;

    for (const rule of SECRET_RULES) {
      rule.regex.lastIndex = 0;
      let match;
      while ((match = rule.regex.exec(line)) !== null) {
        // Redact part of the match for safe reporting
        const val = match[1] || match[0];
        const redacted = val.length > 8
          ? val.substring(0, 4) + '...' + val.substring(val.length - 4)
          : '***';

        leaks.push({
          file: filePath,
          rule: rule.name,
          matched: redacted,
          line: index + 1
        });
      }
    }
  });

  return leaks;
}

export function scanStaged(files = []) {
  const leaks = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    try {
      const stat = fs.statSync(file);
      if (stat.size > 1024 * 1024) continue; // skip files > 1MB
      const content = fs.readFileSync(file, 'utf-8');
      leaks.push(...scanFileContent(file, content));
    } catch {
      // Ignore binary or inaccessible files
    }
  }
  return leaks;
}
