const { execSync } = require('child_process');

// Runs once per `playwright test` invocation, before any test file is
// collected - regenerates the .features-gen/ specs from the current
// .feature files, no matter how the command was invoked (bare npx, an npm
// script, with --grep, etc.). Unlike calling bddgen from inside
// playwright.config.js itself, globalSetup is a distinct lifecycle phase
// that runs after config resolution, so it does not re-trigger itself when
// bddgen re-reads playwright.config.js in its own process.
module.exports = async function globalSetup() {
  execSync('npx bddgen', { cwd: __dirname, stdio: 'inherit' });
};
