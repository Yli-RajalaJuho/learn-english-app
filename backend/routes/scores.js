const database = require("../database/scoresFunctionsDB.js");
const connections = require("../database/connectionsDB.js");
const express = require("express");

/**
 * Express Router for handling score-related routes.
 *
 * @type {express.Router}
 */
const scoresRouter = express.Router();

/**
 * Save data to the database.
 *
 * @route POST /api/scores/
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Retrieve all scores from the database.
 *
 * @route GET /api/scores/
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
scoresRouter.get("/", async (req, res) => {
  let connection = undefined;
  try {
    // Get the search term from query parameters
    const searchTerm = req.query.searchTerm;

    // Check if there are sort query parameters
    const sortOrder = req.query.sortOrder;

    // Connect to the database
    connection = await connections.connect();

    // Search for the results
    const scores = await database.findAll(connection, searchTerm, sortOrder);

    // Result
    res.json(scores);
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
 * Retrieve a score by its ID from the database.
 *
 * @route GET /api/scores/:myId([0-9]+)
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
scoresRouter.get("/:myId([0-9]+)", async (req, res) => {
  let connection = undefined;
  try {
    // Get the searched id
    const id = parseInt(req.params.myId);

    // Connect to the database
    connection = await connections.connect();

    // Search for the id
    const score = await database.findById(connection, id);

    // Result
    res.json(score);
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
 * Delete all scores from the database.
 *
 * @route DELETE /api/scores/
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Delete a score by its ID from the database.
 *
 * @route DELETE /api/scores/:myId([0-9]+)
 * @function
 * @async
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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
