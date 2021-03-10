const primitiveTypes = ["bool", "number", "string"]

module.exports = [
  /*
   * {
   *   "field": "number"
   * }
   */
  {
    type: "string",
    enum: primitiveTypes,
  },

  /*
   * {
   *   "field": {
   *     "type": "string",
   *     "values": ["foo", "bar"]
   *   }
   * }
   */
  {
    type: "object",
    additionalProperties: false,
    required: ["type"],
    properties: {
      type: { type: "string", enum: ["string"] },
      values: { type: "array", items: { type: "string" } },
    },
  },

  /*
   * {
   *   "field": {
   *     "type": "array",
   *     "items": "string"
   *   }
   * }
   */
  {
    type: "object",
    additionalProperties: false,
    required: ["type"],
    properties: {
      type: { type: "string", enum: ["array"] },
      items: { type: "string", enum: primitiveTypes },
    },
  },

  /*
   * {
   *   "field": {
   *     "type": "array",
   *     "verb": "verb": "1:n | hasMany",
   *     "items": {
   *       id: "string"
   *     }
   *   }
   * }
   */
  {
    type: "object",
    additionalProperties: false,
    required: ["type"],
    properties: {
      type: { type: "string", enum: ["array"] },
      verb: { type: "string" },
      items: {
        type: "object",
        additionalProperties: {
          $ref: "http://asd14/field",
        },
      },
    },
  },
]
