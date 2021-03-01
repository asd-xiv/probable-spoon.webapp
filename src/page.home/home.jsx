const debug = require("debug")("probable-spoon:HomePage")

import React, { useCallback, useEffect } from "react"
import cx from "classnames"
import { useList, useQuery, useFocus } from "@asd14/react-hooks"

import { ErrorBoundaryUI } from "core.ui/error-boundary/error-boundary"

import { SchemasList } from "./data/list.schemas"

import { ListSection } from "./section.list/list"
import { DiagramSection } from "./section.diagram/diagram"
import { EditorSection } from "./section.editor/editor"

import css from "./home.module.css"

export const HomePage = () => {
  const [{ layer }, setFocus] = useFocus()
  const [{ schemaId: querySchemaId }] = useQuery()
  const {
    selector: { items, byId, hasWithId },
    read,
    update,
  } = useList(SchemasList)

  useEffect(() => {
    read()
  }, [read])

  const { schema, coordinates } = byId(querySchemaId, {})

  const handleSchemaUpdate = useCallback(
    (id, data) => {
      update(id, {
        schema: data,
      })
    },
    [update]
  )

  const handleTableMove = useCallback(
    (id, data) => {
      update(querySchemaId, {
        tableId: id,
        coordinates: data,
      })
    },
    [querySchemaId, update]
  )

  return hasWithId(querySchemaId) ? (
    <div className={css["schema-wrapper"]}>
      <div className={css.schema}>
        <div
          className={cx(css.section, {
            [css["section--has-focus"]]: layer === "base.items",
          })}
          onMouseDown={() => setFocus({ layer: "base.items" })}>
          <ErrorBoundaryUI>
            <ListSection diagrams={items()} />
          </ErrorBoundaryUI>
        </div>
        <div
          className={cx(css.section, {
            [css["section--has-focus"]]: layer === "base.diagram",
          })}
          onMouseDown={() => setFocus({ layer: "base.diagram" })}>
          <ErrorBoundaryUI>
            <DiagramSection
              source={schema}
              coordinates={coordinates}
              onMove={handleTableMove}
            />
          </ErrorBoundaryUI>
        </div>
        <div
          className={cx(css.section, {
            [css["section--has-focus"]]: layer === "base.editor",
          })}
          onMouseDown={() => setFocus({ layer: "base.editor" })}>
          <ErrorBoundaryUI>
            <EditorSection
              id={querySchemaId}
              value={schema}
              onChange={handleSchemaUpdate}
            />
          </ErrorBoundaryUI>
        </div>
      </div>
    </div>
  ) : null
}
