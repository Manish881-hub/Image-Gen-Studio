import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Lock } from 'lucide-react';
import '../App.css';

export function Layout() {
    return (
        <>
            {/* Protected App - Only visible when signed in */}
            <SignedIn>
                <SidebarProvider defaultOpen>
                    <AppSidebar />
                    <main className="main-content w-full flex flex-col relative">
                        <div className="absolute top-4 left-4 z-50 md:hidden">
                            <SidebarTrigger />
                        </div>

                        {/* User profile in top-right corner */}
                        <div className="absolute top-4 right-4 z-50">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9"
                                    }
                                }}
                            />
                        </div>

                        <Outlet />
                    </main>
                </SidebarProvider>
            </SignedIn>

            {/* Sign-in Gate - Shown when not authenticated */}
            <SignedOut>
                <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
                    <Card className="w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border-white/10 text-center space-y-6">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-primary" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                Welcome to AetherStudio
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Sign in to access AI-powered image generation and vision chat
                            </p>
                        </div>

                        <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                            <Lock className="w-3 h-3" />
                            <span>Authentication required</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <SignInButton mode="modal">
                                <Button className="w-full" size="lg">
                                    Sign In
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button variant="outline" className="w-full border-white/10" size="lg">
                                    Create Account
                                </Button>
                            </SignUpButton>
                        </div>

                        <p className="text-[10px] text-muted-foreground">
                            Powered by Clerk Authentication
                        </p>
                    </Card>
                </div>
            </SignedOut>
        </>
    );
}
