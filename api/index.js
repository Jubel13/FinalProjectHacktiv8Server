const serverless = require('serverless-http');

let handler;

module.exports = async function (req, res) {
  try {
    if (!handler) {
      // defer requiring app so missing production env vars don't crash at deploy-time
      const app = require('../app');
      handler = serverless(app);
    }
    return handler(req, res);
  } catch (err) {
    console.error('Server initialization error:', err && err.stack ? err.stack : err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server initialization failed', message: err.message }));
  }
};
