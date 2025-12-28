import { useState } from "react";
import AnalysisForm from "../components/analyzer/AnalysisForm";
import AnalysisResults from "../components/analyzer/AnalysisResults";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import { analyzeProduct } from "../api/axios";

const ProductAnalyzer = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async (payload) => {
        setIsAnalyzing(true);
        setResults(null);
        setError(null);

        try {
            const data = await analyzeProduct(payload);

            // Transform data for Results Component if needed
            // Backend returns: {name, compliance_score, violations, ...}
            // Component expects: { score, violations, productSummary: { name... } }

            setResults({
                score: data.compliance_score,
                violations: data.violations,
                productSummary: {
                    name: data.name,
                    price: data.price,
                    seller: data.seller || "Analysis Result"
                }
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Product Compliance Analyzer</h1>
                <p className="text-slate-500">Scan product listings for legal, safety, and fraud violations.</p>
            </div>

            <AnalysisForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

            {isAnalyzing && <Loading message="Analyzing product compliance..." />}
            {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}
            {results && !isAnalyzing && <AnalysisResults results={results} />}
        </div>
    );
};

export default ProductAnalyzer;
