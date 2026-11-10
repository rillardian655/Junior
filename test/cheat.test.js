import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CHEATS } from '../src/cheats/data.js';

describe('Junior Cheatsheets', () => {
  it('should contain comprehensive git commands', () => {
    assert.ok(Array.isArray(CHEATS.git));
    assert.ok(CHEATS.git.length >= 5);
    const hasAmend = CHEATS.git.some(item => item.cmd.includes('amend'));
    assert.ok(hasAmend);
  });

  it('should contain docker, linux, chmod, and http status codes', () => {
    assert.ok(CHEATS.docker.length > 0);
    assert.ok(CHEATS.linux.length > 0);
    assert.ok(CHEATS.chmod.length > 0);
    assert.ok(CHEATS.http.length > 0);
  });
});
