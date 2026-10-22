import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    reducedMotion: 'reduce',
    launchOptions: existsSync(chromePath) ? { executablePath: chromePath } : {},
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
