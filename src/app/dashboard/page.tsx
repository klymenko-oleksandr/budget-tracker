'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import BudgetOverview from '@/components/BudgetOverview';
import SpendingChart from '@/components/SpendingChart';

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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
          <p className="text-yellow-700">Please sign in to view your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}! 👋</h1>
        <p className="text-slate-600">Here's your financial overview and spending analytics</p>
      </div>

      <div className="space-y-6">
        {/* Budget Overview */}
        <BudgetOverview />

        {/* Chart Controls */}
        <div className="bg-white p-4 rounded-lg shadow-md border">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">📈 Spending Analytics</h2>
            
            <div className="flex flex-wrap gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
                  className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="year">Last 12 Months</option>
                </select>
              </div>

              {/* Chart Type Selector */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-slate-700">Chart Type:</label>
                <div className="flex border border-slate-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => setChartType('pie')}
                    className={`px-3 py-1 text-sm transition-colors ${
                      chartType === 'pie' 
                        ? 'bg-slate-600 text-white' 
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🥧 Pie
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 text-sm transition-colors border-l border-slate-300 ${
                      chartType === 'bar' 
                        ? 'bg-slate-600 text-white' 
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    📊 Bar
                  </button>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-200 transition-colors text-sm"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Spending Chart */}
        <SpendingChart
          refreshTrigger={refreshTrigger}
          chartType={chartType}
          timeRange={timeRange}
        />
      </div>
    </div>
  );
}
