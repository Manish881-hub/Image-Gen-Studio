import React from 'react';
import { ImageStage } from './ImageStage';
import { HistoryRail } from './HistoryRail';
import { StudioControls } from './StudioControls';

export function Studio({
    prompt, setPrompt,
    aspectRatio, setAspectRatio,

    // Advanced Props
    negativePrompt, setNegativePrompt,
    numImages, setNumImages,
    steps, setSteps,
    showAdvanced, setShowAdvanced,
    generationProgress,

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

                    negativePrompt={negativePrompt}
                    setNegativePrompt={setNegativePrompt}
                    numImages={numImages}
                    setNumImages={setNumImages}
                    steps={steps}
                    setSteps={setSteps}
                    showAdvanced={showAdvanced}
                    setShowAdvanced={setShowAdvanced}
                    generationProgress={generationProgress}

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

