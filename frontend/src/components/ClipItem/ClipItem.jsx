import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { clipReset, saveClip, unsaveClip } from '../../features/clips/clipSlice';
import './ClipItem.css';

function ClipItem({ clip }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSave = () => {
    dispatch(saveClip(clip.id));
  };
  const handleUnsave = () => {
    dispatch(unsaveClip(clip.id));
  };
  const handleClose = () => {
    dispatch(clipReset());
  };

  const favorited = user.clips.some((favorite) => favorite.slug === clip.id,);

  const slug = clip.id
  const parent = 'localhost'
  const iframeSrc = "https://clips.twitch.tv/embed?clip= " + {slug} + "&parent=localhost&parent=embed.localhost"
  
  return (
    <div className="clip">
      <div className="favorite-icon-wrapper">
        {favorited ? (
          <MdFavorite className="favorite-icon" onClick={handleUnsave} />
        ) : (
          <MdFavoriteBorder className="favorite-icon" onClick={handleSave} />
        )}
        <IoMdClose className="favorite-close" onClick={handleClose} />
      </div>
      <h1>{clip.broadcaster_name}</h1>
      {clip.title ? <h3>{clip.title}</h3> : ''}
      {/* <iframe
          src={iframeSrc}
          height="300px"
          width="400px"
          allowFullScreen>
      </iframe> */}
      <a href={clip.url} target="_blank">
        <img src={clip.thumbnail_url} alt="Twitch Clip Thumbnail" />
      </a>
      <p>Views : {clip.view_count}</p>
      <p>Created by: {clip.creator_name}</p>

    </div>
  );
}

export default ClipItem;
