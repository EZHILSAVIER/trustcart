import { AlertTriangle, CheckCircle, AlertOctagon, Info } from "lucide-react";
import clsx from "clsx";
import PriceComparison from "./PriceComparison";

const AnalysisResults = ({ results }) => {
    if (!results) return null;

    const { score, violations, productSummary, deals } = results;

    // Determine Overall Status Color
    const getScoreColor = (score) => {
        if (score >= 90) return "text-success bg-green-100 border-green-200 dark:bg-green-900/40 dark:border-green-800";
        if (score >= 70) return "text-warning bg-amber-100 border-amber-200 dark:bg-amber-900/40 dark:border-amber-800";
        return "text-danger bg-red-100 border-red-200 dark:bg-red-900/40 dark:border-red-800";
    };

    const scoreColorClass = getScoreColor(score);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Score Summary */}
            <div className="bg-surface rounded-xl shadow-lg border border-border p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="relative z-10 flex-1">
                    <h2 className="text-2xl font-bold text-primary mb-2">Compliance Analysis Report</h2>
                    <p className="text-secondary mb-4">Analyzed: <span className="font-semibold text-primary">{productSummary.name}</span></p>

                    <div className="flex gap-4 flex-wrap">
                        <div className="px-4 py-2 bg-background rounded-lg border border-border min-w-[120px]">
                            <span className="text-xs text-secondary block uppercase tracking-wider font-semibold">Price Details</span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-primary">
                                    {productSummary.price?.toString().includes("₹") ? productSummary.price : `₹${productSummary.price || 0}`}
                                </span>
                                {productSummary.mrp && (
                                    <span className="text-xs text-secondary line-through">
                                        {productSummary.mrp?.toString().includes("₹") || productSummary.mrp?.toString().toLowerCase().includes("rs") ? productSummary.mrp : `₹${productSummary.mrp}`}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="px-4 py-2 bg-background rounded-lg border border-border">
                            <span className="text-xs text-secondary block uppercase tracking-wider font-semibold">Risk Level</span>
                            <span className={clsx("font-bold", score < 70 ? "text-danger" : "text-success")}>
                                {score < 70 ? "High Risk" : "Low Risk"}
                            </span>
                        </div>
                        <div className="px-4 py-2 bg-background rounded-lg border border-border">
                            <span className="text-xs text-secondary block uppercase tracking-wider font-semibold">Violations</span>
                            <span className="font-bold text-primary">{violations.length} Found</span>
                        </div>
                    </div>
                </div>

                {/* Circular Score */}
                <div className={clsx("relative w-32 h-32 rounded-full flex items-center justify-center border-4 text-3xl font-bold shadow-inner", scoreColorClass)}>
                    {score}%
                    <span className="absolute -bottom-8 text-sm font-medium text-secondary bg-surface px-2 py-0.5 rounded-full shadow-sm border border-border whitespace-nowrap">
                        Safety Score
                    </span>
                </div>
            </div>
            {/* Price Comparison */}
            <PriceComparison deals={deals} />

            {/* Violations List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <AlertTriangle className="text-warning" />
                    Detected Violations
                </h3>

                {violations.length === 0 ? (
                    <div className="p-8 text-center bg-green-50 dark:bg-success/10 rounded-xl border border-green-100 dark:border-success/20 text-success">
                        <CheckCircle className="mx-auto mb-3" size={32} />
                        <p className="font-semibold">No Violations Detected</p>
                        <p className="text-sm opacity-80">This product appears to be fully compliant.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {violations.map((violation, idx) => (
                            <div key={idx} className="bg-surface p-5 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                                <div className={clsx("p-2 rounded-lg shrink-0",
                                    violation.severity === 'high' ? "bg-red-100 text-danger dark:bg-red-900/40" :
                                        violation.severity === 'medium' ? "bg-amber-100 text-warning dark:bg-amber-900/40" : "bg-sky-100 text-brand dark:bg-sky-900/40"
                                )}>
                                    {violation.severity === 'high' ? <AlertOctagon size={24} /> :
                                        violation.severity === 'medium' ? <AlertTriangle size={24} /> : <Info size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-primary">{violation.type}</h4>
                                        <span className={clsx("text-xs px-2 py-1 rounded-full font-medium uppercase",
                                            violation.severity === 'high' ? "bg-red-50 text-danger border border-red-100 dark:bg-red-900/30 dark:border-red-800" :
                                                violation.severity === 'medium' ? "bg-amber-50 text-warning border border-amber-100 dark:bg-amber-900/30 dark:border-amber-800" : "bg-sky-50 text-brand border border-blue-100 dark:bg-sky-900/30 dark:border-sky-800"
                                        )}>
                                            {violation.severity} Severity
                                        </span>
                                    </div>
                                    <p className="text-secondary text-sm mb-3">{violation.description}</p>

                                    {/* Evidence Box */}
                                    <div className="bg-background p-3 rounded border border-border text-xs font-mono text-secondary">
                                        <span className="font-bold text-secondary block mb-1">EVIDENCE:</span>
                                        "{violation.evidence}"
                                    </div>

                                    {/* Recommendation */}
                                    <div className="mt-3 flex items-start gap-2 text-sm text-secondary bg-sky-50 dark:bg-sky-900/20 p-3 rounded border border-blue-100 dark:border-sky-800">
                                        <span className="font-semibold text-brand">Recommendation:</span>
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

