const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')
const Twitch = require('../models/twitchModel')

// @desc    Get Twitch user by name and return id
// @route   GET /api/twitch
// @access  Private
const fetchTwitchByName = asyncHandler(async (req, res) => {
  try {
    const request = req.body.text
    if (!request) return res.json('Please add a Twitch username')
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { login: request },
    }
    const response = await axios.get(process.env.GET_USERS, options)
    return response.data.data[0]
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load Twitch user by name')
  }
})

// @desc    Get Twitch user by id and return name
// @route   GET /api/twitch/id
// @access  Private
const fetchTwitchById = asyncHandler(async (req, res) => {
  try {
    const request = req.body.text
    if (!request) return res.json('Please add a Twitch user id')
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { id: request },
    }
    const response = await axios.get(process.env.GET_USERS, options)
    return res.json(response.data.data[0].login)
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load Twitch user by id')
  }
})

// @desc    Get Twitch user by id and return name
// @route   POST /api/twitch
// @access  Private
const saveTwitch = asyncHandler(async (req, res) => {
  try {
    const request = await fetchTwitchByName(req, res).then((result) => result)
    console.log(request)
    if (!request.id) {
      res.status(400)
      throw new Error("There's no Twitch user here...")
    }
    const twitch = await Twitch.create({
      id: request.id,
      login: request.login,
      display_name: request.display_name,
      type: request.type,
      broadcaster_type: request.broadcaster_type,
      description: request.description,
      profile_image_url: request.profile_image_url,
      offline_image_url: request.offline_image_url,
      view_count: request.view_count,
      created_at: request.created_at,
      email: request.email,
    })
    res.status(200).json(twitch)
  } catch (error) {
    throw error.name === 'MongoServerError' && error.code == 11000
      ? new Error(`Twitch user already saved`)
      : new Error(`Error occured while saving Twitch user. Code: ${error.code}'`)
  }
})

module.exports = {
  fetchTwitchByName,
  fetchTwitchById,
  saveTwitch,
}
