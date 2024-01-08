const database = require("../database/scoresFunctionsDB.js");
const connections = require("../database/connectionsDB.js");
const express = require("express");
const scoresRouter = express.Router();

// SAVE DATA TO THE DATABASE ->
scoresRouter.post("/", async (req, res) => {
  let connection = undefined;
  try {
    // Connect to the database
    connection = await connections.connect();

    // Save data to the database
    const success = await database.save(connection, req.body);

    // Result
    res.sendStatus(success);
  } catch (error) {
    // Handle any errors that occur during connection, query, or response
    if (error.code === 400) {
      // If bad request show style for what the request should look like
      res.status(error.code).send(error.message);
    } else {
      res.sendStatus(error);
    }
  } finally {
    try {
      // Close the database connection
      connections.close(connection);
    } catch (err) {
      // Handle any errors that occur while closing the connection
      res.sendStatus(500);
    }
  }
});

// FIND ALL
scoresRouter.get("/", async (req, res) => {
  let connection = undefined;
  try {
    // Connect to the database
    connection = await connections.connect();

    // Search for the results
    const words = await database.findAll(connection);

    // Result
    res.json(words);
  } catch (error) {
    // Handle any errors that occur during connection, query, or response
    if (error.code === 404) {
      // If not found show what id wasn't found
      res.status(error.code).send(error.message);
    } else {
      res.sendStatus(error);
    }
  } finally {
    try {
      // Close the database connection
      connections.close(connection);
    } catch (err) {
      // Handle any errors that occur while closing the connection
      res.sendStatus(500);
    }
  }
});

// FIND BY ID ->
scoresRouter.get("/:myId([0-9]+)", async (req, res) => {
  let connection = undefined;
  try {
    // Get the searched id
    const id = parseInt(req.params.myId);

    // Connect to the database
    connection = await connections.connect();

    // Search for the id
    const word = await database.findById(connection, id);

    // Result
    res.json(word);
  } catch (error) {
    // Handle any errors that occur during connection, query, or response
    if (error.code === 404) {
      // If not found show what id wasn't found
      res.status(error.code).send(error.message);
    } else {
      res.sendStatus(error);
    }
  } finally {
    try {
      // Close the database connection
      connections.close(connection);
    } catch (err) {
      // Handle any errors that occur while closing the connection
      res.sendStatus(500);
    }
  }
});

// DELETE ALL ->
scoresRouter.delete("/", async (req, res) => {
  let connection = undefined;
  try {
    // Connect to the database
    connection = await connections.connect();

    // Search for the id
    const success = await database.deleteAll(connection);

    // Result
    res.sendStatus(success);
  } catch (error) {
    // Handle any errors that occur during connection, query, or response
    res.sendStatus(error);
  } finally {
    try {
      // Close the database connection
      connections.close(connection);
    } catch (err) {
      // Handle any errors that occur while closing the connection
      res.sendStatus(500);
    }
  }
});

// DELETE BY ID ->
scoresRouter.delete("/:myId([0-9]+)", async (req, res) => {
  let connection = undefined;
  try {
    // Get the searched id
    const id = parseInt(req.params.myId);

    // Connect to the database
    connection = await connections.connect();

    // Search for the id
    const success = await database.deleteById(connection, id);

    // Result
    res.sendStatus(success);
  } catch (error) {
    // Handle any errors that occur during connection, query, or response
    if (error.code === 404) {
      // If not found show what id wasn't found
      res.status(error.code).send(error.message);
    } else {
      res.sendStatus(error);
    }
  } finally {
    try {
      // Close the database connection
      connections.close(connection);
    } catch (err) {
      // Handle any errors that occur while closing the connection
      res.sendStatus(500);
    }
  }
});

module.exports = scoresRouter;
