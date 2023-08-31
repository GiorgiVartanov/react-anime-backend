const express = require("express")
const router = express.Router()

const {
  getFavoriteAnime,
  addFavoriteAnime,
  removeFavoriteAnime,
} = require("../controllers/favoritesController")

const { protect } = require("../middleware/authMiddleware")

router.get("/:username", getFavoriteAnime)
router.post("/add/:animeId", protect, addFavoriteAnime)
router.delete("/remove/:animeId", protect, removeFavoriteAnime)

module.exports = router
