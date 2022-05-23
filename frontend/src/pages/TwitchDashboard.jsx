import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import TwitchItem from '../components/TwitchItem/TwitchItem';
import Spinner from '../components/Spinner/Spinner';
import { twitchReset } from '../features/twitches/twitchSlice';
import './Pages.css';

function TwitchDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { twitches, isLoading, isError, message } = useSelector(
    (state) => state.twitches,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(twitchReset());
    }
    if (!user) {
      navigate('/login');
    }
  }, [user, isError, message, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <p>Channels Dashboard</p>
      </section>
      <section className="content">
        {twitches.id ? (
          <div className="twitches">
            <TwitchItem twitch={twitches} />
          </div>
        ) : (
          <h3>Search a Twitch Channel...</h3>
        )}
      </section>
    </>
  );
}

export default TwitchDashboard;
