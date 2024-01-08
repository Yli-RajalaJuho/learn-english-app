module.exports = {
  basicSchema: {
    type: "object",
    properties: {
      english_word: { type: "string", minLength: 1 },
      finnish_word: { type: "string", minLength: 1 },
      category_tags: { type: "string" },
    },
    required: ["english_word", "finnish_word"],
    additionalProperties: false,
  },

  putSchema: {
    type: "object",
    properties: {
      id: { type: "integer" },
      english_word: { type: "string", minLength: 1 },
      finnish_word: { type: "string", minLength: 1 },
      category_tags: { type: "string" },
    },
    required: ["english_word", "finnish_word"],
    additionalProperties: false,
  },

  patchSchema: {
    type: "object",
    properties: {
      id: { type: "integer" },
      english_word: { type: "string", minLength: 1 },
      finnish_word: { type: "string", minLength: 1 },
      category_tags: { type: "string" },
    },
    anyOf: [
      { required: ["english_word"] },
      { required: ["finnish_word"] },
      { required: ["category_tags"] },
    ],
    additionalProperties: false,
  },

  scoresSchema: {
    type: "object",
    properties: {
      score: { type: "string", minLength: 1 },
      correct_words: { type: "string", minLength: 0 },
      incorrect_words: { type: "string", minLength: 0 },
    },
    required: ["score", "correct_words", "incorrect_words"],
    additionalProperties: false,
  },
};
