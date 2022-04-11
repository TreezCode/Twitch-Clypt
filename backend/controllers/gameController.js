const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')

// @desc    Get top games on Twitch
// @route   GET /api/games
// @access  Private
const getTopGames = asyncHandler(async (req, res) => {
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    }
    const response = await axios.get(process.env.GET_TOPGAMES, {
      headers: options,
    })
    return res.json(response.data.data)
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load top games')
  }
})

// @desc    Get specific game on Twitch by name
// @route   GET /api/games/name
// @access  Private
const getGameByName = asyncHandler(async (req, res) => {
  try {
    if (!req.body.text) return res.json('Please add a game name')
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { name: req.body.text },
    }
    const response = await axios.get(process.env.GET_GAMES, options)
    return res.json(response.data.data)
  } catch (error) {
    console.log(error)
    res.status(400)
    throw new Error('Failed to load game by name')
  }
})

// @desc    Get specific game on Twitch by id
// @route   GET /api/games/id
// @access  Private
const getGameById = asyncHandler(async (req, res) => {
  try {
    if (!req.body.text) return res.json('Please add a game id')
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { id: req.body.text },
    }
    const response = await axios.get(process.env.GET_GAMES, options)
    return res.json(response.data.data)
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load game by id')
  }
})

module.exports = {
  getTopGames,
  getGameByName,
  getGameById,
}
