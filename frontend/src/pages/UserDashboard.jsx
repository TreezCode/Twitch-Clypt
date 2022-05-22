import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if(!user) {
      navigate('/login')
    }
  }, [user])

  return (
    <section className="heading">
      <h1>Welcome {user && user.name}</h1>
      <p>Your Dashboard</p>
    </section>
  );
}

export default UserDashboard;
