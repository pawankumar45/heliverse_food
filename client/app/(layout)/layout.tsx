'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    if (!user) {
        return <div className="flex flex-col space-y-3 h-screen justify-center items-center">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    }

    return (
        <>
            <Navbar
                loading={loading}
                user={user}
                onLogout={logout}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="flex pt-16">
                <aside
                    className={`transition-all duration-300`}
                >
                    <Sidebar setIsOpen={setIsSidebarOpen} isOpen={isSidebarOpen} userRole={user.role} />
                </aside>

                <main
                    className={`flex-1 p-6 transition-all duration-300`}
                >
                    {children}
                </main>
            </div>
        </>
    );
}
