import React from 'react';
import { CheckCircle, AlertTriangle, FileText, Search } from 'lucide-react';

const TimelineView = ({ timeline }) => {
    if (!timeline || timeline.length === 0) return <div className="text-slate-400 text-sm">No history available.</div>;

    const getIcon = (event) => {
        if (event.includes("Ingest")) return <FileText className="w-4 h-4 text-blue-500" />;
        if (event.includes("Analysis")) return <Search className="w-4 h-4 text-purple-500" />;
        if (event.includes("Violation")) return <AlertTriangle className="w-4 h-4 text-red-500" />;
        return <CheckCircle className="w-4 h-4 text-slate-400" />;
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700">Audit Timeline</h4>
            <div className="relative border-l-2 border-slate-200 ml-2 space-y-6">
                {timeline.map((item, index) => (
                    <div key={index} className="ml-6 relative">
                        <div className="absolute -left-[31px] bg-white p-1 rounded-full border border-slate-200 shadow-sm">
                            {getIcon(item.event)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">{item.event}</span>
                            <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                            {item.details && (
                                <div className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                    {item.details}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineView;
