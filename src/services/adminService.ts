
import { supabase } from '@/integrations/supabase/client';
import { Shop, DatabaseProfile } from '@/types/database';
import { Product } from '@/models/product';
import { toast } from '@/hooks/use-toast';
import { adaptShopArray, adaptProductType } from '@/utils/typeAdapters';

// Function to get admin role for the current user
export const getAdminRole = async (): Promise<string> => {
  try {
    // In development mode, always return super_admin
    if (import.meta.env.DEV) {
      return 'super_admin';
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'not_authenticated';
    
    // For production, this would query the admins table
    return 'admin'; // Default fallback
  } catch (error) {
    console.error('Error getting admin role:', error);
    return 'unknown';
  }
};

// Create a function to ensure an admin exists in development mode
export const ensureAdminUser = async () => {
  if (import.meta.env.DEV) {
    console.log('Development mode: Auto-granting admin privileges');
    return true;
  }
  return false;
};

// Check if a user is an admin
export const isAdmin = async (): Promise<boolean> => {
  // In development mode, always grant admin access
  if (import.meta.env.DEV) {
    return true;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // In production, query the admins table
    return false; // Default fallback for now
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get admin permissions
export const getAdminPermissions = async (): Promise<any[]> => {
  // In development mode, grant all permissions
  if (import.meta.env.DEV) {
    const allPermissions = [
      {
        id: '1',
        admin_id: '1',
        role: 'super_admin',
        resource: 'shops',
        can_create: true,
        can_read: true,
        can_update: true,
        can_delete: true,
        created_at: new Date().toISOString()
      }
    ];
    
    // Add permissions for all resources
    ['products', 'users', 'orders', 'system'].forEach((resource, index) => {
      allPermissions.push({
        id: String(index + 2),
        admin_id: '1',
        role: 'super_admin',
        resource: resource,
        can_create: true,
        can_read: true,
        can_update: true,
        can_delete: true,
        created_at: new Date().toISOString()
      });
    });
    
    return allPermissions;
  }
  
  // For production - this would be implemented later
  return [];
};

// Check if user has specific permission
export const hasPermission = async (
  resource: 'shops' | 'products' | 'users' | 'orders' | 'system',
  action: 'create' | 'read' | 'update' | 'delete'
): Promise<boolean> => {
  // In development mode, always grant permission
  if (import.meta.env.DEV) {
    return true;
  }
  
  // For production - this would be implemented later
  return false;
};

// Get all shops for admin
export const getAllShops = async (): Promise<Shop[]> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*');
      
    if (error) {
      console.error('Error fetching shops:', error);
      return [];
    }
    
    // Process each shop to ensure it has all required fields
    const processedShops = data.map(shop => {
      return {
        ...shop,
        // Ensure required fields
        status: shop.status || 'pending',
        is_featured: shop.is_featured || false,
        product_count: shop.product_count || 0,
        email: shop.email || '',
        phone: shop.phone || '',
        website: shop.website || '',
        rating: shop.rating || 0
      };
    });
    
    // Use adaptShopArray to convert to the correct Shop type
    return adaptShopArray(processedShops, 'database') as Shop[];
  } catch (error) {
    console.error('Error fetching shops:', error);
    return [];
  }
};

// Get all products for admin
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    // Add missing properties required by the Product type
    const products = data.map(product => adaptProductType({
      ...product,
      in_stock: true,
      pickup_options: { store: true, curbside: false },
      seller_id: product.shop_id, // Default seller_id to shop_id if not present
      seller_name: 'Shop Owner', // Default seller name
      image_url: product.images && product.images.length > 0 ? product.images[0] : ''
    })) as Product[];
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get all users for admin
export const getAllUsers = async (): Promise<DatabaseProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return data as DatabaseProfile[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Update shop status
export const updateShopStatus = async (
  shopId: string, 
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
): Promise<boolean> => {
  try {
    if (!await hasPermission('shops', 'update')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to update shop status",
        variant: "destructive"
      });
      return false;
    }
    
    // Add the status field to the update
    const { error } = await supabase
      .from('shops')
      .update({ 
        status: status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', shopId);
      
    if (error) {
      console.error('Error updating shop status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update shop status",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Status Updated",
      description: `Shop status updated to ${status}`
    });
    
    return true;
  } catch (error) {
    console.error('Error updating shop status:', error);
    toast({
      title: "Update Failed",
      description: "An error occurred while updating shop status",
      variant: "destructive"
    });
    return false;
  }
};

// Create a new shop as admin (simplified for now)
export const createShopAsAdmin = async (shopData: Partial<Shop>): Promise<boolean> => {
  // Dev mode always succeeds
  if (import.meta.env.DEV) {
    toast({
      title: "Shop Created",
      description: "New shop created successfully (development mode)"
    });
    return true;
  }
  
  return false;
};

// Make a user an admin (simplified for now)
export const makeUserAdmin = async (
  userId: string, 
  role: 'super_admin' | 'admin' | 'moderator' = 'admin'
): Promise<boolean> => {
  // Dev mode always succeeds
  if (import.meta.env.DEV) {
    toast({
      title: "Admin Created",
      description: `User granted ${role} privileges (development mode)`
    });
    return true;
  }
  
  return false;
};

// Get current admin user (simplified for now)
export const getAdminUser = async (): Promise<Admin | null> => {
  // In development mode, return mock super admin
  if (import.meta.env.DEV) {
    return {
      id: '1',
      user_id: 'dev-user',
      role: 'super_admin',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      permissions: []
    };
  }
  
  return null;
};
