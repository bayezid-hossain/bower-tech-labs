import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  outputDir: "tests/visual/.results",
  timeout: 120_000,
  use: { baseURL: "http://localhost:3000", deviceScaleFactor: 1 },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
