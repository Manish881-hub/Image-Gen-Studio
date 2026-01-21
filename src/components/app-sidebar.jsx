import * as React from "react"
import { NavLink, useLocation } from 'react-router-dom'
import {
  Sparkles, LayoutDashboard, MessageSquare, UserCircle,
  Settings, HelpCircle, ChevronUp, LogOut, Grid3X3, Flame
} from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { useUser, UserButton, useClerk } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
      {
        title: "Gallery",
        url: "/gallery",
        icon: Grid3X3,
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
  const { user } = useUser()
  const { signOut } = useClerk()

  // Get user profile with streak data
  const userProfile = useQuery(api.users.getUserProfile,
    user?.id ? { clerkId: user.id } : "skip"
  )

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
        {/* Streak Badge */}
        {userProfile && userProfile.currentStreak > 0 && (
          <div className="flex items-center justify-center gap-2 py-2 mb-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
            <Flame className="size-5 text-orange-500" />
            <span className="text-sm font-semibold text-orange-400">
              Day {userProfile.currentStreak}
            </span>
            {userProfile.longestStreak > userProfile.currentStreak && (
              <span className="text-xs text-muted-foreground">
                (Best: {userProfile.longestStreak})
              </span>
            )}
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-start gap-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-lg"
                      }
                    }}
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.firstName || user?.username || 'User'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress || 'Pro Plan'}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <NavLink to="/profile" className="flex items-center gap-2">
                    <UserCircle className="size-4" />
                    <span>Profile</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/help" className="flex items-center gap-2">
                    <HelpCircle className="size-4" />
                    <span>Help & Support</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-red-500 focus:text-red-500 cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
