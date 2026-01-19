import React, { useState, useEffect } from 'react';
import { Download, Share2, RefreshCw } from 'lucide-react';

export function ImageStage({ currentImage, isGenerating }) {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [currentImage?.url]);

    return (
        <div className="stage-viewer">
            {isGenerating ? (
                <div className="loading-state">
                    <div className="pulse-ring"></div>
                    <p className="loading-text">Weaving pixels...</p>
                </div>
            ) : currentImage ? (
                <div className="image-container tilt-effect">
                    {!imageError ? (
                        <>
                            <img
                                src={currentImage.url}
                                alt={currentImage.prompt}
                                className="generated-image"
                                onError={() => setImageError(true)}
                            />
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
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                            <p>Failed to load image</p>
                            <button
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                onClick={() => {
                                    setImageError(false);
                                    // Hack to re-trigger load: append dummy query param or just re-render
                                    const img = new Image();
                                    img.src = currentImage.url; // Try headerless load
                                    setImageError(false);
                                }}
                            >
                                <RefreshCw size={16} /> Retry
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-state">
                    <p>Ready to create</p>
                </div>
            )}
        </div>
    );
}
