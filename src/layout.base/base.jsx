const debug = require("debug")("probable-spoon:BaseLayout")

import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { useTheme } from "@asd14/gruvbox-ui"

import css from "./base.module.css"

const BaseLayout = ({ children }) => {
  const [{ theme, size }] = useTheme()

  return (
    <div className={cx(css["base-layout"], `theme-${theme}`, `size-${size}`)}>
      {children}
    </div>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export { BaseLayout }
