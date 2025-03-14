
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip: string
          role: string
          avatar_url: string
          created_at: string
          updated_at: string
          shop_name?: string
          shop_description?: string
          shop_category?: string
          shop_location?: string
          shop_logo?: string
        }
        Insert: {
          id: string
          name: string
          email: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          role: string
          avatar_url?: string
          created_at: string
          updated_at: string
          shop_name?: string
          shop_description?: string
          shop_category?: string
          shop_location?: string
          shop_logo?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          role?: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
          shop_name?: string
          shop_description?: string
          shop_category?: string
          shop_location?: string
          shop_logo?: string
        }
      }
      shops: {
        Row: {
          id: string
          name: string
          description: string
          logo_url: string
          category: string
          location: string
          rating: number
          product_count: number
          is_verified: boolean
          owner_id: string
          created_at: string
          updated_at: string
          latitude?: number
          longitude?: number
          cover_image?: string
          delivery_available?: boolean
          pickup_available?: boolean
          is_halal_certified?: boolean
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          images: string[]
          category: string
          shop_id: string
          stock: number
          created_at: string
          updated_at: string
          isHalalCertified?: boolean
          inStock?: boolean
          rating?: number
        }
      }
      seller_accounts: {
        Row: {
          id: string
          user_id: string
          shop_id: string
          account_type: string
          account_name: string
          account_number: string
          bank_name: string
          paypal_email: string | null
          stripe_account_id: string | null
          applepay_merchant_id: string | null
          is_active: boolean
          is_verified: boolean
          balance: number
          currency: string
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
