const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const { fetchToken, fetchGameByName, validateUser } = require('../helpers/twitchHelpers')
const Game = require('../models/gameModel')
const User = require('../models/userModel')

// @desc    Get top games on Twitch
// @route   GET /api/games/top
// @access  Public
const getTopGames = asyncHandler(async (req, res) => {
  try {
    const accessToken = await fetchToken().then((result) => result.access_token)
    let options = {
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

// @desc    Get game by name and increment views
// @route   POST /api/games
// @access  Public
const getGame = asyncHandler(async(req, res) => {
  let { name } = req.body
  if (!name) {
    res.status(400)
    throw new Error('Please add a game to the text field')
  }
  const response = await fetchGameByName(name, res).then((result) => result)
  try {
    // increment views in database
    const game = await Game.findOne({ id: response.id })
    const updatedGame = await Game.findByIdAndUpdate(
      game._id,
      { views: ++game.views },
      { new: true }
    )
    return res.status(200).json(updatedGame)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Save game to logged in user
// @route   PUT /api/game/:id
// @access  Private
const saveGame = asyncHandler(async(req, res) => {
  let loggedIn = req.user
  if (!loggedIn) {
    res.status(401)
    throw new Error('User not logged in')
  }
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  try {
    const gameId = req.params.id
    const gameExists = loggedIn.games.find((game) => game.id === gameId)
    if (gameExists) {
      res.status(400)
      throw new Error(`Game has already been saved`)
    }
    const game = await Game.findOne({ _id: gameId })
    if (!game) throw new Error('Unable to find game in database')
    // add game reference to user
    const updatedUser = await User.findByIdAndUpdate(
      loggedIn._id,
      { $addToSet: { games: { _id: game._id, name: game.name } }, },
      { new: true }
    )
    console.log(`${loggedIn.name} saved ${game.name}`.yellow)
    return res.status(200).json({ user: updatedUser, game: game })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

// @desc    Remove Twitch profile from logged in user
// @route   PUT /api/twitch/saved/:id
// @access  Private
const unsaveGame = asyncHandler(async (req, res) => {
  let loggedIn = req.user
  if (!loggedIn) {
    res.status(401)
    throw new Error('User not logged in')
  }
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  // check if profile exists
  let gameId = req.params.id
  const gameExists = loggedIn.games.find((game) => game.id === gameId)
  if (!gameExists) {
    res.status(400)
    throw new Error(`Game has already been removed`)
  }
  try {
    // remove game reference from user
    const updatedUser = await User.findByIdAndUpdate(
      loggedIn._id,
      { $pull: { games: { _id: gameId } } },
      { new: true }
    )
    console.log(`${loggedIn.name} removed ${gameExists.name}`.yellow)
    return res.status(200).json({ user: updatedUser })
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc    Get all saved games from logged in user
// @route   GET /api/games/saved
// @access  Private
const getSavedGames = asyncHandler(async (req, res) => {
  let loggedIn = req.user
  if (!loggedIn) {
    res.status(400)
    throw new Error('User not logged in')
  }
  // find user and authorize
  const user = await User.findById(loggedIn._id)
  validateUser(loggedIn, user, res)
  try {
    let gameIds = user.games
    const games = await Game.find({ _id : { $in : gameIds } })
    res.status(200).json({ games: games })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

module.exports = {
  getTopGames,
  getGame,
  saveGame,
  unsaveGame,
  getSavedGames,
}
