import React, { useState, useEffect } from 'react';
import './App.css';

import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import './App.css'; // Add this for external styling

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 28.6139, // New Delhi's latitude
  lng: 77.2090, // New Delhi's longitude
};

function App() {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(defaultCenter);
  const [searchBox, setSearchBox] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [address, setAddress] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onLoad = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places.length > 0) {
        const place = places[0];
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setMarker({ lat, lng });
        if (map) {
          map.panTo({ lat, lng });
        }
        fetchAddress(lat, lng);
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarker({ lat: latitude, lng: longitude });
          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
          }
          setLocationPermissionDenied(false);
          fetchAddress(latitude, longitude);
        },
        (error) => {
          setLocationPermissionDenied(true);
          setErrorMessage('Geolocation failed. Enable location services or search manually.');
        }
      );
    } else {
      setLocationPermissionDenied(true);
      setErrorMessage('Geolocation is not supported by your browser.');
    }
  };

  const fetchAddress = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress('No address found.');
        }
      } else {
        setAddress('Geocoder failed: ' + status);
      }
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!houseNo || !area || !category) {
      alert('All fields are required!');
      return;
    }

    const newAddress = {
      houseNo,
      area,
      category,
      isFavorite,
      marker,
    };

    if (editingAddressIndex !== null) {
      const updatedAddresses = savedAddresses.map((address, index) =>
        index === editingAddressIndex ? newAddress : address
      );
      setSavedAddresses(updatedAddresses);
      setEditingAddressIndex(null);
    } else {
      setSavedAddresses([...savedAddresses, newAddress]);
    }

    setHouseNo('');
    setArea('');
    setCategory('');
    setIsFavorite(false);
  };

  const handleEditAddress = (index) => {
    const addressToEdit = savedAddresses[index];
    setHouseNo(addressToEdit.houseNo);
    setArea(addressToEdit.area);
    setCategory(addressToEdit.category);
    setIsFavorite(addressToEdit.isFavorite);
    setMarker(addressToEdit.marker);
    setEditingAddressIndex(index);
    if (map) {
      map.panTo(addressToEdit.marker);
    }
  };

  const handleDeleteAddress = (index) => {
    setSavedAddresses(savedAddresses.filter((_, i) => i !== index));
  };

  const toggleFavorite = (index) => {
    const updatedAddresses = savedAddresses.map((address, i) =>
      i === index ? { ...address, isFavorite: !address.isFavorite } : address
    );
    setSavedAddresses(updatedAddresses);
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={['places']}>
      <div className="app-container">
        {locationPermissionDenied && (
          <div className="modal">
            <div className="modal-content">
              <h3>Location Permission Denied</h3>
              <p>{errorMessage}</p>
              <button onClick={getCurrentLocation}>Enable Location</button>
              <button onClick={() => setLocationPermissionDenied(false)}>Close</button>
            </div>
          </div>
        )}

        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          <input type="text" placeholder="Search for a location" className="search-box" />
        </StandaloneSearchBox>

        <GoogleMap mapContainerStyle={containerStyle} center={marker} zoom={12}>
          <Marker position={marker} />
        </GoogleMap>

        <div className="form-container">
          <h3>Enter Address</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="House/Flat No."
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
            />
            <input
              type="text"
              placeholder="Area/Road"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <div className="category-select">
              <span onClick={() => setCategory('Home')} className={category === 'Home' ? 'selected' : ''}>Home</span>
              <span onClick={() => setCategory('Office')} className={category === 'Office' ? 'selected' : ''}>Office</span>
            </div>
            <label>
              Favorite:
              <input type="checkbox" checked={isFavorite} onChange={() => setIsFavorite(!isFavorite)} />
            </label>
            <button type="submit">{editingAddressIndex !== null ? 'Update Address' : 'Save Address'}</button>
          </form>
        </div>

        <div className="saved-addresses">
          <h3>Saved Addresses</h3>
          <ul>
            {savedAddresses.map((addr, index) => (
              <li key={index}>
                <div>{addr.houseNo}, {addr.area}</div>
                <div>Category: {addr.category}</div>
                <div>
                  <button onClick={() => toggleFavorite(index)}>
                    {addr.isFavorite ? '★' : '☆'}
                  </button>
                  <button onClick={() => handleEditAddress(index)}>Edit</button>
                  <button onClick={() => handleDeleteAddress(index)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LoadScript>
  );
}

export default App;
