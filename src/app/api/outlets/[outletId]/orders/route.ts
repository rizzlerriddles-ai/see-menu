// ============================================================================
// API ROUTE: POST /api/outlets/{outlet_id}/orders
// Create order from customer menu
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface OrderItem {
  dish_id: string
  dish_name: string
  price: number
  quantity: number
  dish_variant_id?: string
}

interface CreateOrderRequest {
  items: OrderItem[]
  table_number?: string
  customer_phone?: string
  customer_email?: string
  customer_name?: string
  special_instructions?: string
  customer_token?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: { outletId: string } }
) {
  try {
    const body: CreateOrderRequest = await request.json()
    const outletId = params.outletId
    const {
      items,
      table_number,
      customer_phone,
      customer_email,
      customer_name,
      special_instructions,
      customer_token,
    } = body

    // Validate input
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    // Get outlet
    const { data: outlet, error: outletError } = await supabase
      .from('outlets')
      .select('id, restaurant_id')
      .eq('id', outletId)
      .single()

    if (outletError || !outlet) {
      return NextResponse.json(
        { error: 'Outlet not found' },
        { status: 404 }
      )
    }

    // Find or create customer
    let customerId: string | null = null
    if (customer_phone || customer_email) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('restaurant_id', outlet.restaurant_id)
        .eq('phone_number', customer_phone || '')
        .single()

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        const token = customer_token || uuidv4().toString()
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            restaurant_id: outlet.restaurant_id,
            phone_number: customer_phone,
            email_address: customer_email,
            customer_token: token,
            full_name: customer_name,
            opted_for_updates: true,
          })
          .select()
          .single()

        if (customerError) console.error('Customer creation error:', customerError)
        else customerId = newCustomer?.id
      }
    }

    // Find table if provided
    let tableId: string | null = null
    if (table_number) {
      const { data: table } = await supabase
        .from('tables')
        .select('id')
        .eq('outlet_id', outletId)
        .eq('table_number', table_number)
        .single()

      tableId = table?.id || null
    }

    // Calculate totals
    let subtotal = 0
    items.forEach((item) => {
      subtotal += item.price * item.quantity
    })

    // Apply tax (18% GST for India)
    const tax = Math.round(subtotal * 0.18 * 100) / 100
    const total = subtotal + tax

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        outlet_id: outletId,
        customer_id: customerId,
        table_id: tableId,
        table_number: table_number,
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        tax,
        total_amount: total,
        special_instructions,
        customer_phone,
        customer_email,
        customer_name,
        source: 'qr_menu',
        user_agent: request.headers.get('user-agent'),
        ip_address: request.ip,
      })
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    for (const item of items) {
      await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          dish_id: item.dish_id,
          dish_name: item.dish_name,
          price: item.price,
          quantity: item.quantity,
          dish_variant_id: item.dish_variant_id,
          item_total: item.price * item.quantity,
        })
    }

    // Log analytics event
    await supabase
      .from('analytics_events')
      .insert({
        outlet_id: outletId,
        event_type: 'order_placed',
        customer_id: customerId,
        customer_token: customer_token,
        metadata: {
          order_id: order.id,
          item_count: items.length,
        },
      })

    return NextResponse.json({
      order,
      message: 'Order created successfully',
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
