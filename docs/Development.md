# Development

## Local Workflow

1. Install dependencies with `npm install`.
2. Create `.clasp.json` from `.clasp.json.example`.
3. Authenticate locally with `npx clasp login`.
4. Configure Script Properties in the target Apps Script project.
5. Develop in `src/` and validate with local scripts.

## Scripts

- `npm run lint`: lint all project files
- `npm run lint:fix`: apply safe ESLint fixes
- `npm run format`: check Prettier formatting
- `npm run format:write`: write Prettier formatting
- `npm run typecheck`: run the TypeScript compiler without emitting files
- `npm run test`: run the Vitest suite with coverage
- `npm run build`: compile the Apps Script bundle into `dist/`
- `npm run push`: build and push to Apps Script
- `npm run pull`: pull the remote Apps Script project metadata and files

## Testing Approach

The template emphasizes unit tests on service and configuration layers. Infrastructure that depends on runtime globals should be wrapped behind interfaces and mocked in tests.

## Coding Standards

- Use strict TypeScript and avoid `any`.
- Prefer dependency injection for service composition.
- Keep platform API usage inside infrastructure wrappers.
- Read external endpoints from configuration rather than literals.
