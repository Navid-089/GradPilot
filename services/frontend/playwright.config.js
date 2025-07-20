/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "./test/e2e", // only run tests inside e2e folder
  use: {
    headless: true,
  },
};

module.exports = config;
