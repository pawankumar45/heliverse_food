'use client'
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react'

const AuthLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { user, logout, loading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <>
            <Navbar
                loading={loading}
                user={user}
                onLogout={logout}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            {children}

        </>
    )
}

export default AuthLayout