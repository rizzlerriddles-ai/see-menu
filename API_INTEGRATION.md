# API Integration Guide

This guide shows how to connect QR Menu Pro to a backend API for production use.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    QR Menu Pro PWA                          │
│                   (Next.js Frontend)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Pages: Home, Features, Pricing, FAQ, Contact, Auth    │ │
│  │ Components: Navigation, Footer, Forms                 │ │
│  │ State: React Hooks + Context (ready for Redux)        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────┬──────────────────────────────────────────┘
                  │ HTTPS
                  ↓
      ┌───────────────────────┐
      │   Backend API         │
      │   (Node/Python/GO)    │
      ├───────────────────────┤
      │ • Auth & Signup       │
      │ • Menu Management     │
      │ • Order Processing    │
      │ • Payments            │
      │ • Analytics           │
      └───────────────────────┘
                  │
                  ↓
      ┌───────────────────────┐
      │   Databases           │
      │ • PostgreSQL/MongoDB  │
      │ • Redis Cache         │
      └───────────────────────┘
```

## Backend Requirements

### Core Endpoints Needed

#### Authentication
```
POST   /api/auth/signup           - Create restaurant account
POST   /api/auth/login            - Authenticate restaurant
POST   /api/auth/logout           - Logout
POST   /api/auth/refresh          - Refresh JWT token
POST   /api/auth/forgot-password  - Request password reset
POST   /api/auth/reset-password   - Reset password with token
```

#### Restaurants
```
GET    /api/restaurants/me        - Get current restaurant profile
PUT    /api/restaurants/me        - Update restaurant profile
POST   /api/restaurants/me/logo   - Upload restaurant logo
GET    /api/restaurants/me/settings - Get restaurant settings
PUT    /api/restaurants/me/settings - Update settings
```

#### Menus
```
GET    /api/menus                 - List restaurant menus
POST   /api/menus                 - Create new menu
GET    /api/menus/:id             - Get menu details
PUT    /api/menus/:id             - Update menu
DELETE /api/menus/:id             - Delete menu

GET    /api/menus/:id/items       - List menu items
POST   /api/menus/:id/items       - Add menu item
PUT    /api/menus/:id/items/:itemId - Update item
DELETE /api/menus/:id/items/:itemId - Delete item
```

#### Orders
```
GET    /api/orders                - List restaurant orders
GET    /api/orders/:id            - Get order details
PUT    /api/orders/:id/status     - Update order status
POST   /api/orders/:id/accept     - Accept order
POST   /api/orders/:id/prepare    - Mark as preparing
POST   /api/orders/:id/ready      - Mark as ready
POST   /api/orders/:id/complete   - Mark as complete
POST   /api/orders/:id/cancel     - Cancel order
```

#### Analytics
```
GET    /api/analytics/dashboard   - Dashboard metrics
GET    /api/analytics/orders      - Order analytics
GET    /api/analytics/items       - Item popularity
GET    /api/analytics/customers   - Customer insights
GET    /api/analytics/revenue     - Revenue data
```

#### Payments
```
POST   /api/payments/create       - Create payment intent
POST   /api/payments/verify       - Verify payment
GET    /api/payments/history      - Payment history
GET    /api/payments/invoice/:id  - Get invoice
```

## Frontend Integration Examples

### 1. Authentication - Signup

**Current Code** (file: `src/app/signup/page.tsx`):
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  // Currently just logs and waits
  await new Promise(resolve => setTimeout(resolve, 2000))
  setIsLoading(false)
}
```

**Integrated Code**:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantName: formData.restaurantName,
          ownerName: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          city: formData.city,
        }),
      }
    )
    
    if (!response.ok) throw new Error('Signup failed')
    
    const data = await response.json()
    
    // Store JWT token
    localStorage.setItem('token', data.token)
    
    // Redirect to dashboard
    window.location.href = '/dashboard'
  } catch (error) {
    console.error('Signup error:', error)
    // Show error message to user
  } finally {
    setIsLoading(false)
  }
}
```

### 2. Login Integration

**File**: `src/app/login/page.tsx`

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    )
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }
    
    // Store token and user data
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    
    // Redirect to dashboard
    window.location.href = '/dashboard'
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    setIsLoading(false)
  }
}
```

### 3. Create Utility for API Calls

**File**: `src/utils/api.ts` (create new)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiCall(
  endpoint: string,
  options?: RequestInit
): Promise<any> {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'API error')
  }
  
  return data
}

// Convenience methods
export const api = {
  get: (endpoint: string) => 
    apiCall(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, body: any) =>
    apiCall(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  
  put: (endpoint: string, body: any) =>
    apiCall(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  
  delete: (endpoint: string) =>
    apiCall(endpoint, { method: 'DELETE' }),
}
```

### 4. Use API Utility in Components

**Example**: Fetch menu items

```tsx
import { api } from '@/utils/api'

export function MenuList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchMenuItems()
  }, [])
  
  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const data = await api.get('/api/menus/current/items')
      setItems(data.items)
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {item.name} - ₹{item.price}
        </div>
      ))}
    </div>
  )
}
```

## Environment Variables Setup

**File**: `.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.qrmenupro.com
NEXT_PUBLIC_API_TIMEOUT=30000

# Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_secret_key

# Authentication
NEXT_PUBLIC_JWT_EXPIRY=7d

# Features
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_WHATSAPP=true
```

## Error Handling

```typescript
// Global error handler for API calls
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
  }
}

export async function apiCall(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options)
    const data = await response.json()
    
    if (!response.ok) {
      throw new APIError(
        data.message || 'API Error',
        response.status,
        data
      )
    }
    
    return data
  } catch (error) {
    if (error instanceof APIError) {
      // Handle specific HTTP errors
      if (error.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    throw error
  }
}
```

## Authentication State Management

### Using React Context

**File**: `src/context/AuthContext.tsx` (create new)

```typescript
import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  restaurantName: string
  role: 'owner' | 'manager'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  
  const login = async (email: string, password: string) => {
    const data = await api.post('/api/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
  }
  
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }
  
  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

## Rate Limiting & Retry Logic

```typescript
export async function apiCallWithRetry(
  endpoint: string,
  options?: RequestInit,
  maxRetries = 3
): Promise<any> {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall(endpoint, options)
    } catch (error) {
      lastError = error
      
      // Only retry on 5xx errors
      if (error instanceof APIError && error.status < 500) {
        throw error
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        )
      }
    }
  }
  
  throw lastError
}
```

## File Upload Example

```typescript
export async function uploadFile(
  file: File,
  endpoint: string
): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  })
  
  return response.json()
}

// Usage
const handleLogoUpload = async (file: File) => {
  try {
    const result = await uploadFile(file, '/api/restaurants/logo')
    console.log('Logo uploaded:', result.url)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

## Testing API Integration

```bash
# Install curl or Postman for testing

# Test login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@restaurant.com",
    "password": "password123"
  }'

# Test getting menu items (with auth)
curl -X GET http://localhost:3001/api/menus/current/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Production Checklist

- [ ] API URLs use HTTPS
- [ ] JWT token stored securely (httpOnly cookie preferred over localStorage)
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Request timeouts set
- [ ] Retry logic implemented
- [ ] Analytics events tracked
- [ ] Error monitoring set up
- [ ] Load testing completed
- [ ] Database backups configured
- [ ] API versioning implemented

## Next Steps

1. Develop backend API with endpoints above
2. Set environment variables
3. Update components with API calls
4. Implement authentication state
5. Test all integrations
6. Deploy to production

---

See `DEPLOYMENT.md` for deployment instructions once backend is ready.
