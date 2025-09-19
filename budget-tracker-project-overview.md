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

## ✅ Phase 1 – Core App Setup (IN PROGRESS)

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

### 🔜 TO DO (Phase 1 Completion)
- Add `layout.tsx` with shared `<Navbar>`
- Scaffold pages:
  - `/dashboard`
  - `/transactions`
  - `/categories`
- Create initial Prisma schema:
  - `User`, `Transaction`, `Category`, `Account` (optional for now)
- Set up Prisma Client, connect to PostgreSQL
- Add Clerk user ID to Prisma models

---

## 🧱 Prisma Schema (Planned)

\`\`\`prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  transactions Transaction[]
  categories Category[]
  accounts   Account[]
}

model Transaction {
  id          String     @id @default(cuid())
  type        TransactionType
  amount      Float
  date        DateTime
  note        String?
  category    Category?  @relation(fields: [categoryId], references: [id])
  categoryId  String?
  account     Account?   @relation(fields: [accountId], references: [id])
  accountId   String?
  user        User       @relation(fields: [userId], references: [id])
  userId      String
}

model Category {
  id     String        @id @default(cuid())
  name   String
  user   User          @relation(fields: [userId], references: [id])
  userId String
  transactions Transaction[]
}

model Account {
  id     String        @id @default(cuid())
  name   String
  type   String        // e.g., "monobank", "binance"
  currency String      // e.g., "UAH", "USD"
  user   User          @relation(fields: [userId], references: [id])
  userId String
  transactions Transaction[]
}

enum TransactionType {
  spend
  earn
  transfer
  returning
}
\`\`\`

---

## 📊 Roadmap Phases

### Phase 1: App + Auth + DB (✅ ~80% done)
- Auth, UI shell, nav, Clerk integration
- Basic layout and routing
- DB schema (in progress)

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