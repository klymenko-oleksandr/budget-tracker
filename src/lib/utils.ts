import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { costFormatOptions } from './constants/formatting';

/**
 * Combines clsx and tailwind-merge for conditional CSS class handling.
 *
 * This utility function merges class names conditionally and resolves Tailwind CSS conflicts
 * by keeping the last conflicting class. It's perfect for component libraries where you need
 * to merge default classes with user-provided classes.
 *
 * @param inputs - Any number of class values (strings, objects, arrays, etc.)
 * @returns A string of merged and deduplicated class names
 *
 * @example
 * // Basic usage with strings
 * cn("px-2 py-1", "bg-blue-500", "text-white")
 * // Returns: "px-2 py-1 bg-blue-500 text-white"
 *
 * @example
 * // Conditional classes with objects
 * cn("base-class", {
 *   "text-red-500": hasError,
 *   "text-green-500": isSuccess
 * })
 *
 * @example
 * // Resolving Tailwind conflicts (last class wins)
 * cn("px-2 px-4", "bg-red-500 bg-blue-500")
 * // Returns: "px-4 bg-blue-500"
 *
 * @example
 * // Component with default and override classes
 * function Button({ className, variant = "default" }) {
 *   return (
 *     <button
 *       className={cn(
 *         "px-4 py-2 rounded font-medium", // base styles
 *         variant === "primary" && "bg-blue-500 text-white",
 *         variant === "secondary" && "bg-gray-200 text-gray-900",
 *         className // user overrides
 *       )}
 *     />
 *   )
 * }
 *
 * @example
 * // Arrays and mixed inputs
 * cn(
 *   ["flex", "items-center"],
 *   condition && "gap-2",
 *   { "opacity-50": disabled },
 *   userClassName
 * )
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatNumber = (value: number, numberFormatOptions?: Intl.NumberFormatOptions): string => {
    if (value < 1 && value > 0) {
        const one = 1;
        return `<${one.toLocaleString(undefined, numberFormatOptions)}`;
    }

    return value.toLocaleString(undefined, numberFormatOptions);
};
export const formatCostNumber = (value: number): string => formatNumber(value, costFormatOptions);
// value from 0 to 1
export const formatPercentage = (value: number) => {
    const percentageFormatter = new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
    });
    return `${percentageFormatter.format(value * 100)}%`;
};
