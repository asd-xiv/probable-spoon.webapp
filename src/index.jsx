// activate debug logging when in development
if (process.env.NODE_ENV !== "production") {
  localStorage.setItem("debug", "probable-spoon:*,@asd14/react-hooks:*")
}

const debug = require("debug")("probable-spoon:Index")

import React from "react"
import { render } from "react-dom"
import { setup as setupHTTPProperties } from "@asd14/fetch-browser"
import { stringify } from "qs"
import { Provider } from "react-redux"

import { store } from "./index.redux"
import { AppRouter } from "./index.router"

import "./index.css"

setupHTTPProperties({
  baseURL: process.env.API_URL,
  stringifyQueryParams: source =>
    stringify(source, {
      allowDots: true,
      encode: false,
      arrayFormat: "brackets",
      strictNullHandling: true,
    }),
})

render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.querySelector("#react-root")
)
