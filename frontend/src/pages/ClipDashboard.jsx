import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ClipItem from '../components/ClipItem/ClipItem';
import Spinner from '../components/Spinner/Spinner';
import { clipReset } from '../features/clips/clipSlice';
import './Pages.css';

function ClipDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { clips, isLoading, isError, message } = useSelector(
    (state) => state.clips,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(clipReset());
    }
    if (!user) {
      navigate('/login');
    }
  }, [user, isError, message, navigate, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const clipDisplay = () => {
    if (clips.profile?.length > 0) {
      return (
        <div className="clips">
          {clips.profile.map((clip) => (
            <ClipItem key={clip.id} clip={clip} />
          ))}
        </div>
      );
    }
    if (clips.game?.length > 0) {
      return (
        <div className="clips">
          {clips.game.map((clip) => (
            <ClipItem key={clip.id} clip={clip} />
          ))}
        </div>
      );
    }
    return <h3>Search for Clips...</h3>;
  };

  return (
    <>
      <section className="heading">
        <p>Clips Dashboard</p>
      </section>
      <section className="content">
        {clipDisplay()}
      </section>
    </>
  );
}

export default ClipDashboard;
