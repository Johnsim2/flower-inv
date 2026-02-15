// src/components/SearchBar.js
// Component for searching/filtering plants by various criteria

import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');

  const handleSearch = () => {
    onSearch(searchTerm, searchField);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('', 'all');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-container">
        <select 
          className="search-field-select"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="all">All Fields</option>
          <option value="code">Identification Code</option>
          <option value="variety">Variety Name</option>
          <option value="botanical">Botanical Name</option>
          <option value="color">Flower Color</option>
          <option value="breeder">Breeder</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder={
            searchField === 'code' ? 'Search by code (e.g., PP-CAL-DR-001)...' :
            searchField === 'variety' ? 'Search by variety name...' :
            searchField === 'botanical' ? 'Search by botanical name...' :
            searchField === 'color' ? 'Search by color...' :
            searchField === 'breeder' ? 'Search by breeder...' :
            'Search plants...'
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button 
          className="btn-search"
          onClick={handleSearch}
        >
          🔍 Search
        </button>

        {searchTerm && (
          <button 
            className="btn-clear"
            onClick={handleClear}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {searchTerm && (
        <div className="search-results-info">
          Searching for: <strong>{searchTerm}</strong> in <strong>{
            searchField === 'all' ? 'all fields' :
            searchField === 'code' ? 'identification codes' :
            searchField === 'variety' ? 'variety names' :
            searchField === 'botanical' ? 'botanical names' :
            searchField === 'color' ? 'flower colors' :
            'breeders'
          }</strong>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
