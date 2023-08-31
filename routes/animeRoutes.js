const express = require("express")
const router = express.Router()

const {
  getGenres,
  getRandomAnimeId,
} = require("../controllers/animeController")

const { protect } = require("../middleware/authMiddleware")

router.get("/genres", getGenres)
router.get("/random", getRandomAnimeId)

module.exports = router
