import { useQuery } from '@tanstack/react-query';
import { DashboardData } from '@/types/dashboard.model';
import { TimeRanges } from '@/types/time-range.model';

export const useDashboardQuery = (timeRange?: TimeRanges) => {
    return useQuery({
        queryKey: ['dashboard', timeRange],
        queryFn: (): Promise<DashboardData> => fetchDashboardData(timeRange),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
};

async function fetchDashboardData(timeRange?: TimeRanges): Promise<DashboardData> {
    const params = new URLSearchParams();

    if (timeRange) {
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case TimeRanges.week:
                startDate.setDate(now.getDate() - 7);
                break;
            case TimeRanges.month:
                startDate.setMonth(now.getMonth() - 1);
                break;
            case TimeRanges.quarter:
                startDate.setMonth(now.getMonth() - 3);
                break;
            case TimeRanges.year:
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        params.set('startDate', startDate.toISOString().split('T')[0]);
        params.set('endDate', now.toISOString().split('T')[0]);
    }

    const response = await fetch(`/api/dashboard?${params.toString()}`);
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
    }

    return result.data;
}
