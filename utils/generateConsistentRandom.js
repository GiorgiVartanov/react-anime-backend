// function to generate random number, that depends on date, hour and on passed seed
const generateConsistentRandom = (max, seed = 12345) => {
  const currentHours = new Date().getHours()
  const currentDate = new Date().getDate()

  const random = (seed + currentHours + currentDate) % max

  return random
}

module.exports = generateConsistentRandom
