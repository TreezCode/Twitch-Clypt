import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTwitch } from '../features/twitches/twitchSlice';
import SearchBar from './SearchBar';

function SearchForm() {
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
    <section className='search-form'>
      <form>
        <div className="form-group">
          <SearchBar
            placeholder="Search Twitch"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onClick={clearInput}
            onSubmit={onSubmit}
          />
        </div>
      </form>
    </section>
  );
}

export default SearchForm;
