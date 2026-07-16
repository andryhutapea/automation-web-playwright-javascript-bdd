const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');
const { BASE_URL } = require('./config');

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/step_defs/**/*.js',
});

module.exports = defineConfig({
  testDir,
  globalSetup: require.resolve('./global-setup.js'),
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['./reporters/local-report-server.reporter.js'],
  ],
  outputDir: 'reports/test-results',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
