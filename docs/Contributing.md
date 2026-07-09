# Contributing

## Standards

This repository is intended to be a reusable template. Changes should prioritize maintainability, clarity, and extensibility over convenience.

## Before Opening a Pull Request

Run the full validation suite:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Contribution Guidelines

- Keep service boundaries explicit.
- Avoid direct platform API calls in business logic.
- Add or update tests for behavioral changes.
- Document architectural changes in `docs/`.
- Do not introduce hardcoded environment-specific URLs or identifiers.

## Review Criteria

Changes should be easy for another team to adopt in a fresh repository created from this template. Favor additive patterns that teams can extend rather than rewrite.
