import axios from 'axios';

const API_URL = '/api/clips/';

// Get Clips from Clip API
const getClip = async (clipData) => {
  const response = await axios.post(API_URL, clipData);
  return response.data;
};

// Save Clip Profile
const saveClip = async (clipId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // axios params: url => data => headers
  const response = await axios.put(API_URL + clipId, null, config);
  return response.data;
};

// Save Clip Profile
const unsaveClip = async (clipId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // axios params: url => data => headers
  const response = await axios.put(API_URL + '/saved/' + clipId, null, config);
  return response.data;
};

// Get saved Clip Profile
const getSavedClips = async (token) => {
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
  saveClip,
  unsaveClip,
  getSavedClips,
};

export default clipService;
