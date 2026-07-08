import { defineConfig } from 'vitest/config';

// Eigene Config: Server-Tests laufen im Node-Umfeld und getrennt vom Frontend-Setup.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
