'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Setup',
    question: 'How do I get started with QR Menu Pro?',
    answer: 'Getting started is simple. Sign up for free, create your restaurant profile, upload your menu items with photos and prices, generate your QR code, and share it with your customers. You can be live in minutes.',
  },
  {
    id: '2',
    category: 'Setup',
    question: 'Is there a setup fee or hidden charges?',
    answer: 'No hidden charges. You only pay the monthly subscription fee based on your chosen plan. We offer a 14-day free trial so you can test all features before committing.',
  },
  {
    id: '3',
    category: 'Payments',
    question: 'Which payment methods do you support?',
    answer: 'We integrate with all major payment methods including UPI, digital wallets (PayTM, PhonePe, Google Pay), credit/debit cards, and net banking. Settlements happen directly to your bank account daily.',
  },
  {
    id: '4',
    category: 'Payments',
    question: 'What is your commission structure?',
    answer: 'Unlike aggregators, we charge ZERO commission on orders. You only pay our monthly subscription. This means more margin stays with you.',
  },
  {
    id: '5',
    category: 'Features',
    question: 'Can I manage multiple restaurant outlets?',
    answer: 'Yes! The Pro plan supports unlimited outlets. Manage all your restaurants from a single dashboard, maintain separate menus, and track analytics for each location.',
  },
  {
    id: '6',
    category: 'Features',
    question: 'Do customers need to download an app?',
    answer: 'No app required. Customers simply scan your QR code with their phone camera and access the digital menu instantly in their browser. It works on any device.',
  },
  {
    id: '7',
    category: 'Features',
    question: 'Can I customize the menu appearance?',
    answer: 'Absolutely. You can customize colors, add your restaurant logo, upload high-quality food photos, organize items into categories, and add descriptions and special offers.',
  },
  {
    id: '8',
    category: 'Analytics',
    question: 'What analytics and data do you provide?',
    answer: 'Track order volume, popular items, peak hours, customer locations, payment methods used, and customer feedback. Use these insights to improve your menu and operations.',
  },
  {
    id: '9',
    category: 'Security',
    question: 'Is my data secure?',
    answer: 'Yes. We use bank-level encryption, secure SSL connections, regular security audits, and comply with data protection regulations. Your customer data is never shared with third parties.',
  },
  {
    id: '10',
    category: 'Support',
    question: 'What support do you offer?',
    answer: 'We provide email support for all plans, phone/video support for Growth and Pro plans, and dedicated account managers for Enterprise customers. Response time is typically within 2 hours.',
  },
  {
    id: '11',
    category: 'Devices',
    question: 'What devices do customers need to order?',
    answer: 'Any smartphone with a camera and internet connection. The menu works on iOS, Android, and any device with a modern web browser. No special software needed.',
  },
  {
    id: '12',
    category: 'Devices',
    question: 'Can I generate and print QR codes?',
    answer: 'Yes. Generate unlimited QR codes and download them in various sizes for printing on menus, table cards, walls, or even receipts. Each QR code is trackable.',
  },
  {
    id: '13',
    category: 'Features',
    question: 'Do you support loyalty programs?',
    answer: 'Yes, the Pro plan includes built-in loyalty points system. Customers earn points on orders which they can redeem for discounts, encouraging repeat visits.',
  },
  {
    id: '14',
    category: 'Features',
    question: 'Can customers order via WhatsApp?',
    answer: 'Yes! Pro plan customers can enable WhatsApp ordering. Customers can send orders directly via WhatsApp, and you receive notifications instantly.',
  },
  {
    id: '15',
    category: 'Integration',
    question: 'Do you integrate with POS systems?',
    answer: 'We have integrations with popular POS systems. If your POS isn\'t listed, our API documentation allows custom integration. Contact our sales team for enterprise solutions.',
  },
]

export function FAQAccordion() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(faqData.map(item => item.category)))
  const filteredFaqs = selectedCategory
    ? faqData.filter(item => item.category === selectedCategory)
    : faqData

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-secondary hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-secondary hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card cursor-pointer"
            onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-poppins font-semibold text-secondary pr-4">
                  {faq.question}
                </h3>
              </div>
              {expandedId === faq.id ? (
                <ChevronUp className="text-primary flex-shrink-0 mt-1" />
              ) : (
                <ChevronDown className="text-gray-400 flex-shrink-0 mt-1" />
              )}
            </div>

            <AnimatePresence>
              {expandedId === faq.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
