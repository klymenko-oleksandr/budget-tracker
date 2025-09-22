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
