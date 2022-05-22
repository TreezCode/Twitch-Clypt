import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import TwitchDashboard from './pages/TwitchDashboard';
import ClipDashboard from './pages/ClipDashboard';
import Settings from './pages/Settings';
import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';

function App() {
  return (
    <>
      <Router>
        <Header />
        <SideBar />
        <div className="main-collapsed" id="main">
          <div className="container">
            <Routes>
              <Route exact path="/" element={<UserDashboard />} />
              <Route exact path="/twitchdashboard" element={<TwitchDashboard />} />
              <Route exact path="/clipdashboard" element={<ClipDashboard />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
