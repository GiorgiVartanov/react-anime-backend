// checks if passed id is a valid id
const isValidId = (id) => {
  if (typeof id !== "string") {
    return false
  }

  if (id.length !== 24) {
    return false
  }

  const hexPattern = /^[0-9a-fA-F]{24}$/
  return hexPattern.test(id)
}

module.exports = isValidId
