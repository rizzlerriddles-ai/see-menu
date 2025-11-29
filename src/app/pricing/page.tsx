'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 999,
      yearlyPrice: 9990,
      description: 'Perfect for small restaurants',
      features: [
        { name: 'QR Menu (Unlimited items)', included: true },
        { name: 'Admin Dashboard', included: true },
        { name: 'Basic Analytics', included: true },
        { name: 'Email Support', included: true },
        { name: 'Online Ordering', included: false },
        { name: 'WhatsApp Integration', included: false },
        { name: 'Loyalty Points', included: false },
        { name: 'Multi-Outlet', included: false },
      ],
      cta: 'Start Free Trial',
    },
    {
      id: 'growth',
      name: 'Growth',
      monthlyPrice: 1499,
      yearlyPrice: 14990,
      description: 'Best for growing restaurants',
      popular: true,
      features: [
        { name: 'QR Menu (Unlimited items)', included: true },
        { name: 'Admin Dashboard', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Phone & Email Support', included: true },
        { name: 'Online Ordering (All modes)', included: true },
        { name: 'Customer Feedback System', included: true },
        { name: 'Basic CRM', included: true },
        { name: 'Multi-Outlet', included: false },
      ],
      cta: 'Start Free Trial',
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 2499,
      yearlyPrice: 24990,
      description: 'For multi-outlet chains',
      features: [
        { name: 'QR Menu (Unlimited items)', included: true },
        { name: 'Admin Dashboard', included: true },
        { name: 'Advanced Analytics', included: true },
        { name: 'Priority Support (24/7)', included: true },
        { name: 'Online Ordering (All modes)', included: true },
        { name: 'Advanced CRM', included: true },
        { name: 'Loyalty Points Program', included: true },
        { name: 'Multi-Outlet Support (Unlimited)', included: true },
      ],
      cta: 'Start Free Trial',
    },
  ]

  return (
    <main className="bg-white">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-green-50 to-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title mb-4">Simple, Transparent Pricing</h1>
          <p className="section-subtitle text-gray-600">
            No hidden fees. No commission on orders. Choose the plan that fits your restaurant.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Yearly (Save 17%)
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`rounded-lg p-8 ${
                  plan.popular
                    ? 'ring-2 ring-primary shadow-floating scale-105 bg-white'
                    : 'bg-gray-50 border border-gray-200'
                }`}
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

                <h3 className="font-poppins font-bold text-2xl mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="text-5xl font-poppins font-bold text-secondary">
                    ₹{billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    {billingPeriod === 'monthly' ? '/month' : '/year (Billed annually)'}
                  </p>
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-green-600'
                      : 'border-2 border-primary text-primary hover:bg-green-50'
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={20} className="text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="section-title text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Pricing FAQs
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                q: 'Do you charge commission on orders?',
                a: 'No! We charge zero commission. You only pay the monthly subscription. This is the biggest difference between us and aggregators like Swiggy/Zomato.',
              },
              {
                q: 'Is there a setup fee or onboarding charge?',
                a: 'No. Get started completely free for 14 days. After that, you choose your plan and can cancel anytime.',
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes, anytime! Upgrade to a higher plan to unlock more features, or downgrade if your needs change. Changes take effect immediately.',
              },
              {
                q: 'What happens after my free trial ends?',
                a: 'If you love QR Menu Pro, upgrade to a paid plan. If not, your account closes with no charges. We won\'t auto-charge your card.',
              },
              {
                q: 'Is there a discount for annual billing?',
                a: 'Yes! Pay yearly and save 17% compared to monthly billing. That\'s ₹1,220 saved on Starter, ₹2,860 on Growth, and ₹4,790 on Pro annually.',
              },
              {
                q: 'Do you offer discounts for bulk or enterprise?',
                a: 'Yes! Contact our sales team for custom enterprise pricing if you manage multiple chains or have specific requirements.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="card"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-poppins font-bold text-secondary mb-2">{item.q}</h4>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-white">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-poppins font-bold mb-6">
            Start Your Free 14-Day Trial Today
          </h2>
          <p className="text-lg text-green-100 mb-8">
            No credit card required. Cancel anytime.
          </p>
          <Link
            href="/signup"
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-block"
          >
            Get Started Free
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
