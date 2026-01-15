import React from 'react';

export function ImageStage({ currentImage, isGenerating }) {
    return (
        <div className="stage-viewer">
            {isGenerating ? (
                <div className="loading-state">
                    <div className="pulse-ring"></div>
                    <p className="loading-text">Weaving pixels...</p>
                </div>
            ) : currentImage ? (
                <div className="image-container tilt-effect">
                    <img src={currentImage} alt="Generated result" className="generated-image" />
                    <div className="image-actions">
                        {/* Actions overlay */}
                    </div>
                </div>
            ) : (
                <div className="empty-state">
                    <p>Ready to create</p>
                </div>
            )}
        </div>
    );
}
