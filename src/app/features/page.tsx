'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Smartphone,
  BarChart3,
  Users,
  Settings,
  Zap,
  Lock,
  Share2,
  TrendingUp,
  MessageSquare,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const features = [
  {
    icon: Smartphone,
    title: 'Mobile-First Dashboard',
    description:
      'Manage your entire restaurant from any device. Fully responsive, lightning-fast interface optimized for touch.',
    image: '📱',
  },
  {
    icon: Settings,
    title: 'Menu Editor',
    description:
      'Add items with beautiful photos, set prices, create variants (size, toppings), and organize into categories. Instant updates.',
    image: '✏️',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description:
      'Track order volume, popular items, peak hours, customer locations, and payment methods. Export reports anytime.',
    image: '📊',
  },
  {
    icon: MessageSquare,
    title: 'Order Management',
    description:
      'Receive orders in real-time. Accept, prepare, or mark as ready. Notify customers instantly. Support for dine-in, pickup, and delivery.',
    image: '🛎️',
  },
  {
    icon: Users,
    title: 'Customer Insights',
    description:
      'Build customer profiles, track preferences, send targeted offers, and create loyalty programs to boost repeat business.',
    image: '👥',
  },
  {
    icon: DollarSign,
    title: 'Payment Integration',
    description:
      'Accept UPI, digital wallets, cards, and net banking. Zero commission. Daily settlements to your bank account.',
    image: '💳',
  },
  {
    icon: Lock,
    title: 'Bank-Level Security',
    description:
      'SSL encryption, PCI compliance, regular security audits, and GDPR-compliant data handling. Your data is safe with us.',
    image: '🔒',
  },
  {
    icon: Share2,
    title: 'Custom Branding',
    description:
      'Add your logo, customize colors, upload cover photos. White-label options available for franchises and chains.',
    image: '🎨',
  },
  {
    icon: Zap,
    title: 'QR Code Generator',
    description:
      'Generate unlimited, trackable QR codes. Print for tables, walls, packaging, or receipts. Each QR has unique analytics.',
    image: '📲',
  },
  {
    icon: TrendingUp,
    title: 'Multi-Outlet Support',
    description:
      'Manage multiple restaurants from one dashboard. Separate menus, inventories, and analytics per outlet. Scale easily.',
    image: '🏢',
  },
]

export default function FeaturesPage() {
  return (
    <main className="bg-white">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-green-50 to-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title mb-4">Powerful Features for Every Restaurant</h1>
          <p className="section-subtitle text-gray-600">
            Everything you need to manage your restaurant efficiently and increase revenue.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="card h-full hover:shadow-floating hover:border-primary hover:border-2">
                  <div className="text-6xl mb-4">{feature.image}</div>

                  <h3 className="font-poppins font-bold text-xl mb-3 text-secondary">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="w-12 h-1 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="section-title text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            See It In Action
          </motion.h2>

          {[
            {
              title: 'Dashboard Overview',
              desc: 'Your restaurant at a glance. See today\'s orders, revenue, top items, and quick actions.',
              image: '📊',
            },
            {
              title: 'Menu Management',
              desc: 'Easily add, edit, or remove items. Upload photos, set prices, and manage variants.',
              image: '📝',
            },
            {
              title: 'Order Processing',
              desc: 'Receive orders in real-time. Track preparation status and notify customers automatically.',
              image: '🎯',
            },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                <h3 className="font-poppins font-bold text-2xl mb-4 text-secondary">
                  {section.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{section.desc}</p>
                <ul className="space-y-2">
                  {['Real-time updates', 'One-click actions', 'Beautiful interface'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-secondary">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-gradient-to-br from-primary to-green-700 rounded-2xl p-12 text-center text-white h-64 flex items-center justify-center">
                  <div className="text-8xl">{section.image}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="section-title mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Integrations & Partnerships
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Razorpay', 'PayTM', 'PhonePe', 'Google', 'Twilio', 'Mailgun', 'Stripe', 'Square'].map(
              (partner, idx) => (
                <motion.div
                  key={idx}
                  className="card flex items-center justify-center h-24"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <span className="font-semibold text-gray-700">{partner}</span>
                </motion.div>
              )
            )}
          </div>

          <p className="text-gray-600 mt-8">
            More integrations coming soon. <a href="/contact" className="text-primary font-semibold">Request one →</a>
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="section-title text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose QR Menu Pro?
          </motion.h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-4 py-3 text-left font-semibold">Feature</th>
                  <th className="px-4 py-3 text-center font-semibold">QR Menu Pro</th>
                  <th className="px-4 py-3 text-center font-semibold">Aggregators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {[
                  { feature: 'Commission on Orders', qmp: 'Zero %', agg: '10-20%' },
                  { feature: 'Setup Fee', qmp: 'None', agg: 'Often ₹5,000+' },
                  { feature: 'Menu Control', qmp: 'Full Control', agg: 'Limited' },
                  { feature: 'Customer Data', qmp: 'Your Data', agg: 'Theirs' },
                  { feature: 'Branding', qmp: 'Customizable', agg: 'Generic' },
                  { feature: 'Multi-outlet', qmp: '✓ Unlimited', agg: '✗ Extra Fees' },
                ].map((row, idx) => (
                  <motion.tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <td className="px-4 py-3 font-medium text-secondary">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-primary font-semibold">{row.qmp}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.agg}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-white">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-poppins font-bold mb-6">
            Experience All Features Free for 14 Days
          </h2>
          <p className="text-lg text-green-100 mb-8">
            No credit card. No commitment. Cancel anytime.
          </p>
          <Link
            href="/signup"
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-block"
          >
            Start Free Trial Now
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
