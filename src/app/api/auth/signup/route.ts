// ============================================================================
// API ROUTE: POST /api/auth/signup
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, restaurantName, ownerName, phone } = body

    // Validate input
    if (!email || !password || !restaurantName || !ownerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: ownerName,
        restaurant_name: restaurantName,
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
      )
    }

    // Create restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        name: restaurantName,
        email,
        phone,
        subscription_plan: 'starter',
        subscription_status: 'trial',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (restaurantError) {
      return NextResponse.json(
        { error: restaurantError.message },
        { status: 500 }
      )
    }

    // Create restaurant_users record
    const { error: userError } = await supabase
      .from('restaurant_users')
      .insert({
        restaurant_id: restaurant.id,
        auth_user_id: authData.user.id,
        email,
        full_name: ownerName,
        role: 'owner',
      })

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: authData.user,
      restaurant,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
