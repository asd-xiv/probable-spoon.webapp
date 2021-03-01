const debug = require("debug")("probable-spoon:Home.SchemasList")

import { buildList } from "@asd14/state-list"
import {
  findWith,
  updateWith,
  update,
  when,
  pipeP,
  same,
  isEmpty,
  is,
} from "@asd14/m"
import localforage from "localforage"

const SCHEMAS_NAMESPACE = "HOME.SCHEMAS"

// localforage.setItem(SCHEMAS_NAMESPACE, [{id: 1, schema: "{}"}])

export const SchemasList = buildList({
  name: SCHEMAS_NAMESPACE,

  read: () => localforage.getItem(SCHEMAS_NAMESPACE),

  update: async (id, { tableId, schema, coordinates }) => {
    const items = await pipeP(
      source => localforage.getItem(source),
      when(isEmpty, same([])),
      updateWith(
        {
          id,
        },
        {
          schema: (source = "") => (is(schema) ? schema : source),
          coordinates: (source = {}) =>
            is(coordinates)
              ? update({ [tableId]: coordinates }, source)
              : source,
        }
      )
    )(SCHEMAS_NAMESPACE)

    await localforage.setItem(SCHEMAS_NAMESPACE, items)

    return findWith({ id }, { id }, items)
  },
})
