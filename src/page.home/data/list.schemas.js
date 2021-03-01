const debug = require("debug")("probable-spoon:Home.SchemasList")

import { buildList } from "@asd14/state-list"
import {
  findWith,
  upsertWith,
  update,
  when,
  pipeP,
  same,
  isEmpty,
  is,
} from "@asd14/m"
import localforage from "localforage"

const SCHEMAS_NAMESPACE = "HOME.SCHEMAS"

// localforage.setItem(SCHEMAS_NAMESPACE, [{ id: "1", schema: "{}" }])

export const SchemasList = buildList({
  name: SCHEMAS_NAMESPACE,

  read: () =>
    pipeP(
      () => localforage.getItem(SCHEMAS_NAMESPACE),
      when(isEmpty, same([{ id: "1", schema: "{}" }]))
    )(),

  update: async (id, { tableId, schema, coordinates }) => {
    const items = await pipeP(
      () => localforage.getItem(SCHEMAS_NAMESPACE),
      when(isEmpty, same([])),
      upsertWith(
        { id },
        {
          id,
          schema: (source = "") => (is(schema) ? schema : source),
          coordinates: (source = {}) =>
            is(coordinates)
              ? update({ [tableId]: coordinates }, source)
              : source,
        }
      )
    )()

    await localforage.setItem(SCHEMAS_NAMESPACE, items)

    return findWith({ id }, { id }, items)
  },
})
