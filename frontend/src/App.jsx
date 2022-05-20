import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import TwitchDashboard from './pages/TwitchDashboard';
import Header from './components/Header';
import SideBar from './components/SideBar';
import DarkMode from './components/DarkMode';

function App() {
  return (
    <>
      <Router>
        <Header />
        <SideBar />
        <div className="main-collapsed" id="main">
          <div className="container">
            <Routes>
              <Route exact path="/" element={<TwitchDashboard />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
