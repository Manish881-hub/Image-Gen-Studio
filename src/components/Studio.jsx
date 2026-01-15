import React from 'react';
import { ImageStage } from './ImageStage';
import { HistoryRail } from './HistoryRail';

export function Studio({ currentImage, isGenerating, history }) {
    return (
        <>
            <div className="stage-content">
                <ImageStage currentImage={currentImage} isGenerating={isGenerating} />
            </div>
            <div className="history-panel glass">
                <HistoryRail history={history} />
            </div>
        </>
    );
}
