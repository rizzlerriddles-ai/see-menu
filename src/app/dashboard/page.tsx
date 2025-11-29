'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Eye,
  Clock,
  ArrowRight,
  Plus,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCurrentUserRestaurant } from '@/lib/auth'

interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  todayVisits: number
  topDish: { name: string; orders: number } | null
  pendingOrders: number
  averageOrderValue: number
}

const DashboardItem = ({
  icon: Icon,
  label,
  value,
  trend,
  color = 'primary',
}: {
  icon: React.ComponentType<any>
  label: string
  value: string | number
  trend?: string
  color?: 'primary' | 'secondary' | 'red' | 'yellow'
}) => {
  const colorClasses = {
    primary: 'bg-green-50 text-primary',
    secondary: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <motion.div
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
      whileHover={{ y: -4 }}
    >
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-secondary mb-2">{value}</p>
      {trend && (
        <p className={`text-sm font-medium ${trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      )}
    </motion.div>
  )
}

export default function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    todayVisits: 0,
    topDish: null,
    pendingOrders: 0,
    averageOrderValue: 0,
  })
  const [restaurant, setRestaurant] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Get restaurant data
        const userRestaurant = await getCurrentUserRestaurant()
        if (!userRestaurant) return

        setRestaurant(userRestaurant.restaurants)

        // Get today's orders
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { data: todaysOrders, error: ordersError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('outlet_id', userRestaurant.restaurants.id)
          .gte('created_at', today.toISOString())

        if (!ordersError && todaysOrders) {
          const totalOrders = todaysOrders.length
          const totalRevenue = todaysOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
          const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

          setStats((prev) => ({
            ...prev,
            todayOrders: totalOrders,
            todayRevenue: totalRevenue,
            pendingOrders: todaysOrders.filter((o) => o.status === 'pending').length,
            averageOrderValue: avgOrderValue,
          }))

          // Get recent orders for display
          setRecentOrders(todaysOrders.slice(0, 5))
        }

        // Get today's menu views
        const { data: analyticsEvents } = await supabase
          .from('analytics_events')
          .select('*')
          .eq('event_type', 'menu_viewed')
          .gte('created_at', today.toISOString())

        if (analyticsEvents) {
          setStats((prev) => ({
            ...prev,
            todayVisits: analyticsEvents.length,
          }))
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-1">Welcome back, {restaurant?.name}!</h1>
          <p className="text-gray-600">Here's what's happening today</p>
        </div>
        <Link href="/dashboard/settings" className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
          <Settings size={24} className="text-gray-700" />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <DashboardItem
          icon={ShoppingCart}
          label="Today's Orders"
          value={stats.todayOrders}
          trend={`${stats.pendingOrders} pending`}
        />
        <DashboardItem
          icon={BarChart3}
          label="Today's Revenue"
          value={`₹${stats.todayRevenue.toFixed(0)}`}
          trend="+12% from yesterday"
          color="secondary"
        />
        <DashboardItem
          icon={Eye}
          label="Menu Views"
          value={stats.todayVisits}
          trend="from QR scans"
          color="yellow"
        />
        <DashboardItem
          icon={TrendingUp}
          label="Avg Order Value"
          value={`₹${stats.averageOrderValue.toFixed(0)}`}
          trend="+5% growth"
          color="red"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          {
            icon: Plus,
            title: 'Add New Dish',
            description: 'Add dishes to your menu',
            href: '/dashboard/menu/dishes/new',
            color: 'bg-green-50 text-primary',
          },
          {
            icon: ShoppingCart,
            title: 'View Orders',
            description: 'Manage incoming orders',
            href: '/dashboard/orders',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            icon: BarChart3,
            title: 'Analytics',
            description: 'View detailed insights',
            href: '/dashboard/analytics',
            color: 'bg-purple-50 text-purple-600',
          },
        ].map((action, idx) => (
          <Link key={idx} href={action.href}>
            <motion.div
              className={`${action.color} rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <action.icon size={32} className="mb-3" />
              <h3 className="font-bold text-lg mb-1">{action.title}</h3>
              <p className="text-sm opacity-75">{action.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-semibold">Get Started</span>
                <ArrowRight size={16} />
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        className="bg-white rounded-lg shadow-sm p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-primary font-medium hover:underline">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No orders yet today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                whileHover={{ x: 4 }}
              >
                <div className="flex-1">
                  <p className="font-semibold text-secondary">{order.order_number}</p>
                  <p className="text-sm text-gray-600">
                    Table {order.table_number} • {order.order_items?.length || 0} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{order.total_amount.toFixed(0)}</p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Empty State Onboarding */}
      {stats.todayOrders === 0 && (
        <motion.div
          className="bg-gradient-to-r from-primary to-green-600 rounded-lg p-8 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-2">Get Your First Order!</h3>
          <p className="mb-4">
            Start by creating your menu and generating QR codes for your tables.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/menu/categories" className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
              Create Menu
            </Link>
            <Link href="/dashboard/qr-codes" className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10">
              Generate QR Codes
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
