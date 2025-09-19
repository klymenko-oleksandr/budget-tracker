'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';

export default function TransactionsPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTransactionSuccess = () => {
    setShowForm(false)
    setRefreshTrigger(prev => prev + 1) // Trigger refresh of transaction list
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
        {/* Add Transaction Button/Form */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">Manage Transactions</h2>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              ➕ Add Transaction
            </button>
          )}
        </div>

        {/* Transaction Form */}
        {showForm && (
          <TransactionForm 
            onSuccess={handleTransactionSuccess}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Transaction List */}
        <TransactionList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

