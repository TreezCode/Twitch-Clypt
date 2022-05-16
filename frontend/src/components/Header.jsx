import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { logout, authReset } from '../features/auth/authSlice';
import { twitchReset } from '../features/twitches/twitchSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    document.getElementById('main').classList.remove('main-collapsed')
    document.getElementById('main').classList.remove('main-opened')
    document.getElementById('mySideBar').classList.remove('sidebar')
    dispatch(twitchReset());
    dispatch(authReset());
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Twitch Clypt</Link>
      </div>
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
    </header>
  );
}

export default Header;
