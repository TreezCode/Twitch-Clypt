const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')
const Twitch = require('../models/twitchModel')
const User = require('../models/userModel')

// @desc    Helper function fetches Twitch profile by name and adds data to db
const fetchTwitchByName = asyncHandler(async (name, res) => {
  const accessToken = await fetchToken().then((result) => result.access_token)
  const options = {
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    params: { login: name },
  }
  // Request data from Twitch API
  const response = await axios.get(process.env.GET_USERS, options)
  const profile = response.data.data[0]
  if (!profile) {
    res.status(400)
    throw new Error('Unable to find that Twitch profile')
  }
  try {
    // Check for Twitch profile in db
    const twitchExists = await Twitch.findOne({ id: profile.id })
    // If profile doesnt exist add it
    if (!twitchExists) {
      const twitch = await Twitch.insertMany({
        id: profile.id,
        login: profile.login,
        display_name: profile.display_name,
        type: profile.type,
        broadcaster_type: profile.broadcaster_type,
        description: profile.description,
        profile_image_url: profile.profile_image_url,
        offline_image_url: profile.offline_image_url,
        view_count: profile.view_count,
        created_at: profile.created_at,
        email: profile.email,
      })
      console.log(
        `Successfully added ${twitch[0].display_name}'s Twitch profile to the database`
          .yellow
      )
      return twitch[0]
    }
    return twitchExists
  } catch (error) {
    throw new Error(error)
  }
})

// @desc    Get Twitch profile by name and update views
// @route   GET /api/twitch
// @access  Private
const getTwitch = asyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name) {
    res.status(400)
    throw new Error('Please add a Twitch name to the text field')
  }
  const response = await fetchTwitchByName(name, res).then(
    (result) => result
  )
  try {
    const twitch = await Twitch.findOne({ id: response.id })
    const updatedTwitch = await Twitch.findByIdAndUpdate(
      twitch._id,
      { views: ++twitch.views },
      { new: true }
    )
    return res.status(200).json(updatedTwitch)
  } catch (error) {
    throw new Error(error.message)
  }
})

// @desc    Save Twitch profile reference to user
// @route   PUT /api/twitch/:id
// @access  Private
const saveTwitch = asyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name) {
    res.status(400)
    throw new Error('Please add a Twitch name to save')
  }
  const loggedIn = req.user
  if (!loggedIn) {
    res.status(400)
    throw new Error('Must be logged in to save Twitch profiles')
  }
  const userId = req.params.id
  const response = await fetchTwitchByName(name, res).then((result) => result)
  // Find Twitch in db
  const twitch = await Twitch.findOne({ id: response.id })
  const user = await User.findById(userId)
  // Validate user
  if (loggedIn._id.toString() !== user._id.toString()) {
    res.status(401)
    throw new Error('User not authorized')
  }
  // Add Twitch object id reference to user in db
  const updatedUser = await User.findByIdAndUpdate(userId, {
    $addToSet: { twitches: twitch._id },
  })
  console.log(
    `${loggedIn.name} saved ${twitch.display_name}'s Twitch profile`.yellow
  )
  return res.status(200).json({ user: updatedUser, twitch: twitch })
})

module.exports = {
  fetchTwitchByName,
  saveTwitch,
  getTwitch,
}
