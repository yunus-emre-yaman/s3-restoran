export default {
  reporter: [["json", { outputFile: "playwright-report.json" }]],
  globalTeardown: "./teardown.js",
  outputDir: "./.test-results",
};
