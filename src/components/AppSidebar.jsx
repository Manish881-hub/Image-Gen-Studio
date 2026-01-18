import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Sparkles, LayoutDashboard, UserCircle, MessageSquare,
    ChevronUp, User2, Settings
} from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import {
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
    return (
        <Sidebar className="border-r border-border bg-sidebar">
            <SidebarHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <Sparkles className="text-purple-500" size={20} />
                    <span>Aether<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Studio</span></span>
                </div>
                <ModeToggle />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/" end className={({ isActive }) => isActive ? "bg-accent/10 text-accent font-medium" : ""}>
                                        <Sparkles />
                                        <span>Studio</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "bg-accent/10 text-accent font-medium" : ""}>
                                        <LayoutDashboard />
                                        <span>Dashboard</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <NavLink to="/chat" className={({ isActive }) => isActive ? "bg-accent/10 text-accent font-medium" : ""}>
                                        <MessageSquare />
                                        <span>Chat</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="h-12">
                            <NavLink to="/profile" className={({ isActive }) => isActive ? "bg-accent/10 text-accent font-medium flex items-center gap-3" : "flex items-center gap-3"}>
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Manish Bhakti</span>
                                    <span className="truncate text-xs">Pro Plan</span>
                                </div>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
