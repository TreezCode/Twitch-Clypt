const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')

// @desc    Get top games on Twitch
// @route   GET /api/topGames
// @access  Private
const getTopGames = asyncHandler(async () => {
  try {
    const accessToken = await fetchToken().then((res) => res.access_token)
    const options = {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    }
    const res = await axios.get(process.env.GET_GAMES, { headers: options })
    if (res.status == 200) {
      console.log(`Top games on Twitch right now!`.blue)
      console.log(res.data)
      return res.data
    }
  } catch (error) {
    console.log(error)
  }
})


module.exports = {
  getTopGames,
}
