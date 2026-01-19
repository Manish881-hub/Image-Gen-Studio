import React from 'react';
import { ImageStage } from './ImageStage';
import { HistoryRail } from './HistoryRail';
import { StudioControls } from './StudioControls';

export function Studio({
    prompt, setPrompt,
    aspectRatio, setAspectRatio,
    isGenerating, onGenerate,
    currentImage, history, onSelectHistory, onDeleteHistory
}) {
    return (
        <div className="studio-layout">
            <div className="studio-main">
                <StudioControls
                    prompt={prompt}
                    setPrompt={setPrompt}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    isGenerating={isGenerating}
                    onGenerate={onGenerate}
                />
                <div className="stage-wrapper">
                    <ImageStage currentImage={currentImage} isGenerating={isGenerating} />
                </div>
            </div>

            <aside className="right-sidebar glass">
                <HistoryRail
                    history={history}
                    onSelect={onSelectHistory}
                    onDelete={onDeleteHistory}
                />
            </aside>
        </div>
    );
}

