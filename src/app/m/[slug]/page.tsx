'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Plus, Minus, Phone, Mail, Bell } from 'lucide-react'
import Link from 'next/link'
import { supabase, getCustomerToken, setCustomerToken, getCart, setCart, clearCart } from '@/lib/supabase'
import type { Outlet, Category, Dish } from '@/lib/supabase'

interface CartItem {
  dishId: string
  name: string
  price: number
  quantity: number
}

export default function CustomerMenu() {
  const params = useParams()
  const searchParams = useSearchParams()
  const outletSlug = params.slug as string
  const tableNumber = searchParams.get('table')

  const [outlet, setOutlet] = useState<Outlet | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setLocalCart] = useState<CartItem[]>([])
  const [showContactPrompt, setShowContactPrompt] = useState(false)
  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    name: '',
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [placing, setPlacing] = useState(false)

  // Load menu data
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setIsLoading(true)

        // Fetch outlet by slug
        const { data: outletData, error: outletError } = await supabase
          .from('outlets')
          .select('*')
          .eq('slug', outletSlug)
          .single()

        if (outletError || !outletData) {
          throw new Error('Outlet not found')
        }

        setOutlet(outletData)

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('outlet_id', outletData.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (!categoriesError && categoriesData) {
          setCategories(categoriesData)
          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0].id)
          }
        }

        // Fetch dishes
        const { data: dishesData, error: dishesError } = await supabase
          .from('dishes')
          .select('*')
          .eq('outlet_id', outletData.id)
          .eq('is_available', true)
          .order('display_order', { ascending: true })

        if (!dishesError && dishesData) {
          setDishes(dishesData)

          // Log menu view
          await supabase.from('analytics_events').insert({
            outlet_id: outletData.id,
            event_type: 'menu_viewed',
            customer_token: getCustomerToken(),
            metadata: { table_number: tableNumber },
          })
        }

        // Check if should show contact prompt
        const customerToken = getCustomerToken()
        if (!customerToken) {
          setShowContactPrompt(true)
        }

        // Load cart from localStorage
        const savedCart = getCart()
        if (savedCart.length > 0) {
          setLocalCart(savedCart)
        }
      } catch (error) {
        console.error('Error loading menu:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMenu()
  }, [outletSlug, tableNumber])

  // Handle contact submission
  const handleSaveContact = () => {
    if (contactData.phone || contactData.email) {
      const token = `token-${Date.now()}-${Math.random()}`
      setCustomerToken(token)
      setShowContactPrompt(false)

      // Store customer info (would typically be saved to DB in a real app)
      // This is handled by the order creation API
    }
  }

  // Cart functions
  const addToCart = (dish: Dish) => {
    const newCart = [...cart]
    const existing = newCart.find((item) => item.dishId === dish.id)

    if (existing) {
      existing.quantity += 1
    } else {
      newCart.push({
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1,
      })
    }

    setLocalCart(newCart)
    setCart(newCart)

    // Log analytics
    supabase.from('analytics_events').insert({
      outlet_id: outlet?.id,
      event_type: 'item_added_to_cart',
      customer_token: getCustomerToken(),
      dish_id: dish.id,
    })
  }

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      setLocalCart(cart.filter((item) => item.dishId !== dishId))
    } else {
      setLocalCart(
        cart.map((item) =>
          item.dishId === dishId ? { ...item, quantity } : item
        )
      )
    }
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(subtotal * 0.18 * 100) / 100
  const total = subtotal + tax

  // Filter dishes by category
  const filteredDishes = selectedCategory
    ? dishes.filter((d) => d.category_id === selectedCategory)
    : []

  const handlePlaceOrder = async () => {
    try {
      setPlacing(true)

      const response = await fetch(`/api/outlets/${outlet?.id}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item) => ({
            dish_id: item.dishId,
            dish_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          table_number: tableNumber,
          customer_phone: contactData.phone,
          customer_email: contactData.email,
          customer_name: contactData.name,
          customer_token: getCustomerToken(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const { order } = await response.json()
      clearCart()
      setLocalCart([])

      // Show success modal
      alert(
        `Order placed successfully!\nOrder #: ${order.order_number}\nTotal: ₹${order.total_amount}`
      )
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!outlet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
          <p className="text-gray-600">Sorry, we couldn't find the menu you're looking for.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary">{outlet.name}</h1>
            {tableNumber && (
              <p className="text-sm text-gray-600">Table {tableNumber}</p>
            )}
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-3 bg-primary rounded-lg text-white"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </motion.header>

      {/* Contact Prompt Modal */}
      <AnimatePresence>
        {showContactPrompt && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-end z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full rounded-t-2xl p-6"
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="text-primary" />
                <h2 className="text-lg font-bold">Stay Updated!</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Share your phone to get order updates & special offers
              </p>

              <input
                type="tel"
                placeholder="Phone number"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 text-sm"
              />

              <input
                type="email"
                placeholder="Email (optional)"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 text-sm"
              />

              <input
                type="text"
                placeholder="Your name"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-sm"
              />

              <button
                onClick={handleSaveContact}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Category Tabs */}
        <motion.div
          className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Dishes Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredDishes.map((dish, idx) => (
            <motion.div
              key={dish.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
            >
              {dish.image_url && (
                <img
                  src={dish.image_url}
                  alt={dish.name}
                  className="w-full h-32 object-cover"
                />
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{dish.name}</h3>
                    {dish.is_vegetarian && (
                      <span className="text-xs text-green-600">🟢 Vegetarian</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {dish.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">₹{dish.price}</p>
                  </div>
                  <motion.button
                    onClick={() => addToCart(dish)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setCartOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed bottom-0 right-0 w-full md:w-96 bg-white rounded-t-2xl shadow-2xl z-50"
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
            >
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Your Cart</h2>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.dishId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                            className="p-1 bg-gray-200 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                            className="p-1 bg-primary text-white rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>

                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {placing ? 'Placing Order...' : 'Place Order'}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
