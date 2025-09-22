'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
    return (
        <header className="border-b bg-white px-6 py-4 shadow-sm flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:text-slate-700 transition-colors flex items-center gap-2">
                💰 Budget Tracker
                <Badge className="text-xs">beta</Badge>
            </Link>

            <nav className="flex gap-6">
                <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 hover:underline transition-colors">
                    Dashboard
                </Link>
                <Link href="/transactions" className="text-slate-600 hover:text-slate-900 hover:underline transition-colors">
                    Transactions
                </Link>
                <Link href="/categories" className="text-slate-600 hover:text-slate-900 hover:underline transition-colors">
                    Categories
                </Link>
            </nav>

            <div>
                <SignedIn>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <SignInButton mode="modal" />
                </SignedOut>
            </div>
        </header>
    );
}
