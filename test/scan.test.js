import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { scanFileContent } from '../src/scanner/rules.js';

describe('Junior Secret & Leak Scanner', () => {
  it('should detect AWS Access Keys', () => {
    const content = 'const AWS_KEY = "AKIAIOSFODNN7EXAMPLE";';
    const leaks = scanFileContent('config.js', content);
    assert.equal(leaks.length, 1);
    assert.equal(leaks[0].rule, 'AWS Access Key ID');
  });

  it('should detect OpenAI API Keys', () => {
    const content = 'export OPENAI_API_KEY="sk-abcdef1234567890abcdef1234567890"';
    const leaks = scanFileContent('server.js', content);
    assert.ok(leaks.length >= 1);
    assert.ok(leaks.some(l => l.rule === 'OpenAI API Key'));
  });

  it('should detect GitHub Personal Access Tokens', () => {
    const content = 'ghp_0123456789abcdefghijklmnopqrstuvwxyz01';
    const leaks = scanFileContent('deploy.sh', content);
    assert.equal(leaks.length, 1);
    assert.equal(leaks[0].rule, 'GitHub Personal Access Token');
  });

  it('should detect sensitive file names like .env or id_rsa', () => {
    const leaks = scanFileContent('.env', 'PORT=3000');
    assert.ok(leaks.some(l => l.rule === 'Sensitive File Name'));
  });

  it('should pass cleanly for standard code without secrets', () => {
    const content = `
      function hello(name) {
        return "Hello, " + name;
      }
      export default hello;
    `;
    const leaks = scanFileContent('index.js', content);
    assert.equal(leaks.length, 0);
  });
});
