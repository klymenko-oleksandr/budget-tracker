'use client';

import { useState } from 'react';
import { Transaction } from '@/types';

interface TransactionExportProps {
    transactions: Transaction[];
    filters?: any;
}

export default function TransactionExport({ transactions }: TransactionExportProps) {
    const [isExporting, setIsExporting] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const exportToCSV = async () => {
        if (transactions.length === 0) {
            alert('No transactions to export!');
            return;
        }

        setIsExporting(true);

        try {
            // Create CSV headers
            const headers = ['Date', 'Type', 'Amount', 'Currency', 'Category', 'Description', 'Note'];

            // Create CSV rows
            const rows = transactions.map((transaction) => [
                new Date(transaction.date).toLocaleDateString(),
                transaction.type,
                transaction.amount.toString(),
                transaction.currency,
                transaction.category?.name || 'No category',
                transaction.description || '',
                transaction.note || '',
            ]);

            // Combine headers and rows
            const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(',')).join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');

            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            alert(`Successfully exported ${transactions.length} transactions to CSV!`);
        } catch (error) {
            console.error('Error exporting transactions:', error);
            alert('Failed to export transactions. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const exportSummary = () => {
        const totalIncome = transactions.filter((t) => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions.filter((t) => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

        const netIncome = totalIncome - totalExpenses;

        const categoryBreakdown = transactions
            .filter((t) => t.type === 'EXPENSE' && t.category)
            .reduce(
                (acc, t) => {
                    const categoryName = t.category!.name;
                    acc[categoryName] = (acc[categoryName] || 0) + t.amount;
                    return acc;
                },
                {} as Record<string, number>
            );

        return {
            totalTransactions: transactions.length,
            totalIncome,
            totalExpenses,
            netIncome,
            categoryBreakdown,
        };
    };

    const summary = exportSummary();

    if (transactions.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">📊 Export & Summary</h3>
                <div className="text-sm text-slate-600">{transactions.length} transactions</div>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-800">{summary.totalTransactions}</div>
                    <div className="text-xs text-slate-500">Total</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{formatCurrency(summary.totalIncome)}</div>
                    <div className="text-xs text-slate-500">Income</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</div>
                    <div className="text-xs text-slate-500">Expenses</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className={`text-lg font-bold ${summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(summary.netIncome)}
                    </div>
                    <div className="text-xs text-slate-500">Net</div>
                </div>
            </div>

            {/* Top Categories */}
            {Object.keys(summary.categoryBreakdown).length > 0 && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Top Spending Categories:</h4>
                    <div className="space-y-1">
                        {Object.entries(summary.categoryBreakdown)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([category, amount]) => (
                                <div key={category} className="flex justify-between text-sm">
                                    <span className="text-slate-600">{category}</span>
                                    <span className="font-medium text-slate-800">{formatCurrency(amount)}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Export Button */}
            <div className="flex gap-2">
                <button
                    onClick={exportToCSV}
                    disabled={isExporting}
                    className={`flex-1 bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 
                               focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                    {isExporting ? '📤 Exporting...' : '📤 Export to CSV'}
                </button>
            </div>

            <div className="mt-3 text-xs text-slate-500">
                💡 CSV export includes all filtered transactions with date, type, amount, category, and description.
            </div>
        </div>
    );
}
