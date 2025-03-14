
import React from 'react';

interface MapComponentProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  center = { lat: 0, lng: 0 }, 
  zoom = 15, 
  markers = [] 
}) => {
  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-500">Map Component (will show location at coordinates {center.lat}, {center.lng})</p>
      </div>
      {markers.length > 0 && (
        <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow text-sm">
          <p>{markers.length} location{markers.length !== 1 ? 's' : ''} marked</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
