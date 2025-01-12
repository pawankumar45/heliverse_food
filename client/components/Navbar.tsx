import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from './ModeToggle';
import { usePathname } from 'next/navigation';
import { routes } from '@/lib/constants';

interface NavbarProps {
    user: { name: string; role: 'manager' | 'pantry' | 'delivery' } | null;
    onLogout: () => void;
    onToggleSidebar: () => void;
    loading: boolean
}

export function Navbar({ user, onLogout, onToggleSidebar, loading }: NavbarProps) {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const userRoutes = user ? routes[user?.role] : [];

    return (
        <nav className="bg-background border-b fixed w-full z-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/dashboard">
                                <span className="text-2xl font-bold">HospitalFood</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                            className="block md:hidden"
                        >
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </Button>
                        <ModeToggle />
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                        <User className="mr-2 h-4 w-4" />
                                        {user.name}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={onLogout} disabled={loading}>
                                        Logout
                                        {loading && <Loader2 className='h-5 w-5' />}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="outline" asChild>
                                <Link href="/auth/login">Login</Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute bg-background p-4 border-t left-0 w-full md:hidden shadow-lg">
                        {userRoutes.map((route) => (
                            <Link key={route.href} href={route.href}>
                                <Button
                                    variant={pathname === route.href ? 'secondary' : 'ghost'}
                                    className="w-full flex items-center justify-start gap-2 mb-2"
                                >
                                    <route.icon className="h-4 w-4" />
                                    {route.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
