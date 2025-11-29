'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { FAQAccordion } from '@/components/FAQAccordion'
import { Footer } from '@/components/Footer'

export default function FAQPage() {
  return (
    <main className="bg-white">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-b from-green-50 to-white">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title mb-4">Frequently Asked Questions</h1>
          <p className="section-subtitle text-gray-600">
            {`Have questions? We've got answers. Find everything you need to know about QR Menu Pro.`}
          </p>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <FAQAccordion />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-4">{`Didn't find your answer?`}</h2>
          <p className="text-gray-600 mb-8">
            Our support team is here to help. Reach out to us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary">
              Contact Support
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
