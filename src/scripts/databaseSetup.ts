
import { supabase } from '@/integrations/supabase/client';

export async function setupDatabase() {
  console.log('Setting up database...');
  
  try {
    // Checking for users table
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (userError) {
      console.error('Error checking profiles:', userError);
    }
    
    console.log('Profiles check result:', userData);
    
    // Checking for products table
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (productError) {
      console.error('Error checking products:', productError);
    }
    
    console.log('Products check result:', productData);
    
    // Checking for shops table
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('id')
      .limit(1);
    
    if (shopError) {
      console.error('Error checking shops:', shopError);
    }
    
    console.log('Shops check result:', shopData);
    
    // Check shop_payment_methods table
    const { data: paymentMethodData, error: paymentMethodError } = await supabase
      .from('shop_payment_methods')
      .select('id')
      .limit(1);
    
    if (paymentMethodError) {
      console.error('Error checking shop_payment_methods:', paymentMethodError);
    }
    
    console.log('Payment methods check result:', paymentMethodData);
    
    // Check shop_sales table
    const { data: salesData, error: salesError } = await supabase
      .from('shop_sales')
      .select('id')
      .limit(1);
    
    if (salesError) {
      console.error('Error checking shop_sales:', salesError);
    }
    
    console.log('Sales check result:', salesData);
    
    // Setup storage if needed
    await setupStorage();
    
    console.log('Database setup completed');
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    return false;
  }
}

async function setupStorage() {
  try {
    // Check if required storage buckets exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error checking storage buckets:', bucketsError);
      return false;
    }
    
    // Check if 'public' bucket exists, create if not
    const publicBucketExists = buckets.some(bucket => bucket.name === 'public');
    if (!publicBucketExists) {
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('public', {
          public: true
        });
      
      if (createBucketError) {
        console.error('Error creating public bucket:', createBucketError);
      }
    }
    
    console.log('Storage setup completed');
    return true;
  } catch (error) {
    console.error('Storage setup failed:', error);
    return false;
  }
}

// Run the database setup
setupDatabase();
