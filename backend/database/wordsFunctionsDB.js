const Ajv = require("ajv");
const ajv = new Ajv();
const schemas = require("./schemas");

module.exports = {
  save: (connection, data) => {
    return new Promise((resolve, reject) => {
      try {
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

  findAll: (connection, sortable, sortOrder) => {
    return new Promise((resolve, reject) => {
      try {
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
              // Delete if exists
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

  deleteAll: (connection) => {
    return new Promise((resolve, reject) => {
      try {
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

  put: (connection, id, data) => {
    return new Promise((resolve, reject) => {
      try {
        const validate = ajv.compile(schemas.putSchema);
        const isValid = validate(data);

        // Check if the location exists
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
              // Update the location
              const english_word = data.english_word;
              const finnish_word = data.finnish_word;
              const category_tags = data.category_tags;

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

  patch: (connection, id, data) => {
    return new Promise((resolve, reject) => {
      try {
        const validate = ajv.compile(schemas.patchSchema);
        const isValid = validate(data);

        // Check if the location exists
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
              // Get the data
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
