const mongoose = require("mongoose")

const favoriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    mal_id: String,
    title: String,
    images: {
      jpg: {
        image_url: String,
        small_image_url: String,
        large_image_url: String,
      },
      webp: {
        image_url: String,
        small_image_url: String,
        large_image_url: String,
      },
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Favorite", favoriteSchema)
