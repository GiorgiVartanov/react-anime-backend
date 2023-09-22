const mongoose = require("mongoose")

const quoteSchema = mongoose.Schema({
  text: String,
  author: String,
  mal_id: Number,
})

module.exports = mongoose.model("Quote", quoteSchema)
