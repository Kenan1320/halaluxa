
import { supabase } from '@/integrations/supabase/client';

export async function createAbuOmarShop() {
  try {
    // Check if Abu Omar shop already exists
    const { data: existingShops, error: existingError } = await supabase
      .from('shops')
      .select('id, name')
      .ilike('name', '%Abu Omar%')
      .limit(1);
    
    if (existingError) {
      console.error('Error checking for existing shop:', existingError);
      return null;
    }
    
    if (existingShops && existingShops.length > 0) {
      console.log('Abu Omar shop already exists with ID:', existingShops[0].id);
      return existingShops[0].id;
    }
    
    // Create the shop if it doesn't exist
    const newShop = {
      name: 'Abu Omar Halal',
      description: 'Authentic Middle Eastern cuisine featuring halal meat options. Our menu includes shawarma wraps, rice bowls, kabobs, and more.',
      category: 'Food & Groceries',
      location: 'Houston, TX',
      isVerified: true,
      rating: 4.8,
      productCount: 8,
      logo: '/lovable-uploads/b7391005-ab3c-4698-85d5-1192b4fc4df6.png', // Using an existing logo image
      coverImage: '/lovable-uploads/d4ab324c-23f0-4fcc-9069-0afbc77d1c3e.png', // Using an existing cover image
      // Add other required fields as needed
    };
    
    const { data, error } = await supabase
      .from('shops')
      .insert(newShop)
      .select();
    
    if (error) {
      console.error('Error creating Abu Omar shop:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      console.log('Successfully created Abu Omar shop with ID:', data[0].id);
      return data[0].id;
    }
    
    return null;
  } catch (err) {
    console.error('Error in createAbuOmarShop:', err);
    return null;
  }
}

// Function to ensure the shop exists
export async function ensureAbuOmarShop() {
  return await createAbuOmarShop();
}
