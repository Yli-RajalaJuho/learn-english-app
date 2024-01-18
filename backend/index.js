const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const wordsRouter = require("./routes/words");
const scoresRouter = require("./routes/scores");
const connections = require("./database/connectionsDB");

/**
 * Express application instance.
 *
 * @type {express.Application}
 */
app.use(cors());

/**
 * Middleware to parse incoming JSON data.
 */
app.use(express.json());

/**
 * Routes for handling word-related operations.
 *
 * @type {express.Router}
 */
app.use("/api/words", wordsRouter);

/**
 * Routes for handling score-related operations.
 *
 * @type {express.Router}
 */
app.use("/api/scores", scoresRouter);

/**
 * The server's port number.
 *
 * @type {number}
 */
const port = 8080;

/**
 * The server instance.
 *
 * @type {http.Server}
 */
let server = undefined;

/**
 * Gracefully shuts down the server and database connections.
 *
 * @function
 * @async
 * @returns {Promise<void>} A Promise that resolves once the shutdown is complete.
 */
const gracefulShutdown = async () => {
  console.log("Starting graceful shutdown...");
  const closeServer = new Promise((resolve, reject) => {
    // Close the server
    if (server) {
      console.log("Server was opened, so we can close it...");
      server.close((err) => {
        if (err) {
          console.error("Error closing server", err);
          reject();
        } else {
          console.log("Server closing successful");
        }
        resolve();
      });
    } else {
      resolve();
    }
  });

  try {
    await closeServer;
    // Close the database connection pool
    console.log("Closing db...");
    await connections.closePool();
    console.log("Graceful shutdown complete");
  } catch (error) {
    console.error(error);
  }
};

/**
 * Starts the server and listens on the specified port.
 *
 * @type {http.Server}
 */
server = app
  .listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });

/**
 * Event listener for SIGTERM signal, indicating a graceful shutdown request from another process.
 */
process.on("SIGTERM", gracefulShutdown); // Some other app requirest shutdown.

/**
 * Event listener for SIGINT signal, indicating a graceful shutdown request from the terminal (e.g., Ctrl+C).
 */
process.on("SIGINT", gracefulShutdown); // ctrl-c
