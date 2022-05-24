import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clipReset } from '../../features/clips/clipSlice';
import './ClipItem.css';

function ClipItem({ clip }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSave = () => {
    dispatch(saveTwitch(twitch._id));
  };
  const handleUnsave = () => {
    dispatch(unsaveTwitch(twitch._id));
  };
  const handleClose = () => {
    dispatch(resetClip());
  };
  
  return (
    <div className="clip">
      <h1>{clip.broadcaster_name}</h1>
      {clip.title ? <h3>{clip.title}</h3> : ''}
      <a href={clip.url} target="_blank">
        <img src={clip.thumbnail_url} alt="Twitch Clip Thumbnail" />
      </a>
      <p>Views : {clip.view_count}</p>
      <p>Created by: {clip.creator_name}</p>
    </div>
  );
}

export default ClipItem;
