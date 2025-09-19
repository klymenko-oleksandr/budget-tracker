'use client';

import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser()

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
    <div className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}! 👋</h1>
        <p className="text-slate-600">Here's your financial overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Balance</h3>
          <p className="text-2xl font-bold text-green-600">$0.00</p>
          <p className="text-xs text-slate-500 mt-1">Coming soon</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-slate-600 mb-2">This Month</h3>
          <p className="text-2xl font-bold text-slate-900">$0.00</p>
          <p className="text-xs text-slate-500 mt-1">Coming soon</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Categories</h3>
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-xs text-slate-500 mt-1">Coming soon</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Transactions</h3>
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-xs text-slate-500 mt-1">Coming soon</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-slate-500">
          <p>No transactions yet. Start by adding your first transaction!</p>
        </div>
      </div>
    </div>
  );
}
