const debug = require("debug")("probable-spoon:HomePage")

import React, { useCallback, useEffect } from "react"
import cx from "classnames"
import { useList, useQuery, useFocus, useKeyboard } from "@asd14/react-hooks"

import { ErrorBoundaryUI } from "core.ui/error-boundary/error-boundary"

import { SchemasList } from "./data/list.schemas"

import { ListSection } from "./section.list/list"
import { DiagramSection } from "./section.diagram/diagram"
import { EditorSection } from "./section.editor/editor"

import css from "./home.module.css"

const LAYER_LIST = "base.list"
const LAYER_DIAGRAM = "base.diagram"
const LAYER_EDITOR = "base.editor"

export const HomePage = () => {
  const [{ layer }, setFocus] = useFocus()
  const [{ diagramId: queryDiagramId }] = useQuery()
  const { addShortcuts, removeShortcuts } = useKeyboard({ layer: "base" })

  const {
    selector: { items, byId, hasWithId },
    create,
    read,
    update,
    remove,
  } = useList(SchemasList)

  useEffect(() => {
    read()
  }, [read])

  const { schema, coordinates } = byId(queryDiagramId, {})

  useEffect(() => {
    addShortcuts({
      // Move focus to right section
      "]": event => {
        if (event.altKey) {
          setFocus({
            layer:
              layer === LAYER_LIST
                ? LAYER_DIAGRAM
                : layer === LAYER_DIAGRAM
                ? LAYER_EDITOR
                : LAYER_LIST,
          })
        }
      },

      // Move focus to left section
      "[": event => {
        if (event.altKey) {
          setFocus({
            layer:
              layer === LAYER_EDITOR
                ? LAYER_DIAGRAM
                : layer === LAYER_DIAGRAM
                ? LAYER_LIST
                : LAYER_EDITOR,
          })
        }
      },
    })

    return () => removeShortcuts()
  }, [layer, addShortcuts, removeShortcuts, setFocus])

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
      update(queryDiagramId, {
        tableId: id,
        coordinates: data,
      })
    },
    [queryDiagramId, update]
  )

  /* eslint-disable unicorn/no-null */
  return (
    <div className={css["schema-wrapper"]}>
      <div className={css.schema}>
        <div
          className={cx(css.section, {
            [css["section--has-focus"]]: layer === LAYER_LIST,
          })}
          onMouseDown={() => setFocus({ layer: LAYER_LIST })}>
          <ErrorBoundaryUI>
            <ListSection
              diagrams={items()}
              hasFocus={layer === LAYER_LIST}
              onCreate={create}
              onUpdate={update}
              onRemove={remove}
            />
          </ErrorBoundaryUI>
        </div>
        <div
          className={cx(css.section, {
            [css["section--has-focus"]]: layer === LAYER_DIAGRAM,
          })}
          onMouseDown={() => setFocus({ layer: LAYER_DIAGRAM })}>
          {hasWithId(queryDiagramId) ? (
            <ErrorBoundaryUI>
              <DiagramSection
                source={schema}
                coordinates={coordinates}
                onMove={handleTableMove}
              />
            </ErrorBoundaryUI>
          ) : null}
        </div>
        <div
          className={cx(css.section, {
            [css["section--has-focus"]]: layer === LAYER_EDITOR,
          })}
          onMouseDown={() => setFocus({ layer: LAYER_EDITOR })}>
          {hasWithId(queryDiagramId) ? (
            <ErrorBoundaryUI>
              <EditorSection
                id={queryDiagramId}
                value={schema}
                onChange={handleSchemaUpdate}
              />
            </ErrorBoundaryUI>
          ) : null}
        </div>
      </div>
    </div>
  )
}
