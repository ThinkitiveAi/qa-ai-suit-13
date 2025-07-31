import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
  },
  workers: 1, // 👈 ensures tests run one after another
});
