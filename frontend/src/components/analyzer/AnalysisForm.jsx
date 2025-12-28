import React, { useState } from "react";
import { Search, Link as LinkIcon, Edit3, Loader2 } from "lucide-react";

const AnalysisForm = ({ onAnalyze, isAnalyzing }) => {
    const [mode, setMode] = useState("url"); // 'url' or 'manual'

    // Form States
    const [url, setUrl] = useState("");
    const [manualData, setManualData] = useState({
        title: "",
        price: "",
        description: "",
        mrp: "",
        category: "general"
    });

    const handleSubmit = () => {
        // Basic Validation
        if (mode === 'url' && !url) return alert("Please enter a URL");
        if (mode === 'manual' && !manualData.title) return alert("Product Title is required");

        // Construct Payload
        const payload = mode === 'url' ? { url } : { manual_data: manualData };
        onAnalyze(payload);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 mb-8">

            {/* Mode Switcher */}
            <div className="flex gap-4 border-b border-slate-100 pb-4 mb-6">
                <button
                    onClick={() => setMode("url")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'url' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <LinkIcon size={16} />
                    Import by URL
                </button>
                <button
                    onClick={() => setMode("manual")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'manual' ? 'bg-primary text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Edit3 size={16} />
                    Manual Input
                </button>
            </div>

            {/* URL Input Form */}
            {mode === "url" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Page URL</label>
                        <div className="relative">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://amazon.com/product/..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                            <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Supported: Amazon, Flipkart, Meesho, Myntra, Nykaa</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isAnalyzing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Scanning Product...
                            </>
                        ) : (
                            <>
                                <Search size={20} />
                                Analyze Compliance
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Manual Input Form */}
            {mode === "manual" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
                            <input
                                type="text"
                                value={manualData.title}
                                onChange={(e) => setManualData({ ...manualData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                                placeholder="e.g. Nike Air Max"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                            <input
                                type="text"
                                value={manualData.price}
                                onChange={(e) => setManualData({ ...manualData, price: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                                placeholder="e.g. ₹2,999"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">MRP (Original Price)</label>
                            <input
                                type="text"
                                value={manualData.mrp}
                                onChange={(e) => setManualData({ ...manualData, mrp: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                                placeholder="e.g. ₹5,000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                value={manualData.category}
                                onChange={(e) => setManualData({ ...manualData, category: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            >
                                <option value="general">General</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
                        <input
                            type="text"
                            value={manualData.image_url || ""}
                            onChange={(e) => setManualData({ ...manualData, image_url: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-slate-400 mt-1">Or leave empty to use placeholder.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={manualData.description}
                            onChange={(e) => setManualData({ ...manualData, description: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg h-32 outline-none focus:border-primary resize-none"
                            placeholder="Paste product description here..."
                        ></textarea>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isAnalyzing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
                    >
                        {isAnalyzing ? "Scanning..." : "Analyze Compliance"}
                    </button>
                </div>
            )
            }

        </div >
    );
};

export default AnalysisForm;
