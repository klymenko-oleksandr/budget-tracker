'use client';

import { memo } from 'react';
import { useDashboardQuery } from '@/queries/dashboard.queries';
import { TimeRanges } from '@/types/time-range.model';
import { formatCostNumber } from '@/lib/utils';

function BudgetOverview() {
    const { data, isLoading: loading, error, refetch } = useDashboardQuery(TimeRanges.month);

    // percentage: 0 - 100
    const ProgressBar = ({ percentage, color, isOverBudget }: { percentage: number; color: string; isOverBudget: boolean }) => (
        <div className="w-full bg-slate-200 rounded-full h-2">
            <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: isOverBudget ? '#ef4444' : color,
                }}
            />
            {percentage > 100 && <div className="text-xs text-red-600 mt-1">{percentage.toFixed(1)}% over budget</div>}
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-md border animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
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
                    <p className="text-red-600 mb-4">❌ {error?.message || 'Failed to fetch dashboard data'}</p>
                    <button
                        onClick={() => refetch()}
                        className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Income</p>
                            <p className="text-2xl font-bold text-green-600">{formatCostNumber(data.summary.totalIncome)}</p>
                        </div>
                        <div className="text-3xl">💰</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-600">{formatCostNumber(data.summary.totalExpenses)}</p>
                        </div>
                        <div className="text-3xl">💸</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Net Income</p>
                            <p className={`text-2xl font-bold ${data.summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCostNumber(data.summary.netIncome)}
                            </p>
                        </div>
                        <div className="text-3xl">{data.summary.netIncome >= 0 ? '📈' : '📉'}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Budget Used</p>
                            <p className="text-2xl font-bold text-slate-800">{data.summary.totalBudgetUsed.toFixed(1)}%</p>
                            <p className="text-sm text-slate-500">{formatCostNumber(data.summary.budgetRemaining)} left</p>
                        </div>
                        <div className="text-3xl">🎯</div>
                    </div>
                </div>
            </div>

            {/* Budget Progress by Category */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-slate-800">Budget Progress by Category</h2>

                {data.categoryAnalytics.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <p className="mb-2">📊 No spending data yet</p>
                        <p className="text-sm">Add some transactions to see your budget progress!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.categoryAnalytics.map((category) => (
                            <div key={category.id} className="border border-slate-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xl">{category.icon}</span>
                                        <span className="font-medium text-slate-800">{category.name}</span>
                                        {category.isOverBudget && (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Over Budget</span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-slate-800">
                                            {formatCostNumber(category.spent)} / {formatCostNumber(category.budget)}
                                        </div>
                                        <div className="text-sm text-slate-500">{formatCostNumber(category.remaining)} remaining</div>
                                    </div>
                                </div>

                                <ProgressBar
                                    percentage={category.percentUsed}
                                    color={category.color}
                                    isOverBudget={category.isOverBudget}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Transactions */}
            {data.recentTransactions.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Recent Transactions</h2>
                    <div className="space-y-3">
                        {data.recentTransactions.slice(0, 5).map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="text-lg">{transaction.type === 'INCOME' ? '💰' : '💸'}</div>
                                    <div>
                                        <div className="font-medium text-slate-800">{transaction.description || 'No description'}</div>
                                        <div className="text-sm text-slate-500">
                                            {new Date(transaction.date).toLocaleDateString()}
                                            {transaction.category && (
                                                <span className="ml-2">
                                                    {transaction.category.icon} {transaction.category.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-semibold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.type === 'INCOME' ? '+' : '-'}
                                    {formatCostNumber(transaction.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(BudgetOverview);
