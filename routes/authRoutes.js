const express = require("express")
const router = express.Router()

const {
  loginUser,
  registerUser,
  changeCredentials,
  getCurrentUser,
} = require("../controllers/authController")

const { protect } = require("../middleware/authMiddleware")

router.post("/login", loginUser)
router.post("/register", registerUser)
router.post("/reset", protect, changeCredentials)
// router.post("/", protect, getCurrentUser)

module.exports = router
