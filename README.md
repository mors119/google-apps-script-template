# Google Apps Script TypeScript Template

Production-ready template repository for Google Apps Script projects built entirely from VSCode using TypeScript, esbuild, Vitest, clasp, and GitHub Actions.

## Overview

This template is designed for teams that want modern engineering discipline around Google Apps Script development. It enforces layered architecture, strict typing, reusable services, centralized configuration, automated quality gates, and CI/CD-based deployment.

Developers write TypeScript locally, validate changes with linting and tests, build Apps Script-compatible output into `dist/`, and deploy through GitHub Actions using `clasp`.

## Features

- Strict TypeScript with `noImplicitAny` and additional compiler safeguards
- Layered architecture: presentation, service, infrastructure, and Google Apps Script API boundaries
- Centralized configuration through `ConfigService`
- `esbuild` bundling for Apps Script-compatible deployment artifacts
- ESLint flat config with TypeScript-aware rules
- Prettier formatting for consistent code style
- Vitest unit testing with coverage
- GitHub Actions workflows for CI and deployment
- `clasp`-based deployment without web-editor development
- Reusable service and infrastructure abstractions suited for team-scale projects

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Create local clasp configuration

Copy `.clasp.json.example` to `.clasp.json` and replace the script ID.

```json
{
  "scriptId": "YOUR_SCRIPT_ID",
  "rootDir": "dist"
}
```

### 3. Configure Script Properties

Set these properties in your Apps Script project:

- `PRODUCT_API`
- `MENU_TITLE` (optional)

### 4. Authenticate clasp locally

```bash
npx clasp login
```

## Development

Useful commands:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run push`
- `npm run pull`
- `npm run deploy`

The build output is generated in `dist/` and is ready for `clasp push`.

## Deployment

Deployment is handled by GitHub Actions. The deploy workflow runs only after the CI workflow succeeds on `main`.

Required GitHub Secrets:

- `CLASP_CREDENTIALS`: full contents of `.clasprc.json`
- `CLASP_SCRIPT_ID`: target Apps Script project ID

The deploy job rebuilds the project, generates `.clasp.json`, and pushes `dist/` to Google Apps Script using `clasp`.

## Repository Structure

```text
.
├── .github/workflows/
├── .vscode/
├── dist/
├── docs/
├── scripts/
├── src/
│   ├── config/
│   ├── infrastructure/
│   ├── menu/
│   ├── services/
│   ├── triggers/
│   ├── utils/
│   └── index.ts
├── tests/
├── .clasp.json.example
├── appsscript.json
├── esbuild.config.js
├── eslint.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Minimal Working Example

The template includes:

- A custom spreadsheet menu installed by `onOpen`
- A `runTemplateDemo` Apps Script function
- An `HttpRequestService` for external requests
- A `ConfigService` for centralized configuration
- An `AppsScriptLogger` for structured logging

The demo function reads `PRODUCT_API` from Script Properties, issues a request through the service layer, logs the result, and displays a UI alert.

## Contributing

1. Create a feature branch.
2. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
3. Open a pull request with a clear description of the change.

Additional contributor guidance is documented in [docs/Contributing.md](./docs/Contributing.md).

## Troubleshooting

- If `clasp push` fails locally, verify `.clasp.json`, your local `clasp login`, and the target script permissions.
- If CI fails on `npm ci`, ensure `package-lock.json` is committed and dependency versions are valid.
- If deployment fails, verify `CLASP_CREDENTIALS` and `CLASP_SCRIPT_ID` secrets.
- If runtime requests fail, confirm that `PRODUCT_API` is set and required scopes exist in `appsscript.json`.
