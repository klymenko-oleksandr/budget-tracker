import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateUser, getUserCategories } from '@/lib/user'
import { prisma } from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

// GET /api/dashboard - Get dashboard data with budget summaries and spending analytics
export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateUser()
    const { searchParams } = new URL(request.url)
    
    // Get date range (default to current month)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : startOfMonth
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : endOfMonth

    // Get user categories with budgets
    const categories = await getUserCategories(user.id)

    // Get transactions for the date range
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true
      }
    })

    // Calculate spending by category
    const spendingByCategory = new Map<string, number>()
    const incomeByCategory = new Map<string, number>()
    
    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach(transaction => {
      const categoryId = transaction.categoryId || 'uncategorized'
      const amount = transaction.amount

      if (transaction.type === TransactionType.INCOME) {
        totalIncome += amount
        incomeByCategory.set(categoryId, (incomeByCategory.get(categoryId) || 0) + amount)
      } else if (transaction.type === TransactionType.EXPENSE) {
        totalExpenses += amount
        spendingByCategory.set(categoryId, (spendingByCategory.get(categoryId) || 0) + amount)
      }
    })

    // Calculate budget vs spending for each category
    const categoryAnalytics = categories.map(category => {
      const spent = spendingByCategory.get(category.id) || 0
      const budget = category.budget || 0
      const remaining = budget - spent
      const percentUsed = budget > 0 ? (spent / budget) * 100 : 0

      return {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        budget,
        spent,
        remaining,
        percentUsed: Math.min(percentUsed, 100),
        isOverBudget: spent > budget && budget > 0
      }
    })

    // Add uncategorized transactions if any
    const uncategorizedSpent = spendingByCategory.get('uncategorized') || 0
    if (uncategorizedSpent > 0) {
      categoryAnalytics.push({
        id: 'uncategorized',
        name: 'Uncategorized',
        color: '#6b7280',
        icon: '📦',
        budget: 0,
        spent: uncategorizedSpent,
        remaining: -uncategorizedSpent,
        percentUsed: 0,
        isOverBudget: false
      })
    }

    // Calculate total budgets
    const totalBudget = categories.reduce((sum, cat) => sum + (cat.budget || 0), 0)
    const totalBudgetUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0

    // Recent transactions (last 10)
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id
      },
      include: {
        category: true,
        account: true
      },
      orderBy: {
        date: 'desc'
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses,
          totalBudget,
          totalBudgetUsed: Math.min(totalBudgetUsed, 100),
          budgetRemaining: totalBudget - totalExpenses
        },
        categoryAnalytics: categoryAnalytics.sort((a, b) => b.spent - a.spent),
        recentTransactions,
        dateRange: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
    }, { status: 500 })
  }
}
