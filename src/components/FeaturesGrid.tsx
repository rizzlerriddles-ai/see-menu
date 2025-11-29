'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QrCode, ShoppingCart, Edit3, CreditCard, MessageSquare, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: 'QR Menu',
    description: 'Generate and manage digital menus. Customers scan to order without apps.',
  },
  {
    icon: ShoppingCart,
    title: 'Online Ordering',
    description: 'Support Dine-in, Pickup, and Delivery modes all in one platform.',
  },
  {
    icon: Edit3,
    title: 'Menu Editing',
    description: 'Add photos, set prices, variants, and toppings. Update instantly.',
  },
  {
    icon: CreditCard,
    title: 'Payments Integration',
    description: 'Accept UPI, Wallets, and Cards. Track revenue in real-time.',
  },
  {
    icon: MessageSquare,
    title: 'Feedback & Loyalty',
    description: 'Collect feedback and build loyalty programs to retain customers.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Ordering',
    description: 'Customers can place orders directly via WhatsApp messaging.',
  },
]

export function FeaturesGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="card group hover:border-primary hover:border-2"
          variants={itemVariants}
        >
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
            <feature.icon className="text-primary group-hover:text-white transition-colors" size={24} />
          </div>
          <h3 className="font-poppins font-bold text-lg mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
