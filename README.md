# junior

A modular developer CLI toolkit and zero-config mock REST API server with real-time web inspection and network chaos simulation.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

---

## Overview

`junior` is an all-in-one developer utility designed to streamline common terminal tasks and accelerate frontend/mobile development:

- **Interactive Commit Generator**: Formats commit messages according to Conventional Commits standards with automated staged secret checks.
- **Credential Leak Scanner**: Scans working trees or staged files for accidentally exposed API keys, tokens, and private keys.
- **Terminal Cheatsheets**: Offline quick-reference command guides for common tools (`git`, `docker`, `chmod`, `linux`, `curl`, `http`, `regex`) with online fallback.
- **Code Annotation Inspector**: Aggregates `TODO`, `FIXME`, and `BUG` markers across codebases with exact file line locations.
- **Repository Metrics**: Analyzes commit counts, active branches, contributors, and lines of code by language.
- **Mock REST API Server**: Generates complete CRUD endpoints from any JSON file with an integrated web dashboard and latency/error simulation.

---

## Command Reference

| Command | Description |
| :--- | :--- |
| `junior commit` | Interactive prompt for Conventional Commits with pre-commit secret leak checks. |
| `junior scan` | Recursively scans codebase for leaked credentials and sensitive files. |
| `junior cheat <topic>` | Displays quick reference cheatsheets in the terminal. |
| `junior todo` | Discovers and groups code annotations (`TODO`, `FIXME`, `BUG`, `HACK`). |
| `junior stats` | Summarizes repository history, lines of code, and language distribution. |
| `junior mock [file]` | Launches a local REST API server with full CRUD and web dashboard. |

---

## Installation

### Local Installation

```bash
git clone https://github.com/rillardian655/Junior.git
cd Junior
npm install
npm link
```

Once linked, the `junior` binary is accessible globally in your terminal.

Alternatively, execute directly via `node`:

```bash
node bin/junior.js --help
```

---

## Usage Guide

### 1. Interactive Commit (`junior commit`)

Guides you through commit type selection, optional scope, description, and breaking change flags:

```bash
junior commit
```

- Prompts to stage unstaged changes (`git add -A`) if no files are currently staged.
- Runs a security scan on staged files before committing to prevent credential leaks.
- Produces standardized Conventional Commits (e.g., `feat(auth): add OAuth2 provider`).

---

### 2. Secret & Credential Scanner (`junior scan`)

Scans for patterns matching high-entropy secrets and sensitive files:

```bash
# Scan full working directory
junior scan

# Scan only files currently staged in git
junior scan --staged
```

**Detected secret patterns:**
- AWS Access Key IDs (`AKIA...`)
- GitHub Personal Access Tokens (`ghp_...`, `gho_...`)
- OpenAI API Keys (`sk-...`)
- Google / Gemini API Keys (`AIza...`)
- Stripe Secret Keys (`sk_live_...`)
- Private key blocks (RSA, OpenSSH, DSA, EC, PGP)
- Sensitive files (`.env`, `id_rsa`, `*.pem`, `*.key`)

---

### 3. Terminal Cheatsheet (`junior cheat`)

Displays command references without opening a browser:

```bash
# List available offline topics
junior cheat

# View specific cheatsheet
junior cheat git
junior cheat docker
junior cheat chmod
junior cheat linux
junior cheat curl
junior cheat http
junior cheat regex

# Query any tool or language via cht.sh fallback
junior cheat rust
```

---

### 4. Codebase Annotation Scanner (`junior todo`)

Scans your repository for unresolved technical debt:

```bash
junior todo
```

Sample output:

```
● Junior Code Annotations & TODO Scanner
Found 2 annotation(s) across 2 file(s):

  src/server.js
    Line  42: [TODO] Add rate-limiting middleware for auth routes
  src/auth.js
    Line  15: [FIXME] Token expiration timestamp not enforced
```

---

### 5. Repository Metrics (`junior stats`)

Provides a summary of codebase composition:

```bash
junior stats
```

Output includes active branch, commit history count, contributors list, and a proportional breakdown of lines of code across tracked file formats.

---

### 6. Mock REST API Server (`junior mock`)

Generates a fully functional REST API backed by a JSON store:

```bash
# Launch with sample database
junior mock sample/db.json --port 3000

# Options
junior mock db.json --port 8080 --delay 200 --read-only
```

#### Available Endpoints

For each collection in your JSON file (e.g., `users`, `posts`):

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/:resource` | Retrieve collection with support for `?q=`, `?page=1&limit=10`, `?_sort=field&_order=asc` |
| `GET` | `/api/:resource/:id` | Retrieve single item by ID |
| `POST` | `/api/:resource` | Create new record (auto-assigns ID and timestamps) |
| `PUT` | `/api/:resource/:id` | Full record update |
| `PATCH` | `/api/:resource/:id` | Partial record update |
| `DELETE` | `/api/:resource/:id` | Remove record |

#### Web Dashboard & Chaos Simulation

Open `http://localhost:3000/_junior` in your browser:
- **Live Request Inspector**: Real-time log of incoming HTTP requests with latency, method, and status codes.
- **Latency Slider**: Simulates network delay (0–2500ms) to evaluate client loading states.
- **Chaos Error Rate**: Simulates random 500 internal server errors to verify client error boundaries.
- **Header Overrides**: Send `x-mock-delay: 1000` or `x-mock-status: 503` for per-request overrides.

---

## Testing

Run the automated test suite:

```bash
npm test
```

Includes 17 test cases covering the CLI commands, secret scanner regex rules, cheatsheet validation, and Mock API REST operations with Supertest.

---

## Project Structure

```
junior/
├── bin/
│   └── junior.js                # CLI executable entrypoint
├── src/
│   ├── cli.js                   # Command routing & option definitions
│   ├── commands/
│   │   ├── commit.js            # Interactive commit builder
│   │   ├── scan.js              # Secret scanner command
│   │   ├── cheat.js             # Cheatsheet lookup command
│   │   ├── todo.js              # Annotation inspector
│   │   ├── stats.js             # Repository metrics collector
│   │   └── mock.js              # Mock server runner
│   ├── cheats/
│   │   └── data.js              # Curated cheatsheet dataset
│   ├── scanner/
│   │   └── rules.js             # Detection rules & file inspectors
│   ├── mock/
│   │   ├── store.js             # JSON file-backed datastore
│   │   ├── server.js            # Express REST CRUD engine
│   │   └── dashboard.js         # Embedded web dashboard
│   └── utils/
│       ├── git.js               # Git subprocess helpers
│       └── ui.js                # Formatted terminal output utilities
├── sample/
│   └── db.json                  # Sample mock data
├── test/
│   ├── cheat.test.js
│   ├── mock.test.js
│   └── scan.test.js
├── package.json
└── README.md
```

---

## License

This project is licensed under the [MIT License](LICENSE).
