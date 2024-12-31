// src/components/LocationSearch.js
import React, { useState } from 'react';

function LocationSearch() {
  const [address, setAddress] = useState('');

  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can integrate Google Maps API here to fetch location details
    alert(`Searching for: ${address}`);
  };

  return (
    <div>
      <h2>Search for a location:</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={handleChange}
          placeholder="Enter address"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default LocationSearch;
