const asyncHandler = require('express-async-handler')
const Twitch = require('../models/twitchModel')
const User = require('../models/userModel')
const { fetchTwitchByName, validateUser } = require('../helpers/twitchHelpers')

// @desc    Get Twitch profile by name and update views
// @route   POST /api/twitch
// @access  Public
const getTwitch = asyncHandler(async (req, res) => {
  // validate input
  const { name } = req.body
  if (!name) {
    res.status(400)
    throw new Error('Please add a Twitch name to the text field')
  }
  const response = await fetchTwitchByName(name, res).then((result) => result)
  try {
    // increment views in database
    const twitch = await Twitch.findOne({ id: response.id })
    const updatedTwitch = await Twitch.findByIdAndUpdate(
      twitch._id,
      { views: ++twitch.views },
      { new: true }
    )
    return res.status(200).json(updatedTwitch)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Save Twitch profile reference to logged in user
// @route   PUT /api/twitch/:id
// @access  Private
const saveTwitch = asyncHandler(async (req, res) => {
  // validate user
  const loggedIn = req.user
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  try {
    // add twitch reference to user in database
    const twitchId = req.params.id
    const twitch = await Twitch.findOne({ _id: twitchId })
    const updatedUser = await User.findByIdAndUpdate(
      loggedIn._id,
      { $addToSet: { twitches: twitch._id } },
      { new: true }
    )
    console.log(
      `${loggedIn.name} saved ${twitch.display_name}'s Twitch profile`.yellow
    )
    return res.status(200).json({ user: updatedUser, twitch: twitch })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Delete Twitch profile reference from logged in user
// @route   DELETE /api/twitch/:id
// @access  Private
const deleteTwitch = asyncHandler(async (req, res) => {
  // validate user
  const loggedIn = req.user
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  try {
    // remove twitch reference from user in db
    const twitchId = req.params.id
    const updatedUser = await User.findByIdAndUpdate(
      loggedIn._id,
      { $pull: { twitches: twitchId } },
      { new: true }
    )
    console.log(`${loggedIn.name} deleted ${twitchId}'s Twitch profile`.yellow)
    return res.status(200).json({ user: updatedUser })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Get all saved Twitch profiles from logged in user
// @route   GET /api/twitch/saved
// @access  Private
const getSavedTwitch = asyncHandler(async (req, res) => {
  // validate user
  const loggedIn = req.user
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  try {
    const profileIds = user.twitches
    const profiles = await Twitch.find({ _id: { $in: profileIds } })
    res.status(200).json({ profiles: profiles })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

module.exports = {
  getTwitch,
  saveTwitch,
  getSavedTwitch,
  deleteTwitch,
}
