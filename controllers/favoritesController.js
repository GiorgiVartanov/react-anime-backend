const url = require("url")
const axios = require("axios")
const asyncHandler = require("express-async-handler")
const Favorite = require("../models/favoriteModel")
const User = require("../models/userModel")

const API_URL = process.env.API_URL

const getFavoriteAnime = asyncHandler(async (req, res) => {
  const { username } = req.params
  const user = await User.findOne({ username: username })

  const response = await Favorite.find({ user: user })

  res.status(200).json({ data: response })
})

const addFavoriteAnime = asyncHandler(async (req, res) => {
  const { animeId } = req.params
  const user = await User.findById(req.user)
  const username = user.username

  const thisFavoriteAlreadyExists = await Favorite.findOne({
    user: req.user._id,
    mal_id: animeId,
  })

  if (thisFavoriteAlreadyExists) {
    res.status(400)
    throw new Error(
      "You have this anime in your favorites, so you can't add it"
    )
  }
  const apiResponse = await axios.get(`${API_URL}/anime/${animeId}`)
  const { title, images } = apiResponse.data.data

  const response = await Favorite.create({
    user: req.user._id,
    mal_id: animeId,
    title: title,
    images: images,
  })

  res.status(200).json(response)
})

const removeFavoriteAnime = asyncHandler(async (req, res) => {
  const { animeId } = req.params
  const user = await User.findById(req.user)
  const username = user.username

  const thisFavoriteAlreadyExists = await Favorite.findOne({
    user: req.user._id,
    mal_id: animeId,
  })

  if (!thisFavoriteAlreadyExists) {
    res.status(400)
    throw new Error(
      "You don't have this anime in your favorites, so you can't delete it"
    )
  }

  const response = await Favorite.deleteOne({
    user: req.user._id,
    mal_id: animeId,
  })

  res.status(200).json(response)
})

module.exports = {
  getFavoriteAnime,
  addFavoriteAnime,
  removeFavoriteAnime,
}
