import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Monitor, Maximize, Smartphone, LayoutDashboard, UserCircle, MessageSquare } from 'lucide-react';


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
                <nav className="nav-menu">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end
                    >
                        <Sparkles size={18} />
                        <span>Studio</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/chat"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <MessageSquare size={18} />
                        <span>Chat</span>
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <UserCircle size={18} />
                        <span>Profile</span>
                    </NavLink>
                </nav>
            </div>

            <div className="sidebar-separator" />

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
