const debug = require("debug")("probable-spoon:UIMonaco")

import React, { useRef, useEffect, useState, useMemo } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { is, debounce } from "@asd14/m"
import { useMount } from "@asd14/react-hooks"

import * as monaco from "monaco-editor/esm/vs/editor/editor.main"
import relationalJSONSchema from "./relational.schemas"

import css from "./monaco.module.css"

//
// Import custom themes
//
monaco.editor.defineTheme("gruvbox-dark", require("./gruvbox-dark.theme.json"))

const UIMonaco = ({ id, value, type, theme, language, onChange }) => {
  const editorReference = useRef()
  const [editor, setEditor] = useState()

  useMount(() => {
    debug("Initializing Monaco Editor editor")

    const _editor = monaco.editor.create(editorReference.current, {
      value,
      language,
      theme,
      fontFamily: "Fire Code, Consolas, Courier New, monospace",
      fontSize: 14,
    })

    _editor.getModel().updateOptions({ tabSize: 2 })

    setEditor(_editor)

    _editor.addCommand(
      monaco.KeyMod.Alt | monaco.KeyCode.US_OPEN_SQUARE_BRACKET,
      () => {
        alert("SAVE pressed!")
      }
    )

    return () => {
      debug("Destroying Monaco Editor editor")

      _editor.dispose()
    }
  })

  useEffect(() => {
    if (is(editor)) {
      monaco.editor.setTheme(theme)
    }
  }, [editor, theme])

  useEffect(() => {
    if (is(editor)) {
      const model = editor.getModel()

      monaco.editor.setModelLanguage(model, language)
    }
  }, [editor, language])

  /*
   * Update editor validation schema based on "id" and "type" props
   */

  useEffect(() => {
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
            oneOf: type === "relational" ? relationalJSONSchema : {},
          },
        },
      ],
    })
  }, [id, type])

  /*
   * Update editor content on "value" props change
   */

  useEffect(() => {
    if (is(editor)) {
      const model = editor.getModel()
      const editorValue = model.getValue()

      if (editorValue !== value) {
        model.pushEditOperations(
          [],
          [
            {
              range: model.getFullModelRange(),
              text: value,
              forceMoveMarkers: true,
            },
          ]
        )
      }
      editor.pushUndoStop()
    }
  }, [editor, value])

  /*
   * Update editor internal onChange handler on "id" props change
   */

  const debouncedOnChange = useMemo(() => debounce(onChange, { wait: 150 }), [
    onChange,
  ])

  useEffect(() => {
    if (is(editor)) {
      const _onChange = editor.onDidChangeModelContent(event => {
        const editorValue = editor.getValue()

        if (editorValue !== value) {
          debouncedOnChange(id, editorValue, event)
        }
      })

      return () => {
        _onChange.dispose()
      }
    }
  }, [id, value, editor, debouncedOnChange])

  return (
    <div className={cx(css.editor)}>
      <div style={{ height: "100%" }} ref={editorReference} />
    </div>
  )
}

UIMonaco.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  type: PropTypes.oneOf(["relational"]).isRequired,
  theme: PropTypes.string.isRequired,
  language: PropTypes.oneOf(["json"]),
  onChange: PropTypes.func.isRequired,
}

UIMonaco.defaultProps = {
  value: "",
  language: "json",
}

export { UIMonaco }
