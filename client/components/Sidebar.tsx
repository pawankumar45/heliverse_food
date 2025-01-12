import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { routes } from '@/lib/constants';

interface SidebarProps {
    isOpen: boolean;
    userRole: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ isOpen, userRole, setIsOpen }: SidebarProps) {
    const pathname = usePathname();

    const sidebarContent = (
        <ScrollArea className="h-full">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
                    <div className="space-y-1">
                        {routes[userRole as keyof typeof routes].map((route) => (
                            <Button
                                key={route.href}
                                variant={pathname === route.href ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                asChild
                                onClick={() => setIsOpen(false)} // Close on click for small screens
                            >
                                <Link href={route.href}>
                                    <route.icon className="mr-2 h-4 w-4" />
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );

    return (
        <div
            className={cn(
                "top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-200 ease-in-out sticky, hidden",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "md:translate-x-0 md:block"
            )}
        >
            <div>
                {sidebarContent}
            </div>
        </div>
    );
}
