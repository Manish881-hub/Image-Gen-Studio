import React, { useRef } from 'react';
import { Sparkles, Monitor, Maximize, Smartphone, ChevronDown, ChevronUp, Shuffle, Info } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { popularPrompts, getRandomPrompt, IMAGE_MODELS } from '../lib/constants';

export function StudioControls({
    prompt, setPrompt,
    onGenerate, isGenerating,
    aspectRatio, setAspectRatio,

    // Advanced Props
    negativePrompt, setNegativePrompt,
    numImages, setNumImages,
    steps, setSteps,
    showAdvanced, setShowAdvanced,
    generationProgress,

    // Model Props
    model, setModel,
    nvidiaApiKey, setNvidiaApiKey,
    nvidiaEndpoint, setNvidiaEndpoint
}) {
    const handleSurpriseMe = () => {
        setPrompt(getRandomPrompt());
    };

    return (
        <div className="studio-controls">
            <div className="control-section">
                <div className="flex items-center justify-between mb-2">
                    <label className="input-label mb-0">Model</label>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.values(IMAGE_MODELS).map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setModel(m.id)}
                            className={`p-2 text-left rounded-lg border transition-all ${model === m.id
                                ? 'bg-purple-500/20 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                : 'bg-black/20 border-white/5 hover:bg-white/5'
                                }`}
                        >
                            <div className="text-xs font-semibold mb-0.5 text-foreground">{m.name}</div>
                            <div className="text-[10px] text-muted-foreground leading-tight">{m.description}</div>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-2">
                    <label className="input-label mb-0">Prompt</label>
                    <button
                        onClick={handleSurpriseMe}
                        className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        <Shuffle size={12} /> Surprise Me
                    </button>
                </div>

                <div className="relative">
                    <Textarea
                        className="prompt-area resize-none h-[100px]"
                        placeholder="Describe your imagination... (e.g. A cyberpunk city at sunset)"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        list="prompt-suggestions"
                    />
                    {/* Datalist for suggestions */}
                    <datalist id="prompt-suggestions">
                        {popularPrompts.map((p, i) => (
                            <option key={i} value={p} />
                        ))}
                    </datalist>
                </div>

                {/* Popular Prompts Quick Select (Optional, simple pills below) */}
                <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                    {popularPrompts.slice(0, 3).map((p, i) => (
                        <button
                            key={i}
                            onClick={() => setPrompt(p)}
                            className="text-[10px] whitespace-nowrap px-2 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                        >
                            {p.substring(0, 20)}...
                        </button>
                    ))}
                </div>
            </div>

            <div className="control-section">
                <label className="input-label">Aspect Ratio</label>
                <div className="ratio-grid">
                    <button
                        className={`ratio-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                        onClick={() => setAspectRatio('16:9')}
                    >
                        <Monitor size={16} /> 16:9
                    </button>
                    <button
                        className={`ratio-btn ${aspectRatio === '9:16' ? 'active' : ''}`}
                        onClick={() => setAspectRatio('9:16')}
                    >
                        <Smartphone size={16} /> 9:16
                    </button>
                    <button
                        className={`ratio-btn ${aspectRatio === '1:1' ? 'active' : ''}`}
                        onClick={() => setAspectRatio('1:1')}
                    >
                        <Maximize size={16} /> 1:1
                    </button>
                </div>
            </div>

            {/* Advanced Toggle */}
            <div className="control-section border-t border-white/5 pt-4">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <span>Advanced Settings</span>
                    {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showAdvanced && (
                    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                        {/* Negative Prompt */}
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Negative Prompt (Avoid)</label>
                            <Textarea
                                className="h-16 text-xs bg-black/20 resize-none"
                                placeholder="Low quality, blurry, watermark..."
                                value={negativePrompt}
                                onChange={(e) => setNegativePrompt(e.target.value)}
                            />
                        </div>

                        {/* Number of Images */}
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Number of Images: {numImages}</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setNumImages(num)}
                                        className={`flex-1 h-8 text-xs rounded-md border transition-colors ${numImages === num
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                            : 'bg-black/20 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Steps Slider (Visual Only for MVP if API doesn't support) */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs text-muted-foreground">Steps</label>
                                <span className="text-xs text-muted-foreground">{steps}</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={steps}
                                onChange={(e) => setSteps(Number(e.target.value))}
                                className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Nvidia API Settings */}
                        {model === IMAGE_MODELS.SD3_5.id && (
                            <div className="space-y-3 pt-4 border-t border-white/5 animate-in slide-in-from-top-2">
                                <div className="space-y-1">
                                    <label className="text-xs text-purple-300 font-medium">NVIDIA API Key</label>
                                    <Input
                                        type="password"
                                        value={nvidiaApiKey}
                                        onChange={(e) => setNvidiaApiKey(e.target.value)}
                                        placeholder="nvapi-..."
                                        className="h-8 text-xs bg-black/40 border-purple-500/30 focus-visible:ring-purple-500/50"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Required for SD 3.5 Large</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Endpoint URL</label>
                                    <Input
                                        value={nvidiaEndpoint}
                                        onChange={(e) => setNvidiaEndpoint(e.target.value)}
                                        placeholder="https://..."
                                        className="h-8 text-xs bg-black/20 font-mono"
                                    />
                                    <p className="text-[10px] text-muted-foreground">
                                        Use <span className="font-mono text-purple-300 select-all">http://localhost:8000/v1/infer</span> for local NIM
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="control-spacer" />

            <button
                className={`generate-btn ${isGenerating ? 'generating' : ''}`}
                onClick={onGenerate}
                disabled={isGenerating || !prompt}
            >
                {isGenerating ? (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <span className="spinner" /> Generating...
                        </div>
                        {generationProgress && (
                            <span className="text-[10px] opacity-70 font-normal mt-1">{generationProgress}</span>
                        )}
                    </div>
                ) : (
                    <>
                        <Sparkles size={18} /> Generate Dream
                    </>
                )}
            </button>
        </div>
    );
}
