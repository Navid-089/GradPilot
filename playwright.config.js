// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "./services/frontend/tests/e2e",
  timeout: 300000,
  retries: 1,
  reporter: "list",
  use: {
    headless: true,
  },
};

module.exports = config;
