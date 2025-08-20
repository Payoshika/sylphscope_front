import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: "./tests/setup.ts",
    // exclude end-to-end / manual playwrite tests from unit test runs
    exclude: [
      "tests/E2Etest/**"
    ]
  }
});