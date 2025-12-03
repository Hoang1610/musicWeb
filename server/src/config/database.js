const mongoose = require("mongoose");
require("dotenv").config();
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
// });
// const connection = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   waitForConnections: true,
//   queueLimit: 0,
//   connectionLimit: 10,
// });
const connection = async () => {
  const options = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
  };
  await mongoose.connect(process.env.DB_HOST, options);
  const state = mongoose.connection.readyState;
  console.log(state);
};

module.exports = connection;
