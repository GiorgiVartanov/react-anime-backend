const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(400)
    throw new Error("Please add all fields")
  }

  // Check if user exists
  const userExistsByEmail = await User.findOne({ email })
  const userExistsByUsername = await User.findOne({ username })

  if (userExistsByEmail) {
    res.status(400)
    throw new Error("User with this email already exists")
  }

  if (userExistsByUsername) {
    res.status(400)
    throw new Error("User with this username already exists")
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
    accountType: "User",
  })

  if (user) {
    res.status(201).json({
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
      },
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error("Please add all fields")
  }

  // if user tried to log in with email
  if (email.includes("@")) {
    // Check for user email
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        user: {
          _id: user.id,
          username: user.username,
          email: user.email,
          accountType: user.accountType,
        },
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error("Invalid credentials")
    }
    // if user tried to log in with username
  } else {
    // Check for user email
    const user = await User.findOne({ username: email })

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        user: {
          _id: user.id,
          username: user.username,
          email: user.email,
          accountType: user.accountType,
        },
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error("Invalid credentials")
    }
  }
})

const changeCredentials = asyncHandler(async (req, res) => {
  const { password, newPassword, newEmail, newUsername } = req.body

  const user = req.user
  const currentUser = await User.findOne({ _id: user.id })

  if (!password) {
    res.status(400)
    throw new Error("Please add all password")
  }

  if (!user || !(await bcrypt.compare(password, currentUser.password))) {
    res.status(400)
    throw new Error("Invalid credentials")
  }

  if (newPassword) {
    // encrypts password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // saves encrypted password to the database
    const updatedUser = await User.updateOne(
      { _id: currentUser._id },
      { password: hashedPassword }
    )

    if (updatedUser.acknowledged !== true) {
      res.status(400)
      throw new Error("Something went wrong")
    }
  }

  if (newEmail) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const emailIsAlreadyTaken = await User.findOne({ email: newEmail })

    if (emailIsAlreadyTaken) {
      res.status(400)
      throw new Error("This Email is already taken")
    }

    if (!emailRegex.test(newEmail)) {
      res.status(400)
      throw new Error("This Email is now valid")
    }

    const updatedUser = await User.updateOne(
      { _id: currentUser._id },
      { email: newEmail }
    )

    if (updatedUser.acknowledged !== true) {
      res.status(400)
      throw new Error("Something went wrong")
    }
  }

  if (newUsername) {
    const usernameIsAlreadyTaken = await User.findOne({ username: newUsername })

    if (usernameIsAlreadyTaken) {
      res.status(400)
      throw new Error("This Username is already taken")
    }

    if (newUsername.length < 4) {
      res.status(400)
      throw new Error("This Username is too short")
    }

    if (newUsername.length > 20) {
      res.status(400)
      throw new Error("This Email is now valid")
    }

    const updatedUser = await User.updateOne(
      { _id: currentUser._id },
      { username: newUsername }
    )

    if (updatedUser.acknowledged !== true) {
      res.status(400)
      throw new Error("Something went wrong")
    }
  }

  const updatedUser = await User.find({ _id: user.id })

  res.status(200).json({
    user: {
      _id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      accountType: updatedUser.accountType,
    },
  })
})

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" }) // it will expire in 1 day (24hours)
}

module.exports = {
  registerUser,
  loginUser,
  changeCredentials,
  getCurrentUser,
}
