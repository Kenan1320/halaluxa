
import { supabase } from '@/integrations/supabase/client';
import { abuOmarProducts } from '@/data/abuOmarProducts';
import { getShopById } from '@/services/shopService';
import { mapModelToDbProduct } from '@/models/product';

// Function to add products to a specific shop
export async function addProductsToAbuOmarShop() {
  try {
    // Find Abu Omar Shop in the database
    const shopName = "Abu Omar Halal";
    const { data: shops, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .ilike('name', `%${shopName}%`)
      .limit(1);
    
    if (shopError || !shops || shops.length === 0) {
      console.error('Error finding Abu Omar shop:', shopError);
      return false;
    }
    
    const shopId = shops[0].id;
    console.log(`Found shop "${shopName}" with ID: ${shopId}`);
    
    // Update products with correct shop ID
    const productsToAdd = abuOmarProducts.map(product => ({
      ...product,
      sellerId: shopId
    }));
    
    // Check if products already exist to avoid duplicates
    const { data: existingProducts, error: existingError } = await supabase
      .from('products')
      .select('name')
      .eq('business_owner_id', shopId);
    
    if (existingError) {
      console.error('Error checking existing products:', existingError);
      return false;
    }
    
    const existingNames = existingProducts.map(p => p.name);
    const newProducts = productsToAdd.filter(p => !existingNames.includes(p.name));
    
    if (newProducts.length === 0) {
      console.log('All products already exist for this shop.');
      return true;
    }
    
    // Convert products to database format
    const dbProducts = newProducts.map(product => {
      const dbProduct = mapModelToDbProduct(product);
      return {
        ...dbProduct,
        business_owner_id: shopId,
        business_owner_name: product.sellerName,
        is_featured: product.isFeatured || false
      };
    });
    
    // Insert products into the database
    const { data, error } = await supabase
      .from('products')
      .insert(dbProducts);
    
    if (error) {
      console.error('Error inserting products:', error);
      return false;
    }
    
    console.log(`Successfully added ${newProducts.length} products to Abu Omar shop.`);
    return true;
  } catch (err) {
    console.error('Error in addProductsToAbuOmarShop:', err);
    return false;
  }
}

// Export a function to check if products exist and add them if not
export async function ensureAbuOmarProducts() {
  try {
    // Find Abu Omar Shop in the database
    const shopName = "Abu Omar Halal";
    const { data: shops, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .ilike('name', `%${shopName}%`)
      .limit(1);
    
    if (shopError || !shops || shops.length === 0) {
      console.error('Shop not found. Please create an Abu Omar Halal shop first.');
      return false;
    }
    
    const shopId = shops[0].id;
    
    // Check if products already exist
    const { data: existingProducts, error: existingError } = await supabase
      .from('products')
      .select('name')
      .eq('business_owner_id', shopId);
    
    if (existingError) {
      console.error('Error checking existing products:', existingError);
      return false;
    }
    
    // If there are fewer products than expected, add the missing ones
    if (existingProducts.length < abuOmarProducts.length) {
      return await addProductsToAbuOmarShop();
    } else {
      console.log('Abu Omar products are already in the database');
      return true;
    }
  } catch (err) {
    console.error('Error in ensureAbuOmarProducts:', err);
    return false;
  }
}
