# QR MENU PRO - COMPLETE DEPLOYMENT & SETUP GUIDE

> Production-ready SaaS MVP for Digital Restaurant Menus

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Installation & Development](#installation--development)
6. [API Documentation](#api-documentation)
7. [Deployment](#deployment)
8. [Features Checklist](#features-checklist)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/yourusername/qr-menu-pro.git
cd qr-menu-pro

# 2. Install dependencies
npm install

# 3. Setup Supabase (see Database Setup section)

# 4. Create .env.local file (see Environment Configuration)

# 5. Run development server
npm run dev

# 6. Visit http://localhost:3000
```

---

## 📋 Prerequisites

- **Node.js**: 18.0+ ([Download](https://nodejs.org/))
- **npm**: 9.0+ (comes with Node.js)
- **Supabase Account**: Free tier ([Sign up](https://supabase.com))
- **Git**: For version control ([Download](https://git-scm.com))
- **PostgreSQL** (managed by Supabase)

### Optional but Recommended

- **Vercel Account**: For easy deployment ([Sign up](https://vercel.com))
- **Docker**: For containerized deployment
- **Redis**: For caching (optional)

---

## 🗄️ Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Create a new project"
3. Fill in project details:
   - Name: `qr-menu-pro` (or your choice)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
4. Wait for project to be created

### Step 2: Initialize Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **Create a new query**
3. Copy the entire content from `DATABASE_SCHEMA.sql`
4. Paste into the query editor
5. Click **Run**

This creates all tables, indexes, RLS policies, and triggers.

### Step 3: Verify Tables Created

In Supabase Dashboard, go to **Table Editor** and verify:

- `restaurants`
- `restaurant_users`
- `outlets`
- `categories`
- `dishes`
- `dish_variants`
- `tables`
- `customers`
- `orders`
- `order_items`
- `analytics_events`

### Step 4: Setup Storage Buckets

In Supabase Dashboard, go to **Storage**:

1. Create bucket: `menu-assets`
   - Policies: Public read, authenticated write
2. Create bucket: `qr-codes`
   - Policies: Public read, authenticated write

---

## 🔐 Environment Configuration

### Step 1: Get Supabase Keys

In Supabase Dashboard:

1. Go to **Settings** → **API**
2. Copy:
   - `Project URL`
   - `anon public` key
   - `service_role` secret key

### Step 2: Create .env.local File

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
# ============================================================================
# SUPABASE CONFIGURATION (REQUIRED)
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret-here

# ============================================================================
# APPLICATION SETTINGS
# ============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=QR Menu Pro
NODE_ENV=development

# ============================================================================
# STORAGE
# ============================================================================
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=menu-assets

# ============================================================================
# FEATURE FLAGS
# ============================================================================
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
```

### Step 3: Setup Authentication

In Supabase Dashboard → **Authentication**:

1. Go to **Providers** → **Email**
2. Enable "Email OTP" (optional)
3. Enable "Email/Password"
4. Go to **Email Templates**
5. Customize confirmation and reset templates

---

## 💻 Installation & Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm lint
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`

Create new restaurant account.

**Request:**

```json
{
  "email": "owner@restaurant.com",
  "password": "secure_password",
  "restaurantName": "The Delhi Bistro",
  "ownerName": "Rajesh Kumar",
  "phone": "+919876543210"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "owner@restaurant.com"
  },
  "restaurant": {
    "id": "uuid",
    "name": "The Delhi Bistro",
    "subscription_plan": "starter",
    "trial_ends_at": "2025-12-15T00:00:00Z"
  }
}
```

### Orders Endpoints

#### POST `/api/outlets/{outletId}/orders`

Create order from customer menu.

**Request:**

```json
{
  "items": [
    {
      "dish_id": "uuid",
      "dish_name": "Butter Chicken",
      "price": 280,
      "quantity": 2
    }
  ],
  "table_number": "5",
  "customer_phone": "+919876543210",
  "customer_email": "customer@email.com",
  "customer_name": "John Doe",
  "customer_token": "token-xyz",
  "special_instructions": "Less spicy"
}
```

**Response:**

```json
{
  "order": {
    "id": "uuid",
    "order_number": "ORD-1234567890-ABC123",
    "status": "pending",
    "total_amount": 560,
    "created_at": "2025-12-01T10:30:00Z"
  },
  "message": "Order created successfully"
}
```

### Data Retrieval Examples

#### Get Menu for Public View

```typescript
// Client-side
const { data: outlet } = await supabase
  .from('outlets')
  .select('*')
  .eq('slug', 'delhi-bistro')
  .single()

const { data: categories } = await supabase
  .from('categories')
  .select('*')
  .eq('outlet_id', outlet.id)
  .eq('is_active', true)

const { data: dishes } = await supabase
  .from('dishes')
  .select('*')
  .eq('outlet_id', outlet.id)
  .eq('is_available', true)
```

#### Get Orders for Restaurant

```typescript
// Requires authentication
const { data: orders } = await supabase
  .from('orders')
  .select('*, order_items(*)')
  .eq('outlet_id', outletId)
  .order('created_at', { ascending: false })
```

---

## 🌍 Deployment

### Option 1: Vercel (Recommended)

**Easiest deployment for Next.js**

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**

   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - etc.

4. **Deploy**

   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

**Domain Setup:**
- Vercel provides free `.vercel.app` domain
- Or add custom domain in Vercel Settings

### Option 2: AWS (EC2)

1. **Create EC2 Instance**

```bash
# Launch Ubuntu 24.04 LTS instance
# Open ports: 80, 443, 3000
```

2. **SSH into Server**

```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Node.js**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2 (Process Manager)**

```bash
sudo npm install -g pm2
```

5. **Clone & Setup**

```bash
git clone https://github.com/yourusername/qr-menu-pro.git
cd qr-menu-pro
npm install
npm run build
```

6. **Create .env.local** with all credentials

7. **Start with PM2**

```bash
pm2 start npm --name "qr-menu-pro" -- start
pm2 startup
pm2 save
```

8. **Setup Nginx Reverse Proxy**

```bash
sudo apt-get install nginx
```

Create `/etc/nginx/sites-available/qr-menu-pro`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/qr-menu-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Setup SSL with Let's Encrypt**

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 3: Docker Deployment

1. **Create Dockerfile**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Create .dockerignore**

```
node_modules
.next
.git
.env.local
```

3. **Build & Run**

```bash
docker build -t qr-menu-pro .
docker run -p 3000:3000 --env-file .env.local qr-menu-pro
```

---

## ✅ Features Checklist

### Core Features

- [x] Restaurant authentication (email/password)
- [x] Multi-tenant database with RLS
- [x] Restaurant profile management
- [x] Multi-outlet support
- [x] Menu management (categories & dishes)
- [x] QR code generation for tables
- [x] Public menu view (no login required)
- [x] Customer phone/email capture
- [x] Order placement from QR menu
- [x] Order management dashboard
- [x] Real-time order status updates
- [x] Customer tracking
- [x] Analytics & insights
- [x] Mobile-responsive design
- [x] Progressive Web App (PWA)

### Advanced Features

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Loyalty points system
- [ ] WhatsApp order integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Dish recommendations
- [ ] Customer feedback system
- [ ] Delivery address management
- [ ] Bulk order reports (CSV export)
- [ ] Staff management & roles
- [ ] Kitchen display system (KDS)
- [ ] API documentation dashboard
- [ ] Webhook support

---

## 🐛 Troubleshooting

### Problem: "Missing Supabase configuration"

**Solution:**

```bash
# Make sure .env.local exists and has:
echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here"
```

### Problem: "RLS policy denying access"

**Solution:**

In Supabase Dashboard → Authentication → Check:

1. User is logged in
2. JWT token is valid
3. RLS policies allow the query
4. Debug by disabling RLS temporarily

### Problem: "Build fails: Cannot find module"

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

### Problem: "Emails not sending"

**Solution:**

In Supabase Dashboard → Authentication → Email:

1. Check SMTP provider settings
2. Verify sender email is confirmed
3. Check email templates are configured
4. Look in Supabase logs for errors

### Problem: "Slow database queries"

**Solution:**

```bash
# Add indexes (they're in DATABASE_SCHEMA.sql)
# Check query plans in Supabase

# Optimize:
# 1. Add pagination to queries
# 2. Use materialized views for analytics
# 3. Cache frequently accessed data
```

---

## 📞 Support & Resources

- **Documentation**: [nextjs.org](https://nextjs.org/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com/docs)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion/)

---

## 📄 License

MIT License - Feel free to use this project for commercial purposes.

---

## 🎯 Next Steps

1. **Setup Database** → Run DATABASE_SCHEMA.sql
2. **Configure Environment** → Add .env.local variables
3. **Install Dependencies** → `npm install`
4. **Run Development** → `npm run dev`
5. **Create Demo Account** → Via signup page
6. **Deploy to Production** → Choose Vercel / AWS / Docker

---

**Ready to launch your restaurant digital menu? Let's go! 🚀**
