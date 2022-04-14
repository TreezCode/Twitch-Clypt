const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')
const Twitch = require('../models/twitchModel')
const User = require('../models/userModel')

// @desc    Helper function fetches Twitch data by name
const fetchTwitchByName = asyncHandler(async (req, res) => {
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { login: req },
    }
    const response = await axios.get(process.env.GET_USERS, options)
    if (!response.data.data[0]) {
      res.status(400)
      throw new Error('Unable to find that Twitch profile')
    }
    return response.data.data[0]
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load Twitch profile')
  }
})

// @desc    Helper function fetches Twitch data by id
const fetchTwitchById = asyncHandler(async (req, res) => {
  try {
    const request = req.body.text
    if (!request) {
      res.status(400)
      throw new Error('Please add a Twitch user id')
    }
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { id: request },
    }
    const response = await axios.get(process.env.GET_USERS, options)
    return res.json(response.data.data[0])
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load Twitch user by id')
  }
})

// @desc    Get Twitch profile by name and store data in db
// @route   GET /api/twitch
// @access  Private
const getTwitch = asyncHandler(async (req, res) => {
  try {
    const { login } = req.body
    const response = await fetchTwitchByName(login, res).then(
      (result) => result
    )
    const twitchExists = await Twitch.findOne({ id: response.id })
    if (!twitchExists) {
      const twitch = await Twitch.insertMany({
        id: response.id,
        login: response.login,
        display_name: response.display_name,
        type: response.type,
        broadcaster_type: response.broadcaster_type,
        description: response.description,
        profile_image_url: response.profile_image_url,
        offline_image_url: response.offline_image_url,
        view_count: response.view_count,
        created_at: response.created_at,
        email: response.email,
      })
      console.log('Twitch profile added to database'.yellow)
      return res.status(200).json(twitch)
    }
    const updatedTwitch = await Twitch.findByIdAndUpdate(
      twitchExists._id,
      { views: ++twitchExists.views },
      { new: true }
    )
    return res.status(200).json(updatedTwitch)
  } catch (error) {
    throw new Error('Failed to get Twitch profile')
  }
})

// @desc    Save Twitch profile to user
// @route   PUT /api/twitch/:id
// @access  Private
const saveTwitch = asyncHandler(async (req, res) => {
  const userId = req.params.id
  const { login } = req.body
  try {
    const response = await fetchTwitchByName(login, res).then(
      (result) => result
    )
    // Check for Twitch in db
    const twitchExists = await Twitch.findOne({ id: response.id })
    // If exists update user data
    if (twitchExists) {
      const user = await User.findByIdAndUpdate(userId, {
        $addToSet: { twitches: twitchExists._id },
      })
      console.log(`Saved a Twitch profile`.yellow)
      return res.status(200).json(user)
    }
    // If doesnt exist add Twitch data then update user data
    if (!twitchExists) {
      const twitch = await Twitch.insertMany({
        id: response.id,
        login: response.login,
        display_name: response.display_name,
        type: response.type,
        broadcaster_type: response.broadcaster_type,
        description: response.description,
        profile_image_url: response.profile_image_url,
        offline_image_url: response.offline_image_url,
        view_count: response.view_count,
        created_at: response.created_at,
        email: response.email,
      })
      console.log('Added a Twitch profile to db'.yellow)
      const user = await User.findByIdAndUpdate(userId, {
        $addToSet: { twitches: twitch._id },
      })
      console.log('Saved a Twitch profile'.yellow)
      if (!req.user) {
        res.status(400)
        throw new Error('Must be a user to save Twitch profiles')
      }
      if (req.user._id ==! twitchExists._id.toString()) {
        res.status(401)
        throw new Error('User not authorized')
      }
      return res.status(200).json(user)
    }
  } catch (error) {
    throw error.name === 'MongoServerError' && error.code == 11000
      ? new Error(`Twitch profile already saved`)
      : new Error(error)
  }
})

module.exports = {
  fetchTwitchByName,
  fetchTwitchById,
  saveTwitch,
  getTwitch,
}
