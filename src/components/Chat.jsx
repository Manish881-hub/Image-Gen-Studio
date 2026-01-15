import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";

export function Chat() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: 'Hello! I see you created this amazing cyberpunk cityscape. What would you like to refine or discuss about it?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock bot reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: "That's an interesting idea! Modifying the lighting to be more neon-noir would definitely enhance the mood. Shall I generate a variation?"
            }]);
        }, 1000);
    };

    return (
        <div className="flex h-full p-4 gap-4 animate-in fade-in duration-500">
            {/* Image Context Panel */}
            <div className="w-1/3 flex flex-col gap-4">
                <Card className="flex-1 bg-black/40 border-white/10 overflow-hidden flex items-center justify-center relative group">
                    <img
                        src="https://images.unsplash.com/photo-1620641788421-7a1c3103428f?q=80&w=1000&auto=format&fit=crop"
                        alt="Context"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                        <p className="text-xs text-muted-foreground mb-1">Current Subject</p>
                        <p className="text-sm font-medium line-clamp-2">Cyberpunk city street at night with neon lights and rain...</p>
                    </div>
                </Card>
            </div>

            {/* Chat Interface */}
            <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur border-white/10">
                <div className="p-4 border-b border-white/5 flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-1 ring-accent-secondary">
                        <AvatarFallback><Bot size={16} /></AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">Aether Assistant</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
                        </p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <Avatar className={`h-8 w-8 ${msg.role === 'bot' ? 'bg-primary/20' : 'bg-muted'}`}>
                                    <AvatarFallback>
                                        {msg.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted/50 border border-white/10'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <form
                        className="flex gap-2"
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    >
                        <Input
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-background/50 border-white/10"
                        />
                        <Button type="submit" size="icon">
                            <Send size={16} />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
