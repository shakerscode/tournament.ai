# Badminton Tournament Management System

A production-ready, frontend-only badminton tournament management web application built with Next.js 16, Tailwind CSS v4, and GSAP animations. All data is persisted using localStorage.

## 🚀 Features

### ✅ Completed Features

1. **Home Page**
   - Hero section with GSAP entrance animations
   - Transparent header with smooth scroll behavior
   - Animated CTAs with microinteractions
   - Featured players slider with auto-advance (1s interval)
   - Upcoming tournament teaser section

2. **Player Registration**
   - Form with name, phone, category fields
   - Image upload to localStorage (base64)
   - Input validation (required fields, phone format)
   - Pending approval status

3. **Admin Dashboard**
   - View pending player registrations
   - Approve/reject players
   - Record player payments with dates and amounts
   - Add and manage expenses
   - Financial summary (total collected, total expenses, balance)
   - Stats cards showing pending/approved players

4. **Instant Tournament**
   - Select even number of players from approved list
   - Choose tournament duration (1, 2, or 3 days)
   - Generate tournament fixtures algorithmically
   - View tournament list and details
   - Fixture display with team pairings and points tracking
   - Group stage, semifinals, and final matches

5. **Finance & Expenses Page**
   - Player payment tracking table
   - Guest list display
   - Expense list with date and amount
   - Financial totals calculation
   - Balance tracking

6. **Player Slider**
   - GSAP animations for smooth transitions
   - Auto-advance every 1 second (pauses on hover)
   - Small white boxes expand to full player cards
   - Shows player name, category, and social links

7. **Mock Google Auth**
   - Dummy authentication page
   - Toggle between user and admin roles
   - localStorage-based auth state
   - No real OAuth required

8. **Responsive Design**
   - Mobile-first approach
   - Works on all screen sizes
   - Keyboard accessible
   - Proper ARIA labels and semantic HTML

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: GSAP 3.12
- **Database**: localStorage (JSON)
- **Language**: TypeScript
- **Package Manager**: npm/yarn

## 🎨 Color Scheme

- **Primary Red**: `hsl(0, 100%, 50%)` (#FF0000)
- **Secondary Black**: `hsl(0, 0%, 10%)` (#1A1A1A)
- **Accent White**: `hsl(0, 0%, 100%)`
- **Gray Medium**: `hsl(0, 0%, 60%)`

## 📁 Project Structure

```
badminton-tournament-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   ├── register/
│   │   └── page.tsx            # Player registration
│   ├── instant-tournament/
│   │   └── page.tsx            # Tournament creation
│   ├── expenses/
│   │   └── page.tsx            # Finance page
│   └── auth/
│       └── page.tsx            # Mock auth page
├── components/
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Footer component
│   ├── Modal.tsx               # Reusable modal
│   ├── PlayerCard.tsx          # Player display card
│   ├── PlayerSlider.tsx        # Animated player carousel
│   ├── ImageUploader.tsx       # Image upload handler
│   └── TournamentBracket.tsx   # Tournament fixture display
├── lib/
│   ├── localDb.ts              # localStorage wrapper
│   └── fixtures.ts             # Tournament fixture generator
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn installed
- Git (optional)

### Step 1: Clone/Extract Project

```bash
cd badminton-tournament-app
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Run Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start at `http://localhost:3000`

### Step 4: Access Admin Features

1. Go to `http://localhost:3000/auth`
2. Select "Sign in as Admin"
3. Click "Continue with Google" (mock)
4. Navigate to `/admin` to access admin dashboard

## 🗄️ localStorage Database Schema

**Key**: `badminton_db_v1`

```json
{
  "players": [
    {
      "id": "p1",
      "name": "Player Name",
      "category": "Men" | "Women",
      "photo": "data:image/...",
      "phone": "+880...",
      "status": "approved" | "pending" | "rejected",
      "payments": [
        {
          "date": "2025-01-12",
          "amount": 500
        }
      ]
    }
  ],
  "tournaments": [
    {
      "id": "t1234567890",
      "name": "Tournament 2025",
      "durationDays": 1 | 2 | 3,
      "playerIds": ["p1", "p2", "p3", "p4"],
      "matches": [
        {
          "id": "m1234",
          "teamA": {
            "players": ["p1", "p2"],
            "points": 21
          },
          "teamB": {
            "players": ["p3", "p4"],
            "points": 18
          },
          "round": "group" | "semifinal" | "final",
          "completed": true,
          "winnerId": "p1"
        }
      ],
      "createdAt": "2025-01-20T10:30:00Z",
      "status": "active" | "completed" | "cancelled",
      "winner": "p1"
    }
  ],
  "expenses": [
    {
      "id": "e1234",
      "date": "2025-01-15",
      "description": "Court booking",
      "amount": 2000
    }
  ],
  "guests": [
    {
      "id": "g1234",
      "name": "Guest Name"
    }
  ],
  "settings": {
    "theme": "red-black"
  }
}
```

## 🔑 API Methods (lib/localDb.ts)

### Players

```typescript
await getPlayers()                     // Get all players
await getPlayerById(id)               // Get player by ID
await addPlayer(player)               // Add new player
await updatePlayer(id, patch)         // Update player
await deletePlayer(id)                // Delete player
```

### Tournaments

```typescript
await getTournaments()                // Get all tournaments
await getTournamentById(id)           // Get tournament by ID
await addTournament(tournament)       // Create tournament
await updateTournament(id, patch)     // Update tournament
await deleteTournament(id)            // Delete tournament
```

### Expenses

```typescript
await getExpenses()                   // Get all expenses
await addExpense(expense)             // Add expense
await deleteExpense(id)               // Delete expense
```

### Utilities

```typescript
await initializeDb()                  // Initialize with default data
await resetDb()                       // Reset to default data
await clearDb()                       // Clear all data
```

## 🎮 Usage Guide

### For Users

1. **Register as Player**
   - Go to `/register`
   - Fill form with name, phone, category
   - Upload profile photo (optional)
   - Wait for admin approval

2. **Create Tournament**
   - Go to `/instant-tournament`
   - Select 4+ approved players (even number)
   - Choose tournament duration
   - Click "Start Tournament"
   - View generated fixtures

3. **Track Finances**
   - Go to `/expenses`
   - View player payments
   - See expense breakdowns
   - Check balance

### For Admin

1. **Access Admin Dashboard**
   - Go to `/auth`
   - Select "Admin" role
   - Click "Continue with Google"
   - Navigate to `/admin`

2. **Approve Players**
   - View pending registrations
   - Click "Approve" or "Reject"

3. **Record Payments**
   - Click "Record Payment"
   - Select player
   - Enter amount and date
   - Save

4. **Add Expenses**
   - Click "Add Expense"
   - Enter description, amount, date
   - Save

## 🔄 Feature Explanations

### Tournament Fixture Generation

The fixture generator (`lib/fixtures.ts`) creates different match structures based on duration:

- **1-Day**: Single round-robin group matches
- **2-Day**: Group stage + semifinals & finals
- **3-Day**: Extended group stage over 2 days, semifinals & finals on day 3

Each match is for doubles (2v2 teams).

### Player Slider Animation

Uses GSAP timeline to:
- Animate active player card to larger size
- Animate inactive cards to smaller size with reduced opacity
- Auto-advance every 1 second (pauses on hover)
- Smooth easing with 0.5s duration

### Hero Section Animations

GSAP animations for:
- Headline fade-in + slide-up (0.8s)
- Subheadline fade-in (0.6s, staggered)
- CTA buttons scale-in (0.6s, staggered)
- Button hover microinteraction (1.05x scale)

## 🐛 Edge Cases & Constraints

### Odd Player Count

- Error message displayed
- Suggestion to add/remove player
- Tournament creation disabled

### Missing Players

- Marked as "placeholder" in matches
- Admin can edit tournament to replace
- Indicates pending fixture assignments

### Data Persistence

- All data stored in localStorage
- Persists across browser sessions
- Can be reset with "Reset DB" button
- Clear browser cache to fully reset

### Maximum Players

- No hard limit (limited by localStorage ~5-10MB)
- Recommended: 16-32 players per tournament
- Scales to thousands of records

## 🔐 Authentication Notes

The authentication is **mock only** for demo purposes:

- No real OAuth server
- Credentials not validated
- Auth state stored in localStorage
- `isAdmin` flag controls feature access
- Can be toggled manually in browser console:
  ```javascript
  localStorage.setItem('isAdmin', 'true')  // Enable admin
  localStorage.setItem('isAdmin', 'false') // Disable admin
  ```

## 🎨 Customization

### Change Color Scheme

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    red: 'hsl(0, 100%, 50%)',      // Change primary color
    'red-dark': 'hsl(0, 100%, 40%)',
  },
}
```

### Modify Hero Video

Replace gradient in `app/page.tsx`:

```jsx
<div className="bg-cover bg-center" style={{backgroundImage: 'url(/hero.mp4)'}}>
```

### Add New Tournament Duration

Edit `lib/fixtures.ts`:

```typescript
case 4:
  return generateFourDayFixtures(playerIds);
```

## 🚀 Production Deployment

### Vercel

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export

```bash
npm run build
# Outputs to /out directory
```

## 📊 Dummy Data

The app seeds 16 players on first load:

- 15 Men (various statuses)
- 1 Woman
- Pre-set payments for some players
- Mix of approved and pending statuses

## 🐱‍💻 Development Notes

### Recommended VSCode Extensions

- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- ES7+ React/Redux/React-Native snippets

### Code Quality

- Full TypeScript support
- ESLint ready (configure in `.eslintrc`)
- Prettier compatible

### Testing

Jest configuration ready - add tests in:

```
tests/
├── lib/
│   ├── localDb.test.ts
│   └── fixtures.test.ts
└── components/
    └── PlayerCard.test.tsx
```

## 📖 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [GSAP Docs](https://greensock.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🐞 Troubleshooting

### localStorage not working

- Check if localStorage is enabled in browser
- Try in incognito mode
- Clear browser cache and reload

### GSAP animations not showing

- Verify GSAP is installed: `npm list gsap`
- Check if animations have `ref` attached
- Inspect browser console for errors

### Tailwind styles not applied

- Rebuild Tailwind: `npm run dev`
- Check className syntax (not className="...")
- Verify tailwind.config.js content paths

### Admin dashboard blank

- Check localStorage for `isAdmin` flag
- Login at `/auth` as Admin
- Verify browser console for errors

## 📝 License

MIT License - Use freely for personal and commercial projects.

## 👨‍💻 Author

Built by Full-Stack Team

---

**Last Updated**: January 2025

**Version**: 1.0.0

**Status**: Production Ready ✅
