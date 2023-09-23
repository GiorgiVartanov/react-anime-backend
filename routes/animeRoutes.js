const express = require("express")
const router = express.Router()

const {
  getGenres,
  getRandomAnimeId,
  getAnimeCoverImage,
} = require("../controllers/animeController")

const { protect } = require("../middleware/authMiddleware")

router.get("/genres", getGenres)
router.get("/random", getRandomAnimeId)
router.get("/cover/:mal_id", getAnimeCoverImage)

module.exports = router
