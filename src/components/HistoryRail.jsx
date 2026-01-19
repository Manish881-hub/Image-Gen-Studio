import React from 'react';
import { History, X } from 'lucide-react';

export function HistoryRail({ history, onSelect, onDelete }) {
    const handleDelete = (e, imageId) => {
        e.stopPropagation(); // Prevent triggering onSelect
        if (onDelete) {
            onDelete(imageId);
        }
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
                            <img src={img.url} alt={img.prompt} title={img.prompt} />
                            <button
                                className="history-item-delete"
                                onClick={(e) => handleDelete(e, img.id)}
                                title="Delete from history"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <div className="history-item-prompt" title={img.prompt}>
                            {img.prompt}
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
