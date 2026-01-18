import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function SplashScreen({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for fade out animation
        }, 2000); // Show for 2 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-700 fade-in-0">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse rounded-full" />
                    <Sparkles className="w-16 h-16 text-purple-500 relative z-10" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter text-foreground">
                    Aether<span className="text-purple-500">Studio</span>
                </h1>
                <p className="text-muted-foreground animate-pulse text-sm tracking-widest uppercase">
                    Initializing Reality Engine...
                </p>
            </div>
        </div>
    );
}
