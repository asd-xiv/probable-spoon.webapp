const debug = require("debug")("probable-spoon:ListSection")

import React, { useState } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { map } from "@asd14/m"

import css from "./list.module.css"

const ListSection = ({ diagrams }) => {
  const [diagramSelectedId, setDiagramSelectedId] = useState()

  return (
    <ul>
      {map(
        item => (
          <li key={item.id}>{item.name}</li>
        ),
        diagrams
      )}
    </ul>
  )
}

ListSection.propTypes = {
  diagrams: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, title: PropTypes.string })
  ),
}

ListSection.defaultProps = {
  diagrams: [],
}

export { ListSection }
