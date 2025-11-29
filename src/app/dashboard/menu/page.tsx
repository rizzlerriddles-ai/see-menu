'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCurrentUserRestaurant } from '@/lib/auth'
import type { Category } from '@/lib/supabase'

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [outlets, setOutlets] = useState<any[]>([])
  const [selectedOutlet, setSelectedOutlet] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRestaurant = await getCurrentUserRestaurant()
        if (!userRestaurant) return

        // Load outlets
        const { data: outletsData } = await supabase
          .from('outlets')
          .select('*')
          .eq('restaurant_id', userRestaurant.restaurant_id)

        if (outletsData && outletsData.length > 0) {
          setOutlets(outletsData)
          setSelectedOutlet(outletsData[0].id)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      if (!selectedOutlet) return

      try {
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('outlet_id', selectedOutlet)
          .order('display_order')

        if (categoriesData) {
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [selectedOutlet])

  const handleDelete = async (categoryId: string) => {
    try {
      await supabase.from('categories').delete().eq('id', categoryId)
      setCategories(categories.filter((c) => c.id !== categoryId))
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting category:', error)
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-1">Menu Management</h1>
          <p className="text-gray-600">Create and manage categories and dishes</p>
        </div>
        <Link href={`/dashboard/menu/categories/new?outlet=${selectedOutlet}`}>
          <motion.button
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            New Category
          </motion.button>
        </Link>
      </motion.div>

      {/* Outlet Selector */}
      {outlets.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg p-4 shadow-sm"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Outlet
          </label>
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.name}
              </option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Categories List */}
      <motion.div
        className="grid gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No categories yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first menu category to get started
            </p>
            <Link href={`/dashboard/menu/categories/new?outlet=${selectedOutlet}`}>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold">
                Create First Category
              </button>
            </Link>
          </div>
        ) : (
          categories.map((category, idx) => (
            <motion.div
              key={category.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-secondary mb-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Order: {category.display_order}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/menu/categories/${category.id}/edit`}>
                    <motion.button
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit2 size={18} />
                    </motion.button>
                  </Link>

                  <motion.button
                    onClick={() => setShowDeleteConfirm(category.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={18} />
                  </motion.button>

                  <Link href={`/dashboard/menu/dishes?category=${category.id}`}>
                    <motion.button
                      className="p-2 bg-primary text-white rounded-lg hover:bg-green-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronDown size={18} />
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm === category.id && (
                <motion.div
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <p className="text-sm text-red-800 mb-3">
                    Are you sure? This will delete the category and all its dishes.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
