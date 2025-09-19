import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

/**
 * Get or create a user in the database based on Clerk authentication
 * This function ensures that authenticated users have a corresponding record in our database
 */
export async function getOrCreateUser() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('User not authenticated')
  }

  // Check if user already exists in our database
  let user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id
    }
  })

  // If user doesn't exist, create them
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: clerkUser.firstName && clerkUser.lastName 
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser.firstName || clerkUser.username || null
      }
    })
  }

  return user
}

/**
 * Get the current authenticated user from the database
 * Returns null if user is not authenticated or doesn't exist in database
 */
export async function getCurrentUser() {
  try {
    return await getOrCreateUser()
  } catch (error) {
    return null
  }
}

/**
 * Ensure user exists and return their ID for database operations
 */
export async function requireUser() {
  const user = await getOrCreateUser()
  return user.id
}
