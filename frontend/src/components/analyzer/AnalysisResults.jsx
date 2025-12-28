import { AlertTriangle, CheckCircle, AlertOctagon, Info } from "lucide-react";
import clsx from "clsx";

const AnalysisResults = ({ results }) => {
    if (!results) return null;

    const { score, violations, productSummary } = results;

    // Determine Overall Status Color
    const getScoreColor = (score) => {
        if (score >= 90) return "text-green-600 bg-green-100 border-green-200";
        if (score >= 70) return "text-yellow-600 bg-yellow-100 border-yellow-200";
        return "text-red-600 bg-red-100 border-red-200";
    };

    const scoreColorClass = getScoreColor(score);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Score Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="relative z-10 flex-1">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Compliance Analysis Report</h2>
                    <p className="text-slate-500 mb-4">Analyzed: <span className="font-semibold text-slate-700">{productSummary.name}</span></p>

                    <div className="flex gap-4 flex-wrap">
                        <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 min-w-[120px]">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Price Details</span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-slate-800">
                                    {productSummary.price?.toString().includes("₹") ? productSummary.price : `₹${productSummary.price || 0}`}
                                </span>
                                {productSummary.mrp && (
                                    <span className="text-xs text-slate-400 line-through">
                                        {productSummary.mrp?.toString().includes("₹") || productSummary.mrp?.toString().toLowerCase().includes("rs") ? productSummary.mrp : `₹${productSummary.mrp}`}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Risk Level</span>
                            <span className={clsx("font-bold", score < 70 ? "text-red-600" : "text-green-600")}>
                                {score < 70 ? "High Risk" : "Low Risk"}
                            </span>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Violations</span>
                            <span className="font-bold text-slate-800">{violations.length} Found</span>
                        </div>
                    </div>
                </div>

                {/* Circular Score */}
                <div className={clsx("relative w-32 h-32 rounded-full flex items-center justify-center border-4 text-3xl font-bold shadow-inner", scoreColorClass)}>
                    {score}%
                    <span className="absolute -bottom-8 text-sm font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100 whitespace-nowrap">
                        Safety Score
                    </span>
                </div>
            </div>

            {/* Violations List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" />
                    Detected Violations
                </h3>

                {violations.length === 0 ? (
                    <div className="p-8 text-center bg-green-50 rounded-xl border border-green-100 text-green-800">
                        <CheckCircle className="mx-auto mb-3" size={32} />
                        <p className="font-semibold">No Violations Detected</p>
                        <p className="text-sm opacity-80">This product appears to be fully compliant.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {violations.map((violation, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                                <div className={clsx("p-2 rounded-lg shrink-0",
                                    violation.severity === 'high' ? "bg-red-100 text-red-600" :
                                        violation.severity === 'medium' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                                )}>
                                    {violation.severity === 'high' ? <AlertOctagon size={24} /> :
                                        violation.severity === 'medium' ? <AlertTriangle size={24} /> : <Info size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-slate-800">{violation.type}</h4>
                                        <span className={clsx("text-xs px-2 py-1 rounded-full font-medium uppercase",
                                            violation.severity === 'high' ? "bg-red-50 text-red-700 border border-red-100" :
                                                violation.severity === 'medium' ? "bg-orange-50 text-orange-700 border border-orange-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                                        )}>
                                            {violation.severity} Severity
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm mb-3">{violation.description}</p>

                                    {/* Evidence Box */}
                                    <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono text-slate-600">
                                        <span className="font-bold text-slate-400 block mb-1">EVIDENCE:</span>
                                        "{violation.evidence}"
                                    </div>

                                    {/* Recommendation */}
                                    <div className="mt-3 flex items-start gap-2 text-sm text-slate-600 bg-blue-50 p-3 rounded border border-blue-100">
                                        <span className="font-semibold text-blue-700">Recommendation:</span>
                                        {violation.type === "Fake Discount" ? "Adjust MRP to reflect actual market price or reduce discount percentage." :
                                            violation.type === "Missing MRP" ? "Explicitly state the Maximum Retail Price in the listing." :
                                                violation.type === "Watermarked Image" ? "Upload a clean product image without third-party watermarks." :
                                                    "Review compliance guidelines for this category."}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisResults;

