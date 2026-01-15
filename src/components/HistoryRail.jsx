import React from 'react';
import { History } from 'lucide-react';

export function HistoryRail({ history, onSelect }) {
    return (
        <div className="history-sidebar-content">
            <div className="history-header">
                <History size={16} /> <span>History</span>
            </div>
            <div className="history-list">
                {history.map((img) => (
                    <div key={img.id} className="history-item" onClick={() => onSelect(img)}>
                        <img src={img.url} alt={img.prompt} title={img.prompt} />
                    </div>
                ))}
                {history.length === 0 && (
                    <div className="history-placeholder">No recent dreams</div>
                )}
            </div>
        </div>
    );
}
