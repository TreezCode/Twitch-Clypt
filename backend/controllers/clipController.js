const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchTwitchByName, fetchToken } = require('../helpers/twitchHelpers')
const { fetchGameByName } = require('../controllers/gameController')
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
  // request clip data from Twitch API
  const response = await axios.get(process.env.GET_CLIPS, options)
  const clipData = response.data.data
  if (!clipData[0]) {
    res.status(400)
    throw new Error('No clips found for that Twitch profile')
  }
  try {
    // check for Twitch clip data in db
    const clipExists = await Clip.findOne({ id: clipData[0].id })
    if (clipExists) return res.status(200).json(clipData)
    // if clip data doesnt exist add it
    const clips = await Clip.insertMany(clipData)
    console.log(`Successfully added ${clips[0].broadcaster_name}'s Twitch clips to the database`.yellow);
    return res.status(200).json(clips)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Get clips from Twitch by game
// @route   POST /api/clips/game
// @access  Private
const getGameClips = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const request = req.body.name
    if (!request) return res.json('Please add a game to search for clips')
    const accessToken = await fetchToken().then((result) => result.access_token)
    const parseGame = await fetchGameByName(req, res).then((result) => result)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { game_id: parseGame },
    }
    const response = await axios.get(process.env.GET_CLIPS, options)
    return res.json(response.data.data)
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load clips by game name')
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
