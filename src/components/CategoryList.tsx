'use client'

import { useState, useEffect } from 'react'
import { Category } from '@/types'

interface CategoryListProps {
  refreshTrigger?: number
  onEditCategory?: (category: Category) => void
}

export default function CategoryList({ refreshTrigger, onEditCategory }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [refreshTrigger])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/categories')
      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
      } else {
        setError(data.error || 'Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the "${categoryName}" category? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        // Remove the category from the list
        setCategories(prev => prev.filter(c => c.id !== categoryId))
        alert('Category deleted successfully!')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'No budget set'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded"></div>
            ))}
          </div>
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
            onClick={fetchCategories}
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Categories</h2>
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4">🏷️ No categories yet</p>
          <p className="text-sm text-slate-400">Categories will be created automatically when you add your first transaction!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Categories ({categories.length})
        </h2>
        <div className="text-sm text-slate-500">
          Manage your spending categories and budgets
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div
            key={category.id}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{category.icon || '📦'}</span>
                <div>
                  <h3 className="font-semibold text-slate-800">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-slate-500 mt-1">{category.description}</p>
                  )}
                </div>
              </div>
              
              {category.color && (
                <div 
                  className="w-4 h-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: category.color }}
                  title={`Category color: ${category.color}`}
                />
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Monthly Budget:</span>
                <span className="font-medium text-slate-800">
                  {formatCurrency(category.budget)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEditCategory && onEditCategory(category)}
                className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded-md hover:bg-slate-200 transition-colors text-sm"
              >
                ✏️ Edit
              </button>
              
              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm"
                title="Delete category"
              >
                🗑️
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-400">
              Created: {new Date(category.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h3 className="font-medium text-slate-800 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Set realistic monthly budgets for each category</li>
          <li>• Use colors and icons to easily identify categories</li>
          <li>• Categories with transactions cannot be deleted</li>
          <li>• Edit budgets anytime to adjust your spending goals</li>
        </ul>
      </div>
    </div>
  )
}
