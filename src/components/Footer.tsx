'use client'

import React from 'react'
import { motion } from 'framer-motion'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="font-poppins font-bold text-lg mb-2">Company</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-primary transition">About</a></li>
              <li><a href="#" className="hover:text-primary transition">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-poppins font-bold text-lg mb-2">Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition">API Docs</a></li>
              <li><a href="#" className="hover:text-primary transition">Status</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-poppins font-bold text-lg mb-2">Legal</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition">Security</a></li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="py-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-lg font-poppins font-semibold mb-4">
            Start your digital menu in 5 minutes
          </p>
          <p className="text-gray-400 mb-6">No credit card required. No app needed.</p>
          <a href="/signup" className="btn-primary inline-block">
            Get Started Free
          </a>
        </motion.div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {currentYear} QR Menu Pro. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition">Twitter</a>
            <a href="#" className="hover:text-primary transition">Instagram</a>
            <a href="#" className="hover:text-primary transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
