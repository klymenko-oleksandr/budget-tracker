import type { Metadata, Viewport } from 'next';
import { CSSProperties, ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
    title: 'Budget Tracker App',
    description: 'Personal finance management and budget tracking application',
    manifest: '/favicon/site.webmanifest',
    icons: {
        icon: [
            { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon/favicon.ico', sizes: 'any' },
        ],
        apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
};

// eslint-disable-next-line react-refresh/only-export-components
export const viewport: Viewport = {
    themeColor: '#334155',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <ClerkProvider signInFallbackRedirectUrl="/dashboard">
            <html lang="en">
                <body className="font-sans antialiased min-h-screen bg-slate-50 text-slate-900">
                    <QueryProvider>
                        <SidebarProvider
                            style={
                                {
                                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                                    '--header-height': 'calc(var(--spacing) * 12)',
                                } as CSSProperties
                            }
                        >
                            <AppSidebar variant="inset" />
                            <SidebarInset>
                                <SiteHeader />
                                <div className="flex flex-1 flex-col">
                                    <div className="@container/main flex flex-1 flex-col gap-2">
                                        <main className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">{children}</main>
                                    </div>
                                </div>
                            </SidebarInset>
                        </SidebarProvider>
                    </QueryProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
