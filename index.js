const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const { errorHandler } = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")

require("dotenv").config()

const PORT = process.env.PORT | 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 1000,
  message: "Too many request from this IP",
})

app.use(limiter)

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/anime", require("./routes/animeRoutes"))
app.use("/api/user", require("./routes/userRoutes"))
app.use("/api/comments", require("./routes/commentRoutes"))
app.use("/api/favorite", require("./routes/favoriteRoutes"))
app.use("/api/quote", require("./routes/quoteRoutes"))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})
