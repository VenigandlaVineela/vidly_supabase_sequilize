require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

require('./startup/logging')();
const express = require('express');
const { connectDB, sequelize } = require('./startup/db');
const validateConfig = require('./startup/config');

const usersRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const genresRoute = require('./routes/genre');
const movieRoute = require('./routes/movie');
const customerRoute = require('./routes/customer');
const rentalRoute = require('./routes/rental');
const returnRoute = require('./routes/returns');
const error = require('./middleware/error');
const winston = require("winston");

const app = express();
app.use(express.json());

validateConfig();

// Routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/genres', genresRoute);
app.use('/api/movies', movieRoute);
app.use('/api/customers', customerRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/returns', returnRoute);

app.use(error);

let server;

async function start() {
  await connectDB();

  // Only sync in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    await sequelize.sync({ alter: true });
  }

  const port = process.env.PORT || 3000;
  server = app.listen(port, "0.0.0.0", () =>
  winston.info(`Server running on port ${port}`)
);


  return server;
}

// Auto-start only if not testing
if (process.env.NODE_ENV !== 'test') {
  start();
}

// Export both app and start for tests
module.exports = { app, start };



// require('dotenv').config();
// const express = require('express');
// const { connectDB } = require('./startup/db');
// const users = require('./routes/user');

// const app = express();
// app.use(express.json());

// connectDB();

// app.use('/api/users', users);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on port ${port}...`));





// // index.js or a test file
// const { connectDB, sequelize } = require('./startup/db');
// const { User } = require('./models/user');

// async function test() {
//   await connectDB();

//   // Create table if not exists
//   await sequelize.sync({ alter: true });

//   // Insert sample user
//   const user = await User.create({
//     name: 'Test',
//     email: 'test@gmail.com',
//     password: 'Test@123'
//   });

//   console.log('User created:', user.toJSON());

//   // Query users
//   const allUsers = await User.findAll();
//   console.log('All users:', allUsers.map(u => u.toJSON()));
// }

// test();
