const express = require("express")
const router = express.Router()

const {
  postCommentForAnime,
  getCommentsForAnime,
  deleteCommentForAnime,
  getCommentsForAnimeForLoggedInUser,
  vote,
} = require("../controllers/commentController")

const { protect } = require("../middleware/authMiddleware")

router.get("/:animeId", getCommentsForAnime)
router.get("/:animeId/logged", protect, getCommentsForAnimeForLoggedInUser)
router.post("/", protect, postCommentForAnime)
router.delete("/delete/:id", protect, deleteCommentForAnime)
router.post("/vote", protect, vote)

module.exports = router
