'use client';

import { useState, useEffect } from 'react';
import { Transaction, Category } from '@/types';

interface TransactionEditFormProps {
    transaction: Transaction;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function TransactionEditForm({ transaction, onSuccess, onCancel }: TransactionEditFormProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        type: transaction.type,
        amount: transaction.amount.toString(),
        date: transaction.date.split('T')[0], // Convert to YYYY-MM-DD format
        categoryId: transaction.categoryId || '',
        description: transaction.description || '',
        note: transaction.note || '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!formData.date) {
            alert('Please select a date');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/transactions/${transaction.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: formData.type,
                    amount: parseFloat(formData.amount),
                    date: new Date(formData.date).toISOString(),
                    categoryId: formData.categoryId || null,
                    description: formData.description.trim() || null,
                    note: formData.note.trim() || null,
                }),
            });

            const data = await response.json();

            if (data.success) {
                if (onSuccess) {
                    onSuccess();
                }
                alert('Transaction updated successfully!');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('Failed to update transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getTransactionTypeIcon = (type: string) => {
        switch (type) {
            case 'INCOME':
                return '💰';
            case 'EXPENSE':
                return '💸';
            case 'TRANSFER':
                return '🔄';
            case 'INVESTMENT':
                return '📈';
            case 'REFUND':
                return '↩️';
            default:
                return '💳';
        }
    };

    const getTransactionTypeColor = (type: string) => {
        switch (type) {
            case 'INCOME':
                return 'text-green-600';
            case 'EXPENSE':
                return 'text-red-600';
            case 'TRANSFER':
                return 'text-blue-600';
            case 'INVESTMENT':
                return 'text-purple-600';
            case 'REFUND':
                return 'text-orange-600';
            default:
                return 'text-slate-600';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Edit Transaction</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTransactionTypeIcon(transaction.type)}</span>
                    <span className={`font-medium ${getTransactionTypeColor(transaction.type)}`}>{transaction.type}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Transaction Type */}
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
                        Transaction Type *
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                        required
                    >
                        <option value="EXPENSE">💸 Expense</option>
                        <option value="INCOME">💰 Income</option>
                        <option value="TRANSFER">🔄 Transfer</option>
                        <option value="INVESTMENT">📈 Investment</option>
                        <option value="REFUND">↩️ Refund</option>
                    </select>
                </div>

                {/* Amount */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
                        Amount *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-500">$</span>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className={`w-full pl-8 pr-3 py-2 border border-slate-300 rounded-md 
                                       focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                            required
                        />
                    </div>
                </div>

                {/* Date */}
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
                        Date *
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 mb-1">
                        Category
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                    >
                        <option value="">Select a category (optional)</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.icon} {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Brief description of the transaction"
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                    />
                </div>

                {/* Note */}
                <div>
                    <label htmlFor="note" className="block text-sm font-medium text-slate-700 mb-1">
                        Note
                    </label>
                    <textarea
                        id="note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Additional notes or details"
                        className={`w-full px-3 py-2 border border-slate-300 rounded-md 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500`}
                    />
                </div>

                {/* Original Transaction Info */}
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-medium text-slate-800 mb-2">Original Transaction:</h3>
                    <div className="text-sm text-slate-600 space-y-1">
                        <p>
                            <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
                        </p>
                        <p>
                            <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Category:</strong>{' '}
                            {transaction.category ? `${transaction.category.icon} ${transaction.category.name}` : 'No category'}
                        </p>
                        {transaction.description && (
                            <p>
                                <strong>Description:</strong> {transaction.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 
                                   focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    >
                        {loading ? 'Updating...' : 'Update Transaction'}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 
                                       focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors`}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
