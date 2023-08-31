const mongoose = require("mongoose")

const voteModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Comment",
  },
  voteType: {
    type: String,
    enum: ["upvote", "downvote"],
  },
})

module.exports = mongoose.model("Vote", voteModel)
