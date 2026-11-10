import express from 'express';
import cors from 'cors';
import pc from 'picocolors';
import { renderDashboardHtml } from './dashboard.js';

export function createMockApp(store, initialConfig = {}) {
  const app = express();
  const config = {
    delay: initialConfig.delay || 0,
    errorRate: initialConfig.errorRate || 0,
    port: initialConfig.port || 3000
  };

  const requestLogs = [];
  const MAX_LOGS = 50;

  app.use(cors());
  app.use(express.json());

  // Request logger & inspector middleware
  app.use((req, res, next) => {
    const start = Date.now();

    // Intercept finish to record log
    res.on('finish', () => {
      // Don't record internal dashboard calls to avoid clutter
      if (req.path.startsWith('/_junior')) return;

      const duration = Date.now() - start;
      requestLogs.unshift({
        id: Math.random().toString(36).substring(2, 9),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        time: new Date().toISOString()
      });

      if (requestLogs.length > MAX_LOGS) {
        requestLogs.pop();
      }

      // Console color logger
      const statusColor = res.statusCode >= 500 ? pc.red : (res.statusCode >= 400 ? pc.yellow : pc.green);
      console.log(
        `  ${pc.bold(req.method.padEnd(7))} ` +
        `${pc.cyan(req.originalUrl.padEnd(30))} ` +
        `${statusColor(res.statusCode)} ${pc.dim(`${duration}ms`)}`
      );
    });

    next();
  });

  // Chaos & delay simulation middleware
  app.use(async (req, res, next) => {
    // Skip for dashboard endpoints
    if (req.path.startsWith('/_junior')) return next();

    // Check header override for delay
    const headerDelay = parseInt(req.headers['x-mock-delay'], 10);
    const delay = !isNaN(headerDelay) ? headerDelay : config.delay;
    if (delay > 0) {
      await new Promise(r => setTimeout(r, delay));
    }

    // Check header override for status code
    const headerStatus = parseInt(req.headers['x-mock-status'], 10);
    if (!isNaN(headerStatus)) {
      return res.status(headerStatus).json({
        error: 'Simulated status code from x-mock-status header',
        statusCode: headerStatus
      });
    }

    // Chaos error injection based on errorRate
    if (config.errorRate > 0 && Math.random() < config.errorRate) {
      return res.status(500).json({
        error: 'Junior Chaos Engine: Simulated Random Server Failure (500)',
        simulated: true
      });
    }

    next();
  });

  // --- Dashboard Endpoints ---
  app.get(['/', '/_junior'], (req, res) => {
    const resources = store.getResources();
    const html = renderDashboardHtml({
      port: config.port,
      resources,
      config
    });
    res.type('html').send(html);
  });

  app.get('/_junior/logs', (req, res) => {
    res.json(requestLogs);
  });

  app.post('/_junior/config', (req, res) => {
    if (req.body.delay !== undefined) config.delay = Math.max(0, Number(req.body.delay));
    if (req.body.errorRate !== undefined) config.errorRate = Math.max(0, Math.min(1, Number(req.body.errorRate)));
    res.json({ ok: true, config });
  });

  app.post('/_junior/reset', (req, res) => {
    const restored = store.reset();
    res.json({ ok: true, restored });
  });

  // --- Dynamic CRUD Endpoints ---
  // List / Query
  app.get('/api/:resource', (req, res) => {
    const { resource } = req.params;
    const result = store.getAll(resource, req.query);

    if (result === null) {
      return res.status(404).json({ error: `Resource collection '${resource}' not found.` });
    }

    if (result.pagination) {
      res.setHeader('X-Total-Count', result.pagination.total);
      return res.json(result);
    }

    res.setHeader('X-Total-Count', result.totalCount);
    res.json(result.data);
  });

  // Get by ID
  app.get('/api/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const item = store.getById(resource, id);

    if (!item) {
      return res.status(404).json({ error: `Item with id '${id}' not found in '${resource}'.` });
    }

    res.json(item);
  });

  // Create
  app.post('/api/:resource', (req, res) => {
    const { resource } = req.params;
    const created = store.create(resource, req.body || {});
    res.status(201).json(created);
  });

  // Full Update (PUT)
  app.put('/api/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const updated = store.update(resource, id, req.body || {}, true);

    if (!updated) {
      return res.status(404).json({ error: `Item with id '${id}' not found in '${resource}'.` });
    }

    res.json(updated);
  });

  // Partial Update (PATCH)
  app.patch('/api/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const updated = store.update(resource, id, req.body || {}, false);

    if (!updated) {
      return res.status(404).json({ error: `Item with id '${id}' not found in '${resource}'.` });
    }

    res.json(updated);
  });

  // Delete
  app.delete('/api/:resource/:id', (req, res) => {
    const { resource, id } = req.params;
    const deleted = store.delete(resource, id);

    if (!deleted) {
      return res.status(404).json({ error: `Item with id '${id}' not found in '${resource}'.` });
    }

    res.status(200).json({ success: true, deleted });
  });

  return { app, config };
}
