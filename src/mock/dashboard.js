export function renderDashboardHtml({ title = 'Junior Mock API Dashboard', port = 3000, resources = [], config = {} }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0d1117;
      --card-bg: #161b22;
      --card-border: #30363d;
      --text: #f0f6fc;
      --text-muted: #8b949e;
      --primary: #58a6ff;
      --accent: #238636;
      --danger: #f85149;
      --warning: #d29922;
      --method-get: #388bfd;
      --method-post: #2ea043;
      --method-put: #bb8009;
      --method-delete: #f85149;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      line-height: 1.5;
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 24px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge {
      background: rgba(88, 166, 255, 0.15);
      color: var(--primary);
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 20px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .endpoint-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      margin-bottom: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
    }
    .endpoint-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tag-get { color: var(--method-get); font-weight: bold; width: 55px; }
    .tag-post { color: var(--method-post); font-weight: bold; width: 55px; }
    .btn {
      background: #21262d;
      color: var(--text);
      border: 1px solid var(--card-border);
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn:hover { background: #30363d; }
    .btn-danger { background: rgba(248, 81, 73, 0.1); color: var(--danger); border-color: rgba(248, 81, 73, 0.4); }
    .btn-danger:hover { background: var(--danger); color: #fff; }
    .control-group {
      margin-bottom: 16px;
    }
    .control-label {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    input[type="range"] {
      width: 100%;
      accent-color: var(--primary);
    }
    .logs-container {
      max-height: 280px;
      overflow-y: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
    }
    .log-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .status-200 { color: #2ea043; }
    .status-400, .status-404 { color: #d29922; }
    .status-500 { color: #f85149; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>⚡ Junior Mock API Server</h1>
      <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Zero-config REST server with instant live controls</p>
    </div>
    <div style="display: flex; gap: 10px;">
      <span class="badge">Port: ${port}</span>
      <span class="badge">Status: Online</span>
    </div>
  </div>

  <div class="grid">
    <!-- Endpoints -->
    <div class="card">
      <div class="card-title">
        <span>Available Collections & Endpoints</span>
        <span class="badge">${resources.length} Collections</span>
      </div>
      <div>
        ${resources.map(res => `
          <div class="endpoint-item">
            <div class="endpoint-left">
              <span class="tag-get">CRUD</span>
              <span>/api/${res}</span>
            </div>
            <a href="/api/${res}" target="_blank" class="btn">Open JSON ↗</a>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 14px; font-size: 12px; color: var(--text-muted);">
        Supports query parameters: <code>?q=search</code>, <code>?page=1&limit=10</code>, <code>?_sort=id&_order=desc</code>
      </div>
    </div>

    <!-- Live Chaos Simulation Controls -->
    <div class="card">
      <div class="card-title">
        <span>Chaos Engineering & Simulation</span>
      </div>

      <div class="control-group">
        <div class="control-label">
          <span>Artificial Response Latency</span>
          <span id="delayValue">0 ms</span>
        </div>
        <input type="range" id="delaySlider" min="0" max="2500" step="50" value="0">
      </div>

      <div class="control-group">
        <div class="control-label">
          <span>Random Failure / Error Rate</span>
          <span id="errorValue">0 %</span>
        </div>
        <input type="range" id="errorSlider" min="0" max="100" step="5" value="0">
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--card-border);">
        <span style="font-size: 13px; color: var(--text-muted);">Reset database to initial state:</span>
        <button id="btnReset" class="btn btn-danger">Reset DB</button>
      </div>
    </div>
  </div>

  <!-- Live Request History -->
  <div class="card" style="margin-top: 20px;">
    <div class="card-title">
      <span>Live Request History</span>
      <span class="badge" id="reqCount">0 requests</span>
    </div>
    <div class="logs-container" id="logsList">
      <div style="color: var(--text-muted); padding: 12px 0;">No incoming API requests yet. Call any endpoint to see live traffic!</div>
    </div>
  </div>

  <script>
    const delaySlider = document.getElementById('delaySlider');
    const delayValue = document.getElementById('delayValue');
    const errorSlider = document.getElementById('errorSlider');
    const errorValue = document.getElementById('errorValue');
    const btnReset = document.getElementById('btnReset');
    const logsList = document.getElementById('logsList');
    const reqCount = document.getElementById('reqCount');

    // Sync sliders
    delaySlider.addEventListener('input', (e) => {
      delayValue.textContent = e.target.value + ' ms';
      fetch('/_junior/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delay: Number(e.target.value) })
      });
    });

    errorSlider.addEventListener('input', (e) => {
      errorValue.textContent = e.target.value + ' %';
      fetch('/_junior/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorRate: Number(e.target.value) / 100 })
      });
    });

    btnReset.addEventListener('click', async () => {
      if (confirm('Reset mock database to initial snapshot?')) {
        await fetch('/_junior/reset', { method: 'POST' });
        alert('Database successfully restored!');
        location.reload();
      }
    });

    // Poll live request history
    async function updateLogs() {
      try {
        const res = await fetch('/_junior/logs');
        if (res.ok) {
          const logs = await res.json();
          reqCount.textContent = logs.length + ' requests';
          if (logs.length > 0) {
            logsList.innerHTML = logs.map(l => \`
              <div class="log-row">
                <div>
                  <span class="tag-\${l.method.toLowerCase()}">\${l.method}</span>
                  <span style="margin-left: 8px;">\${l.url}</span>
                </div>
                <div>
                  <span class="status-\${l.status}">\${l.status}</span>
                  <span style="color: var(--text-muted); margin-left: 10px;">\${l.duration}ms</span>
                  <span style="color: var(--text-muted); margin-left: 10px;">\${new Date(l.time).toLocaleTimeString()}</span>
                </div>
              </div>
            \`).join('');
          }
        }
      } catch (e) {}
    }

    setInterval(updateLogs, 1500);
    updateLogs();
  </script>
</body>
</html>
`;
}
