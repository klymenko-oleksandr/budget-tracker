# 🧾 Project Intro: Budget Tracker App (with Monobank & Brokers)

## 🎯 Project Goal
Build a full-featured **budget tracker app** with:
- Monobank integration
- Custom budgets per category
- Manual/CSV upload from brokers (IBKR, Freedom Finance)
- Optional Binance integration
- Smart rules to auto-categorize
- Graphs & widgets (weekly/monthly stats)
- Custom asset tracking (real estate, crypto, etc.)

---

## 🛠️ Tech Stack

| Layer        | Tech                                |
|--------------|-------------------------------------|
| Frontend     | **Next.js (App Router)** + TypeScript |
| Styling      | Tailwind CSS + shadcn/ui (`slate`)  |
| Auth         | Clerk (`@clerk/nextjs`)             |
| Backend API  | Next.js API routes (for now)        |
| ORM / DB     | Prisma + PostgreSQL                 |
| Charts       | Recharts / Chart.js (planned)       |
| Hosting      | Vercel (planned)                    |

---

## ✅ Phase 1 – Core App Setup (100% COMPLETE)

### ✅ DONE
- Initialized Next.js app with TypeScript, Tailwind
- Installed `@clerk/nextjs`
- Configured Clerk with middleware
- Set up `.env` with:
  - `NEXT_PUBLIC_CLERK_FRONTEND_API`
  - `CLERK_SECRET_KEY`
- Created `middleware.ts` with `clerkMiddleware`
- Chose `slate` as base Tailwind color
- Added navigation UI inside `app/page.tsx` with Clerk-based auth state
- Added `layout.tsx` with shared `<Navbar>`
- Scaffold pages:
    - `/dashboard`
    - `/transactions`
    - `/categories`
- **✅ Created comprehensive Prisma schema:**
  - `User` model with `clerkId` integration
  - `Transaction` model with currency support
  - `Category` model with budget tracking
  - `Account` model for multiple account types
  - Proper relationships and indexes
- **✅ Set up Prisma Client** (`/src/lib/prisma.ts`)
- **✅ Generated Prisma Client** (synced with schema)
- **✅ Created Clerk-Prisma integration utilities** (`/src/lib/user.ts`):
  - `getOrCreateUser()` - Auto-creates DB users from Clerk
  - `getCurrentUser()` - Safe user retrieval
  - `requireUser()` - For protected operations
- **✅ Built default categories system** (`/src/lib/default-categories.ts`):
  - 10 predefined categories with budgets, colors, icons
  - Auto-creation for new users
- **✅ Added database testing utilities** (`/src/lib/db-test.ts`)

### ✅ COMPLETED (Phase 1 Final Steps)
- **✅ Created database schema** via manual SQL execution in Supabase
- **✅ Generated Prisma Client** and verified compatibility
- **✅ Tested full database functionality** - All tables accessible
- **✅ Verified all utility functions** work with the database

---

## 🧱 Prisma Schema (✅ IMPLEMENTED)

\`\`\`prisma
model User {
  id           String        @id @default(cuid())
  clerkId      String        @unique // Clerk user ID for authentication
  email        String        @unique
  name         String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  transactions Transaction[]
  accounts     Account[]
  categories   Category[]
}

model Transaction {
  id          String          @id @default(cuid())
  type        TransactionType
  amount      Float
  currency    String          @default("USD") // USD, UAH, EUR, etc.
  date        DateTime
  description String?
  note        String?
  category    Category?       @relation(fields: [categoryId], references: [id])
  categoryId  String?
  account     Account?        @relation(fields: [accountId], references: [id])
  accountId   String?
  user        User            @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@index([userId])
  @@index([date])
  @@index([categoryId])
}

model Category {
  id           String        @id @default(cuid())
  name         String
  description  String?
  color        String?       // Hex color for UI display
  icon         String?       // Icon identifier for UI
  budget       Float?        // Monthly budget for this category
  user         User          @relation(fields: [userId], references: [id])
  userId       String
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@unique([name, userId]) // Unique category names per user
  @@index([userId])
}

model Account {
  id           String        @id @default(cuid())
  name         String
  type         AccountType   @default(manual)
  currency     String        @default("USD")
  balance      Float         @default(0)
  isActive     Boolean       @default(true)
  // Integration specific fields
  apiToken     String?       // For Monobank, Binance, etc.
  apiSecret    String?       // Encrypted API secrets
  lastSyncAt   DateTime?
  user         User          @relation(fields: [userId], references: [id])
  userId       String
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@index([userId])
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
  INVESTMENT
  REFUND
}

enum AccountType {
  manual      // Manually added transactions
  monobank    // Monobank integration
  binance     // Binance integration
  broker      // IBKR, Freedom Finance CSV uploads
  crypto      // Other crypto exchanges
  bank        // Other bank integrations
}
\`\`\`

---

## 📊 Roadmap Phases

### Phase 1: App + Auth + DB (✅ 100% COMPLETE)
- ✅ Auth, UI shell, nav, Clerk integration
- ✅ Basic layout and routing
- ✅ Comprehensive DB schema with Clerk integration
- ✅ Prisma Client setup and generation
- ✅ User management utilities (`/src/lib/user.ts`)
- ✅ Default categories system (`/src/lib/default-categories.ts`)
- ✅ Database testing utilities (`/src/lib/db-test.ts`)
- ✅ Database schema created via manual SQL execution
- ✅ Full database functionality verified and tested

### Phase 2: Budgets + Manual Transaction Input
- Monthly budgets per category
- Add/edit/delete transactions
- Show spend vs budget with charts

### Phase 3: Monobank Sync + CSV Upload
- Monobank integration (via token)
- IBKR/Freedom CSV parsing
- Rule engine for auto-categorizing

### Phase 4: Graphs, Widgets, Reports
- Weekly/monthly/yearly stats
- Budget progress widgets
- Category analytics

### Phase 5: Multi-currency, Transfers, Notifications
- Support for USD, UAH, crypto
- Transfer tracking
- Email alerts or mobile PWA

---

## 🧩 Current Setup Commands

\`\`\`bash
npx create-next-app@latest budget-tracker --app --typescript --tailwind --eslint --src-dir
npm install @clerk/nextjs prisma @prisma/client
npx prisma init
\`\`\`
