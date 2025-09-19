import { testCompleteSetup } from '../src/lib/db-test.js'

// Run complete database setup test
testCompleteSetup()
  .then(result => {
    console.log('\n' + '='.repeat(50))
    console.log(result.message)
    console.log('='.repeat(50))
    
    if (result.success) {
      console.log('\n🎉 Phase 1 Complete! Your budget tracker database is ready.')
      console.log('✅ Next: Move to Phase 2 - Budgets + Manual Transaction Input')
    } else {
      console.log('\n❌ Issues found that need to be resolved.')
    }
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message)
  })
