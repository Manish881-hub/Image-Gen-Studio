import React, { useState, useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Sparkles, Zap, MessageSquare, ArrowRight, Aperture } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
    const [showSignIn, setShowSignIn] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Simulated carousel effect for background or showcase
    const showcaseImages = [
        "https://pollinations.ai/p/cyberpunk city sunset?width=800&height=600&seed=1",
        "https://pollinations.ai/p/mystical forest fairy lights?width=800&height=600&seed=2",
        "https://pollinations.ai/p/futuristic car concept?width=800&height=600&seed=3",
        "https://pollinations.ai/p/abstract geometric neon?width=800&height=600&seed=4"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImageIndex((prev) => (prev + 1) % showcaseImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-foreground relative overflow-hidden flex flex-col">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-1.5 rounded-lg">
                        <Aperture className="text-white w-5 h-5" />
                    </div>
                    <span>Aether<span className="text-purple-400">Studio</span></span>
                </div>
                {!showSignIn && (
                    <Button
                        variant="ghost"
                        className="hover:bg-white/10"
                        onClick={() => setShowSignIn(true)}
                    >
                        Sign In
                    </Button>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 text-center">

                {!showSignIn ? (
                    <div className="max-w-4xl w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Hero Badge */}
                        <div className="mb-6 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-300 flex items-center gap-2">
                            <Sparkles size={12} />
                            <span>Powered by Stable Diffusion 3.5 Large</span>
                        </div>

                        {/* Hero Text */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Imagine <span className="text-purple-400">Anything.</span><br />
                            Create <span className="text-blue-400">Everything.</span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                            AetherStudio gives you the power to generate stunning visuals from text,
                            analyze images with AI vision, and organize your creative history.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <Button
                                size="lg"
                                className="bg-white text-black hover:bg-white/90 font-semibold px-8 h-12 text-base shadow-lg shadow-white/10"
                                onClick={() => setShowSignIn(true)}
                            >
                                Start Creating <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/10 hover:bg-white/5 h-12 text-base"
                                onClick={() => window.open('https://github.com/manishbhaktisagar', '_blank')}
                            >
                                View on GitHub
                            </Button>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                            <FeatureCard
                                icon={<Sparkles className="text-purple-400" />}
                                title="SD 3.5 Large"
                                desc="State-of-the-art 8B parameter model by Stability AI."
                            />
                            <FeatureCard
                                icon={<MessageSquare className="text-blue-400" />}
                                title="Vision Chat"
                                desc="Chat with your images using Gemini & Llama."
                            />
                            <FeatureCard
                                icon={<Zap className="text-yellow-400" />}
                                title="Instant History"
                                desc="Save, manage, and revisit your creations."
                            />
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                            <p className="text-muted-foreground text-sm">Sign in to access your studio</p>
                        </div>

                        <div className="flex justify-center">
                            <SignIn
                                appearance={{
                                    elements: {
                                        rootBox: "w-full",
                                        card: "bg-card border border-white/10 shadow-2xl w-full",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        formButtonPrimary: "bg-purple-600 hover:bg-purple-700 !shadow-none",
                                        footerActionLink: "text-purple-400 hover:text-purple-300"
                                    }
                                }}
                            />
                        </div>

                        <div className="mt-6 text-center">
                            <Button
                                variant="link"
                                className="text-muted-foreground text-xs hover:text-white"
                                onClick={() => setShowSignIn(false)}
                            >
                                ← Back to Home
                            </Button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 p-6 border-t border-white/5 text-center text-xs text-muted-foreground">
                <p>© 2026 AetherStudio. Built by Manish Bhakti Sagar. Powered by NVIDIA NIM.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors text-left group cursor-default">
            <div className="mb-3 p-2 rounded-lg bg-black/20 w-fit group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="font-semibold mb-1 text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
    );
}
