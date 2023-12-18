require("dotenv").config({ path: "./.env" });

const mysql = require("mysql");

// Debugging console log
console.log(process.env.DB_HOST);

const connectionPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = {
  // Connect to the database
  connect: () => {
    return new Promise((resolve, reject) => {
      connectionPool.getConnection((err, connection) => {
        if (err) {
          console.error("Error getting MySQL connection:", err);
          reject(500);
        } else {
          console.log("MySQL connection acquired: ", connection.threadId);
          resolve(connection);
        }
      });
    });
  },

  // End one connection
  close: (connection) => {
    connection.release();
    console.log("MySQL connection released: ", connection.threadId);
  },

  // Close MySQL
  closePool: () => {
    return new Promise((resolve, reject) => {
      connectionPool.end((err) => {
        if (err) {
          console.error("Error closing MySQL pool:", err);
          reject(err);
        } else {
          console.log("MySQL pool closed");
          resolve();
        }
      });
    });
  },
};
