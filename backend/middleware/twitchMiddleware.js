const asyncHandler = require('express-async-handler')
const { default: axios } = require('axios')

// @desc Grants app access token
// @resource Twitch OAuth Client Credentials Grant Flow documentation:
// @resource https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
const fetchToken = asyncHandler(async () => {
  try {
    const options = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'client_credentials',
    }
    const res = await axios.post(process.env.GET_TOKEN, options)
    if (res.status == 200) {
      return res.data
    }
  } catch (error) {
    throw new Error('Failed to fetch token')
  }
})

// @desc Grants user access & refresh token
// @resource Twitch OAuth Authorization Code Grant Flow documentation:
// @resource https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
const authApp = asyncHandler(async () => {
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
    const res = await axios.get(
      process.env.CLIENT_AUTH,
      { params: options },
      scope
    )
    if (res.status == 200) {
      console.log(`Successfully authorized`.blue)
      console.log('authApp: ', res)
      return res
    }
  } catch (error) {
    throw new Error(`Error occuried while authorizing`.red)
  }
})

// @desc Revoke user access token
// @resource Revoking Access Tokens documentation:
// @resource https://dev.twitch.tv/docs/authentication/revoke-tokens
const revokeToken = asyncHandler(async () => {
  try {
    const accessToken = await fetchToken().then((res) => res.access_token)
    const options = {
      client_id: process.env.CLIENT_ID,
      token: `Bearer ${accessToken}`,
    }
    const response = await axios.post(process.env.REVOKE_TOKEN, options)
    if (response.status == 200) {
      console.log('Token revocation success'.red)
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = {
  authApp,
  fetchToken,
  revokeToken,
}
