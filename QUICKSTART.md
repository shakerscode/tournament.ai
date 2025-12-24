# Quick Start Guide

Get the Badminton Tournament app running in 2 minutes!

## 🚀 One-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: **http://localhost:3000**

That's it! 🎉

## 👤 Test Accounts

### User Account
1. Go to http://localhost:3000/auth
2. Select "Sign in as User"
3. Click "Continue with Google"

### Admin Account
1. Go to http://localhost:3000/auth
2. Select "Sign in as Admin"
3. Click "Continue with Google"

## 🎯 What to Try First

### As User
1. **Register a Player**: http://localhost:3000/register
   - Fill in name, phone, select category
   - Upload a photo (optional)
   - Submit to join pending players

2. **Create Tournament**: http://localhost:3000/instant-tournament
   - Select even number of players
   - Choose 1, 2, or 3-day duration
   - Click "Start Tournament"
   - View generated fixtures

3. **Check Finances**: http://localhost:3000/expenses
   - See player payment tracking
   - View total expenses
   - Monitor balance

### As Admin
1. **Go to Dashboard**: http://localhost:3000/admin
   - View pending player registrations
   - Click "Approve" to accept players
   - Record player payments
   - Add tournament expenses

## 📊 Sample Data

The app comes pre-loaded with 16 players:

**Men**: Shaker, Shefat, Sohan, Khabir, Zihad, Shakib, Shaon, Jahangir, Rafi, Soju, Naim, Samir, Shihab, Sojib, Kazi Sobuj

**Women**: Mahi

**Status**: 15 approved, 1 pending (Sohan)

## 🔧 Common Tasks

### Reset All Data
Open browser console (F12) and run:
```javascript
localStorage.removeItem('badminton_db_v1')
location.reload()
```

### Toggle Admin Mode
```javascript
// Enable admin
localStorage.setItem('isAdmin', 'true')

// Disable admin
localStorage.setItem('isAdmin', 'false')

// Check status
localStorage.getItem('isAdmin')
```

### Clear Everything
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

## 📱 Responsive Design

The app works on all devices:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 🖥️ Desktop (1024px+)
- 🖥️ Large screens (1440px+)

Test by pressing F12 and using the device toolbar.

## 🎨 Theme Colors

- **Primary Red**: #FF0000
- **Secondary Black**: #1A1A1A
- **Accent White**: #FFFFFF

Edit `tailwind.config.js` to change colors.

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Styles Not Loading
```bash
# Clear build cache
rm -rf .next
npm run dev
```

### localStorage Not Working
- Try incognito mode
- Check if localStorage is enabled
- Clear browser cache

### GSAP Animations Not Working
- Inspect browser console (F12)
- Check Network tab for GSAP
- Verify GSAP is imported

## 📖 Next Steps

1. Read [README.md](./README.md) for full documentation
2. Explore the [source code](./app)
3. Customize colors and branding
4. Deploy to Vercel or your hosting

## 💡 Pro Tips

- Use **Tab key** to navigate (keyboard accessible)
- Hover over **player slider** to pause auto-advance
- **Admin dashboard** shows financial summaries
- **Tournament fixtures** are auto-generated based on duration
- All data is **persisted in localStorage**

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [GSAP Animations](https://greensock.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🆘 Need Help?

1. Check [README.md](./README.md) for full docs
2. Inspect browser console (F12)
3. Check Network tab for errors
4. Try resetting localStorage

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Ready to Use ✅
