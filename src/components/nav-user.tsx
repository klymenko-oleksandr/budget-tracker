'use client';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export function NavUser() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SignedIn>
                    <UserButton showName />
                </SignedIn>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SignedOut>
                    <SignInButton mode="modal" />
                </SignedOut>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
