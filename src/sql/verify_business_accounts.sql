
-- SQL Migration to verify all business accounts
-- Run this in Supabase SQL Editor

-- Update all shops from business accounts to be verified
UPDATE shops
SET is_verified = true
FROM profiles
WHERE shops.owner_id = profiles.id
AND profiles.role = 'business';

-- Remove any products that aren't from business accounts
DELETE FROM products
WHERE seller_id NOT IN (
  SELECT id 
  FROM profiles 
  WHERE role = 'business'
);

-- Delete any shops that aren't from business accounts
DELETE FROM shops
WHERE owner_id NOT IN (
  SELECT id 
  FROM profiles 
  WHERE role = 'business'
);
