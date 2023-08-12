const app = require('./app');
require('./config/db');
require('dotenv').config();

const port = process.env.PORT || 3000;

// app.use((err, req, res, next) => {
//   console.log(err);
//   process.exit(1);
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
