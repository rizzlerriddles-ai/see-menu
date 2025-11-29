'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCurrentUserRestaurant } from '@/lib/auth'
import type { Order } from '@/lib/supabase'

interface OrderWithItems extends Order {
  order_items?: any[]
}

const statusColors = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
  accepted: { bg: 'bg-blue-50', text: 'text-blue-800', icon: CheckCircle, label: 'Accepted' },
  preparing: { bg: 'bg-purple-50', text: 'text-purple-800', icon: AlertCircle, label: 'Preparing' },
  served: { bg: 'bg-green-50', text: 'text-green-800', icon: CheckCircle, label: 'Served' },
  completed: { bg: 'bg-green-100', text: 'text-green-900', icon: CheckCircle, label: 'Completed' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-800', icon: AlertCircle, label: 'Cancelled' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderWithItems[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userRestaurant = await getCurrentUserRestaurant()
        if (!userRestaurant) return

        // Get all outlets for this restaurant
        const { data: outlets } = await supabase
          .from('outlets')
          .select('id')
          .eq('restaurant_id', userRestaurant.restaurant_id)

        const outletIds = outlets?.map((o) => o.id) || []

        // Get orders from all outlets
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .in('outlet_id', outletIds)
          .order('created_at', { ascending: false })
          .limit(50)

        if (!error && ordersData) {
          setOrders(ordersData)
        }
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((o) => o.status === selectedStatus))
    }
  }, [selectedStatus, orders])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      )
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

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
      >
        <h1 className="text-3xl font-bold text-secondary mb-1">Orders</h1>
        <p className="text-gray-600">Manage and track all orders</p>
      </motion.div>

      {/* Status Filter */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {['all', 'pending', 'accepted', 'preparing', 'served', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedStatus === status
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Orders List */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order, idx) => {
            const statusConfig = statusColors[order.status as keyof typeof statusColors]
            const StatusIcon = statusConfig?.icon || Clock

            return (
              <motion.div
                key={order.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="p-4 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-secondary">{order.order_number}</h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 ${statusConfig?.bg} ${statusConfig?.text}`}
                        >
                          <StatusIcon size={14} />
                          {statusConfig?.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-x-3">
                        <span>Table {order.table_number}</span>
                        <span>•</span>
                        <span>{order.order_items?.length || 0} items</span>
                        {order.customer_phone && (
                          <>
                            <span>•</span>
                            <span>{order.customer_phone}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        ₹{order.total_amount.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(order.created_at).toLocaleTimeString('en-IN')}
                      </p>
                    </div>

                    <ChevronRight
                      className={`transition-transform ml-4 ${
                        expandedOrder === order.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <motion.div
                    className="border-t bg-gray-50 p-4 space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Order Items:</h4>
                      <div className="space-y-2">
                        {order.order_items?.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm bg-white p-2 rounded"
                          >
                            <span>{item.dish_name} x{item.quantity}</span>
                            <span className="font-medium">₹{item.item_total}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Update Status:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {(['pending', 'accepted', 'preparing', 'served', 'completed', 'cancelled'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                              order.status === status
                                ? 'bg-primary text-white'
                                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-3 rounded space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{order.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>₹{order.tax?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Total:</span>
                        <span className="text-primary">₹{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}
