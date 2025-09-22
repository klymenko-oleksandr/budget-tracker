import { CategoryAnalytic } from './category.model';

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
    recentTransactions: any[]; // @Todo: Replace with actual type if available
    dateRange: {
        startDate: string;
        endDate: string;
    };
}
