const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken } = require('../middleware/twitchMiddleware')
const Game = require('../models/gameModel')

// @desc    Get top games on Twitch
// @route   GET /api/games
// @access  Private
const fetchTopGames = asyncHandler(async (req, res) => {
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

// @desc    Get specific game on Twitch by name & return id
// @route   GET /api/games/:name
// @access  Private
const fetchGameByName = asyncHandler(async (req, res) => {
  try {
    const request = req.body.text
    if (!request) {
      res.status(400)
      throw new Error('Please add a game name')
    }
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { name: request },
    }
    const response = await axios.get(process.env.GET_GAMES, options)
    return response.data.data[0].id
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load game by name')
  }
})

// @desc    Get specific game on Twitch by id & return name
// @route   GET /api/games/:id
// @access  Private
const fetchGameById = asyncHandler(async (req, res) => {
  try {
    const request = req.body.text
    if (!request) {
      res.status(400)
      throw new Error('Please add a game id')
    }
    const accessToken = await fetchToken().then((result) => result.access_token)
    const options = {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      params: { id: request },
    }
    const response = await axios.get(process.env.GET_GAMES, options)
    return res.json(response.data.data)
  } catch (error) {
    res.status(400)
    throw new Error('Failed to load game by id')
  }
})

module.exports = {
  fetchTopGames,
  fetchGameByName,
  fetchGameById,
}
