const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')

// @desc    Get top games on Twitch
// @route   GET /api/topGames
// @access  Private
const getTopGames = asyncHandler(async (req, res) => {
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    }
    const response = await axios.get(process.env.GET_GAMES, { headers: options })
    if (response.status == 200) {
      console.log(`Top games on Twitch right now!`.blue)
      console.log(response.data)
      return res.json(response.data)
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = {
  getTopGames,
}
