// ============================================================================
// AUTHENTICATION & AUTHORIZATION UTILITIES
// ============================================================================

import { supabase, getSession } from './supabase'

export interface AuthUser {
  id: string
  email: string
  user_metadata?: Record<string, any>
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData extends LoginCredentials {
  restaurantName: string
  ownerName: string
  phone: string
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

export async function signUp(data: SignupData) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.ownerName,
        restaurant_name: data.restaurantName,
      },
    },
  })

  if (authError) throw authError

  if (!authData.user) throw new Error('Signup failed')

  // Create restaurant record
  const { error: restaurantError } = await supabase
    .from('restaurants')
    .insert({
      name: data.restaurantName,
      email: data.email,
      phone: data.phone,
      subscription_plan: 'starter',
      subscription_status: 'trial',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    })

  if (restaurantError) throw restaurantError

  // Get the created restaurant
  const { data: restaurant, error: restaurantFetchError } = await supabase
    .from('restaurants')
    .select('*')
    .eq('email', data.email)
    .single()

  if (restaurantFetchError) throw restaurantFetchError

  // Create restaurant_users record
  const { error: userError } = await supabase
    .from('restaurant_users')
    .insert({
      restaurant_id: restaurant.id,
      auth_user_id: authData.user.id,
      email: data.email,
      full_name: data.ownerName,
      role: 'owner',
    })

  if (userError) throw userError

  return {
    user: authData.user,
    restaurant,
  }
}

export async function login(credentials: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })

  if (error) throw error

  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser(): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getUser()
  return data.user ? {
    id: data.user.id,
    email: data.user.email || '',
    user_metadata: data.user.user_metadata,
  } : null
}

export async function getCurrentUserRestaurant() {
  const user = await getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('restaurant_users')
    .select('*, restaurants(*)')
    .eq('auth_user_id', user.id)
    .single()

  if (error) return null
  return data
}

// ============================================================================
// AUTHORIZATION HELPERS
// ============================================================================

export async function canAccessRestaurant(restaurantId: string): Promise<boolean> {
  const user = await getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('restaurant_users')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .eq('auth_user_id', user.id)
    .single()

  return !!data && !error
}

export async function canAccessOutlet(outletId: string): Promise<boolean> {
  const user = await getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('outlets')
    .select('restaurant_id')
    .eq('id', outletId)
    .single()

  if (!data) return false

  return canAccessRestaurant(data.restaurant_id)
}

export async function validateRestaurantAccess(restaurantId: string): Promise<boolean> {
  try {
    return await canAccessRestaurant(restaurantId)
  } catch {
    return false
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession()
  if (error) throw error
  return data
}

// ============================================================================
// PASSWORD RESET
// ============================================================================

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
}

// ============================================================================
// OTP AUTHENTICATION (Optional)
// ============================================================================

export async function signInWithOTP(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })
  if (error) throw error
}

export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  if (error) throw error
  return data
}
