import React from 'react';
import { FcSearch } from 'react-icons/fc';
import { GrFormClose } from 'react-icons/gr';

function SearchBar({ placeholder, name, id, value, onChange, onClick }) {
  return (
    <div className="search">
      <div className="input-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder={placeholder}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
        />
        <span className="search-icon">
          {value.length !== 0 ? (
            <GrFormClose className="clear-input" onClick={onClick} />
          ) : (
            <FcSearch />
          )}
        </span>
      </div>
    </div>
  );
}

export default SearchBar;
