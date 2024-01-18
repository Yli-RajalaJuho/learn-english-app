const database = require("../database/wordsFunctionsDB.js");
const connections = require("../database/connectionsDB.js");
const express = require("express");

/**
 * Express Router for handling word-related routes.
 *
 * @type {express.Router}
 */
const wordsRouter = express.Router();

/**
 * Save data to the database.
 *
 * @route POST /api/words/
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Retrieve all words from the database with optional sorting.
 *
 * @route GET /api/words/
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Retrieve a word by its ID from the database.
 *
 * @route GET /api/words/:myId([0-9]+)
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Search for words in the database with optional sorting and search parameters.
 *
 * @route GET /api/words/search
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
wordsRouter.get("/search", async (req, res) => {
  let connection = undefined;
  try {
    // Get the search term from query parameters
    const searchTerm = req.query.searchTerm;

    // Check if there are sort query parameters
    const sortable = req.query.sortable;
    const sortOrder = req.query.sortOrder;

    // Connect to the database
    connection = await connections.connect();

    // Search for the term
    const searchResults = await database.search(
      connection,
      searchTerm,
      sortable,
      sortOrder
    );

    // Result
    res.json(searchResults);
  } catch (error) {
    // Handle any errors that occur during connection, query, or response
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

/**
 * Delete all words from the database.
 *
 * @route DELETE /api/words/
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Delete a word by its ID from the database.
 *
 * @route DELETE /api/words/:myId([0-9]+)
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Update a word by its ID in the database.
 *
 * @route PUT /api/words/:myId([0-9]+)
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Patch a word by its ID in the database.
 *
 * @route PATCH /api/words/:myId([0-9]+)
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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
