import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: 'QR Menu Pro - Digital Menu & Ordering for Restaurants',
  description: 'QR-based digital menu platform for restaurants. Fast ordering, contactless experience, no commissions. Perfect for Indian restaurants.',
  keywords: ['digital menu', 'QR code menu', 'restaurant ordering', 'contactless menu', 'Indian restaurants'],
  authors: [{ name: 'QR Menu Pro' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://qrmenupro.com',
    siteName: 'QR Menu Pro',
    title: 'QR Menu Pro - Digital Menu & Ordering for Restaurants',
    description: 'QR-based digital menu platform for restaurants in India',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QR Menu Pro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Menu Pro - Digital Menu & Ordering',
    description: 'QR-based digital menu platform for restaurants',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0AAD4D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0AAD4D" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-white">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
