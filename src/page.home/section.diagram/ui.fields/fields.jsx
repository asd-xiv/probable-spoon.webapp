const debug = require("debug")("probable-spoon:FieldsUI")

import React from "react"
import cx from "classnames"
import PropTypes from "prop-types"
import { reduce, pipe, map, findWith, is } from "@asd14/m"
import { deepReactMemo } from "@asd14/react-hooks"

import css from "./fields.module.css"

const toArray = pipe(
  Object.entries,
  reduce(
    (accumulator, [key, value]) => [
      ...accumulator,
      {
        id: key,
        ...(typeof value === "string" ? { type: value } : value),
      },
    ],
    []
  )
)

const FieldsUI = ({ tableId, items, outputs, level = 0, hasTableFocus }) => {
  return (
    <div className={css.fields}>
      {map(item => {
        const fieldOutput = findWith(
          { id: `${tableId}-output-${item.id}` },
          undefined,
          outputs
        )

        const isNonPrimitive = item.type === "array" || item.type === "object"

        return (
          <React.Fragment key={item.id}>
            {level === 0 && isNonPrimitive ? <br /> : null}

            <div
              className={cx(css.field, {
                [css["field--has-table-focus"]]: hasTableFocus,
              })}>
              <div className={css["field-name"]}>{`${level === 0 ? "" : "| "}${
                item.id
              }`}</div>
              <div className={css["field-type"]}>
                {item.type === "array"
                  ? "[]"
                  : item.type === "object"
                  ? "{}"
                  : item.type}
              </div>

              {is(fieldOutput) ? <div className={css["field-output"]} /> : null}
            </div>

            {item.type === "array" || item.type === "object" ? (
              <FieldsUI
                tableId={tableId}
                items={item.items}
                level={level + 1}
              />
            ) : null}
          </React.Fragment>
        )
      }, toArray(items))}
    </div>
  )
}

FieldsUI.propTypes = {
  tableId: PropTypes.string.isRequired,
  items: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      })
    ),
  }),
  outputs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
  level: PropTypes.number,
  hasTableFocus: PropTypes.bool,
}

FieldsUI.defaultProps = {
  items: {},
  level: 0,
  outputs: [],
  hasTableFocus: false,
}

const memo = deepReactMemo(FieldsUI)

export { memo as FieldsUI }
