const url = require("url")
const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler")
const calculateTime = require("../utils/calculateTime")
const axios = require("axios")

const isValidId = require("../utils/isValidId")

const User = require("../models/userModel")
const Favorite = require("../models/favoriteModel")
const Comment = require("../models/commentModel")
const Friendship = require("../models/friendshipModel")
const Vote = require("../models/voteModel")

const searchForUser = asyncHandler(async (req, res) => {
  const { q } = req.query

  const users = await User.find({ username: { $regex: q, $options: "i" } })

  const usersToSend = users.map((user) => ({
    username: user.username,
  }))

  res.status(200).json({ data: usersToSend })
})

const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({ username: username })

  if (!user) {
    res.status(400)
    throw new Error("this user does not exist")
  }

  // converting mongoose document to a plain JavaScript object
  const userObj = user.toObject()

  // removing fields that won't be sent to the client
  delete userObj._id
  delete userObj.password
  delete userObj.email
  delete userObj.updatedAt

  userObj.createdAt = calculateTime(Number(new Date(userObj.createdAt)))

  const favorite = await Favorite.find({ user: user })

  // const favoritesObject = favorite.toObject()

  delete favorite._id
  delete favorite.user

  // const favoriteIds = favorite.map((favorite) => favorite.animeId)

  const favoriteAnime = favorite.map((item) => ({
    mal_id: item.mal_id,
    title: item.title,
    images: item.images,
  }))

  userObj.favoriteAnime = favoriteAnime

  const friends = await Friendship.find({
    $or: [
      { user1: user }, // checks if user is user1
      { user2: user }, // checks if user is user2
    ],
  })
    .populate("user1", "username")
    .populate("user2", "username")

  const friendNames = friends.map((friend) => {
    const user1 = friend.user1
    const user2 = friend.user2

    if (user1.username === username) return user2.username
    else return user1.username
  })

  userObj.friends = friendNames

  res.status(200).json({ data: userObj })
})

const getAllUsers = asyncHandler(async (req, res) => {
  const user = req.user

  if (user.accountType !== "Admin") {
    res.status(400)
    throw new Error(
      "This page can only be accessed by users with the status Admin"
    )
  }

  const users = await User.find()

  const usersData = users.map((user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
    accountType: user.accountType,
  }))

  res.status(200).json({ data: usersData })
})

const getUserFriends = asyncHandler(async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({ username: username })

  if (!user) {
    res.status(400)
    throw new Error("this user does not exist")
  }

  const friends = await Friendship.find({
    $or: [
      { user1: user }, // checks if user is user1
      { user2: user }, // checks if user is user2
    ],
  })
    .populate("user1", "username")
    .populate("user2", "username")

  const friendNames = friends.map((friend) => {
    const user1 = friend.user1
    const user2 = friend.user2

    if (user1.username === username) return user2.username
    else return user1.username
  })

  res.status(200).json({ data: friendNames })
})

const addFriend = asyncHandler(async (req, res) => {
  const { friendName } = req.body

  const user = req.user
  const friend = await User.findOne({ username: friendName })

  if (!friend) {
    res.status(400)
    throw new Error("this user does not exist")
  }

  if (user._id === friend._id) {
    res.status(400)
    throw new Error("you add yourself to your friend list")
  }

  const alreadyInFriendList = await Friendship.findOne({
    $or: [
      { user1: user, user2: friend },
      { user1: friend, user2: user },
    ],
  })

  if (alreadyInFriendList) {
    res.status(400)
    throw new Error("you are already friends")
  }

  const friendship = await Friendship.create({ user1: user, user2: friend })

  res.status(200).json({ data: friendship })
})

const removeFriend = asyncHandler(async (req, res) => {
  const { friendName } = req.body

  const user = req.user
  const friend = await User.findOne({ username: friendName })

  if (!friend) {
    res.status(400)
    throw new Error("this user does not exist")
  }

  const isInFriendList = await Friendship.findOne({
    $or: [
      { user1: user, user2: friend },
      { user1: friend, user2: user },
    ],
  })

  if (!isInFriendList) {
    res.status(400)
    throw new Error("they are not in your friend list")
  }

  const deletedFriendship = await Friendship.deleteOne({
    $or: [
      { user1: user, user2: friend },
      { user1: friend, user2: user },
    ],
  })

  res.status(200).json({ data: deletedFriendship })
})

const deleteUser = asyncHandler(async (req, res) => {
  const user = req.user
  const { id } = req.params // user can be deleted by either id or username

  const currentUser = await User.findOne({ _id: user._id })

  if (currentUser.accountType !== "Admin") {
    res.status(400)
    throw new Error(
      "This action can only be done by users with the status Admin"
    )
  }

  let userToDelete

  console.log(id)

  if (isValidId(id)) userToDelete = await User.findById(id)
  else userToDelete = await User.findOne({ username: id })

  if (userToDelete._id === user._id) {
    res.status(400)
    throw new Error("You can't delete yourself")
  }

  if (!userToDelete) {
    res.status(400)
    throw new Error("This user does not exist")
  }

  if (userToDelete.accountType === "Admin") {
    res.status(400)
    throw new Error("This user can not be deleted because they are admin")
  }

  Friendship.deleteMany({
    $or: [{ user1: userToDelete }, { user2: userToDelete }],
  })
    .then(() => {
      console.log("Friendship deleted")
    })
    .catch((error) => {
      throw new Error(error)
    })

  Vote.deleteMany({
    user: userToDelete,
  })
    .then(() => {
      console.log("Vote deleted")
    })
    .catch((error) => {
      throw new Error(error)
    })

  Comment.deleteMany({
    user: userToDelete,
  })
    .then(() => {
      console.log("Comment deleted")
    })
    .catch((error) => {
      throw new Error(error)
    })

  const response = await User.deleteOne({ _id: id })

  res.status(200).json({ response })
})

const promoteUser = asyncHandler(async (req, res) => {
  const user = req.user
  const { id } = req.params

  const currentUser = await User.findOne({ _id: user })

  if (currentUser.accountType !== "Admin" && currentUser._id !== id) {
    res.status(400)
    throw new Error(
      "This action can only be done by users with the status Admin"
    )
  }

  if (!isValidId(id)) {
    res.status(400)
    throw new Error("Passed Id is not valid")
  }

  const userToDelete = await User.findOne({ _id: id })

  if (!userToDelete) {
    res.status(400)
    throw new Error("This User does not exist")
  }

  if (userToDelete.accountType === "Admin") {
    res.status(400)
    throw new Error("This User is already an Admin")
  }

  const userPromotion = await User.updateOne(
    { _id: id },
    { accountType: "Admin" }
  )

  res.status(200).json(userPromotion)
})

const demoteUser = asyncHandler(async (req, res) => {
  const user = req.user
  const { id } = req.params

  const currentUser = await User.findOne({ _id: user })

  if (currentUser.accountType !== "Admin" && currentUser._id !== id) {
    res.status(400)
    throw new Error(
      "This action can only be done by users with the status Admin"
    )
  }

  if (!isValidId(id)) {
    res.status(400)
    throw new Error("Passed Id is not valid")
  }

  const userToDelete = await User.findOne({ _id: id })

  if (!userToDelete) {
    res.status(400)
    throw new Error("This User does not exist")
  }

  if (user.accountType === "User") {
    res.status(400)
    throw new Error("This User is already an User")
  }

  const userDemotion = await User.updateOne(
    { _id: id },
    { accountType: "User" }
  )

  res.status(200).json(userDemotion)
})

module.exports = {
  searchForUser,
  getUser,
  getAllUsers,
  getUserFriends,
  addFriend,
  removeFriend,
  deleteUser,
  promoteUser,
  demoteUser,
}
