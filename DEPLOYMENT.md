# Deployment Guide for QR Menu Pro

This guide covers deploying QR Menu Pro to various hosting platforms.

## Quick Start - Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps with PWA support.

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit - QR Menu Pro"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

That's it! Your app is live.

### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add your environment variables from `.env.example`
3. Click "Save"

## AWS Deployment

### Using AWS Amplify

1. Connect your GitHub repo to AWS Amplify
2. Amplify auto-detects Next.js framework
3. Configure build settings (use defaults)
4. Deploy

### Using EC2 + PM2

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18

# Clone repository
git clone https://github.com/yourusername/qr-menu-pro.git
cd qr-menu-pro

# Install dependencies
npm install

# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "qr-menu-pro" -- start

# Save PM2 process list
pm2 save
pm2 startup
```

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Build and run

```bash
docker build -t qr-menu-pro .
docker run -p 3000:3000 qr-menu-pro
```

## Railway.app Deployment

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repo
6. Railway auto-detects Next.js
7. Set environment variables
8. Deploy

## Netlify Deployment (Not Recommended for Next.js API)

Netlify works but Vercel is better for Next.js apps with PWA support.

```bash
npm run build
```

Then deploy the `.next` folder as static site.

## Performance Optimization

### 1. Enable Caching Headers

```js
// In next.config.js - already configured
headers: async () => {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'max-age=0, s-maxage=60' }
      ],
    },
  ];
}
```

### 2. CDN Configuration

- Vercel: Automatic with Edge Functions
- AWS: Use CloudFront
- GCP: Use Cloud CDN

### 3. Database Connection (Future)

For production, connect to:
- PostgreSQL (via Prisma)
- MongoDB (via Mongoose)
- Firebase Realtime Database

## SSL/HTTPS

- **Vercel**: Automatic SSL
- **AWS Amplify**: Automatic SSL
- **AWS EC2**: Use AWS Certificate Manager + ALB
- **Railway**: Automatic SSL

## Monitoring

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:

```js
const withSentry = require("@sentry/nextjs/withSentry");

module.exports = withSentry({
  dsn: process.env.SENTRY_DSN,
});
```

### Google Analytics

Already integrated in components via meta tags.

### Datadog

Install Datadog browser SDK for frontend monitoring.

## Database Setup (for future backend)

### PostgreSQL on AWS RDS

```sql
-- Create database
CREATE DATABASE qr_menu_pro;

-- Create tables (example)
CREATE TABLE restaurants (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menus (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Connect in Next.js

```bash
npm install prisma @prisma/client
npx prisma init
```

## Domain Setup

### Vercel
1. Add domain in Vercel Dashboard
2. Update DNS records
3. Auto-renews SSL

### Route 53 (AWS)
1. Create hosted zone
2. Point nameservers
3. Create A record pointing to your server/CloudFront

## Backup & Recovery

- **GitHub**: Code is backed up
- **Database**: Enable automated backups
- **Assets**: Use S3/Cloud Storage

## Security Checklist

- [ ] Environment variables configured
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] Admin credentials secure
- [ ] Database backups enabled
- [ ] DDoS protection enabled
- [ ] Regular security updates
- [ ] Monitoring alerts configured

## Cost Estimation

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vercel | Pro | $20 |
| AWS RDS | db.t3.micro | ~$25 |
| AWS S3 | Standard | ~$5 |
| Datadog | Free | $0 |
| **Total** | | **~$50** |

## Troubleshooting

### Build fails
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PWA not working
- Clear browser cache
- Check manifest.json is served
- Verify service worker registration
- Check browser console for errors

### High memory usage
- Enable Node.js memory limits
- Use PM2 cluster mode
- Optimize database queries

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Support

For deployment issues:
- Check logs in hosting dashboard
- Review `.next/` build output
- Check network tab in browser DevTools
- Contact hosting provider support

---

**Happy Deploying!**
