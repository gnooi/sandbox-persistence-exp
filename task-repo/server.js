const { createApp } = require('./app');

const port = process.env.PORT || 3000;
const dbPath = process.env.DB_PATH || './data/todos.db';

createApp({ dbPath }).listen(port, () => {
  console.log(`todo api listening on ${port}`);
});
