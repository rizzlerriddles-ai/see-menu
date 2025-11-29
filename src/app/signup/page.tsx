'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Lock, Phone, Store, Eye, EyeOff, Check } from 'lucide-react'

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    agree: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (step === 1 && formData.restaurantName && formData.ownerName) {
      setStep(2)
    } else if (step === 2 && formData.email && formData.phone && formData.password === formData.confirmPassword) {
      setStep(3)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  }

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 to-white py-20">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <span className="font-poppins font-bold text-secondary text-lg">QR Menu Pro</span>
        </Link>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${
                step >= i ? 'bg-primary' : 'bg-gray-300'
              }`}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="card shadow-floating min-h-96">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {step === 1 && (
              <div>
                <h1 className="font-poppins font-bold text-2xl mb-2">Tell us about your restaurant</h1>
                <p className="text-gray-600 text-sm mb-6">This helps us customize your experience</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      Restaurant Name
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={formData.restaurantName}
                        onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="e.g., Taj Mahal Restaurant"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="e.g., Mumbai"
                    />
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={!formData.restaurantName || !formData.ownerName}
                  className="btn-primary w-full mt-6 disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="font-poppins font-bold text-2xl mb-2">Create your account</h1>
                <p className="text-gray-600 text-sm mb-6">Secure login for your dashboard</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="your@restaurant.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="8+ characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-2">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary w-full"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!formData.email || !formData.password || formData.password !== formData.confirmPassword}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="font-poppins font-bold text-2xl mb-2">Confirm & Get Started</h1>
                <p className="text-gray-600 text-sm mb-6">Review your information before confirming</p>

                {/* Summary */}
                <div className="space-y-3 mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Restaurant:</span>
                    <span className="font-semibold">{formData.restaurantName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Owner:</span>
                    <span className="font-semibold">{formData.ownerName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{formData.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold text-primary">Free Trial (14 days)</span>
                  </div>
                </div>

                {/* Agreement */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="rounded mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-primary font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-primary font-semibold hover:underline">Privacy Policy</a>
                  </span>
                </label>

                {/* Submit */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary w-full"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.agree || isLoading}
                    className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    {isLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
