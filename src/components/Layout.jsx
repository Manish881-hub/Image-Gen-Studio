import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import '../App.css';

export function Layout() {
    return (
        <SidebarProvider defaultOpen>
            <AppSidebar />
            <main className="main-content w-full flex flex-col relative">
                <div className="absolute top-4 left-4 z-50 md:hidden">
                    <SidebarTrigger />
                </div>
                <Outlet />
            </main>
        </SidebarProvider>
    );
}
