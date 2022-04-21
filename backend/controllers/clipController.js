const { default: axios } = require('axios')
const asyncHandler = require('express-async-handler')
const {
  fetchToken,
  fetchTwitchByName,
  fetchGameByName,
} = require('../helpers/twitchHelpers')
const Clip = require('../models/clipModel')

// @desc    Get clips from Twitch by profile name or game title
// @route   POST /api/clips
// @access  Private
const getClips = asyncHandler(async (req, res) => {
  // validate input
  let { name } = req.body
  if (!name) {
    res.status(400)
    throw new Error('Add a game or to search for clips')
  }
  try {
    // configure both http requests using Promise.all
    const accessToken = await fetchToken().then((result) => result.access_token)
    const twitchResponse = await fetchTwitchByName(name, res).then((result) => result)
    const gameResponse = await fetchGameByName(name, res).then((result) => result)
    await Promise.all([twitchResponse, gameResponse]).then((results) => results)
    // if no data found
    if (!twitchResponse && !gameResponse) {
      res.status(400)
      throw Error('No Twitch profile or game with that name found')
    }
    // if only twitch profile exists
    if (!gameResponse) {
      let twitchName = twitchResponse.display_name
      // configure http request
      let options = {
        headers: {
          'Client-Id': process.env.CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
        params: { broadcaster_id: twitchResponse.id },
      }
      // request data from Twitch API
      const response = await axios.get(process.env.GET_CLIPS, options)
      let clipData = response.data.data
      if (clipData.length > 0) {
        try {
          // update database with new set 'ordered:false'
          await Clip.insertMany(clipData, { ordered: false })
          let numAdded = clipData.length
          console.log(`Successfully added ${numAdded} of ${twitchName}'s clips to the database`.yellow)
        } catch (error) {
          if (!error.message.includes('E11000')) {
            res.status(400)
            throw new Error(error)
          }
          let numUpdated = error.result.result.nInserted
          console.log(`Successfully updated ${numUpdated} of ${twitchName}'s clips in the database`.yellow)
        } finally {
          return res.status(201).json({ profile: clipData })
        }
      }
      res.status(400)
      throw Error('No clips for that profile')
    }
    // if only game name exists
    if (!twitchResponse) {
      let gameName = gameResponse.name
      // configure http request
      let options = {
        headers: {
          'Client-Id': process.env.CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
        params: { game_id: gameResponse.id },
      }
      // request data from Twitch API
      const response = await axios.get(process.env.GET_CLIPS, options)
      let clipData = response.data.data
      if (clipData.length > 0) {
        try {
          // update database with new set 'ordered:false'
          await Clip.insertMany(clipData, { ordered: false })
          let numAdded = clipData.length
          console.log(`Successfully added ${numAdded} ${gameName} Twitch clips to the database`.yellow)
        } catch (error) {
          if (!error.message.includes('E11000')) {
            res.status(400)
            throw new Error(error)
          }
          let numUpdated = error.result.result.nInserted
          console.log(`Successfully updated ${numUpdated} ${gameName} Twitch clips in the database`.yellow)
        } finally {
          return res.status(201).json({ game: clipData })
        }
      }
      res.status(400)
      throw Error('No clips for that game')
    }
    // if both twitch profile and game exists
    if (twitchResponse && gameResponse) {
      let twitchName = twitchResponse.display_name
      let gameName = gameResponse.name
      // configure both http requests
      let twitchOptions = {
        headers: {
          'Client-Id': process.env.CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
        params: { broadcaster_id: twitchResponse.id },
      }
      let gameOptions = {
        headers: {
          'Client-Id': process.env.CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
        params: { game_id: gameResponse.id },
      }
      // request data from both Twitch API endpoints using Promise.all
      const twitchClipResponse = await axios.get(process.env.GET_CLIPS, twitchOptions)
      const gameClipResponse = await axios.get(process.env.GET_CLIPS, gameOptions)
      await Promise.all([twitchClipResponse, gameClipResponse]).then((result) => result)
      let twitchClipData = twitchClipResponse.data.data
      let gameClipData = gameClipResponse.data.data
      // if both profile and game have clips
      if (twitchClipData.length > 0 && gameClipData.length > 0) {
        try {
          // update database with new set 'ordered:false'
          const updateTwitchClips = await Clip.insertMany(twitchClipData , { ordered: false })
          const updateGameClips = await Clip.insertMany(gameClipData , { ordered: false })
          await Promise.all([updateTwitchClips, updateGameClips]).then((result) => result)
          let numTwitchAdded = twitchClipData.length
          let numGameAdded = gameClipData.length
          console.log(`Successfully added ${numTwitchAdded} of ${twitchName}'s Twitch clips to the database`.yellow)
          console.log(`Successfully added ${numGameAdded} ${gameName} Twitch clips to the database`.yellow)
        } catch (error) {
          if (!error.message.includes('E11000')) {
            res.status(400)
            throw new Error(error)
          }
          let numUpdated = error.result.result.nInserted
          console.log(`Successfully updated ${numUpdated} ${gameName} Twitch clips in the database`.yellow)
        } finally {
          return res.status(200).json({ profile: twitchClipData, game: gameClipData })
        }
      }
      // if only game has clips
      if (gameClipData.length > 0) {
        try {
          // update database with new set 'ordered:false'
          await Clip.insertMany(gameClipData, { ordered: false })
          let numAdded = gameClipData.length
          console.log(`Successfully added ${numAdded} ${gameName} Twitch clips to the database`.yellow)
        } catch (error) {
          if (!error.message.includes('E11000')) {
            res.status(400)
            throw new Error(error)
          }
          let numUpdated = error.result.result.nInserted
          console.log(`Successfully updated ${numUpdated} ${gameName} Twitch clips in the database`.yellow)
        } finally {
          return res.status(201).json({ game: gameClipData })
        }
      }
      // if only profile has clips
      if (twitchClipData.length > 0) {
        try {
          // update database with new set 'ordered:false'
          await Clip.insertMany(twitchClipData, { ordered: false })
          let numAdded = twitchClipData.length
          console.log(`Successfully added ${numAdded} of ${twitchName}'s Twitch clips to the database`.yellow)
        } catch (error) {
          if (!error.message.includes('E11000')) {
            res.status(400)
            throw new Error(error)
          }
          let numUpdated = error.result.result.nInserted
          console.log(`Successfully updated ${numUpdated} of ${twitchName}'s Twitch clips in the database`.yellow
          )
        } finally {
          return res.status(201).json({ profile: twitchClipData })
        }
      }
      return
    }
  } catch (error) {
    res.status(400)
    throw Error(error.message)
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
  getClips,
  getSavedClips,
  saveClip,
  unsaveClip,
}
