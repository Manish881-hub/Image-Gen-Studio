import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function Profile() {
    return (
        <div className="flex flex-col items-center justify-start p-8 space-y-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="w-full max-w-4xl flex items-start gap-8">
                {/* User Sidebar Card */}
                <Card className="w-1/3 bg-card/50 backdrop-blur border-white/10">
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="w-24 h-24 mb-4 ring-2 ring-accent-primary ring-offset-2 ring-offset-background">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl">Manish Bhakti</CardTitle>
                        <CardDescription>Creative Director</CardDescription>
                        <Badge variant="secondary" className="mt-2 bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30">
                            Pro Plan
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Member since</span>
                            <span>Jan 2024</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location</span>
                            <span>San Francisco</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Tabs */}
                <div className="w-2/3">
                    <Tabs defaultValue="account" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        </TabsList>

                        <TabsContent value="account">
                            <Card className="bg-card/50 backdrop-blur border-white/10">
                                <CardHeader>
                                    <CardTitle>Account Details</CardTitle>
                                    <CardDescription>
                                        Manage your personal information and email preferences.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input id="name" defaultValue="Manish Bhakti" className="bg-background/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue="manish@example.com" className="bg-background/50" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Save Changes</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preferences">
                            <Card className="bg-card/50 backdrop-blur border-white/10">
                                <CardHeader>
                                    <CardTitle>Preferences</CardTitle>
                                    <CardDescription>
                                        Customize your studio experience.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg border-white/5 bg-background/30">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">High Quality Preview</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Always load high-res images in standard view.
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">Enabled</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg border-white/5 bg-background/30">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Auto-Save History</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Keep prompt history saved locally.
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">Enabled</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
