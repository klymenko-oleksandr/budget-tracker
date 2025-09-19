'use client'

import { useState, useEffect } from 'react'
import { TransactionType } from '@prisma/client'

interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  date: string
  description: string | null
  note: string | null
  category: {
    id: string
    name: string
    color: string
    icon: string
  } | null
  account: {
    id: string
    name: string
  } | null
}

interface TransactionListProps {
  refreshTrigger?: number
}

export default function TransactionList({ refreshTrigger }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [refreshTrigger])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/transactions')
      const data = await response.json()

      if (data.success) {
        setTransactions(data.data.transactions)
      } else {
        setError(data.error || 'Failed to fetch transactions')
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      setError('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        // Remove the transaction from the list
        setTransactions(prev => prev.filter(t => t.id !== transactionId))
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Failed to delete transaction')
    }
  }

  const formatAmount = (amount: number, currency: string, type: TransactionType) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)

    if (type === TransactionType.INCOME) {
      return `+${formatted}`
    } else if (type === TransactionType.EXPENSE) {
      return `-${formatted}`
    }
    return formatted
  }

  const getTransactionTypeIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return '💰'
      case TransactionType.EXPENSE:
        return '💸'
      case TransactionType.TRANSFER:
        return '🔄'
      case TransactionType.INVESTMENT:
        return '📈'
      case TransactionType.REFUND:
        return '↩️'
      default:
        return '💳'
    }
  }

  const getAmountColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME:
        return 'text-green-600'
      case TransactionType.EXPENSE:
        return 'text-red-600'
      default:
        return 'text-slate-600'
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded"></div>
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
            onClick={fetchTransactions}
            className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Recent Transactions</h2>
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4">📝 No transactions yet</p>
          <p className="text-sm text-slate-400">Add your first transaction using the form above!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        Recent Transactions ({transactions.length})
      </h2>
      
      <div className="space-y-3">
        {transactions.map(transaction => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">
                {getTransactionTypeIcon(transaction.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-slate-800">
                    {transaction.description || 'No description'}
                  </h3>
                  {transaction.category && (
                    <span 
                      className="px-2 py-1 text-xs rounded-full text-white"
                      style={{ backgroundColor: transaction.category.color }}
                    >
                      {transaction.category.icon} {transaction.category.name}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  {transaction.note && (
                    <span className="truncate max-w-xs">💬 {transaction.note}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className={`font-semibold ${getAmountColor(transaction.type)}`}>
                {formatAmount(transaction.amount, transaction.currency, transaction.type)}
              </span>
              
              <button
                onClick={() => handleDelete(transaction.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                title="Delete transaction"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {transactions.length >= 50 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-slate-500">
            Showing latest 50 transactions. Use filters to see more.
          </p>
        </div>
      )}
    </div>
  )
}
