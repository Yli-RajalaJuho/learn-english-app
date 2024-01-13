const database = require("../database/wordsFunctionsDB.js");
const connections = require("../database/connectionsDB.js");
const express = require("express");
const wordsRouter = express.Router();

// SAVE DATA TO THE DATABASE ->
wordsRouter.post("/", async (req, res) => {
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

// FIND ALL with SORT
wordsRouter.get("/", async (req, res) => {
  let connection = undefined;
  try {
    // Connect to the database
    connection = await connections.connect();

    // Check if there are sort query parameters
    const sortable = req.query.sortable;
    const sortOrder = req.query.sortOrder;

    // Search for the results with optional sorting
    const words = await database.findAll(connection, sortable, sortOrder);

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
wordsRouter.get("/:myId([0-9]+)", async (req, res) => {
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
wordsRouter.delete("/", async (req, res) => {
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
wordsRouter.delete("/:myId([0-9]+)", async (req, res) => {
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

// PUT ->
wordsRouter.put("/:myId([0-9]+)", async (req, res) => {
  let connection = undefined;
  try {
    // Get the searched id
    const id = parseInt(req.params.myId);

    // Connect to the database
    connection = await connections.connect();

    // Search for the id
    const success = await database.put(connection, id, req.body);

    // Result
    res.sendStatus(success);
  } catch (error) {
    // Handle any errors that occur during connection, query, or response
    if (error.code === 404) {
      // If not found show what id wasn't found
      res.status(error.code).send(error.message);
    } else if (error.code === 400) {
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

// PATCH ->
wordsRouter.patch("/:myId([0-9]+)", async (req, res) => {
  let connection = undefined;
  try {
    // Get the searched id
    const id = parseInt(req.params.myId);

    // Connect to the database
    connection = await connections.connect();

    // Search for the id
    const success = await database.patch(connection, id, req.body);

    // Result
    res.sendStatus(success);
  } catch (error) {
    // Handle any errors that occur during connection, query, or response
    if (error.code === 404) {
      // If not found show what id wasn't found
      res.status(error.code).send(error.message);
    } else if (error.code === 400) {
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

module.exports = wordsRouter;
