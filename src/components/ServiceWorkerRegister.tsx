'use client'

import React from 'react'
import Script from 'next/script'

export function ServiceWorkerRegister() {
  return (
    <Script
      src="/sw-register.js"
      strategy="afterInteractive"
      onLoad={() => {
        // console.log('Service Worker registration script loaded')    
      }}
    />
  )
}
