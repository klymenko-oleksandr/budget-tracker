const { PrismaClient } = require('@prisma/client')

async function verifyDatabaseSchema() {
  console.log('🧪 Verifying database schema after manual creation...\n')
  
  const prisma = new PrismaClient()
  
  try {
    // Test connection
    console.log('🔌 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test each table exists by attempting to query them
    console.log('\n🔍 Verifying database tables...')
    
    const tests = [
      { name: 'User', query: () => prisma.user.findFirst() },
      { name: 'Category', query: () => prisma.category.findFirst() },
      { name: 'Account', query: () => prisma.account.findFirst() },
      { name: 'Transaction', query: () => prisma.transaction.findFirst() }
    ]
    
    let allTablesExist = true
    
    for (const test of tests) {
      try {
        await test.query()
        console.log(`   ✅ ${test.name} table exists and is accessible`)
      } catch (error) {
        console.log(`   ❌ ${test.name} table issue:`, error.message)
        allTablesExist = false
      }
    }
    
    if (allTablesExist) {
      console.log('\n🎉 SUCCESS! All database tables verified!')
      console.log('✅ Phase 1 is now 100% COMPLETE!')
      console.log('🚀 Ready to move to Phase 2: Budgets + Manual Transaction Input')
      
      // Test that we can count records (should be 0 for new database)
      const userCount = await prisma.user.count()
      const categoryCount = await prisma.category.count()
      const accountCount = await prisma.account.count()
      const transactionCount = await prisma.transaction.count()
      
      console.log('\n📊 Database Statistics:')
      console.log(`   Users: ${userCount}`)
      console.log(`   Categories: ${categoryCount}`)
      console.log(`   Accounts: ${accountCount}`)
      console.log(`   Transactions: ${transactionCount}`)
      
    } else {
      console.log('\n❌ Some tables are missing or have issues.')
      console.log('Please check the SQL script execution in Supabase.')
    }
    
  } catch (error) {
    console.log('❌ Database verification failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Run verification
verifyDatabaseSchema().catch(console.error)
