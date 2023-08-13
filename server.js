const app = require('./app');
// require('./config/db');
require('dotenv').config({ path: `./config.env` });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!! 💥 Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋🏼 SIGTERM received. Shutting down the system.');
  server.close(() => {
    console.log('💥 process terminated');
  });
});
