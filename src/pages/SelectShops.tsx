import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { getShops } from '@/services/shopService';
import { Store } from 'lucide-react';

const SelectShops = () => {
  const { user } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const fetchedShops = await getShops();
        // Filter shops based on the current user's ID
        const userShops = fetchedShops.filter(shop => shop.owner_id === user?.id);
        setShops(userShops);
      } catch (err: any) {
        setError(err.message || 'Failed to load shops.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchShops();
    }
  }, [user]);

  if (loading) {
    return <div>Loading shops...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div>
      {shops.map((shop) => (
        <div key={shop.id}>
          {shop.logo_url ? (
            <img src={shop.logo_url} alt={shop.name} />
          ) : (
            <Store className="h-6 w-6" />
          )}
          {shop.name}
        </div>
      ))}
    </div>
  );
};

export default SelectShops;
