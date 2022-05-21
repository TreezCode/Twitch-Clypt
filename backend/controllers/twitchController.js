const asyncHandler = require('express-async-handler')
const Twitch = require('../models/twitchModel')
const User = require('../models/userModel')
const { fetchTwitchByName } = require('../helpers/twitchHelpers')

// @desc    Get Twitch profile by name and increment views
// @route   POST /api/twitch
// @access  Public
const getTwitch = asyncHandler(async (req, res) => {
  let { name } = req.body
  if (!name) {
    res.status(400)
    throw Error('Please add a Twitch to the text field')
  }
  const response = await fetchTwitchByName(name, res).then((result) => result)
  if (!response) {
    res.status(400)
    throw Error('No Twitch profile found')
  }
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
    res.status(500)
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
  // check if Twitch profile exists in our database
  let twitchId = req.params.id
  const twitchExists = loggedIn.twitches.find(
    (twitch) => twitch._id.toString() === twitchId
  )
  if (twitchExists) {
    res.status(400)
    throw new Error(`Twitch profile has already been saved`)
  }
  try {
    const twitch = await Twitch.findOne({ _id: twitchId })
    if (!twitch) throw new Error('Unable to find Twitch profile in database')
    // add twitch reference to user
    const updatedUser = await User.findByIdAndUpdate(
      loggedIn._id,
      {
        $addToSet: {
          twitches: {
            _id: twitch._id,
            name: twitch.display_name,
            image_url: twitch.profile_image_url,
          },
        },
      },
      { new: true }
    ).select('-password')
    console.log(
      `${loggedIn.name} saved ${twitch.display_name}'s Twitch profile`.yellow
    )
    return res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500)
    throw new Error(error)
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
  try {
    // check if Twitch profile exists
    let twitchId = req.params.id
    const twitchExists = loggedIn.twitches.find(
      (twitch) => twitch.id === twitchId
    )
    if (!twitchExists) {
      res.status(400)
      throw new Error(`Twitch profile has already been removed`)
    }
    // remove twitch reference from user
    const updatedUser = await User.findByIdAndUpdate(
      loggedIn._id,
      { $pull: { twitches: { _id: twitchId } } },
      { new: true }
    ).select('-password')
    console.log(
      `${loggedIn.name} removed ${twitchExists.name}'s Twitch profile`.yellow
    )
    return res.status(200).json({ user: updatedUser })
  } catch (error) {
    res.status(500)
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
  try {
    let profileIds = loggedIn.twitches
    const profiles = await Twitch.find({ _id: { $in: profileIds } })
    res.status(200).json({ saved: profiles })
  } catch (error) {
    res.status(500)
    throw new Error(error.message)
  }
})

module.exports = {
  getTwitch,
  saveTwitch,
  unsaveTwitch,
  getSavedTwitch,
}
