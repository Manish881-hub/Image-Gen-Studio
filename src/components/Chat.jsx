import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { popularPrompts, CHAT_MODELS } from '../lib/constants';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Settings, Trash2 } from "lucide-react";

export function Chat({ currentImage, messages, onSaveMessage, onClearMessages, userId }) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Initialize with env var if available, otherwise check sessionStorage
    const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_OPENROUTER_API_KEY || sessionStorage.getItem('openrouter_key') || '');
    const [showSettings, setShowSettings] = useState(!apiKey);

    const handleSaveKey = (e) => {
        const key = e.target.value;
        setApiKey(key);
        sessionStorage.setItem('openrouter_key', key);
        console.log("API Key updated by user");
    };

    // Debug check
    React.useEffect(() => {
        console.log("Chat Component Mounted");
        console.log("API Key Source:", import.meta.env.VITE_OPENROUTER_API_KEY ? "Env Var" : "Missing from Env");
        console.log("Current API Key:", apiKey ? "Present (Starts with " + apiKey.substring(0, 5) + "...)" : "Missing");
    }, []);

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!apiKey) {
            alert('Please enter your OpenRouter API Key in the settings to chat.');
            setShowSettings(true);
            return;
        }

        const userText = input;
        setInput('');
        setIsLoading(true);

        // Model Priorities
        const MODELS = CHAT_MODELS;

        try {
            await onSaveMessage({
                userId,
                role: 'user',
                text: userText,
                timestamp: new Date().toISOString()
            });

            const callApi = async (model, includeImage) => {
                const content = [{ type: "text", text: userText }];
                if (includeImage && currentImage?.url) {
                    content.push({
                        type: "image_url",
                        image_url: { url: currentImage.url }
                    });
                }

                return fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": window.location.origin,
                        "X-Title": "AetherStudio"
                    },
                    body: JSON.stringify({
                        "model": model,
                        "stream": false,
                        "messages": [
                            ...messages.filter(m => m.role !== 'error').map(m => ({
                                role: m.role === 'bot' ? 'assistant' : 'user',
                                content: m.text
                            })),
                            { role: "user", content: content }
                        ]
                    })
                });
            };

            let response;
            let usedFallback = false;

            // Attempt 1: Gemini 2.0 Flash
            try {
                response = await callApi(MODELS.PRIMARY, true);
                if (!response.ok) throw new Error(`Primary failed: ${response.status}`);
            } catch (err) {
                console.warn(err.message);
                // Attempt 2: Llama 3.2 Vision
                try {
                    response = await callApi(MODELS.SECONDARY, true);
                    if (!response.ok) throw new Error(`Secondary failed: ${response.status}`);
                } catch (err2) {
                    console.warn(err2.message);
                    // Attempt 3: Llama 3.2 Text Only
                    usedFallback = true;
                    response = await callApi(MODELS.FALLBACK, false);
                }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let msg = errorData.error?.message || `All models failed (Status ${response.status})`;

                if (response.status === 402) msg = "Free tier limit reached. Please try again later or add credit.";
                if (response.status === 429) msg = "AI is currently busy (Rate Limited). Please wait a moment.";

                throw new Error(msg);
            }

            const data = await response.json();
            let botResponse = data.choices[0]?.message?.content || "I couldn't generate a response.";

            if (usedFallback) {
                botResponse += CHAT_MODELS.DISPLAY.FALLBACK_NOTE;
            }

            await onSaveMessage({
                userId,
                role: 'bot',
                text: botResponse,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error("Chat Error Details:", error);
            await onSaveMessage({
                userId,
                role: 'error',
                text: `Error details: ${error.message}. Check console for more info.`,
                timestamp: new Date().toISOString()
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = async () => {
        if (window.confirm("Clear all chat history?")) {
            await onClearMessages({ userId });
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
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Settings size={16} />
                            <span>Settings</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400"
                                onClick={handleClearChat}
                                title="Clear Chat History"
                            >
                                <Trash2 size={14} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                                {showSettings ? 'Hide' : 'Edit'}
                            </Button>
                        </div>
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
                                Free model: {CHAT_MODELS.DISPLAY.DEFAULT}
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
                            {isLoading ? 'Thinking...' : CHAT_MODELS.DISPLAY.DEFAULT}
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
                            className="bg-black/40 border-white/10 text-foreground placeholder:text-muted-foreground"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" disabled={isLoading} title="Send message">
                            <Send size={16} />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={handleClearChat}
                            disabled={isLoading}
                            title="Clear chat history"
                            className="text-muted-foreground hover:text-red-400"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
