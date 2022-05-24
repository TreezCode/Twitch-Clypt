import axios from 'axios';

const API_URL = '/api/clips/';

// Get Clips from Twitch API
const getClip = async (clipData) => {
  const response = await axios.post(API_URL, clipData);
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
  return response.data;
};

// Save Twitch Profile
const unsaveTwitch = async (twitchId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // axios params: url => data => headers
  const response = await axios.put(API_URL + '/saved/' + twitchId, null, config);
  return response.data;
};

// Get saved Twitch Profile
const getSavedTwitch = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'saved', config);
  return response.data;
};

const clipService = {
  getClip,
  saveTwitch,
  unsaveTwitch,
  getSavedTwitch,
};

export default clipService;
