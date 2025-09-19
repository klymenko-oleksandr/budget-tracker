import {PrismaClient} from '@prisma/client';


async function diagnoseDatabaseConnection() {
  console.log('🔍 Diagnosing database connection...\n')
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL environment variable is not set')
    console.log('Please check your .env file and ensure DATABASE_URL is configured')
    return
  }
  
  console.log('✅ DATABASE_URL environment variable is set')
  
  // Parse DATABASE_URL to check format
  try {
    const url = new URL(process.env.DATABASE_URL)
    console.log(`✅ DATABASE_URL format is valid`)
    console.log(`   Protocol: ${url.protocol}`)
    console.log(`   Host: ${url.hostname}`)
    console.log(`   Port: ${url.port || 'default'}`)
    console.log(`   Database: ${url.pathname.slice(1)}`)
    console.log(`   Username: ${url.username || 'not specified'}`)
  } catch (error) {
    console.log('❌ DATABASE_URL format is invalid:', error.message)
    return
  }
  
  // Test Prisma connection
  const prisma = new PrismaClient()
  
  try {
    console.log('\n🔌 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Successfully connected to database')
    
    // Test a simple query
    console.log('\n📊 Testing database query...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database query successful:', result)
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message)
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Suggestions:')
      console.log('   - Make sure PostgreSQL is running')
      console.log('   - Check if the host and port are correct')
      console.log('   - Verify firewall settings')
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Suggestions:')
      console.log('   - Check username and password in DATABASE_URL')
      console.log('   - Verify user has access to the database')
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('\n💡 Suggestions:')
      console.log('   - Create the database first')
      console.log('   - Check database name in DATABASE_URL')
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Run diagnosis
diagnoseDatabaseConnection().catch(console.error)
