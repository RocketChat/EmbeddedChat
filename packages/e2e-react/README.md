# E2E EmbeddedChat Tests

End-to-end tests using Playwright for the EmbeddedChat React package. Tests focus on UI stability and deterministic flows without external service dependencies.

## Setup

### Install system dependencies (Linux)
```bash
sudo yarn playwright install-deps
```

### Install Playwright browsers
```bash
cd packages/e2e-react
npx playwright install chromium
```

## Run Tests

### Local
```bash
yarn workspace e2e-react test
```

### Watch mode
```bash
yarn workspace e2e-react test --watch
```

### Debug UI
```bash
yarn workspace e2e-react test --debug
```

### View HTML report
```bash
yarn workspace e2e-react show-report
```

## Test Coverage

- **renders unauthenticated chat state** — Verifies EmbeddedChat loads with login prompt
- **opens login modal from join button** — Ensures JOIN button opens password auth modal
- **shows required field validation for empty login submit** — Tests form validation without auth service

## Configuration

- Base URL: `http://127.0.0.1:5173` (dev server)
- Host (RC server): Configurable via `VITE_RC_HOST` env var, defaults to `http://127.0.0.1:3000`
- CI retries: 2 (enabled on CI only)
- Failure artifacts: Screenshots + traces automatically collected
