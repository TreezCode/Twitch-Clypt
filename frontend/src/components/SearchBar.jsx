import React from 'react';
import { FcSearch } from 'react-icons/fc';
import { GrFormClose } from 'react-icons/gr';

function SearchBar({ placeholder, name, id, value, onChange, onClick }) {
  return (
    <div className="search">
      <div className="inputWrapper">
        <input
          className="searchInput"
          type="text"
          placeholder={placeholder}
          name={name}
          id={id}
          value={value}
          onChange={onChange}
        />
        <span className="searchIcon">
          {value.length !== 0 ? (
            <GrFormClose className="clearInput" onClick={onClick} />
          ) : (
            <FcSearch />
          )}
        </span>
      </div>
      <div className="dataResult"></div>
    </div>
  );
}

export default SearchBar;
