const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    english_word: { type: "string" },
    finnish_word: { type: "string" },
    category_tags: { type: "string" },
  },
  required: ["english_word", "finnish_word"],
  additionalProperties: false,
};

module.exports = {
  save: (connection, data) => {
    return new Promise((resolve, reject) => {
      try {
        const validate = ajv.compile(schema);
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

  findAll: (connection) => {
    return new Promise((resolve, reject) => {
      try {
        connection.query("SELECT * FROM Words", (err, words) => {
          if (err) {
            // Server Error
            console.error(err);
            reject(500);
          } else {
            const results = words.map((data) => {
              return {
                id: data.id,
                english_word: data.english_word,
                finnish_word: data.finnish_word,
                category_tags: data.category_tags,
              };
            });

            // Valid
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
};
