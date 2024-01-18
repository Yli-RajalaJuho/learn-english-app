require("dotenv").config({ path: "./.env" });

const mysql = require("mysql");

// Debugging what dbhost is being used
console.log(process.env.DB_HOST);

/**
 * MySQL connection pool for handling database connections.
 *
 * @type {mysql.Pool}
 */
const connectionPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Module handling MySQL database connections.
 *
 * @module connectionsDB
 */
module.exports = {
  /**
   * Connect to the database.
   *
   * @function
   * @async
   * @returns {Promise<mysql.Connection>} A Promise that resolves with the acquired database connection.
   */
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

  /**
   * End one connection.
   *
   * @function
   * @param {mysql.Connection} connection - The MySQL connection to be released.
   * @returns {void}
   */
  close: (connection) => {
    connection.release();
    console.log("MySQL connection released: ", connection.threadId);
  },

  /**
   * Close the MySQL connection pool.
   *
   * @function
   * @async
   * @returns {Promise<void>} A Promise that resolves once the MySQL connection pool is closed.
   */
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
