import React from 'react';
import { History } from 'lucide-react';

export function HistoryRail({ history }) {
    return (
        <div className="history-container">
            <div className="history-label">
                <History size={14} /> <span>Recent</span>
            </div>
            <div className="history-scroll">
                {history.map((img, idx) => (
                    <div key={idx} className="history-item">
                        <img src={img} alt={`History ${idx}`} />
                    </div>
                ))}
                {history.length === 0 && (
                    <div className="history-placeholder">No history</div>
                )}
            </div>
        </div>
    );
}
