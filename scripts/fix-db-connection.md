# Fix Prisma "prepared statement s0 already exists" Error

This error occurs when using connection poolers (like Supabase) with Prisma. Here are the solutions:

## Solution 1: Use Connection Parameters with Pooled Connection

Since Supabase doesn't expose direct connections easily, we'll fix the pooled connection:

```bash
# Add connection parameters to your existing pooled connection
DATABASE_URL="postgresql://postgres.lkxyvdmkrrhjkedtrlqn:YOUR_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0"
```

**Key parameters:**
- `pgbouncer=true` - Tells Prisma it's using a connection pooler
- `connection_limit=1` - Limits connections to avoid conflicts
- `pool_timeout=0` - Prevents timeout issues

## Solution 2: Add Connection Parameters

Add these parameters to your DATABASE_URL:

```bash
DATABASE_URL="postgresql://postgres.lkxyvdmkrrhjkedtrlqn:YOUR_PASSWORD@aws-1-eu-north-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
```

## Solution 3: Use Prisma db push instead of migrate

For development, you can use `db push` which doesn't create migration files:

```bash
npx prisma db push --force-reset
```

## Solution 4: Reset and Try Again

If the database has conflicting state:

```bash
# Reset the database
npx prisma db push --force-reset

# Then generate client
npx prisma generate
```

## Recommended Steps:

1. Update your `.env` with the direct connection (port 5432)
2. Run `npx prisma db push --force-reset`
3. Run `npx prisma generate`
4. Test with your diagnostic script

## After Success:

Once the schema is pushed successfully, you can switch back to the pooled connection (port 6543) for your application runtime.
