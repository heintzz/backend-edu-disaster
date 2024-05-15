const dotenv = require('dotenv');
const express = require('express');
const pool = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3008;

app.use(express.json());
app.use(cors());

pool.connect((err, client, release) => {
  console.log('[⚡database]: Connected to postgresql');
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  client?.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      console.error('Error executing query', err.stack);
      return;
    }
  });
});

const apiV1Router = express.Router();

apiV1Router.use('/auth', require('./routes/general/auth.route'));
apiV1Router.use('/student', require('./routes/student/index.route'));
apiV1Router.use('/admin', require('./routes/admin/index.route'));
apiV1Router.use('/superadmin', require('./routes/superadmin/index.route'));
apiV1Router.use('/teacher', require('./routes/teacher/index.route'));

app.use('/api/v1', apiV1Router);

app.listen(port, () => {
  console.log(`[⚡server]: Server is running at http://localhost:${port}`);
});
