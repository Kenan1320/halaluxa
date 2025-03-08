
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopProduct } from '@/models/shop';
import { Product } from '@/models/product';

// Function to upload product image to Supabase storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
};

// Helper function to convert database shop to Shop model
const mapDbShopToModel = (data: any): Shop => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location || '',
    rating: data.rating || 4.5,
    productCount: data.product_count || 0,
    isVerified: true,
    category: data.category || 'General',
    logo: data.logo_url || null,
    coverImage: data.cover_image || null,
    ownerId: data.owner_id,
    latitude: data.latitude,
    longitude: data.longitude
  };
};

// Helper function to convert database product to ShopProduct model
const mapDbProductToShopProduct = (data: any): ShopProduct => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    images: data.images || [],
    sellerId: data.seller_id || data.business_owner_id,
    sellerName: data.seller_name || data.business_owner_name,
    rating: data.rating
  };
};

// Convert a ShopProduct to a Product model
export const convertToModelProduct = (product: ShopProduct): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    inStock: true,
    category: product.category,
    images: product.images,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    rating: product.rating || 4,
    isHalalCertified: true,
    details: {},
    createdAt: new Date().toISOString()
  };
};

// Function to get a shop by ID
export const getShopById = async (shopId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();

    if (error) {
      console.error('Error fetching shop:', error);
      return null;
    }

    return mapDbShopToModel(data);
  } catch (error) {
    console.error('Error in getShopById:', error);
    return null;
  }
};

// Function to get the main shop for a user
export const getMainShop = async (userId: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId)
      .eq('is_main', true)
      .single();

    if (error) {
      // If no main shop is found, try to get the first shop owned by the user
      if (error.code === 'PGRST116') {
        const { data: firstShop, error: firstShopError } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_id', userId)
          .limit(1)
          .single();

        if (firstShopError) {
          console.error('Error fetching first shop:', firstShopError);
          return null;
        }

        return mapDbShopToModel(firstShop);
      }

      console.error('Error fetching main shop:', error);
      return null;
    }

    return mapDbShopToModel(data);
  } catch (error) {
    console.error('Error in getMainShop:', error);
    return null;
  }
};

// Get products for a specific shop
export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching shop products:', error);
      return getMockShopProducts(shopId);
    }

    if (!data || data.length === 0) {
      return getMockShopProducts(shopId);
    }

    return data.map(mapDbProductToShopProduct);
  } catch (error) {
    console.error('Error in getShopProducts:', error);
    return getMockShopProducts(shopId);
  }
};

// Create a new shop
export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Map our Shop model to database structure
    const dbShop = {
      name: shopData.name,
      description: shopData.description,
      location: shopData.location,
      category: shopData.category,
      logo_url: shopData.logo,
      cover_image: shopData.coverImage,
      owner_id: shopData.ownerId,
      is_main: false,
      rating: shopData.rating || 4.5,
      product_count: shopData.productCount || 0,
      latitude: shopData.latitude,
      longitude: shopData.longitude
    };

    const { data, error } = await supabase
      .from('shops')
      .insert(dbShop)
      .select()
      .single();

    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }

    return mapDbShopToModel(data);
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

// Update a shop
export const updateShop = async (shopId: string, updates: Partial<Shop>): Promise<Shop | null> => {
  try {
    // Map our Shop model to database structure
    const dbShop = {
      name: updates.name,
      description: updates.description,
      location: updates.location,
      category: updates.category,
      logo_url: updates.logo,
      cover_image: updates.coverImage,
      rating: updates.rating,
      product_count: updates.productCount,
      latitude: updates.latitude,
      longitude: updates.longitude
    };

    const { data, error } = await supabase
      .from('shops')
      .update(dbShop)
      .eq('id', shopId)
      .select()
      .single();

    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }

    return mapDbShopToModel(data);
  } catch (error) {
    console.error('Error in updateShop:', error);
    return null;
  }
};

// Set a shop as the main shop for a user
export const setMainShop = async (shopId: string, userId: string): Promise<boolean> => {
  try {
    // First, unset any existing main shop
    const { error: resetError } = await supabase
      .from('shops')
      .update({ is_main: false })
      .eq('owner_id', userId);

    if (resetError) {
      console.error('Error resetting main shop:', resetError);
      return false;
    }

    // Then set the selected shop as main
    const { error } = await supabase
      .from('shops')
      .update({ is_main: true })
      .eq('id', shopId)
      .eq('owner_id', userId);

    if (error) {
      console.error('Error setting main shop:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in setMainShop:', error);
    return false;
  }
};

// Get all shops for the marketplace
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching all shops:', error);
      return getMockShops();
    }

    if (!data || data.length === 0) {
      return getMockShops();
    }

    return data.map(mapDbShopToModel);
  } catch (error) {
    console.error('Error in getAllShops:', error);
    return getMockShops();
  }
};

// Get shops owned by a user
export const getUserShops = async (userId: string): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', userId)
      .order('name');

    if (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }

    if (!data || data.length === 0) {
      // Return mock shops for development
      return getMockShops().filter(shop => shop.ownerId === userId);
    }

    return data.map(mapDbShopToModel);
  } catch (error) {
    console.error('Error in getUserShops:', error);
    return [];
  }
};

// Delete a shop
export const deleteShop = async (shopId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', shopId);

    if (error) {
      console.error('Error deleting shop:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteShop:', error);
    return false;
  }
};

// Get nearby shops based on location
export const getNearbyShops = async (
  latitude: number, 
  longitude: number, 
  radiusInKm: number = 10
): Promise<Shop[]> => {
  try {
    // This would ideally use a PostGIS function to calculate distance
    // For now, we'll return all shops and sort by distance client-side
    const { data, error } = await supabase
      .from('shops')
      .select('*');

    if (error) {
      console.error('Error fetching nearby shops:', error);
      return getMockShops();
    }

    if (!data || data.length === 0) {
      return getMockShops();
    }

    // Calculate distance for each shop (simplified version)
    const shopsWithDistance = data.map((shop: any) => {
      if (shop.latitude && shop.longitude) {
        // Simple distance calculation (not accurate for long distances)
        const distance = calculateDistance(
          latitude, 
          longitude, 
          shop.latitude, 
          shop.longitude
        );
        return {
          ...mapDbShopToModel(shop),
          distance
        };
      }
      return mapDbShopToModel(shop);
    });

    // Filter shops by distance and sort by closest
    return shopsWithDistance
      .filter((shop: Shop) => shop.distance !== undefined && shop.distance <= radiusInKm)
      .sort((a: Shop, b: Shop) => (a.distance || 0) - (b.distance || 0));
  } catch (error) {
    console.error('Error in getNearbyShops:', error);
    return getMockShops();
  }
};

// Helper function to calculate distance between two coordinates
const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Mock data section
// ----------------

// Function to get mock shops when database is not available
export const getMockShops = (): Shop[] => {
  return [
    {
      id: "shop1",
      name: "Abu Omar Halal Restaurant",
      description: "Authentic Middle Eastern cuisine with a focus on shawarma, wraps, and falafel bowls. All our ingredients are fresh and halal certified.",
      location: "125 Main Street, Austin, TX 78701",
      rating: 4.8,
      productCount: 6,
      isVerified: true,
      category: "Food & Dining",
      logo: "/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png",
      coverImage: null,
      ownerId: "user1"
    },
    {
      id: "shop2",
      name: "Shukr Clothing",
      description: "Modern modest clothing that combines contemporary style with traditional values. Our collection includes abayas, jilbabs, and modest everyday wear for men and women.",
      location: "450 Fashion Ave, New York, NY 10018",
      rating: 4.7,
      productCount: 5,
      isVerified: true,
      category: "Clothing & Apparel",
      logo: "/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png",
      coverImage: null,
      ownerId: "user2"
    },
    {
      id: "shop3",
      name: "Brocelle Arab Furniture",
      description: "Luxurious Arab-style furniture pieces that combine traditional craftsmanship with modern design elements. Each piece is crafted with attention to detail and cultural authenticity.",
      location: "780 Decor Boulevard, Dubai Design District",
      rating: 4.9,
      productCount: 2,
      isVerified: true,
      category: "Home & Furniture",
      logo: "/lovable-uploads/c17a65f0-5723-4edf-a3f0-3d356dfb91ef.png",
      coverImage: null,
      ownerId: "user3"
    }
  ];
};

// Function to get mock products for a specific shop
export const getMockShopProducts = (shopId: string): ShopProduct[] => {
  switch(shopId) {
    case "shop1":
      return [
        {
          id: "prod1",
          name: "Beef Shawarma Wrap",
          description: "Tender slices of marinated beef wrapped in a warm pita with tahini, pickles, and vegetables. Our signature dish!",
          price: 9.99,
          category: "Food & Dining",
          images: ["/lovable-uploads/1089136e-5f89-4a64-802c-be230d0c1303.png"],
          sellerId: "user1",
          sellerName: "Abu Omar Halal",
          rating: 4.9
        },
        {
          id: "prod2",
          name: "Chicken Shawarma Wrap",
          description: "Juicy marinated chicken thinly sliced, wrapped in a warm pita with garlic sauce, pickles, and fresh vegetables.",
          price: 8.99,
          category: "Food & Dining",
          images: ["/lovable-uploads/0bb27bbc-275a-4721-9a65-d6c38574c0d5.png"],
          sellerId: "user1",
          sellerName: "Abu Omar Halal",
          rating: 4.8
        },
        {
          id: "prod3",
          name: "Shawarma Party Platter",
          description: "Perfect for gatherings! 10 mini shawarma wraps served with fries, pickles, and our special garlic sauce.",
          price: 29.99,
          category: "Food & Dining",
          images: ["/lovable-uploads/3617671c-bb85-4f25-91e2-9b8650560e48.png"],
          sellerId: "user1",
          sellerName: "Abu Omar Halal",
          rating: 4.9
        },
        {
          id: "prod4",
          name: "Falafel Bowl",
          description: "Freshly made falafel served on a bed of yellow rice with chickpeas, vegetables, pickles, olives, and tahini sauce.",
          price: 12.99,
          category: "Food & Dining",
          images: ["/lovable-uploads/7daa34b7-fbda-4663-a974-efd6ee31e7bc.png"],
          sellerId: "user1",
          sellerName: "Abu Omar Halal",
          rating: 4.7
        },
        {
          id: "prod5",
          name: "Chicken Bowl",
          description: "Grilled marinated chicken served on yellow rice with fresh vegetables, olives, and your choice of sauce.",
          price: 13.99,
          category: "Food & Dining",
          images: ["/lovable-uploads/5a8664a8-ab5c-44b2-9474-8cbd43b5c56e.png"],
          sellerId: "user1",
          sellerName: "Abu Omar Halal",
          rating: 4.8
        },
        {
          id: "prod6",
          name: "Arayes",
          description: "Grilled pita bread stuffed with seasoned ground beef, served with tahini sauce, pickles, and french fries.",
          price: 11.99,
          category: "Food & Dining",
          images: ["/lovable-uploads/f846c14d-67e5-4e69-9867-767ebadb0353.png"],
          sellerId: "user1",
          sellerName: "Abu Omar Halal",
          rating: 4.6
        }
      ];
    case "shop2":
      return [
        {
          id: "prod7",
          name: "Salam Hoodie - Black",
          description: "Comfortable black hoodie with 'Salam' Arabic calligraphy print. Made from 100% organic cotton for maximum comfort.",
          price: 39.99,
          category: "Clothing & Apparel",
          images: ["/lovable-uploads/ccebdac8-88f3-47fa-a413-2e81d006ece3.png"],
          sellerId: "user2",
          sellerName: "Shukr Clothing",
          rating: 4.9
        },
        {
          id: "prod8",
          name: "Arabic Calligraphy Hoodie - Gold",
          description: "Premium black hoodie featuring gold Arabic calligraphy with the motivational phrase 'Whoever strives shall succeed'.",
          price: 49.99,
          category: "Clothing & Apparel",
          images: ["/lovable-uploads/737921c3-f0e2-46bd-b52d-24250d223770.png"],
          sellerId: "user2",
          sellerName: "Shukr Clothing",
          rating: 4.8
        },
        {
          id: "prod9",
          name: "Minimalist Quote Hoodie - Beige",
          description: "Elegant beige hoodie with the classic quote 'With Hardship Comes Ease' in vintage font. Perfect for casual wear.",
          price: 44.99,
          category: "Clothing & Apparel",
          images: ["/lovable-uploads/d4f8251f-008c-4d69-a7bd-cc1fb57a8de8.png"],
          sellerId: "user2",
          sellerName: "Shukr Clothing",
          rating: 4.7
        },
        {
          id: "prod10",
          name: "Patience Arabic Hoodie - Black",
          description: "Black hoodie featuring the Arabic word for 'Patience' in gold calligraphy with English translation. Made from premium cotton blend.",
          price: 45.99,
          category: "Clothing & Apparel",
          images: ["/lovable-uploads/34b3bad5-457b-4710-a89d-8760f86fb9e6.png"],
          sellerId: "user2",
          sellerName: "Shukr Clothing",
          rating: 4.9
        },
        {
          id: "prod11",
          name: "Patience Arabic Hoodie - Pink",
          description: "Soft pink hoodie featuring the Arabic word for 'Patience' in gold calligraphy. Perfect for a modest yet stylish look.",
          price: 45.99,
          category: "Clothing & Apparel",
          images: ["/lovable-uploads/454d04bb-b4fa-4976-b180-1348c79670cb.png"],
          sellerId: "user2",
          sellerName: "Shukr Clothing",
          rating: 4.8
        }
      ];
    case "shop3":
      return [
        {
          id: "prod12",
          name: "Royal Majlis Set - Blue & Gold",
          description: "Luxurious traditional majlis set featuring blue velvet upholstery with gold accents. Includes U-shaped seating arrangement with decorative pillows.",
          price: 4999.99,
          category: "Home & Furniture",
          images: ["/lovable-uploads/6cd1c595-84b8-4075-9df0-e60a2595d32d.png"],
          sellerId: "user3",
          sellerName: "Brocelle Arab Furniture",
          rating: 5.0
        },
        {
          id: "prod13",
          name: "Modern Majlis Set - Teal & White",
          description: "Contemporary majlis set with teal and white upholstery, featuring built-in seating with geometric accent pillows and a marble center table with gold accents.",
          price: 3999.99,
          category: "Home & Furniture",
          images: ["/lovable-uploads/6246682a-f998-4df2-a39b-d271f55166b8.png"],
          sellerId: "user3",
          sellerName: "Brocelle Arab Furniture",
          rating: 4.9
        }
      ];
    default:
      return [];
  }
};

// Export the helper function for testing
export { mapDbShopToModel, mapDbProductToShopProduct };
