
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from "@/models/product"
import { Shop } from "@/models/shop"

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
 * Normalize a Product object to use both snake_case and camelCase properties
 * This helps with TypeScript compatibility during the transition
 */
export function normalizeProduct(product: any): Product {
  return {
    ...product,
    // Ensure snake_case properties exist
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images || [],
    category: product.category,
    shop_id: product.shop_id || product.shopId,
    is_halal_certified: product.is_halal_certified || product.isHalalCertified || false,
    in_stock: product.in_stock || product.inStock || true,
    created_at: product.created_at || product.createdAt,
    updated_at: product.updated_at || product.updatedAt,
    seller_id: product.seller_id || product.sellerId,
    seller_name: product.seller_name || product.sellerName,
    // Ensure camelCase properties exist
    shopId: product.shop_id || product.shopId,
    isHalalCertified: product.is_halal_certified || product.isHalalCertified || false,
    inStock: product.in_stock || product.inStock || true,
    createdAt: product.created_at || product.createdAt,
    updatedAt: product.updated_at || product.updatedAt,
    sellerId: product.seller_id || product.sellerId,
    sellerName: product.seller_name || product.sellerName,
  };
}

/**
 * Normalize a Shop object to ensure it has all required properties
 * regardless of whether it comes from the database or local model
 */
export function normalizeShop(shop: any): Shop {
  return {
    ...shop,
    // Ensure snake_case properties exist
    id: shop.id,
    name: shop.name,
    description: shop.description,
    location: shop.location,
    rating: shop.rating || 0,
    product_count: shop.product_count || shop.productCount || 0,
    is_verified: shop.is_verified || shop.isVerified || false,
    category: shop.category,
    logo_url: shop.logo_url || shop.logo || null,
    cover_image: shop.cover_image || shop.coverImage || null,
    owner_id: shop.owner_id || shop.ownerId || null,
    // Ensure camelCase properties exist
    logo: shop.logo_url || shop.logo || null,
    coverImage: shop.cover_image || shop.coverImage || null,
    ownerId: shop.owner_id || shop.ownerId || null,
    productCount: shop.product_count || shop.productCount || 0,
    isVerified: shop.is_verified || shop.isVerified || false,
    latitude: shop.latitude || null,
    longitude: shop.longitude || null,
    distance: shop.distance || null,
  };
}
