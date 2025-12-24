# Acceptance Criteria & Testing Checklist

Complete testing checklist for all deliverables.

## ✅ Phase 1: Admin Dashboard

### Core Features
- [ ] Access admin dashboard at `/admin`
- [ ] View pending player registrations table
- [ ] View pending player count in stats
- [ ] View approved player count in stats
- [ ] View total expenses in stats
- [ ] View total collected amount in stats
- [ ] View remaining balance in stats

### Player Approval/Rejection
- [ ] See list of pending players (Sohan should be pending)
- [ ] Click "Approve" button for pending player
- [ ] Player status changes to "approved"
- [ ] Click "Reject" button for pending player
- [ ] Player status changes to "rejected"
- [ ] Page updates automatically after action

### Payment Recording
- [ ] Click "Record Payment" button
- [ ] Modal opens with player selector
- [ ] Can select from approved players only
- [ ] Can enter payment amount
- [ ] Can select payment date
- [ ] Click "Record Payment" to save
- [ ] Payment appears in player payment history
- [ ] Total collected amount updates in stats

### Expense Management
- [ ] Click "Add Expense" button
- [ ] Modal opens with expense form
- [ ] Can enter expense description
- [ ] Can enter expense amount
- [ ] Can select expense date
- [ ] Click "Add Expense" to save
- [ ] Expense appears in expenses table
- [ ] Total expenses updates in stats
- [ ] Can delete expense

### Authorization
- [ ] Non-admin users cannot access `/admin`
- [ ] Admin flag in localStorage controls access
- [ ] Can toggle admin mode: `localStorage.setItem('isAdmin', 'true')`

---

## ✅ Phase 2: Player Registration

### Form Fields
- [ ] Name field is required
- [ ] Phone field is required
- [ ] Category selector defaults to "Men"
- [ ] Can select "Men" or "Women" category
- [ ] Photo upload is optional

### Validation
- [ ] Submit disabled if name is empty
- [ ] Submit disabled if phone is empty
- [ ] Error shows for missing name
- [ ] Error shows for invalid phone (less than 10 digits)
- [ ] Success message shows after registration
- [ ] Redirects to home after 2 seconds

### Image Upload
- [ ] Click upload area triggers file picker
- [ ] Can select image files (PNG, JPG, GIF)
- [ ] Preview shows after selection
- [ ] Can remove image with X button
- [ ] File size validation (max 2MB)
- [ ] Error shows for non-image files
- [ ] Image saved as base64 in localStorage

### Registration Status
- [ ] New players start with "pending" status
- [ ] Players appear in admin dashboard pending list
- [ ] Players appear in admin dashboard after approval

---

## ✅ Phase 3: Home Page

### Header
- [ ] Header is transparent over hero
- [ ] Header becomes opaque on scroll
- [ ] Logo links to home
- [ ] Navigation links visible on desktop
- [ ] "Admin" link visible only for admins
- [ ] Navigation links work

### Hero Section
- [ ] Headline "Play Fast. Win Faster." displays
- [ ] Subheadline displays below
- [ ] "Instant Tournament" button visible
- [ ] "Register Now" button visible
- [ ] Hero has gradient background
- [ ] GSAP animations on load:
  - [ ] Headline fades in and slides up
  - [ ] Subheadline fades in
  - [ ] CTA buttons scale in with stagger
- [ ] Button hover animations work (1.05x scale)
- [ ] Buttons link to correct pages

### Player Slider
- [ ] Shows featured players section
- [ ] Displays approved players only
- [ ] Auto-advances every 1 second
- [ ] Pauses on hover
- [ ] Resumes after hover ends
- [ ] Small white boxes visible
- [ ] Active player card scales up larger
- [ ] Inactive cards scale down
- [ ] Shows player name and category on active card
- [ ] Indicator dots below slider
- [ ] Can click dots to jump to player
- [ ] Smooth GSAP transitions

### Tournament Section
- [ ] "Tournament 2025 is Coming Soon" section displays
- [ ] Shows 3 feature cards (Schedule, Players, Prizes)
- [ ] "Register Interest" button present

### CTA Section
- [ ] "Ready to Start?" section at bottom
- [ ] "Create Tournament Now" button links to `/instant-tournament`

### Responsive Design
- [ ] Mobile layout works (< 768px)
- [ ] Tablet layout works (768px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Text is readable on all sizes
- [ ] Buttons are clickable on mobile

### Performance
- [ ] Page loads quickly
- [ ] GSAP animations are smooth (60fps)
- [ ] No layout shift on animations
- [ ] Hero content visible immediately

---

## ✅ Phase 4: Instant Tournament

### Tournament List View
- [ ] Shows list of created tournaments
- [ ] Each tournament card shows:
  - [ ] Tournament name
  - [ ] Duration (days)
  - [ ] Player count
  - [ ] Match count
  - [ ] Status badge
- [ ] "Create New Tournament" button present
- [ ] Click tournament to view details
- [ ] Click button to go to create page

### Tournament Creation

#### Player Selection
- [ ] Shows list of approved players only
- [ ] Player cards clickable
- [ ] Selected players highlighted with ring
- [ ] Selection indicator (✓) visible
- [ ] Player count displays ("X players selected")
- [ ] Can select multiple players
- [ ] Can deselect players

#### Duration Selection
- [ ] 3 duration buttons (1, 2, 3 days)
- [ ] Currently selected duration highlighted
- [ ] Can change duration selection
- [ ] Defaults to 1 day

#### Validation
- [ ] Error if less than 4 players selected
- [ ] Error if odd number of players selected
- [ ] Suggestion to add/remove players
- [ ] "Start Tournament" button disabled if invalid
- [ ] Shows helpful message for odd count

#### Tournament Creation
- [ ] Click "Start Tournament" with valid data
- [ ] Shows loading state
- [ ] Generates fixtures based on duration
- [ ] Saves tournament to localStorage
- [ ] Redirects to tournament details page
- [ ] Success state shows

### Tournament Details View
- [ ] Shows tournament name
- [ ] Shows duration
- [ ] Shows player count
- [ ] Shows match count
- [ ] Shows tournament status
- [ ] "Back to Tournaments" button works

### Tournament Bracket

#### Match Display
- [ ] Group stage matches displayed first
- [ ] Semifinals displayed next
- [ ] Final match displayed last
- [ ] Each match shows:
  - [ ] Team A players
  - [ ] Team B players
  - [ ] "vs" separator
  - [ ] Points if completed

#### Match Structure
- [ ] Each team has 2 players (doubles)
- [ ] Teams properly paired
- [ ] All players from tournament included
- [ ] No duplicate players in same team
- [ ] Placeholders for semifinal/final teams

#### 1-Day Tournament
- [ ] Generates group stage matches only
- [ ] No semininals or finals
- [ ] 4 players = 1 match
- [ ] 8 players = 2 matches
- [ ] Proper round-robin structure

#### 2-Day Tournament
- [ ] Day 1: Group stage matches
- [ ] Day 2: Semifinals and finals
- [ ] Finals match present
- [ ] Proper progression structure

#### 3-Day Tournament
- [ ] Days 1-2: Extended group stage
- [ ] Day 3: Semifinals and finals
- [ ] More matches than 1-day
- [ ] All three rounds present

### Edge Cases
- [ ] Odd players error prevents creation
- [ ] Less than 4 players error shows
- [ ] Minimum player selection enforced
- [ ] Even number required enforced

---

## ✅ Phase 5: Finance & Expenses

### Player Payments Table
- [ ] Shows all approved players
- [ ] Displays columns:
  - [ ] Player Name
  - [ ] Category
  - [ ] Amount Paid
  - [ ] Last Payment date
- [ ] Amount shows total of all payments
- [ ] Last payment shows most recent date
- [ ] "-" shows for no payments
- [ ] Green color for amounts

### Guests Table
- [ ] Shows guest list (if any)
- [ ] Displays guest names
- [ ] Empty state if no guests

### Expenses List
- [ ] Shows all expenses
- [ ] Sorted by most recent first
- [ ] Displays columns:
  - [ ] Description
  - [ ] Amount (right-aligned)
  - [ ] Date
- [ ] Clickable expense items
- [ ] Hover effect on items

### Financial Summary Cards
- [ ] Total Expenses card shows:
  - [ ] Label "Total Expenses"
  - [ ] Amount in red
  - [ ] Correct calculation
- [ ] Total Collected card shows:
  - [ ] Label "Total Collected"
  - [ ] Amount in green
  - [ ] Correct calculation
- [ ] Remaining Balance card shows:
  - [ ] Label "Balance"
  - [ ] Green if positive
  - [ ] Red if negative
  - [ ] Correct calculation

### Calculations
- [ ] Total Expenses = sum of all expenses
- [ ] Total Collected = sum of all payments
- [ ] Remaining = Collected - Expenses
- [ ] Updates in real-time

### Responsive Design
- [ ] Mobile layout stacks vertically
- [ ] Tablet shows 2-column layout
- [ ] Desktop shows 3-column layout
- [ ] Tables scroll on mobile
- [ ] Numbers format with commas (৳1,000)

---

## ✅ Mock Authentication

### Access Admin
- [ ] Go to `/auth`
- [ ] See role selection (User/Admin)
- [ ] Click "Continue with Google"
- [ ] Redirects to home page
- [ ] `isAdmin` flag set in localStorage
- [ ] Admin link appears in header

### Switch Roles
- [ ] Can select different role
- [ ] Login as User
- [ ] Go to `/auth` again
- [ ] Select Admin
- [ ] Login as Admin
- [ ] Admin features now accessible

### Console Toggle
- [ ] Open browser console (F12)
- [ ] Run: `localStorage.setItem('isAdmin', 'true')`
- [ ] Refresh page
- [ ] Admin features appear
- [ ] Run: `localStorage.setItem('isAdmin', 'false')`
- [ ] Refresh page
- [ ] Admin features disappear

---

## ✅ General Features

### Header Navigation
- [ ] Home link works
- [ ] Instant Tournament link works
- [ ] Expenses link works
- [ ] Register link works
- [ ] Admin link appears for admins
- [ ] Header scrolls with page
- [ ] Logo links to home

### Footer
- [ ] Displays on all pages
- [ ] Shows company info
- [ ] Shows quick links
- [ ] Shows social links
- [ ] Displays copyright year

### Modals
- [ ] Open and close properly
- [ ] Close button works
- [ ] Escape key closes
- [ ] Backdrop click closes
- [ ] Overlay prevents scroll
- [ ] Title displays

### Data Persistence
- [ ] New player saved to localStorage
- [ ] Tournament saved to localStorage
- [ ] Payment saved to localStorage
- [ ] Expense saved to localStorage
- [ ] Data persists on refresh
- [ ] Data persists on navigate

### Responsive Design
- [ ] Mobile (320px) - readable, usable
- [ ] Tablet (768px) - good layout
- [ ] Desktop (1024px+) - optimal layout
- [ ] No horizontal scroll (unless needed)
- [ ] Touch targets 44px+ on mobile
- [ ] Text readable at all sizes

### Accessibility
- [ ] Keyboard navigation works (Tab key)
- [ ] Focus visible on buttons
- [ ] Form labels associated
- [ ] Color not only indicator
- [ ] Alt text on images
- [ ] ARIA labels on icons
- [ ] Semantic HTML used

---

## 🗄️ localStorage Data Validation

Run in browser console:
```javascript
// View database
const db = JSON.parse(localStorage.getItem('badminton_db_v1'));
console.log(db);

// Check players
console.log(db.players);

// Check tournaments
console.log(db.tournaments);

// Check expenses
console.log(db.expenses);

// Check guests
console.log(db.guests);
```

Verify:
- [ ] Players array has 16 items initially
- [ ] Tournaments array updates after creation
- [ ] Expenses array updates after addition
- [ ] All data has proper IDs
- [ ] Statuses are valid values

---

## 🐛 Bug Report Template

If you find an issue:

```markdown
**Title**: [Feature] Brief description

**Steps to reproduce**:
1. Go to [page]
2. Click [button]
3. Enter [data]
4. Expected: [what should happen]
5. Actual: [what happened]

**Browser**: [Chrome/Firefox/Safari]
**Device**: [Mobile/Tablet/Desktop]
**OS**: [Windows/Mac/Linux]
```

---

## ✨ Performance Checklist

- [ ] Page load < 3s
- [ ] Animations smooth (60fps)
- [ ] No layout shift (CLS < 0.1)
- [ ] First input delay < 100ms
- [ ] Largest Contentful Paint < 2.5s

---

**Status**: All criteria ready for testing ✅

**Last Updated**: January 2025

**Version**: 1.0.0
