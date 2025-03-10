
import { supabase } from '@/integrations/supabase/client';

// Define the Shop type and export it
export interface Shop {
  id: string;
  name: string;
  description: string;
  category: string;
  logo_url?: string;
  banner_url?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  businessHours?: string;
  ownerId: string;
  isVerified: boolean;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  geoLat?: number;
  geoLng?: number;
  distance?: number;
}

// Map database results to Shop model
const mapDbShopToModel = (data: any): Shop => {
  return {
    id: data.id,
    name: data.name || '',
    description: data.description || '',
    category: data.category || '',
    logo_url: data.logo_url,
    banner_url: data.banner_url,
    location: data.location,
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    phone: data.phone,
    email: data.email,
    website: data.website,
    businessHours: data.business_hours,
    ownerId: data.owner_id,
    isVerified: data.is_verified || false,
    averageRating: data.average_rating,
    reviewCount: data.review_count,
    createdAt: data.created_at,
    geoLat: data.geo_lat,
    geoLng: data.geo_lng,
    distance: data.distance
  };
};

// Get a shop by its ID
export async function getShopById(id: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching shop:', error);
      return null;
    }
    
    return mapDbShopToModel(data);
  } catch (err) {
    console.error('Error in getShopById:', err);
    return null;
  }
}

// Get shop by owner ID
export async function getShopByOwnerId(ownerId: string): Promise<Shop | null> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', ownerId)
      .single();
    
    if (error || !data) {
      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching shop by owner:', error);
      }
      return null;
    }
    
    return mapDbShopToModel(data);
  } catch (err) {
    console.error('Error in getShopByOwnerId:', err);
    return null;
  }
}

// Get all shops
export async function getAllShops(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    return data.map(mapDbShopToModel);
  } catch (err) {
    console.error('Error in getAllShops:', err);
    return [];
  }
}

// Get shops by category
export async function getShopsByCategory(category: string): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching shops in category ${category}:`, error);
      return [];
    }
    
    return data.map(mapDbShopToModel);
  } catch (err) {
    console.error(`Error in getShopsByCategory for ${category}:`, err);
    return [];
  }
}

// Get shops near a location
export async function getShopsNearLocation(lat: number, lng: number, radius: number = 10): Promise<Shop[]> {
  try {
    // Use a standard SQL query with geographic calculations since we can't use PostGIS directly
    const { data, error } = await supabase.rpc('get_shops_within_distance', {
      lat,
      lng,
      radius_miles: radius
    });
    
    if (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    return data.map(mapDbShopToModel);
  } catch (err) {
    console.error('Error in getShopsNearLocation:', err);
    return [];
  }
}

// Get featured shops (based on rating, verification)
export async function getFeaturedShops(limit: number = 6): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('is_verified', true)
      .order('average_rating', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching featured shops:', error);
      return [];
    }
    
    return data.map(mapDbShopToModel);
  } catch (err) {
    console.error('Error in getFeaturedShops:', err);
    return [];
  }
}

// Create a new shop
export async function createShop(shop: Partial<Shop>): Promise<Shop | null> {
  try {
    // Convert from model to database field names
    const dbShop = {
      name: shop.name,
      description: shop.description,
      category: shop.category,
      logo_url: shop.logo_url,
      banner_url: shop.banner_url,
      location: shop.location,
      address: shop.address,
      city: shop.city,
      state: shop.state,
      zip_code: shop.zipCode,
      phone: shop.phone,
      email: shop.email,
      website: shop.website,
      business_hours: shop.businessHours,
      owner_id: shop.ownerId,
      is_verified: shop.isVerified || false,
      geo_lat: shop.geoLat,
      geo_lng: shop.geoLng
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
  } catch (err) {
    console.error('Error in createShop:', err);
    return null;
  }
}

// Update an existing shop
export async function updateShop(id: string, updates: Partial<Shop>): Promise<Shop | null> {
  try {
    // Convert from model to database field names
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.logo_url !== undefined) dbUpdates.logo_url = updates.logo_url;
    if (updates.banner_url !== undefined) dbUpdates.banner_url = updates.banner_url;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (updates.city !== undefined) dbUpdates.city = updates.city;
    if (updates.state !== undefined) dbUpdates.state = updates.state;
    if (updates.zipCode !== undefined) dbUpdates.zip_code = updates.zipCode;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.website !== undefined) dbUpdates.website = updates.website;
    if (updates.businessHours !== undefined) dbUpdates.business_hours = updates.businessHours;
    if (updates.isVerified !== undefined) dbUpdates.is_verified = updates.isVerified;
    if (updates.geoLat !== undefined) dbUpdates.geo_lat = updates.geoLat;
    if (updates.geoLng !== undefined) dbUpdates.geo_lng = updates.geoLng;
    
    const { data, error } = await supabase
      .from('shops')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }
    
    return mapDbShopToModel(data);
  } catch (err) {
    console.error('Error in updateShop:', err);
    return null;
  }
}

// Delete a shop
export async function deleteShop(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting shop:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in deleteShop:', err);
    return false;
  }
}

// Function to create mock data when needed
export function getMockShops(): Shop[] {
  return [
    {
      id: "1",
      name: "Halal Delights",
      description: "Authentic halal food and groceries",
      category: "Food & Groceries",
      logo_url: "/lovable-uploads/0780684a-9c7f-4f32-affc-6f9ea641b814.png",
      location: "New York",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      phone: "212-555-1234",
      email: "contact@halaldelights.com",
      website: "https://halaldelights.com",
      businessHours: "Mon-Sat: 9AM-9PM, Sun: 10AM-6PM",
      ownerId: "owner1",
      isVerified: true,
      averageRating: 4.7,
      reviewCount: 124,
      createdAt: new Date().toISOString(),
      geoLat: 40.712776,
      geoLng: -74.005974,
      distance: 0
    },
    {
      id: "2",
      name: "Barakah Clothing",
      description: "Modern modest fashion for all occasions",
      category: "Clothing & Accessories",
      logo_url: "/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png",
      location: "Chicago",
      address: "456 Oak St",
      city: "Chicago",
      state: "IL",
      zipCode: "60611",
      phone: "312-555-6789",
      email: "info@barakahclothing.com",
      website: "https://barakahclothing.com",
      businessHours: "Mon-Fri: 10AM-8PM, Sat-Sun: 11AM-7PM",
      ownerId: "owner2",
      isVerified: true,
      averageRating: 4.9,
      reviewCount: 87,
      createdAt: new Date().toISOString(),
      geoLat: 41.878113,
      geoLng: -87.629799,
      distance: 0
    }
  ];
}
