import type { Metadata, Viewport } from 'next';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';

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
                        <Navbar />
                        <main>{children}</main>
                    </QueryProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
