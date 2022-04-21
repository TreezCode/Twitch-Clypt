const asyncHandler = require('express-async-handler')
const Twitch = require('../models/twitchModel')
const User = require('../models/userModel')
const { fetchTwitchByName, validateUser } = require('../helpers/twitchHelpers')

// @desc    Get Twitch profile by name and increment views
// @route   POST /api/twitch
// @access  Public
const getTwitch = asyncHandler(async (req, res) => {
  let { name } = req.body
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

// @desc    Save Twitch profile to logged in user
// @route   PUT /api/twitch/:id
// @access  Private
const saveTwitch = asyncHandler(async (req, res) => {
  let loggedIn = req.user
  if (!loggedIn) {
    res.status(401)
    throw new Error('User not logged in')
  }
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  try {
    const twitchId = req.params.id
    const twitchExists = loggedIn.twitches.find((twitch) => twitch.id === twitchId)
    if (twitchExists) {
      res.status(400)
      throw new Error(`Twitch profile has already been saved`)
    }
    const twitch = await Twitch.findOne({ _id: twitchId })
    if (!twitch) throw new Error('Unable to find Twitch profile in database')
    // add twitch reference to user
    const updatedUser = await User.findByIdAndUpdate(
      loggedIn._id,
      { $addToSet: { twitches: { _id: twitch._id, name: twitch.display_name } }, },
      { new: true }
    )
    console.log(`${loggedIn.name} saved ${twitch.display_name}'s Twitch profile`.yellow)
    return res.status(200).json({ user: updatedUser, twitch: twitch })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Remove Twitch profile from logged in user
// @route   PUT /api/twitch/saved/:id
// @access  Private
const unsaveTwitch = asyncHandler(async (req, res) => {
  let loggedIn = req.user
  if (!loggedIn) {
    res.status(401)
    throw new Error('User not logged in')
  }
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  // check if profile exists
  let twitchId = req.params.id
  const twitchExists = loggedIn.twitches.find((twitch) => twitch.id === twitchId)
  if (!twitchExists) {
    res.status(400)
    throw new Error(`Twitch profile has already been removed`)
  }
  try {
    // remove twitch reference from user
    const updatedUser = await User.findByIdAndUpdate(
      loggedIn._id,
      { $pull: { twitches: { _id: twitchId } } },
      { new: true }
    )
    console.log(`${loggedIn.name} removed ${twitchExists.name}'s Twitch profile`.yellow)
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
  let loggedIn = req.user
  if (!loggedIn) {
    res.status(400)
    throw new Error('User not logged in')
  }
  // find user and authorize
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  try {
    let profileIds = user.twitches
    const profiles = await Twitch.find({ _id : { $in : profileIds } })
    res.status(200).json({ profiles: profiles })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

module.exports = {
  getTwitch,
  saveTwitch,
  unsaveTwitch,
  getSavedTwitch,
}
