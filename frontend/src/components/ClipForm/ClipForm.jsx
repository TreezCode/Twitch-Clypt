import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getClip } from '../../features/clips/clipSlice';
import SearchBar from '../SearchBar/SearchBar';
import './ClipForm.css';

function ClipForm() {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(getClip({ name }));
    setName('');
  };

  const clearInput = () => {
    setName('');
  };

  return (
    <section className="search-form">
      <form>
        <div className="form-group">
          <SearchBar
            placeholder="Search Clips"
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

export default ClipForm;
