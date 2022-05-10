import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login.jsx'
import Register from './pages/Register'
import Header from './components/Header.jsx'
import Dashboard from './pages/Dashboard'
import DarkMode from './components/DarkMode'

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <DarkMode />
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
