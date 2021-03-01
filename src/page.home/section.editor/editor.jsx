const debug = require("debug")("probable-spoon:EditorSection")

import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import * as monaco from "monaco-editor/esm/vs/editor/editor.main"
import { useMount } from "@asd14/react-hooks"

import { UIMonaco } from "core.ui/monaco/monaco"

import fieldTypeSchemas from "./editor.schemas"
import css from "./editor.module.css"

const EditorSection = ({ id, value, onChange }) => {
  useMount(() => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      schemaValidation: "error",
      allowComments: true,
      validate: true,
      schemas: [
        {
          uri: "http://asd14/model.json",
          fileMatch: [id],
          schema: {
            type: "object",
            additionalProperties: {
              type: "object",
              additionalProperties: {
                $ref: "http://asd14/field",
              },
            },
          },
        },
        {
          uri: "http://asd14/field",
          schema: {
            oneOf: fieldTypeSchemas,
          },
        },
      ],
    })
  })

  return (
    <div className={cx(css.editor)}>
      <UIMonaco id={id} value={value} tabSize={2} onChange={onChange} />
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
