const debug = require("debug")("probable-spoon:GuestLayout")

import React from "react"
import PropTypes from "prop-types"

import { BaseLayout } from "layout.base/base"

// import css from "./guest.module.css"

const GuestLayout = ({ children }) => {
  return (
    <BaseLayout>
      <div>{children}</div>
    </BaseLayout>
  )
}

GuestLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export { GuestLayout }
