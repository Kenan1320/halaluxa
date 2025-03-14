
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Convert snake_case to camelCase for object keys
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case for object keys
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Normalize a Shop object to ensure it has all required properties
 * regardless of whether it comes from the database or local model
 */
export function normalizeShop(shop: any): any {
  // Handle type conversion between database Shop and model Shop
  return {
    ...shop,
    id: shop.id,
    name: shop.name,
    description: shop.description,
    location: shop.location,
    rating: shop.rating || 0,
    productCount: shop.product_count || shop.productCount || 0,
    isVerified: shop.is_verified || shop.isVerified || false,
    category: shop.category,
    logo: shop.logo || shop.logo_url || null,
    coverImage: shop.cover_image || shop.coverImage || null,
    ownerId: shop.owner_id || shop.ownerId || null,
    latitude: shop.latitude || null,
    longitude: shop.longitude || null,
    distance: shop.distance || null,
  };
}

