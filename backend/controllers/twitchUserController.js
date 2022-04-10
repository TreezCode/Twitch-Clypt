const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')

// @desc    Get Twitch user by name and return id
// @route   GET /api/twitch
// @access  Private
const findByLogin = asyncHandler(async (req, res) => {
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { login: req.body.login },
    }
    const response = await axios.get(process.env.GET_USERS, options)
    if (response.status == 200) {
      res.status(200)
      return response.data.data[0].id
    }
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load Twitch user by login')
  }
})

// @desc    Get Twitch user by id and return name
// @route   GET /api/twitch/id
// @access  Private
const findById = asyncHandler(async (req, res) => {
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { id: req.body.id },
    }
    const response = await axios.get(process.env.GET_USERS, options)
    if (response.status == 200) {
      res.status(200)
      return res.json(response.data.data[0].login)
    }
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load Twitch user by id')
  }
})

module.exports = {
  findByLogin,
  findById,
}
