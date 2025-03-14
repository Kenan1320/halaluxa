
import React from 'react';

interface MapComponentProps {
  latitude?: number | null;
  longitude?: number | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude }) => {
  // This is a placeholder implementation
  // In a real app, you would integrate with a mapping library
  return (
    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
      {latitude && longitude ? (
        <div className="text-center">
          <p>Map would display here</p>
          <p className="text-sm text-gray-600">Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
        </div>
      ) : (
        <p>No location coordinates available</p>
      )}
    </div>
  );
};

export default MapComponent;
