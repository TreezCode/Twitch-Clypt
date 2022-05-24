import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignInAlt, FaSignOutAlt, FaUser, FaTwitch } from 'react-icons/fa';
import { AiFillSetting, AiFillHome } from 'react-icons/ai';
import { logout, authReset } from '../../features/auth/authSlice';
import { twitchReset } from '../../features/twitches/twitchSlice';
import { clipReset } from '../../features/clips/clipSlice';
import TwitchForm from '../TwitchForm/TwitchForm';
import ClipForm from '../ClipForm/ClipForm';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(twitchReset());
    dispatch(clipReset());
    dispatch(authReset());
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (!user) {
      document.querySelector('#myHeader').classList.add('header-logged-out');
    }
    if (user) {
      document.querySelector('#myHeader').classList.remove('header-logged-out');
    }
  }, [user, location]);

  const handlePageLogic = () => {
    if (location.pathname === '/twitchdashboard') {
      return <TwitchForm />;
    }
    if (location.pathname === '/clipdashboard') {
      return <ClipForm />;
    }
    return <div></div>;
  };

  return (
    <header className="header" id="myHeader">
      <div className="logo">
        <Link to="/">
          <FaTwitch className="header-fa-twitch" />
        </Link>
      </div>
      {user ? (
        <>
          <div className="channels-link">
            <Link to="/twitchdashboard">Channels</Link>
          </div>
          <div className="clips-link">
            <Link to="/clipdashboard">Clips</Link>
          </div>
          {handlePageLogic()}
          <div className="home-link">
            <Link to="/">
              <AiFillHome className="header-ai-home" />
              <span className="home-link-text">{user.name}</span>
            </Link>
          </div>
          <div className="user-link">
            <Link to="/settings">
              <AiFillSetting className="header-ai-setting" />
              <span className="user-link-text">Settings</span>
            </Link>
          </div>
        </>
      ) : (
        ''
      )}
      <div className="auth-links">
        <ul>
          {user ? (
            <li>
              <button className="logout-btn btn" onClick={onLogout}>
                <FaSignOutAlt />
                <span className="logout-btn-text">Logout</span>
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <FaSignInAlt /> Login
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <FaUser /> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
