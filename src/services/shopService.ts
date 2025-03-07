
import { supabase } from '@/integrations/supabase/client';
import { Shop, ShopProduct } from '@/models/shop';
import { Product } from '@/models/product';

// Mapping database fields to model fields
const mapDbShopToModel = (dbShop: any): Shop => {
  return {
    id: dbShop.id,
    name: dbShop.name,
    description: dbShop.description,
    location: dbShop.location,
    rating: dbShop.rating || 0,
    productCount: dbShop.product_count || 0,
    isVerified: dbShop.is_verified || false,
    category: dbShop.category || 'General',
    logo: dbShop.logo_url || null,
    coverImage: dbShop.cover_image || null,
    ownerId: dbShop.owner_id,
    latitude: dbShop.latitude || null,
    longitude: dbShop.longitude || null,
    distance: dbShop.distance || null
  };
};

// Create a new shop
export async function createShop(shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    // First upload the logo if it exists
    let logoUrl = null;
    if (shopData.logo && shopData.logo.startsWith('data:')) {
      const { data: uploadResult, error: uploadError } = await uploadShopLogo(shopData.logo, shopData.ownerId!);
      
      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        throw uploadError;
      }
      
      logoUrl = uploadResult?.path;
    }
    
    // Prepare shop data for database
    const dbShopData = {
      name: shopData.name!,
      description: shopData.description!,
      location: shopData.location || '',
      rating: shopData.rating || 0,
      product_count: shopData.productCount || 0,
      is_verified: shopData.isVerified || false,
      category: shopData.category || 'General',
      logo_url: logoUrl || shopData.logo || null,
      cover_image: shopData.coverImage || null,
      owner_id: shopData.ownerId!,
      latitude: shopData.latitude || null,
      longitude: shopData.longitude || null
    };
    
    // Insert the shop
    const { data, error } = await supabase
      .from('shops')
      .insert(dbShopData)
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
}

// Upload shop logo to supabase storage
export async function uploadShopLogo(base64Image: string, ownerId: string) {
  try {
    // Convert base64 to blob
    const formatData = base64Image.split(';base64,');
    const contentType = formatData[0].split(':')[1];
    const base64Data = formatData[1];
    const blob = base64ToBlob(base64Data, contentType);
    
    // Generate a unique file name
    const fileExt = contentType.split('/')[1];
    const fileName = `${ownerId}_${Date.now()}.${fileExt}`;
    const filePath = `shop_logos/${fileName}`;
    
    // Upload to Supabase Storage
    return await supabase.storage
      .from('shops')
      .upload(filePath, blob, {
        contentType,
        cacheControl: '3600'
      });
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw error;
  }
}

// Helper function to convert base64 to blob
function base64ToBlob(base64: string, contentType = '') {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
}

// Get all shops
export async function getShops(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    // Map database fields to model fields
    return data.map(shop => mapDbShopToModel(shop));
  } catch (error) {
    console.error('Error in getShops:', error);
    return [];
  }
}

// Get a shop by ID
export async function getShopById(id: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching shop with id ${id}:`, error);
      return null;
    }
    
    return mapDbShopToModel(data);
  } catch (error) {
    console.error(`Error in getShopById for ${id}:`, error);
    return null;
  }
}

// Get featured shops (for home page)
export async function getFeaturedShops(limit = 6): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
    
    return data.map(shop => mapDbShopToModel(shop));
  } catch (error) {
    console.error('Error in getFeaturedShops:', error);
    return getMockShops().slice(0, limit);
  }
}

// Get nearby shops based on location
export async function getNearbyShops(
  latitude: number, 
  longitude: number, 
  radius = 10, 
  limit = 6
): Promise<Shop[]> {
  try {
    // Using a simple function to determine distance - in a real app you'd use PostGIS
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }
    
    // Calculate distance and filter
    return data
      .map(shop => {
        const shopWithDistance = mapDbShopToModel(shop);
        if (shop.latitude && shop.longitude) {
          shopWithDistance.distance = calculateDistance(
            latitude, 
            longitude, 
            shop.latitude, 
            shop.longitude
          );
        } else {
          shopWithDistance.distance = null;
        }
        return shopWithDistance;
      })
      .filter(shop => shop.distance === null || shop.distance <= radius)
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error in getNearbyShops:', error);
    return getMockShops().slice(0, limit);
  }
}

// Calculate distance between two points in km (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get products by shop ID
export async function getShopProducts(shopId: string): Promise<ShopProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('business_owner_id', shopId);
    
    if (error) {
      console.error(`Error fetching products for shop ${shopId}:`, error);
      return [];
    }
    
    // Convert database fields to model
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images || [],
      sellerId: product.business_owner_id,
      sellerName: product.business_owner_name,
      rating: product.rating || 0
    }));
  } catch (error) {
    console.error(`Error in getShopProducts for ${shopId}:`, error);
    return createMockProducts(shopId, 6);
  }
}

// Update a shop
export async function updateShop(shopData: Partial<Shop>): Promise<Shop | null> {
  try {
    if (!shopData.id) {
      console.error('Cannot update shop without id');
      return null;
    }
    
    // Handle logo upload if it's a new base64 image
    let logoUrl = shopData.logo;
    if (shopData.logo && shopData.logo.startsWith('data:') && shopData.ownerId) {
      const { data: uploadResult, error: uploadError } = await uploadShopLogo(shopData.logo, shopData.ownerId);
      
      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        throw uploadError;
      }
      
      logoUrl = uploadResult?.path;
    }
    
    // Prepare shop data for database
    const dbShopData: any = {};
    
    if (shopData.name !== undefined) dbShopData.name = shopData.name;
    if (shopData.description !== undefined) dbShopData.description = shopData.description;
    if (shopData.location !== undefined) dbShopData.location = shopData.location;
    if (shopData.rating !== undefined) dbShopData.rating = shopData.rating;
    if (shopData.productCount !== undefined) dbShopData.product_count = shopData.productCount;
    if (shopData.isVerified !== undefined) dbShopData.is_verified = shopData.isVerified;
    if (shopData.category !== undefined) dbShopData.category = shopData.category;
    if (logoUrl !== undefined) dbShopData.logo_url = logoUrl;
    if (shopData.coverImage !== undefined) dbShopData.cover_image = shopData.coverImage;
    if (shopData.latitude !== undefined) dbShopData.latitude = shopData.latitude;
    if (shopData.longitude !== undefined) dbShopData.longitude = shopData.longitude;
    
    // Update the shop
    const { data, error } = await supabase
      .from('shops')
      .update(dbShopData)
      .eq('id', shopData.id)
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
}

// Create mock products for development
function createMockProducts(shopId: string, count: number = 10): ShopProduct[] {
  const products: ShopProduct[] = [];
  
  for (let i = 0; i < count; i++) {
    products.push(createMockProduct(shopId, i));
  }
  
  return products;
}

function createMockProduct(shopId: string, index: number): ShopProduct {
  const categories = ["Food", "Clothing", "Books", "Accessories", "Beauty"];
  const productNames = ["Organic Dates", "Modest Dress", "Prayer Rug", "Halal Meat", "Islamic Book", "Miswak", "Honey", "Olive Oil", "Attar Perfume", "Hijab"];
  const shopIndex = parseInt(shopId.replace('shop-', ''));
  
  return {
    id: `product-${shopId}-${index}`,
    name: productNames[index % productNames.length] + (index >= productNames.length ? ` ${Math.floor(index / productNames.length) + 1}` : ''),
    price: 5 + Math.floor(Math.random() * 50),
    description: `This is a ${productNames[index % productNames.length].toLowerCase()} from our shop. It's high quality and halal certified.`,
    category: categories[index % categories.length],
    images: [
      `/lovable-uploads/${index % 10 + 1}.png`,
    ],
    sellerId: shopId,
    sellerName: `Shop ${shopIndex}`,
    rating: 3 + Math.random() * 2
  };
}

// Mock data for development
function getMockShops(): Shop[] {
  return [
    {
      id: 'shop-1',
      name: 'Halal Delights',
      description: 'Authentic halal food products from around the world',
      location: 'New York, NY',
      rating: 4.8,
      productCount: 105,
      isVerified: true,
      category: 'Food & Groceries',
      logo: '/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png',
      coverImage: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ownerId: 'user-1',
      latitude: 40.7128,
      longitude: -74.0060,
      distance: 0.5
    },
    {
      id: 'shop-2',
      name: 'Modest Fashion House',
      description: 'Trendy modest fashion for every occasion',
      location: 'Los Angeles, CA',
      rating: 4.6,
      productCount: 78,
      isVerified: true,
      category: 'Fashion',
      logo: '/lovable-uploads/3c7163e3-7825-410e-b6d1-2e91e6ec2442.png',
      coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ownerId: 'user-2',
      latitude: 34.0522,
      longitude: -118.2437,
      distance: 1.2
    },
    {
      id: 'shop-3',
      name: 'Islamic Bookstore',
      description: 'Books, Qurans, and educational materials',
      location: 'Chicago, IL',
      rating: 4.9,
      productCount: 56,
      isVerified: true,
      category: 'Books & Stationery',
      logo: '/lovable-uploads/30853bea-af12-4b7d-9bf5-14f37b607a62.png',
      coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ownerId: 'user-3',
      latitude: 41.8781,
      longitude: -87.6298,
      distance: 2.4
    },
    {
      id: 'shop-4',
      name: 'Barakah Home Decor',
      description: 'Islamic art, carpets, and home decoration',
      location: 'Houston, TX',
      rating: 4.5,
      productCount: 92,
      isVerified: true,
      category: 'Home & Decor',
      logo: '/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png',
      coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ownerId: 'user-4',
      latitude: 29.7604,
      longitude: -95.3698,
      distance: 3.1
    },
    {
      id: 'shop-5',
      name: 'Natural Healing',
      description: 'Herbal remedies and natural health products',
      location: 'Philadelphia, PA',
      rating: 4.7,
      productCount: 45,
      isVerified: true,
      category: 'Health & Fitness',
      logo: '/lovable-uploads/23c8a527-4c88-45b8-96c7-2e04ebee04eb.png',
      coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ownerId: 'user-5',
      latitude: 39.9526,
      longitude: -75.1652,
      distance: 4.0
    },
    {
      id: 'shop-6',
      name: 'Attar Perfumes',
      description: 'Alcohol-free perfumes and essential oils',
      location: 'Phoenix, AZ',
      rating: 4.4,
      productCount: 38,
      isVerified: true,
      category: 'Beauty & Wellness',
      logo: '/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png',
      coverImage: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ownerId: 'user-6',
      latitude: 33.4484,
      longitude: -112.0740,
      distance: 5.3
    }
  ];
}
