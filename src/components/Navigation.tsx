'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-soft' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="font-poppins font-bold text-secondary hidden sm:inline">QR Menu Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="btn-ghost text-sm">
              Features
            </Link>
            <Link href="/pricing" className="btn-ghost text-sm">
              Pricing
            </Link>
            <Link href="/faq" className="btn-ghost text-sm">
              FAQ
            </Link>
            <Link href="/contact" className="btn-ghost text-sm">
              Contact
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="btn-ghost text-sm">
              Login
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-6 space-y-4">
              <Link href="/#features" className="block btn-ghost">
                Features
              </Link>
              <Link href="/pricing" className="block btn-ghost">
                Pricing
              </Link>
              <Link href="/faq" className="block btn-ghost">
                FAQ
              </Link>
              <Link href="/contact" className="block btn-ghost">
                Contact
              </Link>
              <Link href="/login" className="block btn-ghost">
                Login
              </Link>
              <Link href="/signup" className="block btn-primary">
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
