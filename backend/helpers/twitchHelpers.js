const asyncHandler = require('express-async-handler')
const { default: axios } = require('axios')
const Twitch = require('../models/twitchModel')
const Game = require('../models/gameModel')

// @desc Grants app access token
// @resource Twitch OAuth Client Credentials Grant Flow documentation:
// @resource https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
const fetchToken = asyncHandler(async (req, res) => {
  const options = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'client_credentials',
  }
  const response = await axios.post(process.env.GET_TOKEN, options)
  if (!response) throw new Error('Failed to fetch token')
  try {
    const token = response.data
    return token
  } catch (error) {
    res.status(401)
    throw new Error('Failed to fetch token')
  }
})

// @desc      Grants user access & refresh token
// @resource  Twitch OAuth Authorization Code Grant Flow documentation:
// @resource  https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
const authApp = asyncHandler(async (req, res) => {
  try {
    const scope = new URLSearchParams()
    scope.append('scope', 'channel:manage:videos')
    scope.append('scope', 'clips:edit')
    scope.append('scope', 'user:read:follows')
    const options = {
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
    }
    const response = await axios.get(
      process.env.CLIENT_AUTH,
      { params: options },
      scope
    )
    console.log(`Authorization successful`.blue)
    return response
  } catch (error) {
    res.status(401)
    throw new Error(`An error occuried while authorizing`.red)
  }
})

// @desc      Revoke user access token
// @resource  Revoking Access Tokens documentation:
// @resource  https://dev.twitch.tv/docs/authentication/revoke-tokens
const revokeToken = asyncHandler(async (req, res) => {
  try {
    const accessToken = await fetchToken().then((res) => res.access_token)
    const options = {
      client_id: process.env.CLIENT_ID,
      token: `Bearer ${accessToken}`,
    }
    const response = await axios.post(process.env.REVOKE_TOKEN, options)
    console.log('Token revocation successful'.blue)
    return response
  } catch (error) {
    res.status(401)
    throw new Error('An error occuried while revoking token')
  }
})

// @desc      Helper function fetches Twitch profile by name and adds data to MongoDB
// @resource  Get Users documentation:
// @resource  https://dev.twitch.tv/docs/api/reference#get-users
const fetchTwitchByName = asyncHandler(async (name, res) => {
  // configure http request
  let login = name
    .replace(/[\s+:,;]/g, '')
    .toLowerCase()
    .trim()
  const accessToken = await fetchToken().then((result) => result.access_token)
  // config first request to fetch profile data from Twitch API
  const options = {
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    params: { login: login },
  }
  const profileResponse = await axios.get(process.env.GET_USERS, options)
  const profile = profileResponse.data.data[0]
  // config second request to fetch follower data from Twitch API
  const options2 = {
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    params: { to_id: profileResponse.data.data[0].id },
  }
  const followResponse = await axios.get(process.env.GET_FOLLOWS, options2)
  if (profile && followResponse) {
    try {
      // update profile to include follower data
      profile.followers = followResponse.data
      const twitchExists = await Twitch.findOne({ id: profile.id })
      // if profile doesnt exist add it
      if (!twitchExists) {
        const twitch = await Twitch.insertMany(profile)
        console.log(`Successfully added ${twitch[0].display_name}'s Twitch profile to the database`.yellow)
        return twitch[0]
      }
      // update profile data view and follower count
      const updatedTwitch = await Twitch.findByIdAndUpdate(
        twitchExists._id,
        {
          view_count: profile.view_count,
          followers: profile.followers,
        },
        { new: true }
      );
      console.log(`Successfully updated ${updatedTwitch.display_name}'s Twitch profile in the database`.yellow)
      return updatedTwitch
    } catch (error) {
      console.log(error)
      res.status(500)
      throw new Error(error)
    }
  }
})

// @desc      Helper function fetches game profile by name and adds data to MongoDB
// @resource  Get Games documentation:
// @resource  https://dev.twitch.tv/docs/api/reference#get-games
const fetchGameByName = asyncHandler(async (name, res) => {
  // configure http request
  name = name.replace(/  +/g, ' ').toLowerCase().trim()
  const accessToken = await fetchToken().then((result) => result.access_token)
  const options = {
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    params: { name: name },
  }
  // request profile data from Twitch API
  const response = await axios.get(process.env.GET_GAMES, options)
  const gameData = response.data.data[0]
  if (gameData) {
    try {
      // check for game in db
      const gameExists = await Game.findOne({ id: gameData.id })
      // if game doesnt exist add it
      if (!gameExists) {
        const game = await Game.insertMany(gameData)
        console.log(`Successfully added ${name} to the database`.yellow)
        return game[0]
      }
      return gameExists
    } catch (error) {
      res.status(400)
      throw new Error(error)
    }
  }
  return
})

module.exports = {
  fetchToken,
  authApp,
  revokeToken,
  fetchTwitchByName,
  fetchGameByName,
}
