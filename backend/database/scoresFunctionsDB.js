const Ajv = require("ajv");
const ajv = new Ajv();
const schemas = require("./schemas");

module.exports = {
  save: (connection, data) => {
    return new Promise((resolve, reject) => {
      try {
        const validate = ajv.compile(schemas.scoresSchema);
        const isValid = validate(data);

        if (!isValid) {
          // Bad Request
          reject({
            code: 400,
            message: validate.errors,
          });
        } else {
          const sql = `INSERT INTO Scores (score, correct_words, incorrect_words) values (?, ?, ?)`;

          connection.query(
            sql,
            [data.score, data.correct_words, data.incorrect_words],
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

  findAll: (connection, searchTerm, sortOrder) => {
    return new Promise((resolve, reject) => {
      try {
        // Initialize the sql query
        let query = `SELECT * FROM Scores WHERE id LIKE ?`;

        const values = `%${searchTerm}%`;

        let sanitizedSortOrder = "desc";
        const validSortOrders = ["asc", "desc"];

        // Sanitize sortOrder
        if (sortOrder && validSortOrders.includes(sortOrder.toLowerCase())) {
          sanitizedSortOrder = sortOrder.toLowerCase();
        }

        query += ` ORDER BY id ${sanitizedSortOrder}`;

        // Search the database with all the given data
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
              // Delete if exists
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

  deleteAll: (connection) => {
    return new Promise((resolve, reject) => {
      try {
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
