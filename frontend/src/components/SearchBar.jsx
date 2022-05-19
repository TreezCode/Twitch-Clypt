import React from 'react';
import { FcSearch } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';

function SearchBar({
  placeholder,
  name,
  id,
  value,
  onChange,
  onClick,
  onSubmit,
}) {
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
        <div className="input-icons">
          {value ? (
            <span className="clear-icon-wrapper">
              <IoMdClose className="clear-icon" onClick={onClick} />
            </span>
          ) : (
            ''
          )}
          <button className='search-icon-btn' type='submit' onClick={onSubmit}>
            <FcSearch className='search-icon' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
