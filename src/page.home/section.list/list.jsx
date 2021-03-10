const debug = require("debug")("probable-spoon:ListSection")

import React, { useEffect, useState, useCallback } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { useQuery, useKeyboard, useDom } from "@asd14/react-hooks"
import { Input } from "@asd14/gruvbox-ui"
import {
  pipe,
  findWith,
  findIndexWith,
  map,
  read,
  first,
  last,
  equals,
  isEmpty,
  is,
} from "@asd14/m"

import { hover } from "core.libs/position"

import css from "./list.module.css"

const ListSection = ({ diagrams, hasFocus, onCreate, onUpdate, onRemove }) => {
  const [{ diagramId: queryDiagramId }, setQuery] = useQuery()
  const { addShortcuts, removeShortcuts } = useKeyboard({ layer: "base.list" })

  const [{ id: editId, title: editTitle }, setEdit] = useState({})
  const [editDom, setEditDom] = useDom()

  useEffect(() => {
    if (is(editDom) && is(editId) && hasFocus) {
      editDom.focus()
    }
  }, [editId, editDom, hasFocus])

  useEffect(() => {
    addShortcuts({
      // Create Diagram
      a: () =>
        onCreate().then(({ result }) => {
          if (is(result)) {
            setQuery({ diagramId: result.id })
          }
        }),

      // Set edit-mode for selected Diagram
      i: () => {
        setEdit({
          id: queryDiagramId,
          title: pipe(
            findWith({ id: queryDiagramId }),
            read("title", "")
          )(diagrams),
        })
      },

      // Delete selected Diagram
      d: () => {
        const title = pipe(
          findWith({ id: queryDiagramId }),
          read("title", "")
        )(diagrams)

        if (window.confirm(`Delete "${title}" diagram?`)) {
          return onRemove(queryDiagramId).then(() => {
            const isLast = pipe(
              last,
              read("id"),
              equals(queryDiagramId)
            )(diagrams)

            setQuery({
              diagramId: hover(isLast ? "up" : "down", {
                id: queryDiagramId,
                items: diagrams,
              }),
            })
          })
        }
      },

      // Select previous diagram
      ArrowUp: () => {
        const isFirst = pipe(
          first,
          read("id"),
          equals(queryDiagramId)
        )(diagrams)

        if (!isFirst) {
          const currentIndex = findIndexWith({ id: queryDiagramId }, diagrams)

          setQuery({
            diagramId: read([currentIndex - 1, "id"], undefined, diagrams),
          })
        }
      },

      // Select next diagram
      ArrowDown: () => {
        const isLast = pipe(last, read("id"), equals(queryDiagramId))(diagrams)

        if (!isLast) {
          const currentIndex = findIndexWith({ id: queryDiagramId }, diagrams)

          setQuery({
            diagramId: read([currentIndex + 1, "id"], undefined, diagrams),
          })
        }
      },
    })

    return () => removeShortcuts()
  }, [
    queryDiagramId,
    diagrams,
    addShortcuts,
    removeShortcuts,
    setQuery,
    onCreate,
    onRemove,
  ])

  const handleEditTitleChange = useCallback(
    event => setEdit({ id: editId, title: event.currentTarget.value }),
    [editId]
  )

  const handleEditBlur = useCallback(() => setEdit({}), [])

  const handleEditSubmit = useCallback(
    () => onUpdate(editId, { title: editTitle }).then(() => setEdit({})),
    [editId, editTitle, onUpdate]
  )

  return (
    <ul
      className={cx(css.list, {
        [css["list--focused"]]: hasFocus,
      })}>
      {map(
        item => (
          <li
            key={item.id}
            className={cx(css.item, {
              [css["item--selected"]]: queryDiagramId === item.id,
            })}>
            {item.id === editId ? (
              <Input
                ref={setEditDom}
                value={editTitle}
                onChange={handleEditTitleChange}
                onSubmit={handleEditSubmit}
                onBlur={handleEditBlur}
              />
            ) : isEmpty(item.title) ? (
              <em>untitled</em>
            ) : (
              item.title
            )}
          </li>
        ),
        diagrams
      )}
    </ul>
  )
}

ListSection.propTypes = {
  diagrams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })
  ),
  hasFocus: PropTypes.bool,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
}

ListSection.defaultProps = {
  diagrams: [],
  hasFocus: false,
  onCreate: undefined,
  onUpdate: undefined,
  onRemove: undefined,
}

export { ListSection }
