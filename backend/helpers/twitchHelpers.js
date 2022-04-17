const asyncHandler = require('express-async-handler')
const { default: axios } = require('axios')
const Twitch = require('../models/twitchModel')

// @desc Grants app access token
// @resource Twitch OAuth Client Credentials Grant Flow documentation:
// @resource https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
const fetchToken = asyncHandler(async (req, res) => {
  try {
    const options = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'client_credentials',
    }
    const response = await axios.post(process.env.GET_TOKEN, options)
    const token = response.data
    return token
  } catch (error) {
    res.status(401)
    throw new Error('Failed to fetch token')
  }
})

// @desc Grants user access & refresh token
// @resource Twitch OAuth Authorization Code Grant Flow documentation:
// @resource https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
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

// @desc Revoke user access token
// @resource Revoking Access Tokens documentation:
// @resource https://dev.twitch.tv/docs/authentication/revoke-tokens
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
    console.log(error)
    res.status(401)
    throw new Error('An error occuried while revoking token')
  }
})

// @desc Helper function fetches Twitch profile by name and adds data to MongoDB
// @resource Get Users documentation:
// @resource https://dev.twitch.tv/docs/api/reference#get-users
const fetchTwitchByName = asyncHandler(async (name, res) => {
  // configure http request
  name = name.replace(/\s+/g, '').toLowerCase().trim()
  const accessToken = await fetchToken().then((result) => result.access_token)
  const options = {
    headers: {
      'Client-Id': process.env.CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    params: { login: name },
  }
  // request profile data from Twitch API
  const response = await axios.get(process.env.GET_USERS, options)
  const profile = response.data.data[0]
  if (!profile) {
    res.status(400)
    throw new Error('Unable to find that Twitch profile')
  }
  try {
    // check for Twitch profile in db
    const twitchExists = await Twitch.findOne({ id : profile.id })
    // if profile doesnt exist add it
    if (!twitchExists) {
      const twitch = await Twitch.insertMany(profile)
      console.log(`Successfully added ${twitch[0].display_name}'s Twitch profile to the database`.yellow)
      return twitch[0]
    }
    return twitchExists
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
})

// @desc Helper function checks for user login and authentication validations
const validateUser = asyncHandler(async (loggedIn, user, res) => {
  if (!user) {
    res.status(400)
    throw new Error('User not found in database')
  }
  // authenticate user
  if (loggedIn._id.toString() !== user._id.toString()) {
    res.status(401)
    throw new Error('User not authorized')
  }
})

module.exports = {
  fetchToken,
  authApp,
  revokeToken,
  fetchTwitchByName,
  validateUser,
}
