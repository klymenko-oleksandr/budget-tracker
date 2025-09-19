'use client'

import { useState, useEffect } from 'react'
import { TransactionType } from '@prisma/client'
import { Category } from '@/types'

export interface FilterOptions {
  search: string
  type: TransactionType | 'ALL'
  categoryId: string
  startDate: string
  endDate: string
  minAmount: string
  maxAmount: string
}

interface TransactionFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
}

export default function TransactionFilters({ onFiltersChange, onReset }: TransactionFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    type: 'ALL',
    categoryId: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  })
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      search: '',
      type: 'ALL',
      categoryId: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    }
    setFilters(resetFilters)
    onReset()
  }

  const getQuickDateRange = (range: 'today' | 'week' | 'month' | 'quarter' | 'year') => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let startDate = new Date(today)
    
    switch (range) {
      case 'today':
        break
      case 'week':
        startDate.setDate(today.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(today.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(today.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1)
        break
    }

    setFilters(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }))
  }

  const hasActiveFilters = () => {
    return filters.search || 
           filters.type !== 'ALL' || 
           filters.categoryId || 
           filters.startDate || 
           filters.endDate || 
           filters.minAmount || 
           filters.maxAmount
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center">
          🔍 Filter Transactions
          {hasActiveFilters() && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-600 hover:text-slate-800 text-sm"
          >
            {isExpanded ? '▼ Less' : '▶ More'}
          </button>
          {hasActiveFilters() && (
            <button
              onClick={handleReset}
              className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Search and Type - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Search Description
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search transactions..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Transaction Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">💰 Income</option>
              <option value="EXPENSE">💸 Expense</option>
              <option value="TRANSFER">🔄 Transfer</option>
              <option value="INVESTMENT">📈 Investment</option>
              <option value="REFUND">↩️ Refund</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Date Range Buttons */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quick Date Ranges
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => getQuickDateRange('today')}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors text-sm"
                >
                  Today
                </button>
                <button
                  onClick={() => getQuickDateRange('week')}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors text-sm"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => getQuickDateRange('month')}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors text-sm"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => getQuickDateRange('quarter')}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors text-sm"
                >
                  Last 3 Months
                </button>
                <button
                  onClick={() => getQuickDateRange('year')}
                  className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors text-sm"
                >
                  Last Year
                </button>
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Min Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Max Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Summary */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            <span className="font-medium">Active filters:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.search && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.type !== 'ALL' && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Type: {filters.type}
                </span>
              )}
              {filters.categoryId && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  Category: {categories.find(c => c.id === filters.categoryId)?.name}
                </span>
              )}
              {(filters.startDate || filters.endDate) && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                  Date Range
                </span>
              )}
              {(filters.minAmount || filters.maxAmount) && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  Amount Range
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
