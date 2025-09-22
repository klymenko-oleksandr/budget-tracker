import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import QueryProvider from '@/providers/QueryProvider';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
    title: 'Budget Tracker App',
    description: '🚧 IN PROGRESS',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <ClerkProvider signInFallbackRedirectUrl="/dashboard">
            <html lang="en">
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 text-slate-900`}>
                    <QueryProvider>
                        <Navbar />
                        <main>{children}</main>
                    </QueryProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
