import React, { useState } from 'react';
import { History, Trash2, Download, Copy, Check } from 'lucide-react';

export function HistoryRail({ history, onSelect, onDelete }) {
    const [copiedId, setCopiedId] = useState(null);

    const handleDelete = (e, imageId) => {
        e.stopPropagation();
        if (onDelete && window.confirm("Delete this image?")) {
            onDelete(imageId);
        }
    };

    const handleDownload = async (e, img) => {
        e.stopPropagation();
        try {
            const response = await fetch(img.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dream-${img.id || Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
            window.open(img.url, '_blank');
        }
    };

    const handleCopyPrompt = (e, img) => {
        e.stopPropagation();
        navigator.clipboard.writeText(img.prompt);
        setCopiedId(img.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="history-sidebar-content">
            <div className="history-header">
                <History size={16} /> <span>History</span>
            </div>
            <div className="history-list">
                {history.map((img) => (
                    <div key={img.id} className="history-item" onClick={() => onSelect(img)}>
                        <div className="history-item-image-container">
                            <img src={img.url} alt={img.prompt} />

                            {/* Overlay Controls */}
                            <div className="history-overlay">
                                <div className="history-actions">
                                    <button
                                        className="history-action-btn"
                                        onClick={(e) => handleDownload(e, img)}
                                        title="Download"
                                    >
                                        <Download size={14} />
                                    </button>
                                    <button
                                        className="history-action-btn"
                                        onClick={(e) => handleCopyPrompt(e, img)}
                                        title="Copy Prompt"
                                    >
                                        {copiedId === img.id ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                    <button
                                        className="history-action-btn delete"
                                        onClick={(e) => handleDelete(e, img.id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="history-prompt-preview">
                                    {img.prompt}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {history.length === 0 && (
                    <div className="history-placeholder">No recent dreams</div>
                )}
            </div>
        </div>
    );
}
