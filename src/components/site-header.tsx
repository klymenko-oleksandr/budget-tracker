'use client';

import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { getPageTitle } from '@/lib/page-title';

export function SiteHeader() {
    const pathname = usePathname();
    const pageTitle = getPageTitle(pathname);

    return (
        <header
            className={cn(
                'flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height]',
                'ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'
            )}
        >
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <h1 className="text-base font-medium">{pageTitle}</h1>
            </div>
        </header>
    );
}
