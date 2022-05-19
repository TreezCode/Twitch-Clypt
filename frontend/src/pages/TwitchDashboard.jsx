import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import TwitchForm from '../components/TwitchForm';
import TwitchItem from '../components/TwitchItem';
import Spinner from '../components/Spinner';
import SideBar from '../components/SideBar';
import { unsaveTwitch, twitchReset } from '../features/twitches/twitchSlice';

function TwitchDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { twitches, isLoading, isError, message } = useSelector(
    (state) => state.twitches,
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (isError) {
      toast.error(message);
      dispatch(twitchReset());
    }
  }, [twitches, user, isError, message, navigate, dispatch]);

  const handleUnsave = (e) => {
    const removeId = e.target.dataset.remove
    dispatch(unsaveTwitch(removeId));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <SideBar user={user} twitches={twitches} onClick={handleUnsave} />
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
