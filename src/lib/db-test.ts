import { prisma } from './prisma'

/**
 * Test database connection and basic operations
 */
export async function testDatabaseConnection() {
  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Test a simple query
    const userCount = await prisma.user.count()
    console.log(`✅ Database query successful - Found ${userCount} users`)

    return {
      success: true,
      message: 'Database connection and queries working properly',
      userCount
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return {
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    await prisma.$disconnect()
  }
}

/**
 * Check if database tables exist by attempting basic operations
 */
export async function checkDatabaseSchema() {
  try {
    // Try to query each main table to verify schema exists
    const checks = await Promise.allSettled([
      prisma.user.findFirst(),
      prisma.category.findFirst(),
      prisma.account.findFirst(),
      prisma.transaction.findFirst()
    ])

    const results = {
      user: checks[0].status === 'fulfilled',
      category: checks[1].status === 'fulfilled',
      account: checks[2].status === 'fulfilled',
      transaction: checks[3].status === 'fulfilled'
    }

    const allTablesExist = Object.values(results).every(Boolean)

    return {
      success: allTablesExist,
      tables: results,
      message: allTablesExist 
        ? 'All database tables exist and are accessible'
        : 'Some database tables are missing or inaccessible'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to check database schema',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Test complete database setup including schema verification
 */
export async function testCompleteSetup() {
  console.log('🧪 Testing complete database setup...\n')
  
  // Test connection
  const connectionTest = await testDatabaseConnection()
  if (!connectionTest.success) {
    return connectionTest
  }
  
  // Test schema
  console.log('🔍 Checking database schema...')
  const schemaTest = await checkDatabaseSchema()
  
  if (schemaTest.success) {
    console.log('✅ All database tables verified:')
    console.log('   - User table: ✅')
    console.log('   - Category table: ✅') 
    console.log('   - Account table: ✅')
    console.log('   - Transaction table: ✅')
  } else {
    console.log('❌ Schema verification failed:', schemaTest.message)
    console.log('   Table status:', schemaTest.tables)
  }
  
  return {
    success: connectionTest.success && schemaTest.success,
    connection: connectionTest,
    schema: schemaTest,
    message: schemaTest.success 
      ? '🎉 Database setup is complete and fully functional!'
      : 'Database setup has issues that need to be resolved'
  }
}
