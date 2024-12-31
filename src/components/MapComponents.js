import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapComponent = () => {
  const containerStyle = { width: '100%', height: '400px' }; // Define map dimensions
  const center = { lat: 37.7749, lng: -122.4194 }; // Example: Centered at San Francisco

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY_HERE">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* Additional Map features can go here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
