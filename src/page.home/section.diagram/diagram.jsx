const debug = require("debug")("probable-spoon:DiagramSection")

import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { useMemo, useFocus } from "@asd14/react-hooks"
import { useTheme } from "@asd14/gruvbox-ui"
import {
  push,
  pipe,
  keys,
  filter,
  read,
  map,
  reduce,
  toLower,
  hasKey,
} from "@asd14/m"

import { TableUI } from "./ui.table/table"

import css from "./diagram.module.css"

const startsWithUpperCase = source => /^[A-Z].*/.test(source)

const parseSchema = ({ schema }) => {
  const schemaEntries = Object.entries(schema)
  const isSchemaObject = source => hasKey(toLower(source), schema)
  const isReferencingOtherNode = source =>
    startsWithUpperCase(source) && isSchemaObject(source)

  return {
    nodes: reduce(
      (accumulator, [key, value]) => {
        return [
          ...accumulator,
          {
            id: key,
            inputs: [{ id: `${key}-input-main` }],
            outputs: pipe(
              keys,
              filter(isReferencingOtherNode),
              map(item => ({ id: `${key}-output-${item}` })),
              push({ id: `${key}-output-main` })
            )(value),
            fields: value,
          },
        ]
      },
      [],
      schemaEntries
    ),

    links: reduce(
      (accumulator, [key, value]) => {
        return [
          ...accumulator,
          ...pipe(
            keys,
            filter(isReferencingOtherNode),
            map(item => ({
              input: `${toLower(item)}`,
              output: `${key}-output-${item}`,
              label: read([item, "verb"], "hasMany", value),
              readOnly: true,
            }))
          )(value),
        ]
      },
      [],
      schemaEntries
    ),
  }
}

const DiagramSection = ({ source, coordinates, onMove }) => {
  const [{ id: focusId, layer }, setFocus] = useFocus()
  const [{ unit: themeUnit }] = useTheme()

  const { nodes, links } = useMemo(() => {
    let parsedSource = {}

    try {
      parsedSource = JSON.parse(source)

      return parseSchema({
        schema: parsedSource,
      })
    } catch (error) {
      debug({ error })

      return { nodes: [], links: [] }
    }
  }, [source])

  const handleCoordinatesUpdate = useCallback(
    (id, [top, left]) => {
      const gridTop = Math.floor(top / themeUnit) * themeUnit
      const gridLeft = Math.floor(left / themeUnit) * themeUnit

      onMove(id, [gridTop, gridLeft])
    },
    [onMove, themeUnit]
  )

  return (
    <div className={css["diagram-grid"]}>
      {map(({ id, inputs, outputs, fields }) => {
        return (
          <TableUI
            key={id}
            id={id}
            inputs={inputs}
            outputs={outputs}
            fields={fields}
            coordinates={read(id, [100, 100], coordinates)}
            hasFocus={layer === "base.diagram" && focusId === id}
            onMove={handleCoordinatesUpdate}
            onMouseDown={() => setFocus({ id })}
          />
        )
      }, nodes)}
    </div>
  )
}

DiagramSection.propTypes = {
  source: PropTypes.string,
  coordinates: PropTypes.shape(),
  onMove: PropTypes.func.isRequired,
}

DiagramSection.defaultProps = {
  source: '{"asd": {}}',
  coordinates: {},
}

export { DiagramSection }
