const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const wordsRouter = require("./routes/words");
const connections = require("./database/connectionsDB");

const port = 8080;

app.use(cors());

app.use(express.json());

app.use("/api/words", wordsRouter);

let server = undefined;

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

server = app
  .listen(port, () => {
    console.log(`Server listening on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });

process.on("SIGTERM", gracefulShutdown); // Some other app requirest shutdown.
process.on("SIGINT", gracefulShutdown); // ctrl-c
