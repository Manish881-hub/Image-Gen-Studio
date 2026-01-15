import React from 'react';
import { Download, Share2 } from 'lucide-react';

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
                    <img src={currentImage.url} alt={currentImage.prompt} className="generated-image" />
                    <div className="image-overlay">
                        <div className="action-bar glass">
                            <button className="icon-btn" title="Download" onClick={() => window.open(currentImage.url, '_blank')}>
                                <Download size={20} />
                            </button>
                            <button className="icon-btn" title="Share">
                                <Share2 size={20} />
                            </button>
                        </div>
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
