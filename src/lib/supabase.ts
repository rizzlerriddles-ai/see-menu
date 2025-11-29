// ============================================================================
// SUPABASE CLIENT & UTILITIES
// ============================================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// SECURE API CALLS (for SSR & API routes)
// ============================================================================

export async function getSupabaseServerClient() {
  const { createClient } = await import('@supabase/supabase-js')
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// ============================================================================
// AUTHENTICATION HELPERS
// ============================================================================

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data?.session
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user
}

// ============================================================================
// DATABASE HELPERS
// ============================================================================

export interface Restaurant {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  logo_url?: string
  subscription_plan: 'starter' | 'growth' | 'pro'
  subscription_status: 'active' | 'trial' | 'inactive'
  currency: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface Outlet {
  id: string
  restaurant_id: string
  name: string
  slug: string
  address: string
  phone?: string
  opening_time: string
  closing_time: string
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  outlet_id: string
  name: string
  description?: string
  image_url?: string
  display_order: number
  is_active: boolean
}

export interface Dish {
  id: string
  outlet_id: string
  category_id?: string
  name: string
  description?: string
  image_url?: string
  price: number
  discount_price?: number
  is_vegetarian: boolean
  is_vegan?: boolean
  is_gluten_free?: boolean
  is_available: boolean
  view_count: number
  cart_add_count: number
  created_at: string
}

export interface Table {
  id: string
  outlet_id: string
  table_number: string
  qr_code_deep_link: string
  qr_code_image_url?: string
  capacity: number
  is_active: boolean
}

export interface Order {
  id: string
  outlet_id: string
  customer_id?: string
  table_number?: string
  order_number: string
  status: 'pending' | 'accepted' | 'preparing' | 'served' | 'completed' | 'cancelled'
  total_amount: number
  created_at: string
}

export interface Customer {
  id: string
  restaurant_id: string
  phone_number?: string
  email_address?: string
  customer_token: string
  total_orders: number
  total_spent: number
  created_at: string
}

// ============================================================================
// API UTILITY FUNCTIONS
// ============================================================================

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const session = await getSession()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw error
  return data
}

export async function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data?.publicUrl
}

// ============================================================================
// LOCAL STORAGE HELPERS
// ============================================================================

export function getCustomerToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('customer_token')
}

export function setCustomerToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('customer_token', token)
  }
}

export function clearCustomerToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('customer_token')
  }
}

export function getCart() {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export function setCart(items: any[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items))
  }
}

export function clearCart(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cart')
  }
}
