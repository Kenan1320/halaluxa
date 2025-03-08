
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/models/product';
import { Shop, ShopProduct } from '@/models/shop';
import { Json } from '@/integrations/supabase/types';

// Get all shops
export const getShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*');
    
    if (error) throw error;
    
    return data.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description || '',
      location: shop.location || '',
      rating: shop.rating || 0,
      productCount: shop.product_count || 0,
      isVerified: shop.is_verified || false,
      category: shop.category || '',
      logo: shop.logo_url || null,
      coverImage: shop.cover_image || null,
      ownerId: shop.owner_id,
      latitude: shop.latitude || null,
      longitude: shop.longitude || null
    }));
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Get shops alias for components using getAllShops
export const getAllShops = getShops;

// Get a shop by ID
export const getShopById = async (id: string): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || '',
      rating: data.rating || 0,
      productCount: data.product_count || 0,
      isVerified: data.is_verified || false,
      category: data.category || '',
      logo: data.logo_url || null,
      coverImage: data.cover_image || null,
      ownerId: data.owner_id,
      latitude: data.latitude || null,
      longitude: data.longitude || null
    };
  } catch (error) {
    console.error('Error fetching shop by ID:', error);
    return null;
  }
};

// Get the main shop for a business user
export const getMainShop = async (userId?: string): Promise<Shop | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userId || userData.user?.id;
    
    if (!uid) {
      throw new Error('User ID is required');
    }
    
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .eq('owner_id', uid)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || '',
      rating: data.rating || 0,
      productCount: data.product_count || 0,
      isVerified: data.is_verified || false,
      category: data.category || '',
      logo: data.logo_url || null,
      coverImage: data.cover_image || null,
      ownerId: data.owner_id,
      latitude: data.latitude || null,
      longitude: data.longitude || null
    };
  } catch (error) {
    console.error('Error fetching main shop for user:', error);
    return null;
  }
};

// Get all products for a shop
export const getShopProducts = async (shopId: string): Promise<ShopProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, shops(name)')
      .eq('seller_id', shopId);
    
    if (error) throw error;
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      images: product.images || [],
      sellerId: product.seller_id,
      sellerName: product.shops?.name || '',
      rating: product.rating || 0
    }));
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
};

// Convert a ShopProduct to a Product model
export const convertToModelProduct = (shopProduct: ShopProduct): Product => {
  return {
    id: shopProduct.id,
    name: shopProduct.name,
    description: shopProduct.description,
    price: shopProduct.price,
    category: shopProduct.category,
    images: shopProduct.images,
    sellerId: shopProduct.sellerId,
    sellerName: shopProduct.sellerName,
    rating: shopProduct.rating || 0,
    inStock: true,
    isHalalCertified: true,
    createdAt: new Date().toISOString(),
    details: {}
  };
};

// Create a new shop
export const createShop = async (shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('shops')
      .insert({
        name: shopData.name,
        description: shopData.description,
        location: shopData.location,
        category: shopData.category,
        logo_url: shopData.logo,
        cover_image: shopData.coverImage,
        owner_id: user.user.id,
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        is_verified: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || '',
      rating: data.rating || 0,
      productCount: data.product_count || 0,
      isVerified: data.is_verified || false,
      category: data.category || '',
      logo: data.logo_url || null,
      coverImage: data.cover_image || null,
      ownerId: data.owner_id,
      latitude: data.latitude || null,
      longitude: data.longitude || null
    };
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
};

// Update a shop
export const updateShop = async (id: string, shopData: Partial<Shop>): Promise<Shop | null> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .update({
        name: shopData.name,
        description: shopData.description,
        location: shopData.location,
        category: shopData.category,
        logo_url: shopData.logo,
        cover_image: shopData.coverImage,
        latitude: shopData.latitude,
        longitude: shopData.longitude
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || '',
      rating: data.rating || 0,
      productCount: data.product_count || 0,
      isVerified: data.is_verified || false,
      category: data.category || '',
      logo: data.logo_url || null,
      coverImage: data.cover_image || null,
      ownerId: data.owner_id,
      latitude: data.latitude || null,
      longitude: data.longitude || null
    };
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
};

// Utility to subscribe to shops (for real-time updates)
export const subscribeToShops = (callback: (shops: Shop[]) => void) => {
  const subscription = supabase
    .channel('shops-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shops' }, async () => {
      const shops = await getShops();
      callback(shops);
    })
    .subscribe();
  
  return subscription;
};

// Upload a product image to storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.user.id}/${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data: urlData } = await supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading product image:', error);
    return null;
  }
};

// Create a new product
export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // Get the shop ID for this user
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.user.id)
      .single();
    
    if (shopError) throw shopError;
    
    // Add the product
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        images: productData.images,
        seller_id: shopData.id,
        stock: productData.inStock ? 10 : 0,
        is_halal_certified: productData.isHalalCertified,
        details: productData.details as Json
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images: data.images,
      sellerId: data.seller_id,
      sellerName: '',
      rating: data.rating || 0,
      inStock: data.stock > 0,
      isHalalCertified: data.is_halal_certified,
      createdAt: data.created_at,
      details: data.details as Record<string, any>
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        images: productData.images,
        stock: productData.inStock ? 10 : 0,
        is_halal_certified: productData.isHalalCertified,
        details: productData.details as Json
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images: data.images,
      sellerId: data.seller_id,
      sellerName: '',
      rating: data.rating || 0,
      inStock: data.stock > 0,
      isHalalCertified: data.is_halal_certified,
      createdAt: data.created_at,
      details: data.details as Record<string, any>
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
