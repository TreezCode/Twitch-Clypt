import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTwitch } from 'react-icons/fa';
import { GoVerified } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { abbreviateNumber } from 'js-abbreviation-number';
import { saveTwitch, unsaveTwitch, twitchReset } from '../../features/twitches/twitchSlice';
import './SavedTwitchItem.css'

function SavedTwitchItem({ twitch }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSave = () => {
    dispatch(saveTwitch(twitch._id));
  };
  const handleUnsave = () => {
    dispatch(unsaveTwitch(twitch._id));
  };
  const handleClose = () => {
    dispatch(twitchReset());
  };

  const twitchJoinDate = new Date(twitch.created_at)
    .toString()
    .substring(0, 15);
  const followers = abbreviateNumber(twitch.followers.total, 1);
  const twitchLink = 'https://www.twitch.tv/' + twitch.login;
  const favorited = user.twitches.some(
    (favorite) => favorite._id === twitch._id,
  );

  const backgroundURL = 'url' + '(' + twitch.profile_image_url + ')'
  const savedTwitchStyle = {
    backgroundImage: backgroundURL,
    backgroundPosition: "center",
    backgroundSize: "100px 100px",
    backgroundRepeat: "repeat",
  }

  return (
    <div className="twitch" style={savedTwitchStyle}>
      <div className="favorite-icon-wrapper">
        {favorited ? (
          <MdFavorite className="favorite-icon" onClick={handleUnsave} />
        ) : (
          <MdFavoriteBorder className="favorite-icon" onClick={handleSave} />
        )}
      </div>
      <h2 className="twitch-name">{twitch.display_name}</h2>
      {twitch.broadcaster_type.length !== 0 ? (
        <>
          <p className="icon-wrapper">
            Twitch {twitch.broadcaster_type}
            <GoVerified className="go-verified" />
          </p>
        </>
      ) : (
        ''
      )}
      <p>{followers} followers</p>
      <br />
      <a href={twitchLink} target="_blank">

      </a>
      <div className="icon-wrapper">
        <FaTwitch className="fa-twitch" />
      </div>
      <h4>Twitch views :</h4>
      <p>{twitch.view_count.toLocaleString('en-US')}</p>

    </div>
  );
}

export default SavedTwitchItem;