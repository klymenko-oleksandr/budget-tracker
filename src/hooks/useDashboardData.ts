import { useDashboardQuery } from '@/queries/dashboard.queries';
import { TimeRanges } from '@/types/time-range.model';

export interface SpendingData {
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    totalSpent: number;
    budget: number | null;
    transactionCount: number;
}

// Derived hook for spending chart data
export const useSpendingData = (timeRange?: TimeRanges) => {
    const { data: dashboardData, ...rest } = useDashboardQuery(timeRange);

    const spendingData: SpendingData[] =
        dashboardData?.categoryAnalytics.map((category) => ({
            categoryId: category.id,
            categoryName: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
            totalSpent: category.spent,
            budget: category.budget,
            transactionCount: 0, // @Todo: We'll need to add this to the API response
        })) || [];

    return {
        data: spendingData,
        totalSpending: spendingData.reduce((sum, item) => sum + item.totalSpent, 0),
        ...rest,
    };
};
