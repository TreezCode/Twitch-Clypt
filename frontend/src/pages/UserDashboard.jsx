import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSavedTwitch, twitchReset } from '../features/twitches/twitchSlice';
import { getSavedClips, clipReset } from '../features/clips/clipSlice';
import SavedTwitchItem from '../components/SavedTwitchItem/SavedTwitchItem';
import SavedClipItem from '../components/SavedClipItem/SavedClipItem';
import Spinner from '../components/Spinner/Spinner';
import './Pages.css';

import '../components/SavedTwitchItem/SavedTwitchItem.css';

function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  const { twitches } = useSelector((state) => state.twitches);
  const { clips } = useSelector((state) => state.clips.clips);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(twitchReset());
      dispatch(clipReset());
    }
    if(user) {
      dispatch(getSavedTwitch());
      dispatch(getSavedClips());
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading heading-user-dashboard">
        <h1>Welcome {user?.name}</h1>
      </section>
      <section className="content-user-dashboard">
        <h4 className="clips-title">Favorite Clips</h4>
        <h4 className="twitches-title">Favorite Channels</h4>
        {clips?.length > 0 ? (
          <div className="clips">
            {clips.map((clip) => (
              <SavedClipItem key={clip._id} clip={clip} />
            ))}
          </div>
        ) : (
          <h3>No saved Twitch clips here...</h3>
        )}
        {twitches.length > 0 ? (
          <div className="twitches">
            {twitches.map((twitch) => (
              <SavedTwitchItem key={twitch._id} twitch={twitch} />
            ))}
          </div>
        ) : (
          <h3>No saved Twitch profiles here...</h3>
        )}
      </section>
    </>
  );
}

export default UserDashboard;
