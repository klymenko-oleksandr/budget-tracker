import { prisma } from './prisma'

export interface DefaultCategory {
  name: string
  description: string
  color: string
  icon: string
  budget?: number
}

/**
 * Default categories that will be created for new users
 */
export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  {
    name: 'Food & Dining',
    description: 'Restaurants, groceries, and food delivery',
    color: '#ef4444',
    icon: '🍽️',
    budget: 500
  },
  {
    name: 'Transportation',
    description: 'Gas, public transport, car maintenance',
    color: '#3b82f6',
    icon: '🚗',
    budget: 200
  },
  {
    name: 'Shopping',
    description: 'Clothing, electronics, and general purchases',
    color: '#8b5cf6',
    icon: '🛍️',
    budget: 300
  },
  {
    name: 'Entertainment',
    description: 'Movies, games, subscriptions, and hobbies',
    color: '#f59e0b',
    icon: '🎬',
    budget: 150
  },
  {
    name: 'Bills & Utilities',
    description: 'Rent, electricity, internet, phone bills',
    color: '#ef4444',
    icon: '📄',
    budget: 800
  },
  {
    name: 'Healthcare',
    description: 'Medical expenses, pharmacy, insurance',
    color: '#10b981',
    icon: '🏥',
    budget: 200
  },
  {
    name: 'Education',
    description: 'Courses, books, training, and learning',
    color: '#6366f1',
    icon: '📚',
    budget: 100
  },
  {
    name: 'Travel',
    description: 'Flights, hotels, vacation expenses',
    color: '#06b6d4',
    icon: '✈️',
    budget: 300
  },
  {
    name: 'Savings',
    description: 'Emergency fund, investments, retirement',
    color: '#22c55e',
    icon: '💰',
    budget: 1000
  },
  {
    name: 'Other',
    description: 'Miscellaneous expenses',
    color: '#6b7280',
    icon: '📦',
    budget: 100
  }
]

/**
 * Create default categories for a user
 */
export async function createDefaultCategories(userId: string) {
  const existingCategories = await prisma.category.findMany({
    where: { userId }
  })

  // Only create default categories if user has no categories yet
  if (existingCategories.length === 0) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map(category => ({
        ...category,
        userId
      }))
    })
  }
}

/**
 * Get all categories for a user, creating defaults if none exist
 */
export async function getUserCategories(userId: string) {
  let categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' }
  })

  // Create default categories if user has none
  if (categories.length === 0) {
    await createDefaultCategories(userId)
    categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    })
  }

  return categories
}
