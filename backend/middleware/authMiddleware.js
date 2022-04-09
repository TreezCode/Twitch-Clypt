const asyncHandler = require('express-async-handler')
const axios = require('axios')

// Twitch client credentials grant flow documentation:
// https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
const fetchToken = asyncHandler(async () => {
  try {
    const options = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: encodeURIComponent('client_credentials'),
    }
    const res = await axios.post(process.env.GET_TOKEN, options)
    if (res.status == 200) {
      return res.data
    }
  } catch (error) {
    console.log(error)
  }
})

// Twitch authorization code grant flow documentation:
// https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
const authApp = asyncHandler(async () => {
  try {
    const scope = new URLSearchParams()
    scope.append('scope', 'channel:manage:videos')
    scope.append('scope', 'clips:edit')
    scope.append('scope', 'user:read:follows')
    const options = {
      response_type: encodeURIComponent('code'),
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
    }
    const res = await axios.get(
      process.env.CLIENT_AUTH,
      { params: options },
      scope
    )
    if (res.status == 200) {
      console.log(`Successfully authorized`.blue.underline)
      return res
    }
  } catch (error) {
    console.log(`Error occuried while authorizing`.red.underline)
    console.log(error)
  }
})

module.exports = {
  authApp,
  fetchToken,
}
