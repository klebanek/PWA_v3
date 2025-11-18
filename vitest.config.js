import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['app.js', 'service-worker.js'],
      exclude: ['node_modules/', 'tests/'],
      all: true,
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    },
    mockReset: true,
    restoreMocks: true
  }
});
