const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')
const { findByLogin } = require('../controllers/twitchUserController')
const Clip = require('../models/clipModel')

// @desc    Get clips from Twitch user by name
// @route   GET /api/clips
// @access  Private
const getClips = asyncHandler(async (req, res) => {
  try {
    if (!req.body.text) return res.json('Please add a game or user to search')
    const accessToken = await fetchToken().then((result) => result.access_token)
    const parseName = await findByLogin(req, res).then((result) => result)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { broadcaster_id: parseName },
    }
    const response = await axios.get(process.env.GET_CLIPS, options)
    return res.json(response.data.data)
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load clips')
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
  getClips,
  saveClip,
  updateClip,
  deleteClip,
}
