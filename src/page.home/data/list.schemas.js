const debug = require("debug")("probable-spoon:Home.SchemasList")

import { buildList } from "@asd14/state-list"
import cuid from "cuid"
import {
  push,
  findWith,
  upsertWith,
  removeWith,
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

  create: async () => {
    const items = await localforage.getItem(SCHEMAS_NAMESPACE)
    const newDiagram = { id: cuid(), title: "unnamed", schema: "{}" }

    await localforage.setItem(SCHEMAS_NAMESPACE, push(newDiagram)(items))

    return newDiagram
  },

  read: () =>
    pipeP(
      () => localforage.getItem(SCHEMAS_NAMESPACE),
      when(isEmpty, same([{ id: "1", schema: "{}" }]))
    )(),

  update: async (id, { tableId, title, schema, coordinates }) => {
    const items = await pipeP(
      () => localforage.getItem(SCHEMAS_NAMESPACE),
      when(isEmpty, same([])),
      upsertWith(
        { id },
        {
          id,
          title: source => (is(title) ? title : source),
          schema: source => (is(schema) ? schema : source),
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

  remove: async id => {
    const items = await localforage.getItem(SCHEMAS_NAMESPACE)

    await localforage.setItem(SCHEMAS_NAMESPACE, removeWith({ id }, items))

    return { id }
  },
})
