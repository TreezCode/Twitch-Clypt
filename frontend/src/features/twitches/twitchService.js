import axios from 'axios';

const API_URL = '/api/twitch/';

// Get Twitch Profiles from Twitch API
const getTwitch = async (twitchData) => {
  const response = await axios.post(API_URL, twitchData);
  return response.data;
};

// Save Twitch Profile
const saveTwitch = async (twitchId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // axios params: url => data => headers
  const response = await axios.put(API_URL + twitchId, null, config);
  console.log(response.data);
  return response.data;
};

const twitchService = {
  getTwitch,
  saveTwitch,
};

export default twitchService;
