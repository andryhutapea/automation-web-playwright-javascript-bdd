// Minimal static file server for the Playwright HTML report, spawned
// detached so it keeps running (and is reused) across test runs —
// mirrors what `python3 -m http.server` did for the Allure report
// in the Python version of this suite.
const http = require('http');
const fs = require('fs');
const path = require('path');

const [, , rootDir, portArg] = process.argv;
const port = Number(portArg);

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.zip': 'application/zip',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
};

http
  .createServer((req, res) => {
    let filePath = path.join(rootDir, decodeURIComponent(req.url.split('?')[0]));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(rootDir, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(port);
