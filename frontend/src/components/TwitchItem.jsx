import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTwitch } from 'react-icons/fa';
import { GoVerified } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { abbreviateNumber } from 'js-abbreviation-number';
import { saveTwitch, unsaveTwitch, twitchReset } from '../features/twitches/twitchSlice';
import { getUserData } from '../features/auth/authSlice';

function TwitchItem({ twitch }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { twitches } = useSelector((state) => state.twitches);

  useEffect(() => {
    dispatch(getUserData());
  }, []);

  const handleSave = () => {
    dispatch(saveTwitch(twitch._id));
  };
  const handleUnsave = () => {
    dispatch(unsaveTwitch(twitch._id));
  };
  const handleClose = () => {
    dispatch(twitchReset());
  };

  const twitchJoinDate = new Date(twitch.created_at).toString().substring(0, 15);
  const followers = abbreviateNumber(twitch.followers.total, 1);
  const twitchLink = 'https://www.twitch.tv/' + twitch.login;
  const favorited = user.twitches.some((twitch) => twitch._id === twitches._id);

  return (
    <div className="twitch">
      <div className="favorite-icon-wrapper">
        {favorited ? (
          <MdFavorite className="favorite-icon" onClick={handleUnsave} />
        ) : (
          <MdFavoriteBorder className="favorite-icon" onClick={handleSave} />
        )}
        <IoMdClose className="favorite-close" onClick={handleClose} />
      </div>
      <h2 className="twitch-name">{twitch.display_name}</h2>
      <p>{followers} followers</p>
      {twitch.broadcaster_type.length !== 0 ? (
        <>
        <br />
        <p className="icon-wrapper">
          Twitch {twitch.broadcaster_type}
          <GoVerified className="go-verified" />
        </p>
        </>
      ) : ('')}
      <br />
      <a href={twitchLink} target="_blank">
        <img
          className="twitch-profile-pic"
          src={twitch.profile_image_url}
          alt="Twitch Profile Picture"
          srcSet={[twitch.profile_image_url + ' 1000w']}
          sizes="
        (max-width: 500px) calc(130vw - 2rem), 
        (max-width: 750px) calc(120vw - 2rem),
        calc(95vw - 8rem - 2rem)
        "
        />
      </a>
      <div className="icon-wrapper">
        <FaTwitch className="fa-twitch" />
      </div>

      <br />
      <h4>Twitch join: </h4>
      <p>{twitchJoinDate}</p>
      <br />
      <h4>Twitch views: </h4>
      <p>{twitch.view_count.toLocaleString('en-US')}</p>
      <br />
      <p>{twitch.description}</p>
    </div>
  );
}

export default TwitchItem;
