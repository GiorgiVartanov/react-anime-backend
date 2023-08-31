const url = require("url")
const asyncHandler = require("express-async-handler")

const getGenres = asyncHandler(async (req, res) => {
  const data = [
    { mal_id: 1, name: "Action" },
    { mal_id: 2, name: "Adventure" },
    { mal_id: 46, name: "Award Winning" },
    { mal_id: 4, name: "Comedy" },
    { mal_id: 8, name: "Drama" },
    { mal_id: 10, name: "Fantasy" },
    { mal_id: 14, name: "Horror" },
    { mal_id: 7, name: "Mystery" },
    { mal_id: 22, name: "Romance" },
    { mal_id: 24, name: "Sci-Fi" },
    { mal_id: 36, name: "Slice of Life" },
    { mal_id: 30, name: "Sports" },
    { mal_id: 37, name: "Supernatural" },
    { mal_id: 41, name: "Suspense" },
    { mal_id: 54, name: "Combat Sports" },
    { mal_id: 39, name: "Detective" },
    { mal_id: 56, name: "Educational" },
    { mal_id: 59, name: "High Stakes Game" },
    { mal_id: 13, name: "Historical" },
    { mal_id: 62, name: "Isekai" },
    { mal_id: 66, name: "Mahou Shoujo" },
    { mal_id: 17, name: "Martial Arts" },
    { mal_id: 18, name: "Mecha" },
    { mal_id: 67, name: "Medical" },
    { mal_id: 38, name: "Military" },
    { mal_id: 19, name: "Music" },
    { mal_id: 6, name: "Mythology" },
    { mal_id: 68, name: "Organized Crime" },
    { mal_id: 20, name: "Parody" },
    { mal_id: 71, name: "Pets" },
    { mal_id: 40, name: "Psychological" },
    { mal_id: 3, name: "Racing" },
    { mal_id: 72, name: "Reincarnation" },
    { mal_id: 21, name: "Samurai" },
    { mal_id: 23, name: "School" },
    { mal_id: 29, name: "Space" },
    { mal_id: 11, name: "Strategy Game" },
    { mal_id: 31, name: "Super Power" },
    { mal_id: 76, name: "Survival" },
    { mal_id: 77, name: "Team Sports" },
    { mal_id: 78, name: "Time Travel" },
    { mal_id: 32, name: "Vampire" },
    { mal_id: 79, name: "Video Game" },
    { mal_id: 80, name: "Visual Arts" },
    { mal_id: 48, name: "Workplace" },
    { mal_id: 42, name: "Seinen" },
    { mal_id: 25, name: "Shoujo" },
    { mal_id: 27, name: "Shounen" },
  ]

  res.status(200).json({ data })
})

const getRandomAnimeId = asyncHandler(async (req, res) => {
  const animeIds = [
    1535, 5114, 31964, 38000, 20, 11061, 9253, 33486, 1735, 40748, 21, 1575,
    31240, 36456, 20507, 6547, 31043, 23755, 32182, 24833, 20583, 37779, 30831,
    269, 9919, 199, 30, 2904, 33352, 6702, 37450, 38691, 38408, 14719, 35849,
    3588, 34572, 9989, 2001, 28999, 29803, 35790, 28121, 10087, 32937, 37510,
    121, 40456, 34933, 30503, 2167, 30654, 28891, 6746, 5081, 37430, 12189,
    14741, 26243, 47778, 42897, 431, 38671, 9756, 13759, 7054, 164, 205, 33206,
    813, 35507, 11771, 37520, 20899, 4181, 356, 1689, 16592, 27775, 36098, 6045,
    20787, 849, 21995, 39617, 32, 39551, 38883, 35062, 2251, 40221, 32615,
    41353, 37675, 24439, 43608, 33674, 14345, 30484, 34566, 26055, 39587, 14227,
    22297, 20785, 523, 14513, 36474, 223, 30015, 40852, 35073, 37991, 22043,
    38826, 40839, 2025, 16782, 42203, 16894, 28701, 41025, 25013, 18115, 10408,
    30694, 4654, 227, 37347, 18507, 28907, 2236, 249, 40776, 28927, 13125,
    48561, 40496, 37086, 14467, 24415, 38040, 2034, 40454, 39534, 49918, 36407,
    37987, 263, 512, 5630, 6707, 2890, 6594, 1604, 39565, 2759, 51096, 31637,
    27631, 38656, 8425, 42923, 355, 39247, 50346, 34822, 28297, 30123, 578,
    51019, 22147, 14289, 14713, 790, 33489, 28497, 225, 36475, 7311, 6213,
    50172, 40834, 38659, 14075, 16870, 40540, 40938, 49596, 11577, 15315, 136,
    33506, 339, 40956, 39597, 36896, 18671, 43299, 31798, 31859, 40356, 34902,
    31765, 41457, 41389, 11759, 39701, 32951, 41487, 31722, 32998, 1482, 38329,
    392, 49926, 17074, 3784, 4382, 9260, 5681, 38790, 46095, 22729, 48316,
    32105, 51009, 11013, 25781, 48580, 36563, 47790, 45613, 35972, 71, 34561,
    48556, 45, 34881, 40417, 16011, 48895, 48661, 23673, 39196, 47194, 9656,
    28755, 8937, 1691, 48569, 31758, 42938, 24765, 32887, 25537, 50709, 21603,
    46352, 7785, 31757, 237, 10863, 3785, 10161, 232, 5530, 34451, 21855, 2593,
    35851, 37984, 22265, 41168, 33988, 6573, 24405, 41491, 37345, 21843, 323,
    39741, 12445, 22145, 7785, 31757, 237, 10863, 3785, 10161, 232, 5530, 34451,
    21855, 2593, 35851, 37984, 22265, 41168, 33988, 6573, 24405, 41491, 37345,
    21843, 323, 39741, 12445, 22145, 35247, 20031, 16049, 22135, 36946, 40571,
    48549, 6033, 35466, 43523, 38472, 21647, 20853, 44961, 33049, 530, 27833,
    8630, 28249, 11981, 572, 3470, 33926, 185, 154, 40908, 37475, 34626, 41456,
    3786, 46471, 12413, 228, 11785, 16762, 31173, 7647, 11285, 40530, 50273,
    32189, 585,
  ]

  const randomAnimeId = animeIds[Math.floor(Math.random() * animeIds.length)]

  res.status(200).json({ data: randomAnimeId })
})

module.exports = {
  getGenres,
  getRandomAnimeId,
}
