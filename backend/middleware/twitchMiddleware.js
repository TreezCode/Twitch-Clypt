const asyncHandler = require('express-async-handler')
const { default: axios } = require('axios')

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
    return response.data
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

module.exports = {
  authApp,
  fetchToken,
  revokeToken,
}
