const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/authMiddleware')

// @desc    Get top games on Twitch
// @route   GET /api/topGames
// @access  Private
const getTopGames = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Get top games on Twitch' })
})

// Fetch OAuth token data
fetchToken().then((res) => console.log('Outside: ', res))

// const getGames = (url, accessToken, callback) => {
//   const gameOptions = {
//     url: process.env.GET_GAMES,
//     method: 'GET',
//     headers: {
//       'Client-Id': process.env.CLIENT_ID,
//       Authorization: `Bearer ${accessToken}`,
//     },
//   }

//   request.get(gameOptions, (err, res, body) => {
//     if (err) {
//       return console.log(err)
//     }
//     console.log(`Games Status: ${res.statusCode}`)
//     console.log(JSON.parse(body))
//   })
// }

module.exports = {
  getTopGames,
}
