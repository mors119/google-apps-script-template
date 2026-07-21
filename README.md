# Google Apps Script TypeScript Starter

Reusable Google Workspace automation starter for teams building Google
Apps Script projects in TypeScript with clean architecture, esbuild,
Vitest, clasp, and GitHub Actions.

## Vision

This repository is a framework-style starter for Google Workspace
automation rather than a single-product demo.

It separates entrypoints, application services, domain models, ports,
infrastructure adapters, and Google-specific runtime integrations so
teams can build:

-   Google Sheets automations
-   Gmail workflows
-   Google Calendar jobs
-   Google Drive jobs
-   Web Apps
-   Time-driven triggers
-   Event-driven triggers

Business logic should not directly depend on `SpreadsheetApp`,
`GmailApp`, `CalendarApp`, `DriveApp`, or other Google Apps Script
runtime APIs.

## Architecture

``` text
Entrypoints
  -> Application Services
    -> Domain Models
      -> Ports
        -> Infrastructure Adapters
          -> Google Apps Script APIs
```

Repository layout:

``` text
src/
├── application/
│   ├── ports/
│   └── services/
├── config/
├── domain/
│   ├── entities/
│   └── models/
├── entrypoints/
│   ├── sheets/
│   ├── triggers/
│   └── webapp/
├── infrastructure/
│   ├── adapters/
│   ├── http/
│   └── logging/
├── utils/
└── index.ts
```

## Supported Adapters

-   Sheets adapter: create sheets, read ranges, write ranges, and append
    rows
-   Gmail adapter: send text and HTML email
-   Calendar adapter: create, update, and delete events
-   Drive adapter: create files, update files, and manage folders
-   HTTP adapter: perform external API requests with centralized error
    handling
-   UI adapter: keep spreadsheet menus and alerts outside application
    services
-   Logging adapter: isolate Apps Script logging from application logic
-   Properties adapter: read runtime configuration from Script
    Properties

## Example Application

The starter includes `DailyReportService`, which demonstrates a reusable
automation flow:

1.  A time trigger or spreadsheet menu enters through an entrypoint.
2.  `DailyReportService` reads report rows through `SheetPort`.
3.  The service formats a report.
4.  The service sends the result through `MailPort`.
5.  Runtime-specific work remains inside `SheetsAdapter` and
    `GmailAdapter`.

``` text
Time Trigger or Menu
  -> DailyReportService
    -> SheetPort
      -> SheetsAdapter
        -> SpreadsheetApp

    -> MailPort
      -> GmailAdapter
        -> GmailApp
```

Web App support is also included through `doGet` and `doPost`.

The sample `WebAppService` stores incoming payloads in Google Drive
through `DrivePort`.

``` text
HTTP Request
  -> doPost
    -> WebAppService
      -> DrivePort
        -> DriveAdapter
          -> DriveApp
```

## Requirements

-   Node.js 20 or later
-   npm
-   A Google account
-   A Google Apps Script project
-   The Google Apps Script API enabled for the deployment account
-   GitHub repository access for CI/CD deployment

## Development Workflow

### 1. Install dependencies

``` bash
npm install
```

For clean and reproducible CI-style installation:

``` bash
npm ci
```

### 2. Create a Google Apps Script project

Create a standalone or container-bound Google Apps Script project.

Copy its Script ID from:

``` text
Apps Script Editor
-> Project Settings
-> Script ID
```

The Script ID is not the deployment ID, Google Cloud project number, or
Web App URL.

### 3. Configure clasp locally

Copy the example configuration:

``` bash
cp .clasp.json.example .clasp.json
```

Set your Apps Script project ID:

``` json
{
  "scriptId": "YOUR_APPS_SCRIPT_ID",
  "rootDir": "dist"
}
```

The local `.clasp.json` file must not be committed.

The repository should only track:

``` text
.clasp.json.example
```

### 4. Enable the Apps Script API

Before using `clasp push`, enable the Google Apps Script API for the
same Google account used by clasp.

Open the Apps Script user settings page and enable:

``` text
Google Apps Script API
```

This setting is account-specific.

If multiple Google accounts are signed in, verify that the API is
enabled for the exact account used to create `~/.clasprc.json`.

After enabling the API, it may take several minutes for the setting to
propagate.

### 5. Authenticate with clasp

``` bash
npx clasp login
```

This creates the local clasp authentication file:

``` text
~/.clasprc.json
```

The account used for `clasp login` must have edit access to the target
Apps Script project.

### 6. Configure Script Properties

Set the Script Properties required by the starter:

``` text
REPORT_RECIPIENT
REPORT_SHEET_NAME
REPORT_RANGE
REPORT_MENU_TITLE
REPORT_DRIVE_FOLDER
EXTERNAL_API_URL
EXTERNAL_API_TOKEN
DEFAULT_CALENDAR_ID
```

Application services should access configuration through the centralized
configuration service rather than reading `PropertiesService` directly.

Example:

``` typescript
const apiUrl = configService.getRequired("EXTERNAL_API_URL");
```

### 7. Run local validation

``` bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

To validate formatting without changing files:

``` bash
npm run format:check
```

## Build Workflow

The build pipeline is:

``` text
TypeScript
  -> esbuild
    -> dist
      -> clasp
        -> Google Apps Script
```

The source of truth is:

``` text
src/
```

The generated deployment output is:

``` text
dist/
```

Do not manually edit files inside `dist`.

Build the project with:

``` bash
npm run build
```

The bundle must preserve global Apps Script entrypoint functions such
as:

``` text
doGet
doPost
onOpen
onEdit
```

## Local clasp Commands

Build and push the generated output:

``` bash
npm run build
npm run push
```

Alternative local deployment command:

``` bash
npm run deploy:local
```

Pull the current remote Apps Script files:

``` bash
npm run pull
```

`clasp pull` does not restore the original TypeScript source.

Because clasp works with the generated `dist` directory, pulled files
represent deployment output rather than the source architecture in
`src`.

The repository source remains authoritative.

## GitHub Actions Deployment

The GitHub Actions deployment path is:

``` text
Developer
  -> git push
    -> CI Workflow
      -> Deploy Workflow
        -> clasp push
          -> Google Apps Script
```

The CI workflow should run:

``` bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

The Deploy workflow starts after the workflow named `CI` completes
successfully on the `main` branch.

Example trigger:

``` yaml
on:
  workflow_run:
    workflows:
      - CI
    types:
      - completed
```

The value `CI` refers to the workflow `name`, not the workflow filename.

The CI workflow must therefore contain:

``` yaml
name: CI
```

### Required GitHub Secrets

Configure the following repository secrets:

``` text
CLASP_CREDENTIALS
CLASP_SCRIPT_ID
```

Go to:

``` text
GitHub Repository
-> Settings
-> Secrets and variables
-> Actions
```

#### `CLASP_SCRIPT_ID`

Set this to the Script ID from the target Google Apps Script project.

Example:

``` text
1AbCdEfGhIjKlMnOpQrStUvWxYz
```

Do not use:

-   Deployment ID
-   Google Cloud project number
-   Web App URL
-   Spreadsheet ID

#### `CLASP_CREDENTIALS`

Set this to the complete JSON content of:

``` text
~/.clasprc.json
```

Generate it locally with:

``` bash
npx clasp login
cat ~/.clasprc.json
```

Copy the entire JSON document into the GitHub Secret.

This file contains OAuth credentials and must never be committed,
printed in CI logs, or shared publicly.

For production deployment, use a dedicated deployment account rather
than a personal maintainer account.

The deployment account must:

-   Have edit access to the Apps Script project
-   Have the Google Apps Script API enabled
-   Be the same account represented by `CLASP_CREDENTIALS`

### Generated `.clasp.json`

The deployment workflow generates `.clasp.json` at runtime using
`CLASP_SCRIPT_ID`.

Example result:

``` json
{
  "scriptId": "VALUE_FROM_GITHUB_SECRET",
  "rootDir": "dist"
}
```

This prevents a real Script ID from being committed to the template
repository.

### Deployment Workflow Behavior

The deployment workflow checks out the exact commit that passed CI:

``` yaml
ref: ${{ github.event.workflow_run.head_sha }}
```

It then:

1.  Installs dependencies.
2.  Builds the TypeScript project.
3.  Restores clasp authentication.
4.  Generates `.clasp.json`.
5.  Pushes the contents of `dist` to Google Apps Script.

The final push command is:

``` bash
npx clasp push --force
```

Concurrency should prevent overlapping deployments to the same branch:

``` yaml
concurrency:
  group: clasp-deploy-${{ github.event.workflow_run.head_branch }}
  cancel-in-progress: true
```

## `clasp push` and Apps Script Deployment

The command:

``` bash
npx clasp push --force
```

updates the source code of the Apps Script project's HEAD version.

It does not automatically:

-   Create an immutable Apps Script version
-   Create a new Web App deployment
-   Update an existing versioned deployment
-   Change Web App access permissions

For source synchronization and template verification, `clasp push` is
sufficient.

Projects that require versioned Web App releases should add a separate
release workflow using an explicit Apps Script version and deployment
strategy.

## Troubleshooting Deployment

### Apps Script API is not enabled

Error:

``` text
User has not enabled the Apps Script API.
```

Resolution:

1.  Identify the Google account represented by `CLASP_CREDENTIALS`.
2.  Sign in with that account.
3.  Enable the Google Apps Script API in the Apps Script user settings.
4.  Wait several minutes.
5.  Retry the workflow.

If the error continues, recreate the clasp credentials:

``` bash
npx clasp logout
rm -f ~/.clasprc.json
npx clasp login
```

Then update the GitHub `CLASP_CREDENTIALS` Secret with the new contents
of:

``` text
~/.clasprc.json
```

A common cause is enabling the API on one Google account while GitHub
Actions authenticates with another account.

### Local push succeeds but GitHub Actions fails

The local and CI credentials are probably different.

Update `CLASP_CREDENTIALS` using the latest local `~/.clasprc.json`.

### Local and CI pushes both fail

Verify:

-   The Apps Script API is enabled for the deployment account.
-   The deployment account has edit access to the project.
-   `CLASP_SCRIPT_ID` contains the Script ID.
-   `.clasp.json` uses `rootDir: "dist"`.
-   The build created the expected files inside `dist`.

### Verify clasp authentication

Run locally:

``` bash
npx clasp list
npx clasp status
```

A temporary CI diagnostic step may also be used:

``` yaml
- name: Verify clasp authentication
  run: npx clasp list
```

Do not print `~/.clasprc.json` in GitHub Actions.

### Google Workspace restrictions

Company or school Google Workspace accounts may be restricted by
organization administrators.

If Apps Script or related API access is blocked, contact the Workspace
administrator or test with a personal Google account.

## Security

Never commit:

-   `.clasp.json`
-   `.clasprc.json`
-   OAuth credentials
-   API keys
-   production Script IDs
-   access tokens
-   service account credentials
-   environment-specific secrets

Use:

-   GitHub Actions Secrets for deployment credentials
-   Script Properties for Apps Script runtime configuration
-   Dedicated deployment accounts for production
-   Protected GitHub environments for production deployment
-   Least-privilege workflow permissions

Recommended deployment workflow permission:

``` yaml
permissions:
  contents: read
```

## Extension Guide

To add a new automation use case:

1.  Define domain models in `src/domain` when required.
2.  Define a port in `src/application/ports` for each new external
    dependency.
3.  Add an application service in `src/application/services`.
4.  Implement the port in `src/infrastructure`.
5.  Wire the implementation in `src/config/service-container.ts`.
6.  Expose the use case through an entrypoint in `src/entrypoints`.
7.  Add Vitest unit tests using fakes or mocks instead of Apps Script
    globals.
8.  Add integration tests for generated build output when entrypoints
    change.
9.  Update the relevant documentation.

Example dependency flow:

``` text
Application Service
  -> MailPort
    -> GmailAdapter
      -> GmailApp
```

Do not introduce this dependency:

``` text
Application Service
  -> GmailApp
```

## Verification Checklist

Before committing:

``` bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

Before the first CI deployment:

``` text
[ ] Create a test Apps Script project
[ ] Copy the correct Script ID
[ ] Enable the Apps Script API for the deployment account
[ ] Authenticate locally with npx clasp login
[ ] Confirm local clasp push succeeds
[ ] Add CLASP_SCRIPT_ID to GitHub Secrets
[ ] Add CLASP_CREDENTIALS to GitHub Secrets
[ ] Confirm the CI workflow name is CI
[ ] Push or merge a commit into main
[ ] Confirm the Deploy workflow completes successfully
[ ] Verify generated files in the Apps Script editor
```

## Documentation

Further details are available in:

-   [Architecture](./docs/Architecture.md)
-   [Adapters](./docs/Adapters.md)
-   [Development](./docs/Development.md)
-   [Deployment](./docs/Deployment.md)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE)
for details.

------------------------------------------------------------------------

## Troubleshooting Deployment

The most common deployment issue is:

``` text
User has not enabled the Apps Script API.
```

If you encounter this error, verify the following before retrying:

-   The Google Apps Script API is enabled for the deployment account.
-   The `CLASP_CREDENTIALS` secret was generated from the same Google
    account that has the API enabled.
-   The deployment account has **Editor** (or Owner) access to the
    target Apps Script project.
-   `CLASP_SCRIPT_ID` contains the correct **Script ID** (not the
    Deployment ID, Spreadsheet ID, or Cloud Project ID).
-   The generated `.clasp.json` points to the correct `scriptId` and
    uses `rootDir: "dist"`.

If the issue persists, recreate the local clasp credentials:

``` bash
npx clasp logout
rm -f ~/.clasprc.json
npx clasp login
```

Then replace the `CLASP_CREDENTIALS` GitHub Secret with the newly
generated `~/.clasprc.json`.

### Verify Local Deployment

Before relying on GitHub Actions, confirm that local deployment
succeeds:

``` bash
npm run build
npm run clasp:config
npx clasp status
npx clasp push --force
```

If local deployment succeeds but GitHub Actions fails, the problem is
almost always one of the following:

-   The `CLASP_CREDENTIALS` GitHub Secret is outdated.
-   The deployment account differs from the account used locally.
-   The Apps Script API is enabled for a different Google account.
