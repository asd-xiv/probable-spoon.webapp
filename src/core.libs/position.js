import { max, min, read, findIndexWith } from "@asd14/m"

export const hover = (direction, { id, items }) => {
  if (direction !== "up" && direction !== "down") {
    throw new Error(
      `position:hover: allowed values for "direction" are ["up", "down"], received ${JSON.stringify(
        direction
      )}`
    )
  }

  const index = findIndexWith({ id }, items)

  if (direction === "up") {
    return read([max([0, index - 1]), "id"], undefined, items)
  }

  // down
  return read([min([items.length - 1, index + 1]), "id"], undefined, items)
}
