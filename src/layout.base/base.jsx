const debug = require("debug")("probable-spoon:BaseLayout")

import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { useTheme } from "@asd14/react-hooks/dist/use-theme/theme.hook"

import css from "./base.module.css"

const BaseLayout = ({ children }) => {
  const [{ theme, size }] = useTheme({ theme: "gruvbox-dark" })

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
