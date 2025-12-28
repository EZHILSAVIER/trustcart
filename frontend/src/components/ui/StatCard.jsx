import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import clsx from "clsx";

const StatCard = ({ title, value, change, type }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                <span
                    className={clsx(
                        "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
                        type === "positive" && "bg-green-100 text-green-700",
                        type === "negative" && "bg-red-100 text-red-700",
                        type === "neutral" && "bg-slate-100 text-slate-700"
                    )}
                >
                    {type === "positive" && <ArrowUp size={12} className="mr-1" />}
                    {type === "negative" && <ArrowUp size={12} className="mr-1 rotate-180" />} {/* Reusing ArrowUp for consistency if ArrowDown not preferred or direct mapping */}
                    {type === "neutral" && <Minus size={12} className="mr-1" />}
                    {change}
                </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
    );
};

export default StatCard;
