const url = require("url")
const asyncHandler = require("express-async-handler")

const calculateTime = require("../utils/calculateTime")

const Comment = require("../models/commentModel.js")
const User = require("../models/userModel.js")
const Vote = require("../models/voteModel.js")

const getCommentsForAnime = asyncHandler(async (req, res) => {
  const { animeId } = req.params

  const comments = await Comment.find({ animeId: animeId })

  comments.sort((a, b) => Number(b.createdAt) - Number(a.createdAt)) // sorts array, first element will be the one that was posted last

  const usernames = await Promise.all(
    comments.map(async (comment) => await User.findById(comment.user))
  )

  const data = comments.map((comment, index) => ({
    id: comment._id,
    author: usernames[index].username,
    text: comment.text,
    liked: comment.liked,
    disliked: comment.disliked,
    posted: calculateTime(comment.createdAt),
    wasUpdated: Number(comment.createdAt) !== Number(comment.updatedAt),
  }))

  res.status(200).json({ data })
})

const postCommentForAnime = asyncHandler(async (req, res) => {
  const { text, animeId } = req.body

  const comment = await Comment.create({
    user: req.user._id,
    animeId: animeId,
    text: text,
    liked: 0,
    disliked: 0,
  })
  const user = await User.findById(comment.user)
  const username = user.username

  const data = {
    id: comment._id,
    author: username,
    text: comment.text,
    liked: comment.liked,
    disliked: comment.disliked,
    posted: "now",
    wasUpdated: Number(comment.createdAt) !== Number(comment.updatedAt),
  }

  res.status(200).json(data)
})

const deleteCommentForAnime = asyncHandler(async (req, res) => {
  const user = req.user
  const { id } = req.params

  const currentUser = await User.findOne({ _id: user })

  if (currentUser.accountType !== "Admin") {
    res.status(400)
    throw new Error("This can only be done by users with the status Admin")
  }

  const comment = await Comment.findOne({ _id: id })

  if (!comment) {
    res.status(400)
    throw new Error(`comment with if ${id} does not exits`)
  }

  Comment.deleteOne({ _id: id })
    .then(() => {
      console.log("Comment deleted")
    })
    .catch((error) => {
      res.status(400)
      throw new Error(error)
    })

  res.status(200).json({
    message: `comment with id ${id} successfully deleted`,
  })
})

const getCommentsForAnimeForLoggedInUser = asyncHandler(async (req, res) => {
  const { animeId } = req.params
  const user = req.user
  const { isLoggedIn } = req.query

  if (!user) {
    return
  }

  const userVotes = await Vote.find({ user: user._id })

  const comments = await Comment.find({ animeId: animeId })

  // sorts array, first element will be the one that was posted last
  comments.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))

  // gets username of each comment author
  const usernames = await Promise.all(
    comments.map(async (comment) => {
      const user = await User.findById(comment.user)
      return user.username
    })
  )

  // checks if the user has liked/disliked the post
  const userHasVoted = comments.map((comment) => {
    const userVote = userVotes.find((userVote) =>
      userVote.comment.equals(comment._id)
    )

    if (userVote) return userVote.voteType

    return null
  })

  const data = comments.map((comment, index) => ({
    id: comment._id,
    hasLiked: userHasVoted[index],
    author: usernames[index],
    text: comment.text,
    liked: comment.liked,
    disliked: comment.disliked,
    posted: calculateTime(comment.createdAt),
    wasUpdated: Number(comment.createdAt) !== Number(comment.updatedAt),
  }))

  res.status(200).json({ data })
})

const vote = asyncHandler(async (req, res) => {
  const { id, voteType } = req.body

  const comment = await Comment.findById(id)

  // this variable is used to determine if the user has already voted on a comment they voted now
  const exists = await Vote.findOne({ comment: comment, user: req.user })

  if (voteType === "upvote") upvote()
  else if (voteType === "downvote") downvote()

  // increases amount of upvotes on a comment
  // if the current user has already upvoted this comment if will remove it instead
  async function upvote() {
    if (exists) {
      const voteToDelete = await Vote.findOne({
        comment: comment,
        user: req.user,
      }).exec()

      Vote.deleteOne({
        comment: comment,
        user: req.user,
      }).exec()

      if (exists.voteType === "downvote") {
        Vote.create({
          comment: comment,
          user: req.user,
          voteType: "upvote",
        })

        Comment.updateOne(
          { _id: id },
          { $set: { liked: comment.disliked + 1 } }
        ).exec()
      }

      eraseVoteFromComment(voteToDelete)
    } else {
      Vote.create({
        comment: comment,
        user: req.user,
        voteType: "upvote",
      })

      Comment.updateOne(
        { _id: id },
        { $set: { liked: comment.liked + 1 } }
      ).exec()
    }
  }

  // increases amount of downvotes on a comment
  // if the current user has already downvoted this comment if will remove it instead
  async function downvote() {
    if (exists) {
      const voteToDelete = await Vote.findOne({
        comment: comment,
        user: req.user,
      }).exec()

      Vote.deleteOne({
        comment: comment,
        user: req.user,
      }).exec()

      if (exists.voteType === "upvote") {
        Vote.create({
          comment: comment,
          user: req.user,
          voteType: "downvote",
        })

        Comment.updateOne(
          { _id: id },
          { $set: { liked: comment.liked + 1 } }
        ).exec()
      }

      eraseVoteFromComment(voteToDelete)
    } else {
      Vote.create({
        comment: comment,
        user: req.user,
        voteType: "downvote",
      })

      Comment.updateOne(
        { _id: id },
        { $set: { disliked: comment.disliked + 1 } }
      ).exec()
    }
  }

  // if voteToDelete is upvote decreases amount of upvotes
  // if voteToDelete is downvote decreases amount of upvotes
  // is called when user upvotes/downvotes comment second time
  function eraseVoteFromComment(voteToDelete) {
    if (voteToDelete?.voteType === "upvote") {
      // if deleted vote was an upvote
      Comment.updateOne(
        { _id: id },
        { $set: { liked: comment.liked - 1 } }
      ).exec()
    } else {
      // if deleted vote was a downvote
      Comment.updateOne(
        { _id: id },
        { $set: { liked: comment.disliked - 1 } }
      ).exec()
    }
  }

  res.status(200).json({ success: true })
})

module.exports = {
  getCommentsForAnime,
  postCommentForAnime,
  deleteCommentForAnime,
  getCommentsForAnimeForLoggedInUser,
  vote,
}
