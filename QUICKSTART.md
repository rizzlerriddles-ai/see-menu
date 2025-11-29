# Quick Start Guide

Get QR Menu Pro running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, TailwindCSS, Framer Motion, and PWA support.

**Time: ~2-3 minutes depending on internet**

## 2. Run Development Server

```bash
npm run dev
```

Your app will be available at: **http://localhost:3000**

**Time: ~30 seconds**

## 3. Explore the Site

Visit these pages to see all features:

- **Home**: `http://localhost:3000` - Hero, features, pricing
- **Features**: `http://localhost:3000/features` - Detailed features
- **Pricing**: `http://localhost:3000/pricing` - Plans and pricing
- **FAQ**: `http://localhost:3000/faq` - Questions and answers
- **Contact**: `http://localhost:3000/contact` - Contact form
- **Login**: `http://localhost:3000/login` - Owner login
- **Signup**: `http://localhost:3000/signup` - Signup flow

## 4. Test on Mobile

### Option A: Mobile Browser
1. Find your local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
2. Visit: `http://YOUR_IP:3000` on your phone

### Option B: Chrome DevTools
1. Press `F12` in Chrome
2. Click device icon (top-left)
3. Select mobile device
4. Refresh page

## 5. Customize for Your Business

### Update Company Info
Edit these files:
- **Company name**: `src/components/Footer.tsx` - Change "QR Menu Pro"
- **Contact email**: `src/app/contact/page.tsx` - Change "support@qrmenupro.com"
- **Phone**: `src/app/contact/page.tsx` - Change "+91 9876 543210"
- **Colors**: `tailwind.config.js` - Change primary/secondary colors

### Update Pricing
Edit `src/app/pricing/page.tsx`:
```js
{
  id: 'starter',
  name: 'Starter',
  monthlyPrice: 999,  // Change this
  yearlyPrice: 9990,  // And this
  // ...
}
```

### Update FAQ
Edit `src/components/FAQAccordion.tsx` - Modify `faqData` array

## 6. Build for Production

```bash
npm run build
npm run start
```

Your app will be optimized and ready to deploy!

## 🔧 Common Customizations

### Change Brand Colors
File: `tailwind.config.js`
```js
colors: {
  primary: '#0AAD4D',    // Green
  secondary: '#111111',  // Dark
}
```

### Change Fonts
File: `src/app/globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@600;700;800&display=swap');
```

### Update Logo
Replace these images:
- `public/favicon.ico`
- `public/apple-touch-icon.png`
- `public/icon-192.png`
- `public/icon-512.png`

### Change Prices
File: `src/app/pricing/page.tsx`
- Starter: Line ~40
- Growth: Line ~52
- Pro: Line ~64

### Update Features
File: `src/components/FeaturesGrid.tsx`
- Modify `features` array (line ~5)

## 📱 Test PWA Features

### 1. Test Offline Support
1. Go to DevTools (F12)
2. Network tab → Throttle to "Offline"
3. Reload page - you'll see offline page
4. Go back online, reload - normal page loads

### 2. Install as App
1. Open in Chrome/Edge mobile
2. Menu (3 dots) → "Install app"
3. App appears on home screen
4. Opens fullscreen without browser UI

### 3. Check Service Worker
1. DevTools → Application → Service Workers
2. You should see service worker "activated and running"

## 🚀 Next Steps

### 1. Connect Backend
When ready, connect to your backend:
```ts
// Example API call
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/restaurants`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
```

### 2. Add Payment Gateway
Integrate Razorpay or Stripe:
```ts
// In signup/payment page
const response = await Razorpay.checkout({
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
  amount: 99900, // ₹999 in paise
});
```

### 3. Setup Database
Use Prisma to connect database:
```bash
npm install @prisma/client prisma
npx prisma init
```

### 4. Deploy
See `DEPLOYMENT.md` for detailed deployment instructions to Vercel, AWS, or other platforms.

## 📊 File Structure Reference

```
QR Menu Pro/
├── src/
│   ├── app/
│   │   ├── page.tsx ............... Home page
│   │   ├── pricing/page.tsx ....... Pricing page
│   │   ├── faq/page.tsx ........... FAQ page
│   │   ├── features/page.tsx ...... Features page
│   │   ├── contact/page.tsx ....... Contact page
│   │   ├── login/page.tsx ......... Login page
│   │   ├── signup/page.tsx ........ Signup page
│   │   ├── layout.tsx ............. Root layout
│   │   └── globals.css ............ Global styles
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── FeaturesGrid.tsx
│   │   ├── FAQAccordion.tsx
│   │   └── ServiceWorkerRegister.tsx
│   └── utils/ ..................... (Add utils here)
├── public/
│   ├── manifest.json .............. PWA manifest
│   ├── sw.js ...................... Service worker
│   ├── offline.html ............... Offline page
│   └── icons/ ..................... App icons
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md

```

## ✅ Checklist Before Launching

- [ ] Update company name and branding
- [ ] Change colors to match your brand
- [ ] Update contact information
- [ ] Customize pricing for your market
- [ ] Update FAQ with your answers
- [ ] Add your logo and icons
- [ ] Test all pages on mobile
- [ ] Test PWA installation
- [ ] Test offline mode
- [ ] Set up analytics
- [ ] Configure email service
- [ ] Set up payment gateway
- [ ] Deploy to production
- [ ] Set up monitoring
- [ ] Configure backup system

## 🆘 Help & Support

If you get stuck:

1. **Check console errors**: Press F12 → Console tab
2. **Check build output**: `npm run build`
3. **Clear cache**: `npm cache clean --force`
4. **Reinstall deps**: `rm -rf node_modules && npm install`
5. **Check docs**: Read component files - they have comments

## 💡 Pro Tips

- **Fast reload**: Change only CSS - Tailwind handles HMR
- **Component reuse**: Copy existing components as templates
- **Icons**: Browse Lucide React icons: `https://lucide.dev`
- **Colors**: Use Tailwind color picker: `https://www.tailwindshades.com`
- **Fonts**: Google Fonts: `https://fonts.google.com`

---

**You're all set! Happy building!** 🚀

Questions? Check out Next.js docs: https://nextjs.org/docs
