# Deployment Guide

Complete guide for deploying the Badminton Tournament app to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] No console errors in development
- [ ] Build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] localStorage keys finalized
- [ ] UI tested on mobile/tablet/desktop
- [ ] All links working
- [ ] Admin dashboard verified
- [ ] Sample tournaments created and tested
- [ ] Backup of production database taken

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps.

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Configure project
6. Click "Deploy"

Vercel will automatically redeploy on push.

## 🐳 Deploy with Docker

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Step 2: Create .dockerignore

```
node_modules
.git
.gitignore
.next
.env
.env.local
README.md
```

### Step 3: Build and Run

```bash
# Build image
docker build -t badminton-tournament:1.0 .

# Run container
docker run -p 3000:3000 badminton-tournament:1.0
```

### Deploy to Docker Hub

```bash
# Login
docker login

# Tag image
docker tag badminton-tournament:1.0 username/badminton-tournament:latest

# Push
docker push username/badminton-tournament:latest
```

## 📦 Static Export

For static hosting (GitHub Pages, Netlify Static, etc.):

### Step 1: Update next.config.js

```javascript
const nextConfig = {
  output: 'export',
  unoptimized: true,
};
module.exports = nextConfig;
```

### Step 2: Build

```bash
npm run build
# Output in ./out directory
```

### Step 3: Deploy

**GitHub Pages**:
```bash
# Move out/ to docs/
mv out docs

# Commit and push
git add docs/
git commit -m "Deploy: static build"
git push
```

**Netlify**:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=out
```

## ☁️ Deploy to Other Platforms

### AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create badminton-tournament

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku main
```

### DigitalOcean App Platform

1. Push code to GitHub
2. Go to DigitalOcean Dashboard
3. Create > Apps > GitHub > Select repo
4. Choose Node.js runtime
5. Configure environment
6. Deploy

## 🌍 Custom Domain

### Vercel

1. Go to Project Settings
2. Click "Domains"
3. Add custom domain
4. Update DNS records
5. Domain auto-verified

### Other Platforms

Update DNS records:
```
CNAME: your-domain.com -> your-platform-url
```

## 🔒 Environment Variables

Set production environment variables:

```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Badminton Tournament
NEXT_PUBLIC_DB_KEY=badminton_db_v1
```

## 📊 Monitoring

### Vercel Analytics

1. Go to Project Settings
2. Enable Web Analytics
3. View real-time analytics

### Application Monitoring

Add error tracking:
```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:
```javascript
const withSentryConfig = require("@sentry/nextjs/withSentryConfig");

module.exports = withSentryConfig(nextConfig, {
  org: "your-org",
  project: "badminton",
});
```

## 🔄 CI/CD Pipeline

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
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      - run: npm test
      
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] XSS protection enabled
- [ ] CSRF tokens for forms
- [ ] Input validation on all forms
- [ ] No sensitive data in localStorage
- [ ] Environment variables secure
- [ ] Dependencies updated
- [ ] Security headers set
- [ ] Rate limiting enabled

### Next.js Security Headers

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};
```

## 📈 Performance Optimization

### Build Optimization

```bash
# Analyze bundle
npm install --save-dev @next/bundle-analyzer

# Run analysis
ANALYZE=true npm run build
```

### Image Optimization

Vercel auto-optimizes images. For other platforms:

```javascript
// next.config.js
module.exports = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  }
};
```

## 🔄 Database Migration

If moving from localStorage to a database:

### Step 1: Export Data

```javascript
// In browser console
const db = JSON.parse(localStorage.getItem('badminton_db_v1'));
console.log(JSON.stringify(db, null, 2));
// Copy output to file
```

### Step 2: Import Data

```bash
# Create migration script
npm install firebase  # or your chosen backend

# Run migration
node scripts/migrate.js
```

## 📝 Backup & Recovery

### Backup localStorage

```javascript
// Backup
const backup = localStorage.getItem('badminton_db_v1');
console.save(backup, 'badminton_backup.json');

// Restore
localStorage.setItem('badminton_db_v1', backupData);
```

### Create Backup Schedule

Add to GitHub Actions:

```yaml
- name: Backup Database
  run: |
    node scripts/backup.js
    git add backups/
    git commit -m "Backup: $(date)"
    git push
```

## 🚨 Rollback Procedure

If deployment fails:

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback

# Or promote previous
vercel promote <deployment-id>
```

### GitHub Pages

```bash
# Revert commit
git revert <commit-hash>
git push

# Rebuild
npm run build
```

## 📊 Monitoring Dashboard

Create monitoring script:

```javascript
// lib/monitor.ts
export function trackEvent(name: string, data?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log(`Event: ${name}`, data);
  }
}
```

## 🧪 Post-Deployment Testing

- [ ] All pages load
- [ ] Forms submit correctly
- [ ] localStorage works
- [ ] Admin features accessible
- [ ] Responsive design works
- [ ] Animations smooth
- [ ] No console errors
- [ ] Performance acceptable
- [ ] SEO meta tags present
- [ ] Social media sharing works

## 📞 Support & Documentation

### Setup Monitoring

```bash
npm install --save-dev @vercel/speed-insights
```

### Enable Web Analytics

In `next.config.js`:

```javascript
module.exports = {
  analytics: {
    enabled: true,
  },
};
```

## 🎯 Deployment Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Preparation** | 1 day | Code review, testing, security check |
| **Pre-Deployment** | 30 min | Build, test artifacts, env setup |
| **Deployment** | 5-15 min | Upload, configure, verify |
| **Post-Deployment** | 30 min | Smoke tests, monitoring, docs |

## 📚 Useful Commands

```bash
# Build and optimize
npm run build

# Start production server
npm start

# Analyze bundle size
npm run build -- --analyze

# Run tests
npm test

# Check code quality
npm run lint
```

## 🔗 Useful Links

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Docker Docs](https://docs.docker.com)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Sentry Error Tracking](https://sentry.io)

## ✅ Final Checklist

Before going live:

- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Error tracking active
- [ ] Support contact listed
- [ ] Terms of Service defined
- [ ] Privacy Policy created
- [ ] Data retention policy set

---

**Status**: Ready for Production ✅

**Version**: 1.0.0

**Last Updated**: January 2025
