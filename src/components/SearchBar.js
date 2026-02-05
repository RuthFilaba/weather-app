import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setInput('');
    }
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <i className="search-icon fas fa-search"></i>
          <input
            type="text"
            className="search-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for a city..."
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Loading...
            </>
          ) : (
            <>
              <i className="fas fa-cloud-sun"></i>
              Get Weather
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;