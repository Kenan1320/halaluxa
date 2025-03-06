
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
    <div className="flex items-center text-white">
      <motion.button 
        className="flex items-center py-1"
        whileHover={{ scale: 1.02 }}
        onClick={handleLocationClick}
      >
        <MapPin className="h-4 w-4 mr-1 text-white" />
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 w-24 text-sm text-white"
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
            <button type="submit" className="sr-only">Update</button>
          </form>
        ) : (
          <div className="flex items-center">
            <span className="text-sm text-white">
              Deliver to {location?.city ? `${location.city}, ${location.state}` : 'your location'}
            </span>
            <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default LocationBar;
