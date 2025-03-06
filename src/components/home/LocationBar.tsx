
import { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import { motion } from 'framer-motion';

const LocationBar = () => {
  const { isLocationEnabled, location, requestLocation } = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [zipCode, setZipCode] = useState(location?.city ? `${location.city}, ${location.state}` : '');
  
  const handleLocationClick = () => {
    if (!isLocationEnabled) {
      requestLocation();
    } else {
      setIsEditing(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically validate the ZIP code and update the location
    // This is a simplified version
  };
  
  return (
    <div className="flex items-center justify-center my-2">
      <motion.div 
        className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 text-sm"
        whileHover={{ scale: 1.02 }}
        onClick={handleLocationClick}
      >
        <MapPin className="h-4 w-4 text-gray-600 mr-1" />
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 w-24 text-sm"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
            <button type="submit" className="sr-only">Update</button>
          </form>
        ) : (
          <div className="flex items-center">
            <span className="text-gray-800">
              {location?.city ? `${location.city}, ${location.state}` : 'Enable location'}
            </span>
            <ChevronDown className="h-3 w-3 text-gray-600 ml-1" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LocationBar;
