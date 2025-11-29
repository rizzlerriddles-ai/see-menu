'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/lib/auth'

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Menu',
    href: '/dashboard/menu',
    icon: UtensilsCrossed,
  },
  {
    label: 'QR Codes',
    href: '/dashboard/qr-codes',
    icon: QrCode,
  },
  {
    label: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/dashboard/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-screen w-64 bg-secondary text-white shadow-lg z-40 overflow-y-auto"
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b border-green-700">
          <h1 className="text-2xl font-bold font-poppins">QR Menu Pro</h1>
          <p className="text-sm text-green-100 mt-1">Restaurant Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-green-100 hover:bg-green-700'
                  }`}
                  whileHover={{ x: 4 }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-primary text-white p-4 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
