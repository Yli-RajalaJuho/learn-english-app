module.exports = {
  basicSchema: {
    type: "object",
    properties: {
      english_word: { type: "string" },
      finnish_word: { type: "string" },
      category_tags: { type: "string" },
    },
    required: ["english_word", "finnish_word"],
    additionalProperties: false,
  },

  putSchema: {
    type: "object",
    properties: {
      id: { type: "integer" },
      english_word: { type: "string" },
      finnish_word: { type: "string" },
      category_tags: { type: "string" },
    },
    required: ["english_word", "finnish_word"],
    additionalProperties: false,
  },

  patchSchema: {
    type: "object",
    properties: {
      id: { type: "integer" },
      english_word: { type: "string" },
      finnish_word: { type: "string" },
      category_tags: { type: "string" },
    },
    anyOf: [
      { required: ["english_word"] },
      { required: ["finnish_word"] },
      { required: ["category_tags"] },
    ],
    additionalProperties: false,
  },
};
