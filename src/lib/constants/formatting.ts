import { format } from 'date-fns';

export const costFormatOptions = {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
} as const;
export const DEFAULT_DATETIME_FORMAT = 'yyyy-MM-dd, h:mm:ss a';
export const DEFAULT_DATE_FORMAT = 'MMM d, yyyy';
export const SHORT_DATE_FORMAT = 'MMM d';
export const REQUEST_DATE_FORMAT = 'yyyy-MM-dd';
export const MONTH_YEAR_FORMAT = 'MMM yyyy';

export const standardFormatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
};

export const noDecimalFormatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
};

export const twoDecimalFormatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

export const twoDecimalCostFormatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

export const exactDecimalCostFormatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
};

export const formatRequestDate = (date: string | Date) => {
    return format(new Date(date), REQUEST_DATE_FORMAT);
};
