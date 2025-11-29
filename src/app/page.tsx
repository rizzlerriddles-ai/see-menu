'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Zap, Lock, BarChart3, Smartphone, Clock } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { FeaturesGrid } from '@/components/FeaturesGrid'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-4 bg-gradient-to-br from-white via-green-50 to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="section-title leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              QR-Based Digital Menu & Ordering for Restaurants
            </motion.h1>

            <motion.p
              className="section-subtitle text-gray-600 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Faster ordering. Contactless experience. No commissions. Give your customers a seamless ordering experience with our all-in-one digital menu platform.
            </motion.p>

            {/* Trusted Badges */}
            <motion.div
              className="flex items-center gap-4 my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-secondary">1000+</span> restaurants trust us
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/signup" className="btn-primary">
                Start Free Trial (14 days)
              </Link>
              <button className="btn-secondary">
                See Live Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full max-w-sm">
              {/* Phone Mockup */}
              <motion.div
                className="bg-gradient-to-br from-primary to-green-700 rounded-3xl p-4 shadow-floating"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Phone Screen */}
                  <div className="bg-gradient-to-b from-primary to-green-600 p-6 text-center text-white min-h-96 flex items-center justify-center">
                    <div>
                      <div className="text-6xl mb-4">📱</div>
                      <p className="font-poppins font-bold mb-2">Scan Menu Here</p>
                      <div className="mt-6 bg-white text-secondary p-4 rounded-lg font-mono text-sm">
                        ▰▰▰▰▰▰<br/>▰ QR ▰<br/>▰▰▰▰▰▰
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-floating px-4 py-3"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-sm font-semibold text-secondary">✓ Works Offline</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-300 text-sm font-semibold mb-2">TRUSTED BY RESTAURANTS IN</p>
            <p className="text-3xl font-poppins font-bold">India • UAE • Singapore</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle text-gray-600 max-w-2xl mx-auto">
              A complete restaurant management platform with all features built-in. No third-party integrations needed.
            </p>
          </motion.div>
          <FeaturesGrid />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="section-title text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How It Works (In 3 Simple Steps)
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Add Your Menu',
                desc: 'Upload your menu items with photos, prices, and descriptions. Organize into categories.',
                icon: '📋',
              },
              {
                num: '02',
                title: 'Generate QR Code',
                desc: 'Get unique QR codes for each table, delivery area, or your storefront.',
                icon: '📲',
              },
              {
                num: '03',
                title: 'Customers Order',
                desc: 'Customers scan the QR code and place orders directly. No app needed.',
                icon: '✓',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-primary font-poppins font-bold text-sm mb-2">{step.num}</div>
                <h3 className="font-poppins font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'Load times under 2 seconds. Optimized for Indian networks.',
              },
              {
                icon: Lock,
                title: 'Bank-Level Security',
                desc: 'SSL encryption, PCI compliant, regular security audits.',
              },
              {
                icon: Smartphone,
                title: 'Mobile Optimized',
                desc: 'Perfect experience on any device. No app downloads required.',
              },
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                desc: 'Track orders, popular items, and customer preferences.',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                desc: 'Email, chat, and phone support whenever you need it.',
              },
              {
                icon: CheckCircle,
                title: 'Zero Setup Fee',
                desc: 'Start free for 14 days. No credit card needed.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <benefit.icon className="text-primary mb-4" size={32} />
                <h3 className="font-poppins font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Transparent Pricing</h2>
            <p className="section-subtitle text-gray-600">
              No hidden fees. No commission on orders. Upgrade or downgrade anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: 'Starter',
                price: '₹999',
                desc: 'Perfect for small restaurants',
                features: ['QR Menu', 'Admin Dashboard', 'Basic Analytics', 'Email Support'],
              },
              {
                name: 'Growth',
                price: '₹1,499',
                desc: 'Best for growing restaurants',
                features: ['All Starter features', 'Online Ordering', 'Feedback System', 'Basic CRM', 'Phone Support'],
                popular: true,
              },
              {
                name: 'Pro',
                price: '₹2,499',
                desc: 'For multi-outlet chains',
                features: ['All Growth features', 'Multi-Outlet Support', 'Loyalty Points', 'WhatsApp Ordering', 'Priority Support'],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`card text-center ${plan.popular ? 'ring-2 ring-primary shadow-floating scale-105' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="font-poppins font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.desc}</p>
                <div className="text-4xl font-poppins font-bold text-primary mb-1">
                  {plan.price}
                </div>
                <p className="text-gray-600 text-xs mb-6">/month</p>
                <button className={plan.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  Get Started
                </button>
                <ul className="mt-6 space-y-3 text-sm text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/pricing" className="text-primary font-semibold hover:underline">
              View full pricing details →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Join 1000+ restaurants already using QR Menu Pro to increase orders and reduce costs.
          </p>
          <Link href="/signup" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-block">
            Start Your Free Trial Now
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
