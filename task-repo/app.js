const express = require('express');

function createApp({ dbPath } = {}) {
  const app = express();
  app.use(express.json());
  // TODO: implement the API described in SPEC.md
  return app;
}

module.exports = { createApp };
