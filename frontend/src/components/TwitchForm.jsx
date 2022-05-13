import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTwitch } from '../features/twitches/twitchSlice';
import SearchBar from './SearchBar';

function TwitchForm() {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(getTwitch({ name }));
    setName('');
  };
  const clearInput = () => {
    setName('');
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Search</label>
          <SearchBar
            placeholder="Search for Twitch profiles"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onClick={clearInput}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-block" type="submit">
            Search Twitch
          </button>
        </div>
      </form>
    </section>
  );
}

export default TwitchForm;
