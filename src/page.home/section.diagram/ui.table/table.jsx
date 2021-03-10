const debug = require("debug")("probable-spoon:TableUI")

import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { is } from "@asd14/m"
import { useDrag, deepReactMemo } from "@asd14/react-hooks"
import { useTheme } from "@asd14/gruvbox-ui"

import { FieldsUI } from "../ui.fields/fields"
import css from "./table.module.css"

const TableUI = ({
  id,
  inputs,
  outputs,
  fields,
  coordinates: [top, left],
  hasFocus,
  onMove,
  onMouseDown,
}) => {
  const [{ unit: themeUnit }] = useTheme()
  // const [domElement, setDomElement] = useDom()
  const { onPickup } = useDrag({ id, onDrag: onMove })

  // const maxFieldChars = useMemo(() => {
  //   reduce(() => {}, { maxLength: 0 }, fields)
  // }, [fields])

  return (
    <div
      className={cx(css.table, {
        [css["table--has-focus"]]: hasFocus,
      })}
      style={{
        width: 17 * themeUnit + 1,
        left: `${left - 1}px`,
        top: `${top - 1}px`,
      }}
      onMouseDown={event => {
        if (is(onMouseDown)) {
          onMouseDown(event)
        }

        onPickup(event, { coordinates: [top, left] })
      }}>
      <div className={cx(css["input--main"])} />
      <div className={css.name}>{id}</div>
      <div className={css.divider}>---</div>
      <FieldsUI
        tableId={id}
        items={fields}
        inputs={inputs}
        outputs={outputs}
        hasTableFocus={hasFocus}
      />
    </div>
  )
}

TableUI.propTypes = {
  id: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  outputs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  fields: PropTypes.shape(),
  coordinates: PropTypes.arrayOf(PropTypes.number),
  hasFocus: PropTypes.bool,
  onMove: PropTypes.func,
  onMouseDown: PropTypes.func,
}

TableUI.defaultProps = {
  inputs: [],
  outputs: [],
  fields: [],
  coordinates: [],
  hasFocus: false,
  onMove: undefined,
  onMouseDown: undefined,
}

const memo = deepReactMemo(TableUI)

export { memo as TableUI }
