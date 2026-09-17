import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:5173', trace: 'retain-on-failure' },
  webServer: [
    { command: 'npx tsx tests/e2e-server.ts', url: 'http://localhost:3001/api/health', reuseExistingServer: false },
    { command: 'npx vite --host 0.0.0.0', url: 'http://localhost:5173', reuseExistingServer: false }
  ],
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ]
});
