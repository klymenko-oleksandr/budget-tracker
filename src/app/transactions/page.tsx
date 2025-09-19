'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Transaction } from '@/types';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import TransactionEditForm from '@/components/TransactionEditForm';

export default function TransactionsPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTransactionSuccess = () => {
    setShowForm(false)
    setEditingTransaction(null)
    setRefreshTrigger(prev => prev + 1) // Trigger refresh of transaction list
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowForm(false)
  }

  const handleEditCancel = () => {
    setEditingTransaction(null)
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
          <p className="text-yellow-700">Please sign in to view your transactions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transactions 💳</h1>
        <p className="text-slate-600">Track and manage all your income and expenses</p>
      </div>

      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">Manage Transactions</h2>
          <div className="flex gap-3">
            {!showForm && !editingTransaction && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                ➕ Add Transaction
              </button>
            )}
            
            <button
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Transaction Form */}
        {showForm && (
          <TransactionForm 
            onSuccess={handleTransactionSuccess}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Transaction Edit Form */}
        {editingTransaction && (
          <TransactionEditForm
            transaction={editingTransaction}
            onSuccess={handleTransactionSuccess}
            onCancel={handleEditCancel}
          />
        )}

        {/* Transaction List */}
        <TransactionList 
          refreshTrigger={refreshTrigger}
          onEditTransaction={handleEditTransaction}
        />
      </div>
    </div>
  );
}

