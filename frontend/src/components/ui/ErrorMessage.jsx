import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
                <h3 className="text-sm font-bold text-red-800">Something went wrong</h3>
                <p className="text-sm text-red-600 mt-1">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-3 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded transition-colors"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
