
import { supabase } from '@/integrations/supabase/client';
import { Admin, AdminPermission, Shop, Product, DatabaseProfile } from '@/types/database';
import { toast } from '@/hooks/use-toast';

// Create a function to ensure an admin exists in development mode
export const ensureAdminUser = async () => {
  try {
    if (import.meta.env.DEV) {
      // Check if the current user exists and make them an admin in dev mode
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if already an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (adminError && adminError.code !== 'PGRST116') {
          console.error('Error checking admin status:', adminError);
        }
        
        // If not an admin, make them an admin in dev mode
        if (!adminData) {
          const { error: insertError } = await supabase
            .from('admins')
            .insert({
              user_id: user.id,
              role: 'super_admin',
              last_login: new Date().toISOString()
            });
            
          if (insertError) {
            if (insertError.code === '42P01') {
              console.warn('Admin tables not created yet. Please run the SQL to create them first.');
              return false;
            }
            console.error('Error creating admin user:', insertError);
            return false;
          }
          
          console.log('Created admin user in dev mode');
          return true;
        }
        
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    return false;
  }
};

// Check if a user is an admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    // In development mode, always grant admin access
    if (import.meta.env.DEV) {
      return true;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return false; // No admin found
      }
      console.error('Error checking admin status:', error);
      return false;
    }
    
    // Update last login
    const { error: updateError } = await supabase
      .from('admins')
      .update({ 
        last_login: new Date().toISOString() 
      })
      .eq('id', data.id);
      
    if (updateError) {
      console.error('Error updating last login:', updateError);
    }
    
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
    
    // In development mode, grant all permissions
    if (import.meta.env.DEV) {
      const allPermissions: AdminPermission[] = [
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
        },
        // ... repeat for all resources
      ];
      
      // Add permissions for all resources
      ['products', 'users', 'orders', 'system'].forEach((resource, index) => {
        allPermissions.push({
          id: String(index + 2),
          admin_id: '1',
          role: 'super_admin',
          resource: resource as any,
          can_create: true,
          can_read: true,
          can_update: true,
          can_delete: true,
          created_at: new Date().toISOString()
        });
      });
      
      return allPermissions;
    }
    
    // Get admin record
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (adminError) {
      console.error('Error fetching admin:', adminError);
      return [];
    }
    
    if (!adminData) return [];
    
    // Get permissions
    const { data: permissions, error: permissionsError } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('admin_id', adminData.id);
      
    if (permissionsError) {
      console.error('Error fetching permissions:', permissionsError);
      return [];
    }
    
    // If permissions are empty but user is admin, grant default permissions
    if (!permissions || permissions.length === 0) {
      if (adminData.role === 'super_admin') {
        // Return default super admin permissions
        return [
          {
            id: '1',
            admin_id: adminData.id,
            role: 'super_admin',
            resource: 'shops',
            can_create: true,
            can_read: true,
            can_update: true,
            can_delete: true,
            created_at: new Date().toISOString()
          },
          // ... add more default permissions
        ];
      }
    }
    
    return permissions as AdminPermission[];
  } catch (error) {
    console.error('Error getting admin permissions:', error);
    return [];
  }
};

// Check if user has specific permission
export const hasPermission = async (
  resource: 'shops' | 'products' | 'users' | 'orders' | 'system',
  action: 'create' | 'read' | 'update' | 'delete'
): Promise<boolean> => {
  try {
    // In development mode, always grant permission
    if (import.meta.env.DEV) {
      return true;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error('Error checking admin permissions:', error);
      return false;
    }
    
    if (!data) return false;
    
    // Super admin has all permissions
    if (data.role === 'super_admin') return true;
    
    // Check specific permission
    const permissions = await getAdminPermissions();
    const permission = permissions.find(p => p.resource === resource);
    
    if (!permission) return false;
    
    switch (action) {
      case 'create': return permission.can_create;
      case 'read': return permission.can_read;
      case 'update': return permission.can_update;
      case 'delete': return permission.can_delete;
      default: return false;
    }
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
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
    
    return data as Shop[];
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
    
    return data as Product[];
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
    
    const { error } = await supabase
      .from('shops')
      .update({ status })
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

// Create a new shop as admin
export const createShopAsAdmin = async (shopData: Partial<Shop>): Promise<boolean> => {
  try {
    if (!await hasPermission('shops', 'create')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create shops",
        variant: "destructive"
      });
      return false;
    }
    
    // Ensure required fields
    if (!shopData.name || !shopData.owner_id) {
      toast({
        title: "Missing Data",
        description: "Shop name and owner ID are required",
        variant: "destructive"
      });
      return false;
    }
    
    // Set defaults
    const newShop = {
      ...shopData,
      status: 'approved' as const, // Admin-created shops are approved by default
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('shops')
      .insert(newShop);
      
    if (error) {
      console.error('Error creating shop:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create shop",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Shop Created",
      description: "New shop created successfully"
    });
    
    return true;
  } catch (error) {
    console.error('Error creating shop:', error);
    toast({
      title: "Creation Failed",
      description: "An error occurred while creating the shop",
      variant: "destructive"
    });
    return false;
  }
};

// Make a user an admin
export const makeUserAdmin = async (
  userId: string, 
  role: 'super_admin' | 'admin' | 'moderator' = 'admin'
): Promise<boolean> => {
  try {
    // Only in dev mode or if already super admin
    if (import.meta.env.DEV || (await getAdminUser())?.role === 'super_admin') {
      // Check if already an admin
      const { data, error: checkError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking admin status:', checkError);
        return false;
      }
      
      if (data) {
        // Update role if already admin
        const { error: updateError } = await supabase
          .from('admins')
          .update({ role })
          .eq('id', data.id);
          
        if (updateError) {
          console.error('Error updating admin role:', updateError);
          return false;
        }
      } else {
        // Create new admin
        const { error: insertError } = await supabase
          .from('admins')
          .insert({
            user_id: userId,
            role,
            last_login: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Error creating admin:', insertError);
          return false;
        }
      }
      
      return true;
    } else {
      toast({
        title: "Permission Denied",
        description: "Only super admins can grant admin privileges",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error('Error making user admin:', error);
    return false;
  }
};

// Get current admin user
export const getAdminUser = async (): Promise<Admin | null> => {
  try {
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
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching admin user:', error);
      return null;
    }
    
    return data as Admin;
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
};
