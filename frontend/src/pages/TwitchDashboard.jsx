import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import TwitchForm from '../components/TwitchForm';
import TwitchItem from '../components/TwitchItem';
import Spinner from '../components/Spinner';
import SideBar from '../components/SideBar';
import { favoriteReset } from '../features/twitches/twitchSlice';
import { getUserData } from '../features/auth/authSlice';

function TwitchDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { twitches, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.twitches,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (user) {
      dispatch(getUserData());
    }
    if (!user) {
      navigate('/login');
    }
    return () => {
      dispatch(favoriteReset());
    };
  }, [user, isError, message, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <SideBar user={user} />
      <div className="main-collapsed" id="main">
        <div className="container">
          <section className="heading">
            <h1>Welcome {user && user.name}</h1>
            <p>Twitch Dashboard</p>
          </section>
          <TwitchForm />
          <section className="content">
            {twitches.id ? (
              <div className="twitches">
                <TwitchItem twitch={twitches} />
              </div>
            ) : (
              <h3>No Twitch Profile here...</h3>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default TwitchDashboard;
