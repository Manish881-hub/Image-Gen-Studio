import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import '../App.css';

export function Layout({
    prompt, setPrompt,
    isGenerating, onGenerate
}) {
    return (
        <div className="layout-grid">
            <aside className="sidebar-panel glass">
                <Sidebar
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onGenerate={onGenerate}
                    isGenerating={isGenerating}
                />
            </aside>

            <main className="main-stage">
                <Outlet />
            </main>
        </div>
    );
}
