import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Globe, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getShopById, updateUserShopPreference } from '@/services/shopService';
import { getProductsByShopId } from '@/services/productService';
import { Shop } from '@/types/database';
import ShopProductList from '@/components/shop/ShopProductList';
import AddReviewForm from '@/components/shop/AddReviewForm';
import ReviewList from '@/components/shop/ReviewList';
import MapComponent from '@/components/MapComponent';

const ShopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [updatingFavorite, setUpdatingFavorite] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState([
    {
      id: '1',
      userId: 'user-1',
      username: 'John Doe',
      rating: 5,
      comment: 'Great shop! Highly recommended.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      userId: 'user-2',
      username: 'Jane Smith',
      rating: 4,
      comment: 'Good products and service.',
      createdAt: new Date().toISOString(),
    },
  ]);
  
  const enableLocation = useCallback(() => {
    if (!shop) return;
    
    // Check if geolocation is supported
    if ("geolocation" in navigator) {
      // Get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Got position
          console.log("Latitude is :", position.coords.latitude);
          console.log("Longitude is :", position.coords.longitude);
        },
        (error) => {
          // Handle errors
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [shop]);

  useEffect(() => {
    const loadShopDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const shop = await getShopById(id);
        
        if (shop) {
          setShop(shop);
          // Update document title with shop name
          document.title = `${shop.name} | Haluna`;
          
          // Enable location services if available
          if (enableLocation) {
            enableLocation();
          }
          
          // Load shop products
          const products = await getProductsByShopId(id);
          setShopProducts(products);
        } else {
          setError("Shop not found");
        }
      } catch (err) {
        console.error("Error loading shop:", err);
        setError("Failed to load shop details");
      } finally {
        setLoading(false);
      }
    };
    
    loadShopDetails();
  }, [id, enableLocation]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!isLoggedIn || !user || !shop) return;
      
      try {
        const { data, error } = await updateUserShopPreference(shop.id, user.id, {});
        
        if (error) {
          console.error("Error fetching favorite status:", error);
          return;
        }
        
        setIsFavorite(data?.is_favorite || false);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    
    checkFavoriteStatus();
  }, [user, isLoggedIn, shop]);

  const handleFavoriteToggle = async () => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add shops to favorites",
        variant: "destructive"
      });
      return;
    }
    
    if (!shop) return;
    
    try {
      setUpdatingFavorite(true);
      
      // Toggle favorite status
      const newStatus = !isFavorite;
      
      // Update in database
      await updateUserShopPreference(shop.id, user.id, {
        is_favorite: newStatus
      });
      
      // Update local state
      setIsFavorite(newStatus);
      
      toast({
        title: newStatus ? "Added to favorites" : "Removed from favorites",
        description: newStatus 
          ? `${shop.name} has been added to your favorites` 
          : `${shop.name} has been removed from your favorites`,
      });
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast({
        title: "Failed to update",
        description: "There was an error updating your preferences",
        variant: "destructive"
      });
    } finally {
      setUpdatingFavorite(false);
    }
  };

  const handleSubmitReview = (reviewData: { rating: number; comment: string }) => {
    const newReview = {
      id: Math.random().toString(),
      userId: user?.id || 'guest',
      username: user?.name || 'Guest',
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading shop details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!shop) {
    return <div className="text-center py-8">Shop not found.</div>;
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="relative rounded-lg overflow-hidden shadow-md">
        <img
          src={shop.cover_image || '/placeholder-shop-cover.jpg'}
          alt={`${shop.name} Cover`}
          className="w-full h-64 object-cover object-center"
        />
        <div className="absolute top-4 left-4 bg-white bg-opacity-75 rounded-full p-2">
          <img
            src={shop.logo || '/placeholder-shop-logo.png'}
            alt={`${shop.name} Logo`}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={handleFavoriteToggle}
            disabled={updatingFavorite}
            className="bg-white bg-opacity-75 hover:bg-opacity-100 text-red-500 rounded-full p-2 transition-colors duration-200"
          >
            {updatingFavorite ? (
              "Updating..."
            ) : isFavorite ? (
              <Heart className="h-6 w-6 fill-current" />
            ) : (
              <Heart className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < shop.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {shop.rating}/5 ({reviews.length} reviews)
          </span>
        </div>
        <p className="text-gray-700 mt-2">{shop.description}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Information</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              {shop.location}
            </li>
            {shop.phone && (
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                <a href={`tel:${shop.phone}`} className="text-haluna-primary hover:underline">
                  {shop.phone}
                </a>
              </li>
            )}
            {shop.website && (
              <li className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-gray-500" />
                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-haluna-primary hover:underline">
                  {shop.website}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Location</h2>
          <div className="h-64 rounded-lg overflow-hidden">
            <MapComponent latitude={shop.latitude} longitude={shop.longitude} />
          </div>
        </div>
      </div>

      <ShopProductList products={shopProducts} shopName={shop.name} />

      <div className="mt-8">
        <AddReviewForm onSubmit={handleSubmitReview} />
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default ShopDetail;
