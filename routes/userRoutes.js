const express = require("express")
const router = express.Router()
const multer = require("multer")

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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
  changeProfilePicture,
  getProfilePicture,
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
router.post(
  "/profilepicture",
  protect,
  upload.single("file"),
  changeProfilePicture
)
router.get("/profilepicture/:username", getProfilePicture)

module.exports = router
