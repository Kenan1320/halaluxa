
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
    <div className="flex items-center my-2 mt-4">
      <motion.div 
        className="flex items-center bg-white rounded-full px-3 py-1.5 text-sm shadow-sm"
        whileHover={{ scale: 1.02 }}
        onClick={handleLocationClick}
      >
        <div className="flex flex-col mr-2">
          <span className="text-xs text-gray-500">How do you want your items?</span>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-[#2A866A] mr-1" />
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex items-center">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="bg-transparent border-none p-0 focus:ring-0 w-24 text-sm font-medium"
                  autoFocus
                  onBlur={() => setIsEditing(false)}
                />
                <button type="submit" className="sr-only">Update</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="text-gray-800 font-medium">
                  {location?.city ? `${location.city}, ${location.state}` : 'Enable location'}
                </span>
                <ChevronDown className="h-3 w-3 text-[#2A866A] ml-1" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationBar;
