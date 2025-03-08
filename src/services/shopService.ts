
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';

// Export Shop interface
export interface Shop {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  productCount: number;
  isVerified: boolean;
  category: string;
  logo: string | null;
  coverImage: string | null;
  ownerId: string;
  latitude?: number | null;
  longitude?: number | null;
  distance?: number | null;
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName?: string;
  rating?: number;
}

// Get all shops
export const getShops = async (): Promise<Shop[]> => {
  try {
    // This is a mock implementation until tables are created in the database
    // we'll return mock data
    return getMockShops();
  } catch (error) {
    console.error('Error in getShops:', error);
    return getMockShops();
  }
};

// Create mock shops function
const getMockShops = (): Shop[] => {
  return [
    {
      id: "shop1",
      name: "Organic Foods Market",
      description: "Premium organic and halal foods from around the world.",
      location: "New York, NY",
      rating: 4.8,
      productCount: 120,
      isVerified: true,
      category: "Food & Groceries",
      logo: "/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png",
      coverImage: "/lovable-uploads/3617671c-bb85-4f25-91e2-9b8650560e48.png",
      ownerId: "user1",
      latitude: 40.7128,
      longitude: -74.006,
      distance: 1.2
    },
    {
      id: "shop2",
      name: "Halal Meats & More",
      description: "Premium quality halal meats, hand-cut and delivered fresh.",
      location: "Chicago, IL",
      rating: 4.6,
      productCount: 85,
      isVerified: true,
      category: "Food & Groceries",
      logo: "/lovable-uploads/23c8a527-4c88-45b8-96c7-2e04ebee04eb.png",
      coverImage: "/lovable-uploads/30853bea-af12-4b7d-9bf5-14f37b607a62.png",
      ownerId: "user2",
      latitude: 41.8781,
      longitude: -87.6298,
      distance: 2.5
    },
    {
      id: "shop3",
      name: "Modest Fashion House",
      description: "Contemporary modest fashion for the modern woman.",
      location: "Los Angeles, CA",
      rating: 4.9,
      productCount: 150,
      isVerified: true,
      category: "Fashion",
      logo: "/lovable-uploads/34b3bad5-457b-4710-a89d-8760f86fb9e6.png",
      coverImage: "/lovable-uploads/454d04bb-b4fa-4976-b180-1348c79670cb.png",
      ownerId: "user3",
      latitude: 34.0522,
      longitude: -118.2437,
      distance: 3.7
    },
    {
      id: "shop4",
      name: "Barakah Organics",
      description: "Organic, ethically-sourced goods for conscious consumers.",
      location: "Seattle, WA",
      rating: 4.7,
      productCount: 95,
      isVerified: true,
      category: "Food & Groceries",
      logo: "/lovable-uploads/5a8664a8-ab5c-44b2-9474-8cbd43b5c56e.png",
      coverImage: "/lovable-uploads/6246682a-f998-4df2-a39b-d271f55166b8.png",
      ownerId: "user4",
      latitude: 47.6062,
      longitude: -122.3321,
      distance: 4.1
    }
  ];
};

// Alias for getShops to fix import errors in multiple files
export const getAllShops = getShops;

// Get a specific shop by ID
export const getShopById = async (shopId: string): Promise<Shop | null> => {
  try {
    // Mock implementation
    const shops = getMockShops();
    return shops.find(shop => shop.id === shopId) || null;
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

// Get products for a specific shop
export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    // Mock implementation
    return [
      {
        id: "product1",
        name: "Organic Honey",
        description: "Pure, raw organic honey from sustainable sources.",
        price: 12.99,
        category: "Food & Groceries",
        images: ["/lovable-uploads/6cd1c595-84b8-4075-9df0-e60a2595d32d.png"],
        sellerId: shopId,
        sellerName: "Organic Foods Market",
        rating: 4.9
      },
      {
        id: "product2",
        name: "Grass-Fed Beef",
        description: "Premium grass-fed, halal-certified beef.",
        price: 24.99,
        category: "Food & Groceries",
        images: ["/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png"],
        sellerId: shopId,
        sellerName: "Organic Foods Market",
        rating: 4.8
      }
    ];
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return [];
  }
};

// Convert ShopProduct to Product model
export const convertToModelProduct = (shopProduct: ShopProduct): Product => {
  return {
    id: shopProduct.id,
    name: shopProduct.name,
    description: shopProduct.description,
    price: shopProduct.price,
    category: shopProduct.category,
    images: shopProduct.images || [],
    sellerId: shopProduct.sellerId,
    sellerName: shopProduct.sellerName || 'Unknown Seller',
    inStock: true,
    rating: shopProduct.rating || 5,
    isHalalCertified: true,
    createdAt: new Date().toISOString()
  };
};

// Create a new shop
export const createShop = async (shopData: Omit<Shop, 'id'>): Promise<Shop | null> => {
  try {
    // Mock implementation
    const newShop: Shop = {
      id: `shop${Date.now()}`,
      name: shopData.name,
      description: shopData.description,
      location: shopData.location,
      rating: shopData.rating || 0,
      productCount: shopData.productCount || 0,
      isVerified: shopData.isVerified || false,
      category: shopData.category || 'General',
      logo: shopData.logo,
      coverImage: shopData.coverImage,
      ownerId: shopData.ownerId,
      latitude: shopData.latitude || null,
      longitude: shopData.longitude || null
    };
    
    return newShop;
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

// Upload product image to Supabase storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileName = `${Math.random().toString(36).substring(2)}-${file.name}`;
    const filePath = `product-images/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
};

// Subscribe to real-time updates to shops
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  // Mock subscription
  getShops().then(shops => {
    callback(shops);
  });
  
  return {
    unsubscribe: () => {
      // Cleanup function for when subscription is no longer needed
      console.log('Unsubscribed from shops');
    }
  };
};

// Set a shop as the main shop
export const setMainShop = async (shopId: string, userId: string): Promise<boolean> => {
  try {
    // Mock implementation 
    console.log(`Setting shop ${shopId} as main shop for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error in setMainShop:', error);
    return false;
  }
};

// Get the main shop for a user
export const getMainShop = async (userId: string): Promise<Shop | null> => {
  try {
    // Mock implementation - returns first shop
    const shops = await getShops();
    return shops.length > 0 ? shops[0] : null;
  } catch (error) {
    console.error('Error in getMainShop:', error);
    return null;
  }
};

// Get nearby shops based on location
export const getNearbyShopsByCoordinates = async (
  latitude: number, 
  longitude: number, 
  radius: number = 20 // radius in km
): Promise<Shop[]> => {
  try {
    // Mock implementation
    const shops = await getShops();
    
    return shops.map(shop => {
      if (shop.latitude && shop.longitude) {
        // Calculate a simulated distance (just for demo purposes)
        const distance = Math.sqrt(
          Math.pow((shop.latitude - latitude) * 111, 2) + 
          Math.pow((shop.longitude - longitude) * 111 * Math.cos(latitude * Math.PI/180), 2)
        );
        return { ...shop, distance };
      }
      return { ...shop, distance: Math.random() * 20 }; // Random distance for shops without coordinates
    }).sort((a, b) => (a.distance || 100) - (b.distance || 100));
  } catch (error) {
    console.error('Error in getNearbyShopsByCoordinates:', error);
    return [];
  }
};
