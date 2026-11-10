import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { MockStore } from '../src/mock/store.js';
import { createMockApp } from '../src/mock/server.js';

describe('Junior Mock REST API & Server', () => {
  let store;
  let app;

  beforeEach(() => {
    store = new MockStore(null, { readOnly: true });
    store.setFullData({
      users: [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
        { id: 3, name: 'Charlie', role: 'user' }
      ],
      posts: [
        { id: 1, title: 'First Post', authorId: 1 }
      ]
    });
    const created = createMockApp(store, { port: 0 });
    app = created.app;
  });

  it('GET /api/users should return all users', async () => {
    const res = await request(app).get('/api/users');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 3);
    assert.equal(res.headers['x-total-count'], '3');
  });

  it('GET /api/users/:id should return single user', async () => {
    const res = await request(app).get('/api/users/2');
    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Bob');
  });

  it('GET /api/users?role=admin should filter by field', async () => {
    const res = await request(app).get('/api/users?role=admin');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].name, 'Alice');
  });

  it('GET /api/users?q=charlie should perform full-text search', async () => {
    const res = await request(app).get('/api/users?q=charlie');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].name, 'Charlie');
  });

  it('GET /api/users?page=1&limit=2 should paginate results', async () => {
    const res = await request(app).get('/api/users?page=1&limit=2');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.length, 2);
    assert.equal(res.body.pagination.total, 3);
    assert.equal(res.body.pagination.totalPages, 2);
  });

  it('POST /api/users should create a new record', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Diana', role: 'developer' });

    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'Diana');
    assert.equal(res.body.id, 4);
    assert.ok(res.body.createdAt);
  });

  it('PATCH /api/users/:id should partially update a record', async () => {
    const res = await request(app)
      .patch('/api/users/1')
      .send({ role: 'superadmin' });

    assert.equal(res.status, 200);
    assert.equal(res.body.role, 'superadmin');
    assert.equal(res.body.name, 'Alice');
  });

  it('DELETE /api/users/:id should remove a record', async () => {
    const res = await request(app).delete('/api/users/2');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    const check = await request(app).get('/api/users/2');
    assert.equal(check.status, 404);
  });

  it('should support simulated error status via x-mock-status header', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('x-mock-status', '503');

    assert.equal(res.status, 503);
    assert.equal(res.body.statusCode, 503);
  });

  it('GET / should serve the Web Dashboard HTML', async () => {
    const res = await request(app).get('/_junior');
    assert.equal(res.status, 200);
    assert.match(res.text, /Junior Mock API Dashboard/);
  });
});
