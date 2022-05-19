import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { logout, authReset } from '../features/auth/authSlice';
import { twitchReset } from '../features/twitches/twitchSlice';
import TwitchForm from './TwitchForm';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(twitchReset());
    dispatch(authReset());
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    if(!user) {
      document.querySelector('#myHeader').classList.add('header-logged-out')
    }
    if(user) {
      document.querySelector('#myHeader').classList.remove('header-logged-out')
    }
  },[user])

  return (
    <header className="header" id='myHeader'>
      <div className="logo">
        <Link to="/login">Twitch Clypt</Link>
      </div>
      {user ? (
        <TwitchForm />
      ):('')}
      <div className='header-links'>
        <ul>
          {user ? (
            <li>
              <button className="btn" onClick={onLogout}>
                <FaSignOutAlt /> Logout
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
