import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCostNumber, formatPercentage } from '@/lib/utils';

interface KpiCard {
    id: string;
    title: string;
    value: number;
    change: number;
    description: string;
}

export function SectionKpiCards() {
    const kpiCards: KpiCard[] = [
        {
            id: 'total-net-worth',
            title: 'Total net worth',
            value: 102317,
            change: 0.125, // '+12.5%',
            description: "Day's change",
        },
        {
            id: 'monthly-income',
            title: 'Monthly income',
            value: 10.3,
            change: 0.125, // '+12.5%',
            description: "Day's change",
        },
        {
            id: 'monthly-expenses',
            title: 'Monthly expenses',
            value: 102.317,
            change: 0.125, // '+12.5%',
            description: "Day's change",
        },
        {
            id: 'day-change',
            title: 'Daily change',
            value: 102.317,
            change: -0.45, // '-45%',
            description: "Day's change",
        },
    ];

    return (
        <div
            className={cn(
                '*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card',
                'grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs',
                '@xl/main:grid-cols-2 @5xl/main:grid-cols-4'
            )}
        >
            {kpiCards.map((card) => {
                const isPositiveTrending = card.change > 0;
                const changeSign = isPositiveTrending ? '+' : '';
                const value = formatCostNumber(card.value);
                const formattedChange = formatPercentage(card.change);

                return (
                    <Card key={card.id} className="@container/card">
                        <CardHeader>
                            <CardDescription>{card.title}</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{value}</CardTitle>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                {card.description}
                                <Badge variant="outline">
                                    {isPositiveTrending ? <IconTrendingUp /> : <IconTrendingDown />}
                                    {changeSign}
                                    {formattedChange}
                                </Badge>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
