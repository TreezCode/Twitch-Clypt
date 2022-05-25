import React from 'react';
import './SavedClipItem.css';

function SavedClipItem({ clip }) {

  return (
    <div className="clip">
      {/* <iframe
          src={iframeSrc}
          height="300px"
          width="400px"
          allowFullScreen>
      </iframe> */}
      <h1>{clip.broadcaster_name}</h1>
      <a href={clip.url} target="_blank">
        <img src={clip.thumbnail_url} alt="Twitch Clip Thumbnail" />
      </a>
      {clip.title ? <h3>{clip.title}</h3> : ''}
      <p>Views : {clip.view_count}</p>
      <p>Created by: {clip.creator_name}</p>
    </div>
  );
}

export default SavedClipItem;
