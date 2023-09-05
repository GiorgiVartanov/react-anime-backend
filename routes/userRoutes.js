const express = require("express")
const router = express.Router()

const {
  searchForUser,
  getUser,
  getAllUsers,
  getUserFriends,
  addFriend,
  removeFriend,
  deleteUser,
  promoteUser,
  demoteUser,
} = require("../controllers/userController")

const { protect } = require("../middleware/authMiddleware")

router.get("/search", searchForUser)
router.get("/all", protect, getAllUsers)
router.get("/:username", getUser)
router.get("/:username/friends", getUserFriends)
router.post("/add", protect, addFriend)
router.post("/remove", protect, removeFriend)
router.delete("/delete/:id", protect, deleteUser)
router.patch("/promote/:id", protect, promoteUser)
router.patch("/demote/:id", protect, demoteUser)

module.exports = router
