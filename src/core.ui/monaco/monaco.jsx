const debug = require("debug")("probable-spoon:UIMonaco")

import React, { useRef, useEffect, useState } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { is } from "@asd14/m"
import { useMount } from "@asd14/react-hooks"
import * as monaco from "monaco-editor/esm/vs/editor/editor.main"

import css from "./monaco.module.css"

monaco.editor.defineTheme("gruvbox-dark", require("./gruvbox-dark.theme.json"))

const UIMonaco = ({ id, value, tabSize, theme, language, onChange }) => {
  const editorReference = useRef()
  const [editor, setEditor] = useState()

  useMount(() => {
    debug("Initializing Monaco Editor instance")

    const model = monaco.editor.createModel(
      value,
      language,
      monaco.Uri.parse(id)
    )

    model.updateOptions({ tabSize })

    const instance = monaco.editor.create(editorReference.current, {
      model,
      theme,
      fontFamily: "Fire Code, Consolas, Courier New, monospace",
      fontSize: 14,
    })

    setEditor(instance)

    return () => {
      if (is(editor)) {
        debug("Distroying Monaco Editor instance")
        editor.dispose()
      }
    }
  })

  useEffect(() => {
    if (is(editor) && is(onChange)) {
      editor.onDidChangeModelContent(event => {
        onChange(id, editor.getValue(), event)
      })
    }
  }, [id, editor, onChange])

  return (
    <div className={cx(css.editor)}>
      <div style={{ height: "100%" }} ref={editorReference} />
    </div>
  )
}

UIMonaco.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  tabSize: PropTypes.number,
  theme: PropTypes.string,
  language: PropTypes.string,
  onChange: PropTypes.func,
}

UIMonaco.defaultProps = {
  value: "",
  tabSize: 2,
  theme: "gruvbox-dark",
  language: "json",
  onChange: undefined,
}

export { UIMonaco }
