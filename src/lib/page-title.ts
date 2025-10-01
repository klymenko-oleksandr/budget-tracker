/**
 * Utility function to get page title based on pathname
 * Used for dynamic page titles in site header and other components
 */
export const getPageTitle = (pathname: string): string => {
    // Remove trailing slash and split path
    const cleanPath = pathname.replace(/\/$/, '') || '/';

    // Define route to title mapping
    const routeTitleMap: Record<string, string> = getAvailableRoutes();

    // Check for the exact match first
    if (routeTitleMap[cleanPath]) {
        return routeTitleMap[cleanPath];
    }

    // Handle nested routes (e.g., /transactions/123 -> "Transactions")
    const segments = cleanPath.split('/').filter(Boolean);
    if (segments.length > 0) {
        const baseRoute = `/${segments[0]}`;
        if (routeTitleMap[baseRoute]) {
            return routeTitleMap[baseRoute];
        }
    }

    // Fallback: capitalize the first segment or show "Page"
    if (segments.length > 0) {
        return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    }

    return 'Page';
};

/**
 * Get all available route titles for reference
 */
const getAvailableRoutes = (): Record<string, string> => {
    return {
        '/': 'Home',
        '/dashboard': 'Dashboard',
        '/transactions': 'Transactions',
        '/categories': 'Categories',
        '/analytics': 'Analytics',
        '/settings': 'Settings',
    };
};
