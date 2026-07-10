const path = require('path');
const net = require('net');
const { spawn } = require('child_process');

const REPORT_DIR = path.join(__dirname, '..', 'reports', 'html');
const PORT = 9323;

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: 'localhost' });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

// Prints a clickable URL to the last HTML report after every run, reusing
// an already-running server instead of spawning a new one each time —
// same intent as the `pytest_terminal_summary` Allure hook in the Python
// version of this suite.
class LocalReportServerReporter {
  async onEnd() {
    const alreadyRunning = await isPortOpen(PORT);
    if (!alreadyRunning) {
      spawn(process.execPath, [path.join(__dirname, 'report-server.js'), REPORT_DIR, String(PORT)], {
        detached: true,
        stdio: 'ignore',
      }).unref();
    }
    console.log('');
    console.log('--------------------------------- Playwright report ---------------------------------');
    console.log(`http://localhost:${PORT}/index.html`);
  }
}

module.exports = LocalReportServerReporter;
