import { createClient } from '@supabase/supabase-js';
import { Shop, Product } from '@/types/database';
import { ShopProduct } from '@/models/shop';

// Create a Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Calculate distance between two coordinates (haversine formula)
export const calculateDistance = (
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

// Convert degrees to radians
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Sort shops by distance
export const sortShopsByDistance = (
  shops: Shop[],
  userLat: number,
  userLng: number
): Shop[] => {
  return [...shops]
    .map(shop => {
      if (shop.latitude && shop.longitude) {
        const distance = calculateDistance(
          userLat,
          userLng,
          shop.latitude,
          shop.longitude
        );
        return { ...shop, distance };
      }
      return { ...shop, distance: Number.MAX_SAFE_INTEGER };
    })
    .sort((a, b) => {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
};

// Convert product to shop product model
export const convertToModelProduct = (product: Product): ShopProduct => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    images: product.images,
    sellerId: product.seller_id || product.shop_id, // Fallback to shop_id if seller_id is not available
    sellerName: product.shop_name || "", // This might be empty initially
    rating: product.rating || 0
  };
};

// Enhance shop products with shop name
export const enhanceShopProducts = async (
  products: Product[],
  shopId: string
): Promise<ShopProduct[]> => {
  const { data: shopData, error } = await supabase
    .from('shops')
    .select('name')
    .eq('id', shopId)
    .single();

  if (error) {
    console.error('Error fetching shop name:', error);
    return products.map(product => convertToModelProduct(product));
  }

  return products.map(product => {
    const shopProduct = convertToModelProduct(product);
    if (shopData) {
      shopProduct.sellerName = shopData.name;
    }
    return shopProduct;
  });
};

// Add getShopProducts function
export const getShopProducts = async (shopId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId);

  if (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }

  return data || [];
};
