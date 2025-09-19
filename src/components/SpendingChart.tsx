'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface SpendingData {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  totalSpent: number
  budget: number | null
  transactionCount: number
}

interface SpendingChartProps {
  refreshTrigger?: number
  chartType?: 'pie' | 'bar'
  timeRange?: 'week' | 'month' | 'quarter' | 'year'
}

export default function SpendingChart({ refreshTrigger, chartType = 'pie', timeRange = 'month' }: SpendingChartProps) {
  const [data, setData] = useState<SpendingData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalSpending, setTotalSpending] = useState(0)

  useEffect(() => {
    fetchSpendingData()
  }, [refreshTrigger, timeRange])

  const fetchSpendingData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Calculate date range based on timeRange
      const now = new Date()
      let startDate = new Date()
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3)
          break
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      const response = await fetch(`/api/transactions?startDate=${startDate.toISOString()}&endDate=${now.toISOString()}&limit=1000`)
      const transactionData = await response.json()

      if (transactionData.success) {
        const categoryResponse = await fetch('/api/categories')
        const categoryData = await categoryResponse.json()

        if (categoryData.success) {
          const spendingByCategory = processSpendingData(transactionData.data.transactions, categoryData.data)
          setData(spendingByCategory)
          setTotalSpending(spendingByCategory.reduce((sum, item) => sum + item.totalSpent, 0))
        }
      } else {
        setError(transactionData.error || 'Failed to fetch spending data')
      }
    } catch (error) {
      console.error('Error fetching spending data:', error)
      setError('Failed to fetch spending data')
    } finally {
      setLoading(false)
    }
  }

  const processSpendingData = (transactions: any[], categories: any[]): SpendingData[] => {
    const categoryMap = new Map(categories.map(cat => [cat.id, cat]))
    const spendingMap = new Map<string, SpendingData>()

    // Process transactions to calculate spending by category
    transactions.forEach(transaction => {
      if (transaction.type === 'EXPENSE' && transaction.categoryId) {
        const category = categoryMap.get(transaction.categoryId)
        if (category) {
          const existing = spendingMap.get(transaction.categoryId) || {
            categoryId: transaction.categoryId,
            categoryName: category.name,
            categoryIcon: category.icon || '📦',
            categoryColor: category.color || '#6b7280',
            totalSpent: 0,
            budget: category.budget,
            transactionCount: 0
          }

          existing.totalSpent += transaction.amount
          existing.transactionCount += 1
          spendingMap.set(transaction.categoryId, existing)
        }
      }
    })

    return Array.from(spendingMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week': return 'Last 7 Days'
      case 'month': return 'Last 30 Days'
      case 'quarter': return 'Last 3 Months'
      case 'year': return 'Last 12 Months'
      default: return 'Last 30 Days'
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{data.categoryIcon}</span>
            <span className="font-medium">{data.categoryName}</span>
          </div>
          <div className="space-y-1 text-sm">
            <p><strong>Spent:</strong> {formatCurrency(data.totalSpent)}</p>
            {data.budget && (
              <p><strong>Budget:</strong> {formatCurrency(data.budget)}</p>
            )}
            <p><strong>Transactions:</strong> {data.transactionCount}</p>
            {data.budget && (
              <p><strong>Usage:</strong> {((data.totalSpent / data.budget) * 100).toFixed(1)}%</p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-slate-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">❌ {error}</p>
          <button
            onClick={fetchSpendingData}
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">
          📊 Spending by Category - {getTimeRangeLabel()}
        </h3>
        <div className="text-center py-8">
          <p className="text-slate-500 mb-2">📈 No spending data available</p>
          <p className="text-sm text-slate-400">Add some expense transactions to see your spending breakdown!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          📊 Spending by Category - {getTimeRangeLabel()}
        </h3>
        <div className="text-sm text-slate-600">
          Total: {formatCurrency(totalSpending)}
        </div>
      </div>

      {chartType === 'pie' ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ categoryName, percent }) => `${categoryName} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="totalSpent"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.categoryColor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="categoryName" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="totalSpent" name="Spent" fill="#ef4444" />
              <Bar dataKey="budget" name="Budget" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend for Pie Chart */}
      {chartType === 'pie' && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {data.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.categoryColor }}
              />
              <span className="text-xs">{item.categoryIcon}</span>
              <span className="truncate">{item.categoryName}</span>
              <span className="font-medium">{formatCurrency(item.totalSpent)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-800">{data.length}</div>
            <div className="text-xs text-slate-500">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalSpending)}</div>
            <div className="text-xs text-slate-500">Total Spent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {data.reduce((sum, item) => sum + item.transactionCount, 0)}
            </div>
            <div className="text-xs text-slate-500">Transactions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.reduce((sum, item) => sum + (item.budget || 0), 0))}
            </div>
            <div className="text-xs text-slate-500">Total Budget</div>
          </div>
        </div>
      </div>
    </div>
  )
}
