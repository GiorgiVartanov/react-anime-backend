const mongoose = require("mongoose")

const commentModel = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    animeId: String,
    text: { type: String, required: true },
    liked: { type: Number, required: true },
    disliked: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Comment", commentModel)
