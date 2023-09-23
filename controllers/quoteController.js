const asyncHandler = require("express-async-handler")
const axios = require("axios")

const Quote = require("../models/quoteModel")

const generateConsistentRandom = require("../utils/generateConsistentRandom")

const API_URL = process.env.API_URL

// returns unique quote each hour (so, same quote if it was requested same at hour)
const getQuote = asyncHandler(async (req, res) => {
  const randomNumber = generateConsistentRandom(68)

  const response = await Quote.find()
    .skip(randomNumber - 1)
    .limit(1)

  const randomQuote = response[0]

  if (!randomQuote) {
    res.status(400)
    throw new Error("something went wrong")
  }

  let animeFromQuote

  try {
    animeFromQuote = await axios.get(
      `https://api.jikan.moe/v4/anime/${randomQuote.mal_id}`
    )
  } catch (error) {
    res.status(error.response.status)
    throw new Error(error.response.statusText)
  }

  if (!animeFromQuote) {
    res.status(400)
    throw new Error("something went wrong")
  }

  const data = {
    text: randomQuote.text,
    author: randomQuote.author,
    title: animeFromQuote.data.data.title,
    mal_id: randomQuote.mal_id,
    images: animeFromQuote.data.data.images,
  }

  res.status(200).json({ data })
})

module.exports = {
  getQuote,
}
