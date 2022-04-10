const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')

// @desc    Get top streams on Twitch
// @route   GET /api/streams
// @access  Private
const getTopStreams = asyncHandler(async (req, res) => {
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    }
    const response = await axios.get(process.env.GET_STREAMS, {
      headers: options,
    })
    if (response.status == 200) {
      console.log(`Top streams on Twitch right now!`.yellow)
      console.log(response.data.data)
      res.status(200)
      return res.json(response.data.data)
    }
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load top streams')
  }
})

// @desc    Get stream by id on Twitch
// @route   GET /api/streams
// @access  Private
const getStream = asyncHandler(async () => {})

module.exports = {
  getTopStreams,
  getStream,
}
