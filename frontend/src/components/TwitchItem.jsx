import React from 'react';
import { useDispatch } from 'react-redux';
import { FaTwitch } from 'react-icons/fa';
import { GoVerified } from 'react-icons/go';
import { MdFavorite } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { abbreviateNumber } from 'js-abbreviation-number';
import { reset } from '../features/twitches/twitchSlice';
import { saveTwitch } from '../features/twitches/twitchSlice';

function TwitchItem({ twitch }) {
  const twitchJoin = new Date(twitch.created_at).toString().substring(0, 15);
  const followers = abbreviateNumber(twitch.followers.total, 1);
  const twitchLink = 'https://www.twitch.tv/' + twitch.login;
  const dispatch = useDispatch();
  const handleFavorite = () => {
    dispatch(saveTwitch(twitch._id));
  };
  const handleClose = () => {
    dispatch(reset());
  };

  return (
    <div className="twitch">
      <div className="favorite-icon-wrapper">
        <MdFavorite
          className="favorite-icon"
          color="#eb2768"
          size="2em"
          onClick={handleFavorite}
        />
        <IoMdClose
          className="favorite-close"
          color="white"
          size="2em"
          onClick={handleClose}
        />
      </div>
      <h2 className="twitch-name">{twitch.display_name}</h2>
      <p>{followers} followers</p>
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
        <FaTwitch className="fa-twitch" size="1.5em" />
      </div>
      {twitch.broadcaster_type.length !== 0 ? (
        <p className="icon-wrapper">
          Twitch verified {twitch.broadcaster_type}
          <GoVerified className="go-verified" />
        </p>
      ) : (
        ''
      )}
      <br />
      <h4>Twitch join: </h4>
      <p>{twitchJoin}</p>
      <br />
      <h4>Twitch views: </h4>
      <p>{twitch.view_count.toLocaleString('en-US')}</p>
      <br />
      <p>{twitch.description}</p>
    </div>
  );
}

export default TwitchItem;
