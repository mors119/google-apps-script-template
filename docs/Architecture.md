# Architecture

## Goal

This template applies backend-style engineering practices to Google Apps Script projects so teams can scale implementation without relying on the Apps Script editor.

## Layered Design

The repository separates responsibilities into four layers:

1. Presentation
2. Service
3. Infrastructure
4. Platform and external integrations

### Presentation

Located in `src/index.ts`, `src/menu`, and `src/triggers`.

Responsibilities:

- expose global Apps Script entry points
- handle UI interactions
- delegate business logic to services

### Service

Located in `src/services`.

Responsibilities:

- orchestrate use cases
- enforce business rules
- depend on abstractions instead of Google APIs directly

### Infrastructure

Located in `src/infrastructure`.

Responsibilities:

- wrap Google Apps Script APIs
- implement HTTP, logging, and configuration access
- isolate platform-specific behavior

### Configuration

Located in `src/config`.

Responsibilities:

- define configuration keys
- centralize property lookup
- assemble the application container

## Dependency Flow

Dependencies flow inward:

- presentation depends on services
- services depend on infrastructure interfaces
- infrastructure depends on Google Apps Script APIs

This design keeps core logic testable and reduces coupling to runtime globals.

## Build Strategy

`esbuild` bundles `src/index.ts` into `dist/Code.js` and copies `appsscript.json` into `dist/`. `clasp` then pushes the `dist/` directory to Apps Script.

## Configuration Strategy

No source file should hardcode service endpoints. External endpoints must be read through `ConfigService`, typically from Script Properties. This keeps the template environment-agnostic and deployment-safe.
