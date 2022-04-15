const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')
const { fetchTwitchByName } = require('../controllers/twitchController')
const { fetchGameByName } = require('../controllers/gameController')
const Clip = require('../models/clipModel')

// @desc    Get clips from Twitch by user
// @route   GET /api/clips
// @access  Private
const fetchUserClips = asyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name) throw new Error('Add a Twitch name to search for clips')
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    const params = await fetchTwitchByName(name, res).then(
      (result) => result
    )
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { broadcaster_id: params.id },
    }
    const response = await axios.get(process.env.GET_CLIPS, options)
    if (!response.data.data[0])
      throw new Error('Unable to find that Twitch profile')
    return res.status(200).json(response.data.data)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Get clips from Twitch by game
// @route   GET /api/clips/game
// @access  Private
const fetchGameClips = asyncHandler(async (req, res) => {
  try {
    const request = req.body.text
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
// @route   POST /api/clips
// @access  Private
const saveClip = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a clip')
  }
  res.status(200).json({ message: 'Saved clip' })
})

// @desc    Update clip
// @route   PUT /api/clips/:id
// @access  Private
const updateClip = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Update clip ${req.params.id}` })
})

// @desc    Delete clip
// @route   DELETE /api/clips/:id
// @access  Private
const deleteClip = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `Delete clip ${req.params.id}` })
})

module.exports = {
  fetchUserClips,
  fetchGameClips,
  saveClip,
  updateClip,
  deleteClip,
}
