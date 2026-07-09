# Deployment

## CI Workflow

The CI workflow runs on pushes to `main` and `develop`, and on pull requests. It executes:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run build`

## Deploy Workflow

The deploy workflow listens to successful completion of the CI workflow on `main`.

Steps:

1. Check out the commit that passed CI.
2. Install dependencies.
3. Build the project.
4. Write `~/.clasprc.json` from `CLASP_CREDENTIALS`.
5. Generate `.clasp.json` from `CLASP_SCRIPT_ID`.
6. Push `dist/` to Apps Script using `clasp`.

## Required GitHub Secrets

- `CLASP_CREDENTIALS`
- `CLASP_SCRIPT_ID`

## Authentication Format

`CLASP_CREDENTIALS` should contain the full JSON content of a valid `.clasprc.json` file created by `clasp login`.

## Operational Guidance

- Protect the `main` branch.
- Require CI to pass before merge.
- Restrict deployment secrets to trusted environments if your org requires approvals.
