const Ajv = require("ajv");
const ajv = new Ajv();
const schemas = require("./schemas");

/**
 * Module handling database functions for the Scores table.
 *
 * @module scoresFunctionsDB
 */
module.exports = {
  /**
   * Save data to the Scores table if it is valid JSON.
   *
   * @function
   * @async
   * @param {mysql.Connection} connection - The MySQL connection.
   * @param {Object} data - The data to be saved.
   * @returns {Promise<number>} A Promise that resolves with the HTTP status code (201 if created successfully).
   * @throws {Object} If validation fails, it rejects with an object containing the HTTP status code (400) and validation errors.
   * @throws {number} If a server error occurs, it rejects with the HTTP status code (500).
   */
  save: (connection, data) => {
    return new Promise((resolve, reject) => {
      try {
        // Validate the data to be saved
        const validate = ajv.compile(schemas.scoresSchema);
        const isValid = validate(data);

        if (!isValid) {
          // Bad Request
          reject({
            code: 400,
            message: validate.errors,
          });
        } else {
          const sql = `INSERT INTO Scores (score, correct_words, incorrect_words, date) values (?, ?, ?, ?)`;

          // Sql query
          connection.query(
            sql,
            [data.score, data.correct_words, data.incorrect_words, data.date],
            (err) => {
              if (err) {
                console.error(err);
                reject(500);
              } else {
                // Valid: Created
                resolve(201);
              }
            }
          );
        }
      } catch (error) {
        // Server Error
        console.error(error);
        reject(500);
      }
    });
  },

  /**
   * Find all data from the Scores table based on the search term and order by sortOrder.
   *
   * @function
   * @async
   * @param {mysql.Connection} connection - The MySQL connection.
   * @param {string} searchTerm - The search term.
   * @param {string} sortOrder - The sorting order (asc or desc).
   * @returns {Promise<Object[]>} A Promise that resolves with an array of matching records.
   * @throws {Object} If no matching records are found, it rejects with an object containing the HTTP status code (404) and a message.
   * @throws {number} If a server error occurs, it rejects with the HTTP status code (500).
   */
  findAll: (connection, searchTerm, sortOrder) => {
    return new Promise((resolve, reject) => {
      try {
        // Initialize the sql query
        let query = `SELECT * FROM Scores WHERE id LIKE ? OR date LIKE ? OR score LIKE ?`;

        // Values that are being placed to the query
        const values = [
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ];

        // Make sure the order is desc even if invalid
        let sanitizedSortOrder = "desc";
        const validSortOrders = ["asc", "desc"];

        // Sanitize sortOrder
        if (sortOrder && validSortOrders.includes(sortOrder.toLowerCase())) {
          sanitizedSortOrder = sortOrder.toLowerCase();
        }

        // Add the remaining query with the order
        query += ` ORDER BY id ${sanitizedSortOrder}`;

        // Search the database with the given search and order
        connection.query(query, values, (err, result) => {
          if (err) {
            // Server Error
            console.error(err);

            reject(500);
          } else if (result.length === 0) {
            // Not Found
            reject({
              code: 404,
              message: `No matching records found for search term: ${searchTerm}`,
            });
          } else {
            // Valid
            resolve(result);
          }
        });
      } catch (error) {
        // Server Error
        console.error(error);
        reject(500);
      }
    });
  },

  /**
   * Find data from the Scores table by ID.
   *
   * @function
   * @async
   * @param {mysql.Connection} connection - The MySQL connection.
   * @param {number} id - The ID of the record to find.
   * @returns {Promise<Object[]>} A Promise that resolves with an array containing the matching record.
   * @throws {Object} If no matching record is found, it rejects with an object containing the HTTP status code (404) and a message.
   * @throws {number} If a server error occurs, it rejects with the HTTP status code (500).
   */
  findById: (connection, id) => {
    return new Promise((resolve, reject) => {
      try {
        // Execute an SQL query to find a score by ID
        connection.query(
          "SELECT * FROM Scores WHERE id = ?",
          [id],
          (err, result) => {
            if (err) {
              // Server Error
              console.error(err);
              reject(500);
            } else if (result.length === 0) {
              // Not Found
              reject({
                code: 404,
                message: `Score with ID: ${id} not found`,
              });
            } else {
              // Valid
              resolve(result);
            }
          }
        );
      } catch (error) {
        // Server Error
        console.error(error);
        reject(500);
      }
    });
  },

  /**
   * Delete a record from the Scores table by ID.
   *
   * @function
   * @async
   * @param {mysql.Connection} connection - The MySQL connection.
   * @param {number} id - The ID of the record to delete.
   * @returns {Promise<number>} A Promise that resolves with the HTTP status code (204 if deleted successfully).
   * @throws {Object} If no matching record is found, it rejects with an object containing the HTTP status code (404) and a message.
   * @throws {number} If a server error occurs, it rejects with the HTTP status code (500).
   */
  deleteById: (connection, id) => {
    return new Promise((resolve, reject) => {
      try {
        // Check if the score exists
        connection.query(
          "SELECT * FROM Scores WHERE id = ?",
          [id],
          (selectErr, result) => {
            if (selectErr) {
              // Server Error
              console.error(selectErr);
              reject(500);
            } else if (result.length === 0) {
              // Not found
              reject({
                code: 404,
                message: `Score with ID: ${id} not found`,
              });
            } else {
              // Delete if data with the ID exists
              connection.query(
                "DELETE FROM Scores WHERE id = ?",
                [id],
                (deleteErr) => {
                  if (deleteErr) {
                    // Server Error
                    console.error(deleteErr);
                    reject(500);
                  } else {
                    // Valid: No Content
                    resolve(204);
                  }
                }
              );
            }
          }
        );
      } catch (error) {
        // Server Error
        console.error(error);
        reject(500);
      }
    });
  },

  /**
   * Delete all records from the Scores table.
   *
   * @function
   * @async
   * @param {mysql.Connection} connection - The MySQL connection.
   * @returns {Promise<number>} A Promise that resolves with the HTTP status code (204 if deleted successfully).
   * @throws {number} If a server error occurs, it rejects with the HTTP status code (500).
   */
  deleteAll: (connection) => {
    return new Promise((resolve, reject) => {
      try {
        // Sql query
        connection.query("DELETE FROM Scores", (err) => {
          if (err) {
            // Server Error
            console.error(err);
            reject(500);
          } else {
            // Valid: No Content
            resolve(204);
          }
        });
      } catch (error) {
        // Server Error
        console.error(error);
        reject(500);
      }
    });
  },
};
