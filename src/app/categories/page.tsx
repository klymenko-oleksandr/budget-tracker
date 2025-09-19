'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Category } from '@/types';
import CategoryList from '@/components/CategoryList';
import CategoryForm from '@/components/CategoryForm';

export default function CategoriesPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowCreateForm(false)
  }

  const handleFormSuccess = () => {
    setShowCreateForm(false)
    setEditingCategory(null)
    handleRefresh()
  }

  const handleFormCancel = () => {
    setShowCreateForm(false)
    setEditingCategory(null)
  }

  if (!isLoaded) {
    return (
      <div className="p-10">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="p-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h2>
          <p className="text-yellow-700">Please sign in to view your categories.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-10 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories 🏷️</h1>
        <p className="text-slate-600">Organize your spending with custom categories and budgets</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowCreateForm(true)
            setEditingCategory(null)
          }}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          ➕ Add New Category
        </button>
        
        <button
          onClick={handleRefresh}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Create Category Form */}
      {showCreateForm && (
        <CategoryForm
          mode="create"
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          mode="edit"
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Categories List */}
      <CategoryList
        refreshTrigger={refreshTrigger}
        onEditCategory={handleEditCategory}
      />
    </div>
  );
}

