# Figorous — React + TypeScript + Vite
A lightweight Vite + React + TypeScript used for the Figorous front-end.

## Overall Software Stack
- **Vite:** ^6.3.5
- **React:** ^19.1.0
- **TypeScript:** ~5.8.3

Quick links:
- Source: [`src/App.tsx`](src/App.tsx)  
- E2E example: [`e2e/example.spec.ts`](e2e/example.spec.ts)  
- Playwright config: [`playwright.config.ts`](playwright.config.ts)  
- k6 load test: [`tests/E2Etest/k6/test.js`](tests/E2Etest/k6/test.js)  
- npm scripts: [`package.json`](package.json)

Prerequisites
- Node 18+ and npm
- (Optional) Backend API for protected routes
- For E2E: Playwright (installed as dev dependency)
- For load tests: k6

Key Supporting Packages/Libraries
  "dependencies": {
    "@hugeicons/core-free-icons": "^1.0.16",
    "@hugeicons/react": "^1.0.5",
    "@tailwindcss/vite": "^4.1.12",
    "@testing-library/jest-dom": "^6.7.0",
    "@types/react-router-dom": "^5.3.3",
    "axios": "^1.9.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.1",
    "vitest": "^3.2.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@playwright/test": "^1.54.2",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^24.3.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "@vitest/ui": "^3.2.4",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "jsdom": "^26.1.0",
    "sass-embedded": "^1.89.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.30.1",
    "vite": "^6.3.5"
  }

Code 

Install
```sh
npm install
```

Development
```sh
# start the frontend with Vite
npm run dev
```

Build
```sh
npm run build
npm run preview   # run the production build locally
```

Tests

Unit / integration (Vitest)
```sh
npx vitest --ui  tests/unitTest tests/inputComponenttest      
```

Playwright E2E
- Option A (frontend already running):
  1. Start frontend (and backend if needed)
  2. Run Playwright:
     ```sh
     npx playwright test
     ```
- Option B (Playwright starts dev server): enable or use the webServer in [`playwright.config.ts`](playwright.config.ts) and then:
  ```sh
  npx playwright test
  ```
- Tips:
  - Create an authenticated storage state to speed tests (see `e2e/` helpers or record with Playwright codegen).
  - Run a single test file:
    ```sh
    npx playwright test e2e/example.spec.ts
    ```
  - Run headed for debugging:
    ```sh
    npx playwright test --headed -g "test name"
    ```

k6 load/perf tests
- Put k6 scripts under `tests/E2Etest/k6/` (example: [`tests/E2Etest/k6/test.js`](tests/E2Etest/k6/test.js)).
- Run with correct backend auth URL:
```sh
# example: ensure backend is running and then
k6 run --env LOGIN_URL="http://localhost:8080/api/auth/login" --env BASE_URL="http://localhost:5173" tests/E2Etest/k6/test.js
```

How to test protected UI routes in Playwright
- Prefer creating a storage state artifact (one-time) and reuse it in tests:
  - Use Playwright to sign in once and save storage state: `await context.storageState({ path: 'e2e/storageState.json' })`
  - In tests: `test.use({ storageState: 'e2e/storageState.json' })`

Project structure
- src/ — app source
- e2e/ — Playwright tests
- tests/E2Etest/k6/ — k6 load tests