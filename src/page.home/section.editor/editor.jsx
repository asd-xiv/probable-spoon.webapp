const debug = require("debug")("probable-spoon:EditorSection")

import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

import { UIMonaco } from "./ui.monaco/monaco"
import css from "./editor.module.css"

const EditorSection = ({ id, value, onChange }) => {
  return (
    <div className={cx(css.editor)}>
      <UIMonaco
        id={id}
        value={value}
        theme="gruvbox-dark"
        type="relational"
        onChange={onChange}
      />
    </div>
  )
}

EditorSection.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
}

EditorSection.defaultProps = {
  value: "",
  onChange: undefined,
}

export { EditorSection }
