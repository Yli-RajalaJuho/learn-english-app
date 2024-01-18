const Ajv = require("ajv");
const ajv = new Ajv();
const schemas = require("./schemas");

/**
 * Module handling database functions for the Words table.
 *
 * @module wordsFunctionsDB
 */
module.exports = {
  /**
   * Save data to the Words table if it is valid JSON.
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
        const validate = ajv.compile(schemas.basicSchema);
        const isValid = validate(data);

        if (!isValid) {
          // Bad Request
          reject({
            code: 400,
            message: validate.errors,
          });
        } else {
          const sql = `INSERT INTO Words (english_word, finnish_word, category_tags) values (?, ?, ?)`;

          // Sql query
          connection.query(
            sql,
            [data.english_word, data.finnish_word, data.category_tags],
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
   * Find all data from the Words table and order by the specified sortable and sortOrder.
   *
   * @function
   * @async
   * @param {mysql.Connection} connection - The MySQL connection.
   * @param {string} sortable - The field to sort by (id, eng, fin, tags).
   * @param {string} sortOrder - The sorting order (asc or desc).
   * @returns {Promise<Object[]>} A Promise that resolves with an array of matching records.
   * @throws {number} If a server error occurs, it rejects with the HTTP status code (500).
   */
  findAll: (connection, sortable, sortOrder) => {
    return new Promise((resolve, reject) => {
      try {
        // Initialize the sql query
        let query = "SELECT * FROM Words";
        let sanitizedSortable = "english_word";
        let sanitizedSortOrder = "asc";

        const validSortOrders = ["asc", "desc"];
        const validSortables = ["id", "eng", "fin", "tags"];

        // Sanitize sortOrder
        if (sortOrder && validSortOrders.includes(sortOrder.toLowerCase())) {
          sanitizedSortOrder = sortOrder.toLowerCase();
        }

        // Sanitize sortable
        if (sortable && validSortables.includes(sortable.toLowerCase())) {
          switch (sortable.toLowerCase()) {
            case "id":
              sanitizedSortable = "id";
              break;
            case "eng":
              sanitizedSortable = "english_word";
              break;
            case "fin":
              sanitizedSortable = "finnish_word";
              break;
            case "tags":
              sanitizedSortable = "category_tags";
              break;
            default:
              sanitizedSortable = "english_word";
              break;
          }
        }

        // Add the remaining query with sortable and order
        query += ` ORDER BY ${sanitizedSortable} ${sanitizedSortOrder}`;

        // Find all the data based on sort query if there is one
        connection.query(query, (err, words) => {
          if (err) {
            // Server Error
            console.error(err);
            reject(500);
          } else {
            // Return results
            const results = words.map((data) => ({
              id: data.id,
              english_word: data.english_word,
              finnish_word: data.finnish_word,
              category_tags: data.category_tags,
            }));

            resolve(results);
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
   * Find data from the Words table by ID.
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
        // Execute an SQL query to find a word by ID
        connection.query(
          "SELECT * FROM Words WHERE id = ?",
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
                message: `Word with ID: ${id} not found`,
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
   * Find all data from the Words table based on the search term and order by sortOrder and sortable.
   *
   * @function
   * @async
   * @param {mysql.Connection} connection - The MySQL connection.
   * @param {string} searchTerm - The search term.
   * @param {string} sortable - The field to sort by (id, eng, fin, tags).
   * @param {string} sortOrder - The sorting order (asc or desc).
   * @returns {Promise<Object[]>} A Promise that resolves with an array of matching records.
   * @throws {Object} If no matching records are found, it rejects with an object containing the HTTP status code (404) and a message.
   * @throws {number} If a server error occurs, it rejects with the HTTP status code (500).
   */
  search: (connection, searchTerm, sortable, sortOrder) => {
    return new Promise((resolve, reject) => {
      try {
        // Initialize the sql query
        let query = `
        SELECT * FROM Words
        WHERE id LIKE ? OR english_word LIKE ? OR finnish_word LIKE ? OR category_tags LIKE ?
      `;

        // Values that are being placed to the query
        const values = [
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ];

        let sanitizedSortable = "english_word";
        let sanitizedSortOrder = "asc";

        const validSortOrders = ["asc", "desc"];
        const validSortables = ["id", "eng", "fin", "tags"];

        // Sanitize sortOrder
        if (sortOrder && validSortOrders.includes(sortOrder.toLowerCase())) {
          sanitizedSortOrder = sortOrder.toLowerCase();
        }

        // Sanitize sortable
        if (sortable && validSortables.includes(sortable.toLowerCase())) {
          switch (sortable.toLowerCase()) {
            case "id":
              sanitizedSortable = "id";
              break;
            case "eng":
              sanitizedSortable = "english_word";
              break;
            case "fin":
              sanitizedSortable = "finnish_word";
              break;
            case "tags":
              sanitizedSortable = "category_tags";
              break;
            default:
              sanitizedSortable = "english_word";
              break;
          }
        }

        // Add the remaining query with sortable and order
        query += ` ORDER BY ${sanitizedSortable} ${sanitizedSortOrder}`;

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

  /**
   * Delete data from the Words table by ID.
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
        // Check if the word exists
        connection.query(
          "SELECT * FROM Words WHERE id = ?",
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
                message: `Word with ID: ${id} not found`,
              });
            } else {
              // Delete if data with the ID exists
              connection.query(
                "DELETE FROM Words WHERE id = ?",
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
   * Delete all records from the Words table.
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
        connection.query("DELETE FROM Words", (err) => {
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

  /**
   * Replace all the data of a certain word with the given data.
   *
   * @function
   * @async
   * @param {mysql.Connection} connection - The MySQL connection.
   * @param {number} id - The ID of the record to update.
   * @param {Object} data - The data to replace with.
   * @returns {Promise<number>} A Promise that resolves with the HTTP status code (204 if updated successfully).
   * @throws {Object} If no matching record is found, it rejects with an object containing the HTTP status code (404) and a message.
   * @throws {Object} If validation fails, it rejects with an object containing the HTTP status code (400) and validation errors.
   * @throws {number} If a server error occurs, it rejects with the HTTP status code (500).
   */
  put: (connection, id, data) => {
    return new Promise((resolve, reject) => {
      try {
        // Validate the data to be saved
        const validate = ajv.compile(schemas.putSchema);
        const isValid = validate(data);

        // Check if the word exists
        connection.query(
          "SELECT * FROM Words WHERE id = ?",
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
                message: `Word with ID: ${id} not found`,
              });
            } else if (!isValid) {
              // Bad Request
              reject({
                code: 400,
                message: validate.errors,
              });
            } else {
              // If the word exists then update it ->
              const english_word = data.english_word;
              const finnish_word = data.finnish_word;
              const category_tags = data.category_tags;

              // Sql query
              connection.query(
                "UPDATE Words SET english_word = ?, finnish_word = ?, category_tags = ? WHERE id = ?",
                [english_word, finnish_word, category_tags, id],
                (updateErr) => {
                  if (updateErr) {
                    // Server Error
                    console.error(updateErr);
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
   * Replace some parts of the data of a certain word with the given data.
   *
   * @async
   * @function
   * @param {object} connection - The MySQL database connection.
   * @param {number} id - The ID of the word to be patched.
   * @param {object} data - The data to patch the word with.
   * @param {string} data.english_word - The updated English word.
   * @param {string} data.finnish_word - The updated Finnish word.
   * @param {string} data.category_tags - The updated category tags.
   * @returns {Promise<number>} - A Promise that resolves to the HTTP status code (204 - No Content) if successful.
   * @throws {object} - A rejection with an object containing a code (HTTP status code) and message in case of errors.
   *
   * @example
   * try {
   *   await patch(connection, 1, { english_word: 'newEnglish', finnish_word: 'newFinnish' });
   * } catch (error) {
   *   console.error(error);
   * }
   */
  patch: (connection, id, data) => {
    return new Promise((resolve, reject) => {
      try {
        // Validate the data to be saved
        const validate = ajv.compile(schemas.patchSchema);
        const isValid = validate(data);

        // Check if the word exists
        connection.query(
          "SELECT * FROM Words WHERE id = ?",
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
                message: `Word with ID: ${id} not found`,
              });
            } else if (!isValid) {
              // Bad Request
              reject({
                code: 400,
                message: validate.errors,
              });
            } else {
              // If the word exists then update it ->
              const english_word = data.english_word;
              const finnish_word = data.finnish_word;
              const category_tags = data.category_tags;

              // Update english word
              updateEng = () => {
                connection.query(
                  "UPDATE Words SET english_word = ? WHERE id = ?",
                  [english_word, id],
                  (updateErr) => {
                    if (updateErr) {
                      // Server Error
                      console.error(updateErr);
                      reject(500);
                    } else {
                      // Valid: No Content
                      resolve(204);
                    }
                  }
                );
              };

              // Update finnish word
              updateFin = () => {
                connection.query(
                  "UPDATE Words SET finnish_word = ? WHERE id = ?",
                  [finnish_word, id],
                  (updateErr) => {
                    if (updateErr) {
                      // Server Error
                      console.error(updateErr);
                      reject(500);
                    } else {
                      // Valid: No Content
                      resolve(204);
                    }
                  }
                );
              };

              // Update tags
              updateTags = () => {
                connection.query(
                  "UPDATE Words SET category_tags = ? WHERE id = ?",
                  [category_tags, id],
                  (updateErr) => {
                    if (updateErr) {
                      // Server Error
                      console.error(updateErr);
                      reject(500);
                    } else {
                      // Valid: No Content
                      resolve(204);
                    }
                  }
                );
              };

              // Debugging
              console.log(english_word, finnish_word, category_tags);

              // Switch statement to check and execute update functions
              switch (true) {
                case english_word !== undefined:
                  updateEng();
                case finnish_word !== undefined:
                  updateFin();
                case category_tags !== undefined:
                  updateTags();
                  break;
                default:
                  // Bad Request
                  reject(400);
                  break;
              }
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
};
