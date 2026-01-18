import React from 'react';
import { Sparkles, Monitor, Maximize, Smartphone } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

export function StudioControls({ prompt, setPrompt, onGenerate, isGenerating, aspectRatio, setAspectRatio }) {
    return (
        <div className="studio-controls">
            <div className="control-section">
                <label className="input-label">Prompt</label>
                <Textarea
                    className="prompt-area resize-none h-[100px]"
                    placeholder="Describe your imagination..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
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

            <div className="control-spacer" />

            <button
                className={`generate-btn ${isGenerating ? 'generating' : ''}`}
                onClick={onGenerate}
                disabled={isGenerating || !prompt}
            >
                {isGenerating ? (
                    <>
                        <span className="spinner" /> Generating...
                    </>
                ) : (
                    <>
                        <Sparkles size={18} /> Generate Dream
                    </>
                )}
            </button>
        </div>
    );
}
