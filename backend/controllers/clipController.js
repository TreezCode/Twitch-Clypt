const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken, fetchTwitchByName, fetchGameByName } = require('../helpers/twitchHelpers')
const Clip = require('../models/clipModel')

// @desc    Get clips from Twitch by user
// @route   POST /api/clips
// @access  Private
const getTwitchClips = asyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name) {
    res.status(400)
    throw new Error('Add a Twitch name to search for clips')
  }
  try {
    // configure http request
    const accessToken = await fetchToken().then((result) => result.access_token)
    const params = await fetchTwitchByName(name, res).then((result) => result)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { broadcaster_id: params.id },
    }
    // request data from Twitch API
    const response = await axios.get(process.env.GET_CLIPS, options)
    const clipData = response.data.data
    if (!clipData[0]) {
      res.status(400)
      throw new Error('No clips found for that Twitch profile')
    }
    // if previous data DOES exist then update with new set 'ordered:false'
    try {
      await Clip.insertMany(clipData, { ordered: false })
      const numAdded = clipData.length
      console.log(`Successfully added ${numAdded} of ${clipData[0].broadcaster_name}'s Twitch clips to the database`.yellow)
    } catch (error) {
      if (!error.message.includes('E11000')) {
        res.status(400)
        throw new Error(error)
      }
      const numUpdated = error.result.result.nInserted
      console.log(`Successfully updated ${numUpdated} of ${clipData[0].broadcaster_name}'s Twitch clips in the database`.yellow)
    } finally {
      return res.status(201).json(clipData)
    }
  } catch (error) {
    res.json(400)
    throw new Error(error)
  }
})

// @desc    Get clips from Twitch by game
// @route   POST /api/clips/game
// @access  Private
const getGameClips = asyncHandler(async (req, res) => {
  const { game, name } = req.body
  if (!game) {
    return res.json('Please add a game to search for clips')
  }
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    const params = await fetchGameByName(game, res).then((result) => result)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { game_id: params.id },
    }
    const response = await axios.get(process.env.GET_CLIPS, options)
    const clipData = response.data.data
    if (!clipData[0]) {
      res.status(400)
      throw new Error('No clips found for that game')
    }
    // if previous data DOES exist then update with new set 'ordered:false'
    try {
      await Clip.insertMany(clipData, { ordered: false })
      const numAdded = clipData.length
      console.log(`Successfully added ${numAdded} of ${game}'s Twitch clips to the database`.yellow)
    } catch (error) {
      if (!error.message.includes('E11000')) {
        res.status(400)
        throw new Error(error)
      }
      const numUpdated = error.result.result.nInserted
      console.log(`Successfully updated ${numUpdated} of ${game}'s clips in the database`.yellow)
    } finally {
      return res.json(clipData)
    }
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Save clip
// @route   PUT /api/clips/:id
// @access  Private
const saveClip = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a clip')
  }
  res.status(200).json({ message: 'Saved clip' })
})

// @desc    Remove clip
// @route   PUT /api/clips/saved/:id
// @access  Private
const unsaveClip = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete clip ${req.params.id}` })
})

// @desc    Get all saved clips
// @route   GET /api/clips/saved
// @access  Private
const getSavedClips = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete clip ${req.params.id}` })
})

module.exports = {
  getSavedClips,
  getTwitchClips,
  getGameClips,
  saveClip,
  unsaveClip,
}
