import React from 'react';
import { Sparkles, Settings, Smartphone, Monitor, Maximize } from 'lucide-react';

export function Sidebar({ prompt, setPrompt, onGenerate, isGenerating }) {
    return (
        <div className="sidebar-content">
            <div className="sidebar-header">
                <div className="logo-badge">
                    <Sparkles size={20} color="var(--accent-secondary)" />
                    <span className="brand-name">Aether<span className="brand-highlight">Studio</span></span>
                </div>
            </div>

            <div className="sidebar-section">
                <label className="input-label">Prompt</label>
                <textarea
                    className="text-input prompt-area"
                    placeholder="Describe your imagination..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>

            <div className="sidebar-section">
                <label className="input-label">Aspect Ratio</label>
                <div className="ratio-grid">
                    <button className="ratio-btn active">
                        <Monitor size={16} /> 16:9
                    </button>
                    <button className="ratio-btn">
                        <Smartphone size={16} /> 9:16
                    </button>
                    <button className="ratio-btn">
                        <Maximize size={16} /> 1:1
                    </button>
                </div>
            </div>

            <div className="sidebar-spacer" />

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
