---

## 🧭 Full Project Roadmap (All Planned Phases)

### ✅ Phase 1: Core App Setup (IN PROGRESS)

- Initialize Next.js project with Tailwind, TypeScript
- Integrate Clerk for authentication
- Setup PostgreSQL database with Prisma ORM
- Define initial schema: `User`, `Transaction`, `Category`, `Account`
- Scaffold basic UI pages: `/dashboard`, `/transactions`, `/categories`
- Implement navigation and layout
- Connect Clerk `userId` to Prisma models

### ⏭️ Phase 2: Budgets + Manual Input

- Define `Budget` model (per category per month)
- UI to set, edit, delete budgets
- Input form for manual transactions
- Budget progress tracking widgets
- Basic transaction filters (by type, category, date)

### ⏭️ Phase 3: Monobank & Broker Integration

- Add Monobank token-based sync (API)
- Parse Monobank transaction payloads
- Upload CSV support for IBKR and Freedom Finance
- Normalize transactions and auto-categorize by rules
- Prevent duplicate entries

### ⏭️ Phase 4: Smart Categorization Rules

- Add `Rule` model (conditions + actions)
- UI rule builder (if description includes "Silpo", assign category "Food")
- Apply rules automatically on new imports
- Retroactive rule application

### ⏭️ Phase 5: Charts & Dashboards

- Weekly/monthly/yearly stats
- Pie charts: by category
- Line charts: trends over time
- Budget vs actual per category
- Add `Recharts` or `Chart.js`

### ⏭️ Phase 6: Account & Multi-Currency

- Track per-account balances
- Support transfers between accounts
- Currency field on `Account` and `Transaction`
- Apply exchange rates for stats

### ⏭️ Phase 7: Notifications & Reports

- Alert on overspending categories
- Monthly summary email
- Option to export to Excel / PDF
- Optional PWA or mobile-friendly views

### ⏭️ Phase 8: Optional Binance Integration

- Read-only Binance API integration
- Sync crypto transactions
- Handle multi-wallet logic (optional)
