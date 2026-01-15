import React from 'react';
import { Sidebar } from './Sidebar';
import { ImageStage } from './ImageStage';
import { HistoryRail } from './HistoryRail';
import '../App.css';

export function Layout({
    prompt, setPrompt,
    isGenerating, onGenerate,
    currentImage, history
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
                <div className="stage-content">
                    <ImageStage currentImage={currentImage} isGenerating={isGenerating} />
                </div>
                <div className="history-panel glass">
                    <HistoryRail history={history} />
                </div>
            </main>
        </div>
    );
}
