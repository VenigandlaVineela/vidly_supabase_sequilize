const { Sequelize } = require('sequelize');
const config = require('config');

let databaseUrl;

if (process.env.DATABASE_URL) {
  // Fly production
  databaseUrl = process.env.DATABASE_URL;
} else {
  // Local development
  const dbConfig = config.get('db');

  if (!dbConfig.url) {
    throw new Error("DB url missing in config for this NODE_ENV");
  }

  databaseUrl = dbConfig.url.replace(
    '${DB_PASSWORD}',
    process.env.DB_PASSWORD
  );
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

async function connectDB() {
  await sequelize.authenticate();
  console.log(`Connected to Supabase PostgreSQL (${process.env.NODE_ENV})`);
}

module.exports = { sequelize, connectDB };






// // const { Sequelize } = require('sequelize');
// // const config = require('config');

// // const dbConfig = config.get('db');

// // const databaseUrl = dbConfig.url.replace(
// //   '${DB_PASSWORD}',
// //   process.env.DB_PASSWORD
// // );

// // const sequelize = new Sequelize(databaseUrl, {
// //   dialect: dbConfig.dialect,
// //   logging: false,
// //   dialectOptions: {
// //     ssl: {
// //       require: true,
// //       rejectUnauthorized: false,
// //     },
// //   },
// // });

// // async function connectDB() {
// //   try {
// //     await sequelize.authenticate();
// //     console.log('Connected to Supabase PostgreSQL');
// //   } catch (error) {
// //     console.error('Database connection failed:', error.message);
// //     process.exit(1);
// //   }
// // }

// // module.exports = { sequelize, connectDB };





// // require('dotenv').config();
// // const { Sequelize } = require('sequelize');

// // const databaseUrl = "postgresql://postgres.nbravguzouzaivdxnabr:VenigandlaVineela%4010@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"

// // const sequelize = new Sequelize(databaseUrl, {
// //   dialect: 'postgres',
// //   logging: false,  
// //   dialectOptions: {
// //     ssl: {
// //       require: true,
// //       rejectUnauthorized: false, 
// //     },
// //   },
// // });


// // async function connectDB() {
// //   try {
// //     await sequelize.authenticate();
// //     console.log('Connected to Supabase PostgreSQL (development)');
// //   } catch (error) {
// //     console.error('Database connection failed:', error.message);
// //     process.exit(1);
// //   }
// // }

// // // Export
// // module.exports = { sequelize, connectDB };



// const { Sequelize } = require('sequelize');
// const config = require('config');

// const dbConfig = config.get('db');

// if (!dbConfig.url) {
//   throw new Error("DB url missing in config for this NODE_ENV");
// }

// const databaseUrl = dbConfig.url.replace(
//   '${DB_PASSWORD}',
//   process.env.DB_PASSWORD
// );

// const sequelize = new Sequelize(databaseUrl, {
//   dialect: dbConfig.dialect,
//   logging: process.env.NODE_ENV === 'development' ? console.log : false, 
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });


// // async function connectDB() {
// //   try {
// //     await sequelize.authenticate();
// //     console.log(`Connected to Supabase PostgreSQL (${process.env.NODE_ENV})`);
// //   } catch (error) {
// //     console.error('Database connection failed:', error.message);

// //     if (process.env.NODE_ENV !== 'test') {
// //       process.exit(1);
// //     } else {
// //       throw error;
// //     }
// //   }

// // }



// async function connectDB() {
//   await sequelize.authenticate();
//   console.log(`Connected to Supabase PostgreSQL (${process.env.NODE_ENV})`);
// }

// module.exports = { sequelize, connectDB };
