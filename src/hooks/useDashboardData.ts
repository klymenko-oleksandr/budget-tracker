import { useQuery } from '@tanstack/react-query';

export interface CategoryAnalytic {
    id: string;
    name: string;
    color: string;
    icon: string;
    budget: number;
    spent: number;
    remaining: number;
    percentUsed: number;
    isOverBudget: boolean;
}

export interface DashboardData {
    summary: {
        totalIncome: number;
        totalExpenses: number;
        netIncome: number;
        totalBudget: number;
        totalBudgetUsed: number;
        budgetRemaining: number;
    };
    categoryAnalytics: CategoryAnalytic[];
    recentTransactions: any[];
    dateRange: {
        startDate: string;
        endDate: string;
    };
}

export interface SpendingData {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    totalSpent: number;
    budget: number | null;
    transactionCount: number;
}

const fetchDashboardData = async (timeRange?: string): Promise<DashboardData> => {
    const params = new URLSearchParams();

    if (timeRange) {
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        params.set('startDate', startDate.toISOString());
        params.set('endDate', now.toISOString());
    }

    const response = await fetch(`/api/dashboard?${params.toString()}`);
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
    }

    return result.data;
};

export const useDashboardData = (timeRange?: string) => {
    return useQuery({
        queryKey: ['dashboard', timeRange],
        queryFn: () => fetchDashboardData(timeRange),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Derived hook for spending chart data
export const useSpendingData = (timeRange?: string) => {
    const { data: dashboardData, ...rest } = useDashboardData(timeRange);

    const spendingData: SpendingData[] =
        dashboardData?.categoryAnalytics.map((category) => ({
            categoryId: category.id,
            categoryName: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
            totalSpent: category.spent,
            budget: category.budget,
            transactionCount: 0, // We'll need to add this to the API response
        })) || [];

    return {
        data: spendingData,
        totalSpending: spendingData.reduce((sum, item) => sum + item.totalSpent, 0),
        ...rest,
    };
};
