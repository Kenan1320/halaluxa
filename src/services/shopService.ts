import { supabase } from '@/integrations/supabase/client';
import { getRandomId } from '@/lib/utils';
import { Product as ModelProduct } from '@/models/product';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  category: string;
  location: string;
  rating: number;
  distance?: number;
  productCount: number;
  isVerified: boolean;
  ownerId: string;
  latitude?: number;
  longitude?: number;
}

// ShopProduct interface aligned with the model Product
export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  sellerId: string;
  sellerName?: string;
  rating?: number;
  stock: number;
}

// Adapter function to convert ShopProduct to ModelProduct
export function convertToModelProduct(shopProduct: ShopProduct): ModelProduct {
  return {
    ...shopProduct,
    inStock: shopProduct.stock > 0,
    isHalalCertified: true, // Default value
    createdAt: new Date().toISOString(), // Default value
    details: {} // Default empty details
  };
}

// Create new shop
export const createShop = async (shop: Omit<Shop, 'id'>): Promise<Shop | null> => {
  try {
    const newShop = {
      id: `shop-${getRandomId()}`,
      name: shop.name,
      description: shop.description,
      logo_url: shop.logo,
      category: shop.category,
      location: shop.location,
      rating: shop.rating || 0,
      product_count: shop.productCount || 0,
      owner_id: shop.ownerId,
      address: '', // Default value
      created_at: new Date().toISOString(), // Default value
    };

    const { data, error } = await supabase
      .from('shops')
      .insert([newShop])
      .select()
      .single();

    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }

    // Convert database shop to Shop interface
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      logo: data.logo_url,
      coverImage: data.cover_image,
      category: data.category || 'General',
      location: data.location,
      rating: data.rating,
      productCount: data.product_count,
      isVerified: Boolean(data.is_verified),
      ownerId: data.owner_id,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Error in createShop:', error);
    return null;
  }
};

// Subscribe to shops changes for real-time updates
export const subscribeToShops = (
  callback: (shops: Shop[]) => void
): RealtimeChannel => {
  // Create a channel for shops table
  const channel = supabase
    .channel('shops-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shops',
      },
      async () => {
        // When any shop changes, fetch all shops
        const { data } = await supabase.from('shops').select('*');
        
        if (data) {
          // Convert database shops to Shop interface
          const shops = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            logo: item.logo_url,
            coverImage: item.cover_image,
            category: item.category || 'General',
            location: item.location,
            rating: item.rating,
            productCount: item.product_count,
            isVerified: Boolean(item.is_verified),
            ownerId: item.owner_id,
            latitude: item.latitude,
            longitude: item.longitude
          }));
          
          // Sort shops by proximity if we have location data
          const sortedShops = sortShopsByProximity(shops);
          
          callback(sortedShops);
        }
      }
    )
    .subscribe();

  return channel;
};

// Subscribe to shop products for real-time updates
export const subscribeToShopProducts = (
  shopId: string,
  callback: (products: ModelProduct[]) => void
): RealtimeChannel => {
  const channel = supabase
    .channel(`shop-products-${shopId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products',
        filter: `business_owner_id=eq.${shopId}`,
      },
      async () => {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('business_owner_id', shopId);
        
        callback((data || []).map(customMapDbProductToModel));
      }
    )
    .subscribe();

  return channel;
};

// Sort shops by proximity (mock implementation for now)
const sortShopsByProximity = (shops: any[]): Shop[] => {
  // In a real implementation, this would sort by actual proximity
  // For now, sort by product count as a stand-in for popularity
  return [...shops].sort((a, b) => (b.productCount || 0) - (a.productCount || 0));
};

// Helper function for shop product subscription
const customMapDbProductToModel = (data: any): ModelProduct => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    inStock: data.stock > 0,
    category: data.category,
    images: data.images || [],
    sellerId: data.business_owner_id,
    sellerName: data.business_owner_name,
    rating: data.rating,
    isHalalCertified: data.is_halal_certified,
    details: typeof data.details === 'string' ? JSON.parse(data.details) : (data.details || {}),
    createdAt: data.created_at
  };
};

// Functions to upload product images
export const uploadProductImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('product_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    // Handle progress updates if needed
    if (onProgress) {
      onProgress(100); // Complete
    }

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Return the public URL
    const { data: publicUrlData } = supabase.storage
      .from('product_images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
};

// Keep the original functions but mark them as using mock data
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    // Try to get real data first
    const { data, error } = await supabase
      .from('shops')
      .select('*');
    
    if (error || !data || data.length === 0) {
      console.log('Using mock shop data');
      // Fall back to mock data
      return Array(10).fill(null).map((_, i) => createMockShop(i));
    }
    
    // Convert database shops to Shop interface
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      logo: item.logo_url,
      coverImage: item.cover_image,
      category: item.category || 'General',
      location: item.location,
      rating: item.rating,
      productCount: item.product_count,
      isVerified: Boolean(item.is_verified),
      ownerId: item.owner_id,
      latitude: item.latitude,
      longitude: item.longitude
    }));
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

export const getShops = getAllShops; // Alias for backward compatibility

export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    // This would be a real API call in production
    // For now we'll return a mock shop if id is valid format
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!id || typeof id !== 'string') return null;
    
    // Get the shop index from the id (assuming id format is "shop-X")
    const index = parseInt(id.replace('shop-', ''));
    if (isNaN(index)) return null;
    
    return createMockShop(index);
  } catch (error) {
    console.error('Error fetching shop:', error);
    return null;
  }
};

export const getNearbyShops = async (latitude?: number, longitude?: number): Promise<Shop[]> => {
  try {
    // In production, this would use the latitude and longitude
    // For now we'll generate mock data with random distances
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return Array(5).fill(null).map((_, i) => {
      const shop = createMockShop(i);
      shop.distance = Math.round((Math.random() * 10 + 0.5) * 10) / 10; // 0.5 to 10.5 miles
      return shop;
    });
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }
};

export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    // This would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const index = parseInt(shopId.replace('shop-', ''));
    if (isNaN(index)) return [];
    
    // Generate between 3 and 8 products for the shop
    const count = Math.floor(Math.random() * 6) + 3;
    
    return Array(count).fill(null).map((_, i) => createMockProduct(shopId, i));
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
};

export const setMainShop = (shopId: string): void => {
  localStorage.setItem('mainShopId', shopId);
};

export const getMainShop = async (): Promise<Shop | null> => {
  const mainShopId = localStorage.getItem('mainShopId');
  if (!mainShopId) return null;
  
  return getShopById(mainShopId);
};

// Array of logo URLs for mock shops
const shopLogos = [
  '/lovable-uploads/44753aff-66f9-4b69-b215-e76db83c47bf.png', // SmartAscend
  '/lovable-uploads/96911ae4-ccd3-4ef1-8f73-fcbb77a95265.png', // E Logo
  '/lovable-uploads/97b193a4-55a7-441c-a32f-79c71080192e.png', // Khalifa Thobes
  '/lovable-uploads/740d131d-a0ff-46c5-a98c-83e1ed8b5ab4.png', // aaBideen
  '/lovable-uploads/c2307bf9-52c0-4611-8895-3a6224a60cd9.png', // Al-Haq Thobes
  '/lovable-uploads/0e9f3a41-9bf1-4ad1-948d-ca4bacd60f2c.png', // Thobe Company
  '/lovable-uploads/e4d2a324-6b3b-4b2b-8e4a-5e42638a657a.png', // Shukr
  '/lovable-uploads/3e176c4c-e137-4103-b452-aa7b222ac05a.png', // Halal Eatz
  '/lovable-uploads/bf88547f-a12c-40f1-98ee-44958e3fe6ba.png', // Abu Omar
  '/lovable-uploads/d40ef5c4-e8bd-476d-a62f-9ca786a695fb.png'  // Abu Ahmed
];

// Mock data generation utils
function createMockShop(index: number): Shop {
  const categories = ["Grocery", "Clothing", "Restaurant", "Books", "Beauty"];
  const locations = ["Dallas, TX", "Houston, TX", "Austin, TX", "San Antonio, TX", "Plano, TX"];
  const shopNames = ["SmartAscend", "E-Books", "Khalifa Thobes", "aaBideen", "Al-Haq Thobes", "Thobe Company", "Shukr", "Halal Eatz", "Abu Omar", "Abu Ahmed"];
  
  return {
    id: `shop-${index}`,
    name: shopNames[index % shopNames.length] + (index >= shopNames.length ? ` ${Math.floor(index / shopNames.length) + 1}` : ''),
    description: "A great Muslim owned business offering quality products and excellent service to the community.",
    logo: shopLogos[index % shopLogos.length],
    coverImage: index % 2 === 0 ? `/lovable-uploads/${['0c423741-0711-4e97-8c56-ca4fe31dc6ca', '26c50a86-ec95-4072-8f0c-ac930a65b34d'][index % 2]}.png` : undefined,
    category: categories[index % categories.length],
    location: locations[index % locations.length],
    rating: parseFloat((3 + Math.random() * 2).toFixed(1)),
    productCount: 5 + Math.floor(Math.random() * 20),
    isVerified: index % 3 === 0,
    ownerId: `owner-${index}`,
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.0060 + (Math.random() - 0.5) * 0.1
  };
}

function createMockProduct(shopId: string, index: number): ShopProduct {
  const categories = ["Food", "Clothing", "Books", "Accessories", "Beauty"];
  const productNames = ["Organic Dates", "Modest Dress", "Prayer Rug", "Halal Meat", "Islamic Book", "Miswak", "Honey", "Olive Oil", "Attar Perfume", "Hijab"];
  const shopIndex = parseInt(shopId.replace('shop-', ''));
  
  return {
    id: `product-${shopId}-${index}`,
    name: productNames[index % productNames.length] + (index >= productNames.length ? ` ${Math.floor(index / productNames.length) + 1}` : ''),
    price: 5 + Math.floor(Math.random() * 50),
    description: "High-quality product from a trusted Muslim business.",
    images: [
      `/lovable-uploads/${['8d386384-3944-48e3-922c-2edb81fa1631', 'd8db1529-74b3-4d86-b64a-f0c8b0f92c5c'][index % 2]}.png`
    ],
    category: categories[index % categories.length],
    sellerId: shopId,
    sellerName: createMockShop(shopIndex).name,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    stock: 5 + Math.floor(Math.random() * 30)
  };
}
