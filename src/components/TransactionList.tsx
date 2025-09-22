'use client';

import { useState, useEffect, useCallback } from 'react';
import { TransactionType } from '@prisma/client';
import { Transaction } from '@/types';

interface FilterOptions {
    search: string;
    type: TransactionType | 'ALL';
    categoryId: string;
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
}

interface TransactionListProps {
    refreshTrigger?: number;
    onEditTransaction?: (transaction: Transaction) => void;
    filters?: FilterOptions;
    onTransactionsChange?: (transactions: Transaction[]) => void;
}

export default function TransactionList({ refreshTrigger, onEditTransaction, filters, onTransactionsChange }: TransactionListProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query parameters from filters
            const queryParams = new URLSearchParams();

            if (filters?.startDate) {
                queryParams.append('startDate', new Date(filters.startDate).toISOString());
            }
            if (filters?.endDate) {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999); // End of day
                queryParams.append('endDate', endDate.toISOString());
            }
            if (filters?.type && filters.type !== 'ALL') {
                queryParams.append('type', filters.type);
            }
            if (filters?.categoryId) {
                queryParams.append('categoryId', filters.categoryId);
            }
            if (filters?.minAmount) {
                queryParams.append('minAmount', filters.minAmount);
            }
            if (filters?.maxAmount) {
                queryParams.append('maxAmount', filters.maxAmount);
            }

            queryParams.append('limit', '1000'); // Get more transactions for filtering

            const url = `/api/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                let filteredTransactions = data.data.transactions;

                // Client-side filtering for search (since API doesn't support text search yet)
                if (filters?.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filteredTransactions = filteredTransactions.filter(
                        (transaction: Transaction) =>
                            transaction.description?.toLowerCase().includes(searchTerm) ||
                            transaction.note?.toLowerCase().includes(searchTerm) ||
                            transaction.category?.name?.toLowerCase().includes(searchTerm)
                    );
                }

                setTransactions(filteredTransactions);

                // Notify parent component of current transactions for export
                if (onTransactionsChange) {
                    onTransactionsChange(filteredTransactions);
                }
            } else {
                setError(data.error || 'Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    }, [filters, onTransactionsChange]);

    useEffect(() => {
        fetchTransactions();
    }, [refreshTrigger, fetchTransactions]);

    const handleDelete = async (transactionId: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            const response = await fetch(`/api/transactions/${transactionId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                // Remove the transaction from the list
                setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction');
        }
    };

    const formatAmount = (amount: number, currency: string, type: TransactionType) => {
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);

        if (type === TransactionType.INCOME) {
            return `+${formatted}`;
        } else if (type === TransactionType.EXPENSE) {
            return `-${formatted}`;
        }
        return formatted;
    };

    const getTransactionTypeIcon = (type: TransactionType) => {
        switch (type) {
            case TransactionType.INCOME:
                return '💰';
            case TransactionType.EXPENSE:
                return '💸';
            case TransactionType.TRANSFER:
                return '🔄';
            case TransactionType.INVESTMENT:
                return '📈';
            case TransactionType.REFUND:
                return '↩️';
            default:
                return '💳';
        }
    };

    const getAmountColor = (type: TransactionType) => {
        switch (type) {
            case TransactionType.INCOME:
                return 'text-green-600';
            case TransactionType.EXPENSE:
                return 'text-red-600';
            default:
                return 'text-slate-600';
        }
    };

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
        );
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
        );
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
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Recent Transactions ({transactions.length})</h2>

            <div className="space-y-3">
                {transactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className={`flex items-center justify-between p-4 border border-slate-200 rounded-lg 
                                   hover:bg-slate-50 transition-colors`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getTransactionTypeIcon(transaction.type)}</div>

                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-medium text-slate-800">{transaction.description || 'No description'}</h3>
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
                                    {transaction.note && <span className="truncate max-w-xs">💬 {transaction.note}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className={`font-semibold ${getAmountColor(transaction.type)}`}>
                                {formatAmount(transaction.amount, transaction.currency, transaction.type)}
                            </span>

                            <div className="flex space-x-1">
                                {onEditTransaction && (
                                    <button
                                        onClick={() => onEditTransaction(transaction)}
                                        className="text-slate-500 hover:text-slate-700 p-1 rounded transition-colors"
                                        title="Edit transaction"
                                    >
                                        ✏️
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(transaction.id)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                    title="Delete transaction"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {transactions.length >= 50 && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-slate-500">Showing latest 50 transactions. Use filters to see more.</p>
                </div>
            )}
        </div>
    );
}
