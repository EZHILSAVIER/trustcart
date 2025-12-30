import React from 'react';
import { X, Shield, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import TimelineView from './TimelineView';

const ViolationDrawer = ({ isOpen, onClose, violation }) => {
    if (!isOpen || !violation) return null;

    const { product_name, violation: v, detected_at, product_image } = violation;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out">

                {/* Header */}
                <div className="sticky top-0 bg-white z-10 border-b border-slate-100 p-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Violation Details</h2>
                        <span className="text-sm text-slate-500">Detected on {new Date(detected_at).toLocaleDateString()}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">

                    {/* Section A: Product Snapshot */}
                    <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-slate-100 rounded-lg flex-shrink-0 bg-cover bg-center border border-slate-200" style={{ backgroundImage: `url(${product_image || '/placeholder.png'})` }}></div>
                        <div>
                            <h3 className="font-semibold text-slate-900 line-clamp-2">{product_name}</h3>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize border
                            ${v.severity === 'critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                    {v.severity} Severity
                                </span>
                                <span className="text-xs text-slate-500">Impact: {v.impact_score}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section B: Timeline & Audit */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-4 text-indigo-700">
                            <TrendingUp className="w-5 h-5" />
                            <h4 className="font-semibold">Event Timeline</h4>
                        </div>
                        <TimelineView timeline={violation.timeline} />
                    </div>

                    {/* Section C: Regulation Mapping */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3 text-slate-800">
                            <BookOpen className="w-5 h-5" />
                            <h4 className="font-semibold">Regulation Mapping</h4>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                            {v.regulation_mapping ? (
                                <>
                                    <div className="text-sm font-medium text-slate-900">{v.regulation_mapping.act}</div>
                                    <div className="text-xs text-slate-500 mt-1">Section {v.regulation_mapping.section}</div>
                                    <div className="mt-3 text-xs bg-slate-50 p-2 rounded text-slate-600 italic">
                                        "This is a mapped violation based on the Consumer Protection Act..."
                                    </div>
                                </>
                            ) : (
                                <div className="text-sm text-slate-500 italic">No specific regulation mapped for this rule.</div>
                            )}
                        </div>
                    </div>

                    {/* Suggested Fix */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3 text-green-700">
                            <Shield className="w-5 h-5" />
                            <h4 className="font-semibold">Suggested Action</h4>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                            {v.suggested_fix || "Review listing details and remove non-compliant text/images."}
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex space-x-3">
                    <button className="flex-1 bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700">Mark Reviewed</button>
                    <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-medium py-2 rounded-lg hover:bg-slate-50">Ignore</button>
                </div>

            </div>
        </div>
    );
};

export default ViolationDrawer;
