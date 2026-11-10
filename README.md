<div align="center">

# ★ J U N I O R ★

**The Developer Swiss-Army Knife & Zero-Config Mock REST API**

[![CI](https://github.com/rillardian655/Junior/actions/workflows/ci.yml/badge.svg)](https://github.com/rillardian655/Junior/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rillardian655/Junior/pulls)

*A practical, all-in-one developer companion CLI built to streamline your daily workflow, prevent accidental credential leaks, craft standardized commits, and spin up instant Mock REST APIs with built-in Chaos Engineering controls.*

</div>

---

## ⚡ Why Junior?

As software engineers, we often juggle multiple small CLI tools, struggle with remembering git syntax, forget to sanitize secret keys before pushing, or need a quick local REST API to test frontend or mobile apps.

**`Junior`** consolidates the essential daily tools every developer needs into a single, lightning-fast binary with zero fluff.

---

## 🚀 Key Features

| Command | Description |
| :--- | :--- |
| `junior commit` | **Interactive Conventional Commit Maker** — Guides you through commit types, scopes, and checks for accidental secrets before committing. |
| `junior scan` | **Credential & Secret Leak Detector** — Scans your code and staged files for exposed AWS keys, GitHub tokens, OpenAI keys, private keys, and `.env` files. |
| `junior cheat <topic>` | **Instant Cheatsheets** — Fast terminal cheatsheet for `git`, `docker`, `chmod`, `linux`, `curl`, `http`, and `regex` with automatic online fallback to `cht.sh`. |
| `junior todo` | **Annotation Scanner** — Locates and groups `TODO:`, `FIXME:`, `BUG:`, and `HACK:` comments across your entire codebase with line numbers. |
| `junior stats` | **Project & Git Insights** — Summarizes lines of code (LOC), language distributions, commit counts, and top contributors. |
| `junior mock [file]` | **Zero-Config Mock REST API** — Spins up instant CRUD endpoints from any JSON file with an interactive real-time Web Dashboard, latency simulation, and chaos error testing. |

---

## 📦 Installation & Quick Start

### 1. Clone & Link Locally
```bash
git clone https://github.com/rillardian655/Junior.git
cd Junior
npm install
npm link
```

### 2. Or Run Directly via Node
```bash
node bin/junior.js --help
```

---

## 🛠️ Usage Examples

### 1. Interactive Git Commit (`junior commit`)
Never write messy commit messages again. Enforces [Conventional Commits](https://www.conventionalcommits.org/):
```bash
junior commit
```
* Automatically detects unstaged changes and offers to stage them (`git add -A`).
* Scans staged files for sensitive tokens or keys before committing.
* Generates standardized messages like `feat(auth): add OAuth2 google login`.

---

### 2. Secret & Token Leak Scanner (`junior scan`)
Prevent embarrassing and dangerous leaks before they hit GitHub:
```bash
# Scan whole directory
junior scan

# Scan only git staged files (perfect for pre-commit hooks)
junior scan --staged
```
**Detects:**
- AWS Access Key IDs (`AKIA...`)
- GitHub Personal Access Tokens (`ghp_...`, `gho_...`)
- OpenAI API Keys (`sk-...`)
- Google / Gemini API Keys (`AIza...`)
- Slack Webhook URLs
- Private Keys (`BEGIN RSA/OPENSSH PRIVATE KEY`)
- Sensitive file names accidentally added (`.env`, `id_rsa`, `*.pem`)

---

### 3. Instant Terminal Cheatsheet (`junior cheat`)
No need to open a browser to search for command options:
```bash
junior cheat git
junior cheat docker
junior cheat chmod
junior cheat linux
junior cheat curl
junior cheat http
junior cheat regex
```
*Need something else?* Query any command or language directly (e.g. `junior cheat rust` or `junior cheat tar`) and Junior queries community cheatsheets with fallback.

---

### 4. TODO & Technical Debt Inspector (`junior todo`)
Find all pending tasks before a sprint review or release:
```bash
junior todo
```
Sample output:
```
● Junior Code Annotations & TODO Scanner
⚠ Found 3 annotation(s) across 2 file(s):

  src/server.js
    Line  42: [TODO] Add rate-limiting middleware for auth routes
    Line  89: [FIXME] Handle edge case when token is malformed

  src/auth.js
    Line  15: [BUG] Session does not expire on password reset
```

---

### 5. Repository Insights & Codebase Metrics (`junior stats`)
Get instant visibility into your repository:
```bash
junior stats
```
Displays:
* Active branch & total commit history
* Top contributors
* Total lines of code and percentage breakdown by language (JavaScript, TypeScript, Python, Dart, Rust, etc.)

---

### 6. Zero-Config Mock REST API & Web Dashboard (`junior mock`)
Spin up a fully-functional REST API server with zero boilerplate:
```bash
# Start server with sample database (or specify custom db.json)
junior mock sample/db.json --port 3000
```

#### What you get automatically:
* **Full CRUD Endpoints:**
  * `GET    /api/users` (supports `?page=1&limit=10`, `?q=search`, `?_sort=name&_order=asc`)
  * `GET    /api/users/:id`
  * `POST   /api/users` (auto-generates IDs and timestamps)
  * `PUT    /api/users/:id`
  * `PATCH  /api/users/:id`
  * `DELETE /api/users/:id`
* **Real-time Web Dashboard:** Open `http://localhost:3000/_junior` in your browser.
* **Chaos Engineering & Network Simulation:**
  * Latency Slider: simulate 2G/3G networks (0ms - 2500ms delay).
  * Error Rate: simulate random 500 server crashes to test frontend error boundaries.
  * Header overrides: pass `x-mock-status: 500` or `x-mock-delay: 1000` per request.

---

## 🧪 Running Automated Tests

Junior includes a comprehensive test suite built with Node's native test runner and Supertest:

```bash
npm test
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/rillardian655/Junior/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/amazing-feature`)
3. Commit your Changes (`junior commit`)
4. Push to the Branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
  Crafted with care by <a href="https://github.com/rillardian655">xianly runa</a> 🚀
</div>
