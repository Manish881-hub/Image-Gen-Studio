import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Key, Settings } from "lucide-react";

export function Chat({ currentImage }) {
    const [messages, setMessages] = useState([
        { id: 1, role: 'bot', text: 'Hello! Generate an image in the Studio, then ask me anything about it!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Initialize with env var if available, otherwise check localStorage
    const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_OPENROUTER_API_KEY || localStorage.getItem('openrouter_key') || '');
    const [showSettings, setShowSettings] = useState(!apiKey);

    const handleSaveKey = (e) => {
        const key = e.target.value;
        setApiKey(key);
        localStorage.setItem('openrouter_key', key);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!apiKey) {
            setMessages(prev => [...prev, { id: Date.now(), role: 'bot', text: 'Please enter your OpenRouter API Key in the settings to chat.' }]);
            setShowSettings(true);
            return;
        }

        const userMsg = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Construct Content Payload
            const content = [{ type: "text", text: input }];

            // Add image if available
            if (currentImage?.url) {
                content.push({
                    type: "image_url",
                    image_url: { url: currentImage.url }
                });
            }

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin, // Required by OpenRouter for free tier logging
                    "X-Title": "AetherStudio"
                },
                body: JSON.stringify({
                    "model": "nvidia/nemotron-nano-12b-v2-vl:free",
                    "messages": [
                        ...messages.filter(m => m.role !== 'error').map(m => ({
                            role: m.role === 'bot' ? 'assistant' : 'user',
                            content: m.text // Send history as text only to save tokens/complexity for now, or expand if needed
                        })),
                        { role: "user", content: content }
                    ]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || 'API Error');
            }

            const botText = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                text: botText
            }]);

        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'error',
                text: `Error: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full p-4 gap-4 animate-in fade-in duration-500">
            {/* Image Context Panel */}
            <div className="w-1/3 flex flex-col gap-4">
                <Card className="flex-1 bg-black/40 border-white/10 overflow-hidden flex items-center justify-center relative group">
                    {currentImage ? (
                        <>
                            <img
                                src={currentImage.url}
                                alt="Context"
                                className="absolute inset-0 w-full h-full object-contain bg-black/50"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                                <p className="text-xs text-muted-foreground mb-1">Analyzing Generated Image</p>
                                <p className="text-sm font-medium line-clamp-1">{currentImage.prompt}</p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6 text-muted-foreground">
                            <p className="mb-2">No Image Selected</p>
                            <p className="text-xs">Generate an image in the Studio first.</p>
                        </div>
                    )}
                </Card>

                {/* Settings Panel Toggle */}
                <Card className="p-4 bg-card/50 border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Settings size={16} />
                            <span>Settings</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                            {showSettings ? 'Hide' : 'Edit'}
                        </Button>
                    </div>

                    {showSettings && (
                        <div className="mt-3 space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-xs text-muted-foreground">OpenRouter API Key</label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    value={apiKey}
                                    onChange={handleSaveKey}
                                    placeholder="sk-or-..."
                                    className="h-8 text-xs bg-black/20"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Free model: allenai/molmo-2-8b:free
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Chat Interface */}
            <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur border-white/10">
                <div className="p-4 border-b border-white/5 flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-1 ring-green-500/50">
                        <AvatarFallback><Bot size={16} /></AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm">Vision Assistant</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            {isLoading ? 'Thinking...' : 'Molmo-2-8b (Free)'}
                        </p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <Avatar className={`h-8 w-8 ${msg.role === 'bot' ? 'bg-primary/20' : msg.role === 'error' ? 'bg-red-500/20' : 'bg-muted'}`}>
                                    <AvatarFallback>
                                        {msg.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : msg.role === 'error'
                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        : 'bg-muted/50 border border-white/10'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8 bg-primary/20"><AvatarFallback><Bot size={14} /></AvatarFallback></Avatar>
                                <div className="bg-muted/50 border border-white/10 p-3 rounded-lg">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <form
                        className="flex gap-2"
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    >
                        <Input
                            placeholder="Ask about the image..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-background/50 border-white/10"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                            <Send size={16} />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
