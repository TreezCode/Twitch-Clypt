const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')

// @desc    Get top streams on Twitch
// @route   GET /api/streams
// @access  Private
const getTopStreams = asyncHandler(async () => {
  try {
    const accessToken = await fetchToken().then((res) => res.access_token)
    const options = {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    }
    const res = await axios.get(process.env.GET_STREAMS, { headers: options })
    if (res.status == 200) {
      console.log(`Top streams on Twitch right now!`.blue)
      console.log(res.data)
      return res.data
    }
  } catch (error) {
    console.log(error)
  }
})

// @desc    Get stream by id on Twitch
// @route   GET /api/streams
// @access  Private
const getStream = asyncHandler(async () => {

})

module.exports = {
  getTopStreams,
  getStream,
}
