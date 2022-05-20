import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import TwitchItem from '../components/TwitchItem';
import Spinner from '../components/Spinner';
import { twitchReset } from '../features/twitches/twitchSlice';
import { getUserData } from '../features/auth/authSlice';

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
    return () => {
      console.log(twitches?.saved);
    }
  }, [user, isError, message, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Twitch Dashboard</p>
      </section>
      <section className="content">
        {twitches.id ? (
          <div className="twitches">
            <TwitchItem twitch={twitches} />
          </div>
        ) : (
          <h3>No Twitch Profile here...</h3>
        )}
      </section>
    </>
  );
}

export default TwitchDashboard;
