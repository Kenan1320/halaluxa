
import { supabase } from '@/integrations/supabase/client';
import { AdminUser, AdminPermission, AuditLog, AdminRole } from '@/types/shop';
import { Shop } from '@/models/shop';
import { DatabaseProfile } from '@/types/database';
import { Product } from '@/models/product';

// Check if current user is an admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check if admin table exists and if the user is in it
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error || !data) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    // Update last login
    await supabase
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);
      
    return true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Get admin permissions
export const getAdminPermissions = async (): Promise<AdminPermission[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    // Get admin record
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (adminError || !admin) {
      console.error("Error getting admin record:", adminError);
      return [];
    }
    
    // Get permissions for that role
    const { data: permissions, error: permError } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('role', admin.role);
      
    if (permError) {
      console.error("Error getting permissions:", permError);
      return [];
    }
    
    return permissions as unknown as AdminPermission[];
  } catch (error) {
    console.error('Error getting admin permissions:', error);
    return [];
  }
};

// Get admin role
export const getAdminRole = async (): Promise<AdminRole | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single();
      
    if (error || !data) {
      console.error("Error getting admin role:", error);
      return null;
    }
    
    return data.role as AdminRole;
  } catch (error) {
    console.error('Error getting admin role:', error);
    return null;
  }
};

// Log admin action
export const logAdminAction = async (
  action: string,
  resource: string,
  resourceId: string,
  details: any
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single();
      
    if (!admin) {
      console.error("Admin record not found");
      return;
    }
    
    await supabase.from('audit_logs').insert({
      admin_id: admin.id,
      action,
      resource,
      resource_id: resourceId,
      details,
      ip_address: 'client-side' // We can't reliably get IP on client side
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

// Get all shops (with filters for admin)
export const getAllShops = async (
  status?: 'pending' | 'approved' | 'rejected' | 'suspended'
): Promise<Shop[]> => {
  try {
    let query = supabase
      .from('shops')
      .select('*');
      
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error getting shops:", error);
      throw error;
    }
    
    return data as Shop[];
  } catch (error) {
    console.error('Error getting shops:', error);
    return [];
  }
};

// Update shop status
export const updateShopStatus = async (
  shopId: string,
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shops')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', shopId);
      
    if (error) {
      console.error("Error updating shop status:", error);
      throw error;
    }
    
    // Log this action
    await logAdminAction(
      'update_status',
      'shops',
      shopId,
      { status }
    );
    
    return true;
  } catch (error) {
    console.error('Error updating shop status:', error);
    return false;
  }
};

// Create a shop for a user (admin function)
export const createShopForUser = async (
  userEmail: string,
  shopData: Partial<Shop>
): Promise<{ success: boolean; message: string; shop?: Shop }> => {
  try {
    // Check if user exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single();
      
    if (profileError) {
      // User doesn't exist, create new user
      const tempPassword = `Temp${Math.random().toString(36).substring(2, 10)}!`;
      
      // This would require admin privileges or a server function
      // For now, return an error suggesting to create the user first
      return { 
        success: false, 
        message: "Cannot create users from the client. Please create the user account first." 
      };
    } else {
      // User exists, create shop for existing user
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .insert({
          name: shopData.name,
          description: shopData.description || `${shopData.name} shop`,
          location: shopData.location || 'TBD',
          category: shopData.category || 'Others',
          logo_url: shopData.logo_url || '/placeholder.svg',
          owner_id: profile.id,
          status: 'approved', // Admin created shops are pre-approved
          is_verified: true, // Admin created shops are verified
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (shopError) {
        console.error("Error creating shop:", shopError);
        return { 
          success: false, 
          message: `Failed to create shop: ${shopError.message}` 
        };
      }
      
      await logAdminAction(
        'create_shop',
        'shops',
        shop.id,
        { shop, existing_user: true }
      );
      
      return { 
        success: true, 
        message: `Shop created successfully for existing user`,
        shop 
      };
    }
  } catch (error: any) {
    console.error('Error creating shop for user:', error);
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
};

// Get all users (for admin)
export const getAllUsers = async (): Promise<DatabaseProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) {
      console.error("Error getting users:", error);
      throw error;
    }
    
    return data as DatabaseProfile[];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Manage product status (enable/disable)
export const updateProductStatus = async (
  productId: string,
  isPublished: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ 
        is_published: isPublished,
        updated_at: new Date().toISOString() 
      })
      .eq('id', productId);
      
    if (error) {
      console.error("Error updating product status:", error);
      throw error;
    }
    
    await logAdminAction(
      isPublished ? 'enable_product' : 'disable_product',
      'products',
      productId,
      { is_published: isPublished }
    );
    
    return true;
  } catch (error) {
    console.error('Error updating product status:', error);
    return false;
  }
};

// Get all products (admin view)
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        shops:shop_id (name)
      `);
      
    if (error) {
      console.error("Error getting products:", error);
      throw error;
    }
    
    return data.map(product => ({
      ...product,
      seller_name: product.shops?.name
    })) as unknown as Product[];
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
};

// Get audit logs
export const getAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    // This requires the audit_logs table to be created
    // For now, return an empty array
    console.log("Audit logs feature not fully implemented yet");
    return [];
  } catch (error) {
    console.error('Error getting audit logs:', error);
    return [];
  }
};

// Check if user is admin and create admin record if needed
export const ensureAdminUser = async (): Promise<boolean> => {
  // In development, we'll create an admin user for testing
  if (import.meta.env.DEV) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      // See if this user is already an admin
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (adminError && adminError.code === 'PGRST116') {
        // Not found, create admin record
        const { error: insertError } = await supabase
          .from('admins')
          .insert({
            user_id: user.id,
            role: 'admin',
            last_login: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating admin record:', insertError);
          return false;
        }
        
        console.log('Created admin account for development');
        return true;
      }
      
      return !!admin;
    } catch (error) {
      console.error('Error ensuring admin user:', error);
      return false;
    }
  }
  
  return false;
};
