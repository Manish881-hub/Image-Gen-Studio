import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Image as ImageIcon, TrendingUp, Clock } from "lucide-react";

export function Dashboard() {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <Button>
                    <Zap className="mr-2 h-4 w-4" /> New Generation
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/50 backdrop-blur border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credits</CardTitle>
                        <Zap className="h-4 w-4 text-accent-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">450</div>
                        <p className="text-xs text-muted-foreground">Expires in 12 days</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.4s</div>
                        <p className="text-xs text-muted-foreground">-0.3s improvement</p>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">850</div>
                        <p className="text-xs text-muted-foreground">Since Jan 1st</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card/50 backdrop-blur border-white/10">
                    <CardHeader>
                        <CardTitle>Recent Creations</CardTitle>
                        <CardDescription>
                            Your latest AI generated masterpieces.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                            {/* Mock recent images */}
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-square rounded-md overflow-hidden bg-muted relative group cursor-pointer">
                                    <img
                                        src={`https://picsum.photos/seed/${i + 100}/200`}
                                        alt="Recent"
                                        className="object-cover w-full h-full transition-transform group-hover:scale-110"
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-card/50 backdrop-blur border-white/10">
                    <CardHeader>
                        <CardTitle>Quick Tips</CardTitle>
                        <CardDescription>
                            Enhance your prompting skills.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <span className="text-accent-secondary">•</span>
                                Use "cinematic lighting" for dramatic effects.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-accent-secondary">•</span>
                                Specify aspect ratios like "16:9" for wallpapers.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-accent-secondary">•</span>
                                Try negative prompts to remove artifacts.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
