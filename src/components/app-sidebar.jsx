import * as React from "react"
import { NavLink, useLocation } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, MessageSquare, UserCircle,
  Settings, HelpCircle, ChevronRight
} from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

// AetherStudio navigation data
const navMain = [
  {
    title: "Create",
    items: [
      {
        title: "Studio",
        url: "/",
        icon: Sparkles,
      },
      {
        title: "Chat",
        url: "/chat",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Manage",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
      },
    ],
  },
]

export function AppSidebar({ ...props }) {
  const location = useLocation()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="text-white" size={18} />
            </div>
            <span>Aether<span className="text-muted-foreground">Studio</span></span>
          </div>
          <ModeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.url === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.url)

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <NavLink to={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <HelpCircle className="size-4" />
                <span>Help & Support</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
