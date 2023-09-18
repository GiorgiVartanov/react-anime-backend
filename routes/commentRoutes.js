const express = require("express")
const router = express.Router()
const rateLimit = require("express-rate-limit")

const {
  postCommentForAnime,
  getCommentsForAnime,
  deleteCommentForAnime,
  getCommentsForAnimeForLoggedInUser,
  vote,
} = require("../controllers/commentController")

const { protect } = require("../middleware/authMiddleware")

const limiter = rateLimit({
  max: 10,
  windowMs: 1000 * 10,
  message: "stop",
})

router.get("/:animeId", getCommentsForAnime)
router.get("/:animeId/logged", protect, getCommentsForAnimeForLoggedInUser)
router.post("/", protect, postCommentForAnime)
router.delete("/delete/:id", protect, deleteCommentForAnime)
router.post("/vote", limiter, protect, vote)

module.exports = router
