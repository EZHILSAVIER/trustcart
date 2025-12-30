import React from 'react';
import { AlertCircle, CheckCircle, Clock, ArrowUpDown } from 'lucide-react';

const ViolationsTable = ({ violations, onSort, sortConfig, onItemClick }) => {

    const getSeverityBadge = (severity) => {
        switch (severity) {
            case 'critical':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Critical</span>;
            case 'high':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">High</span>;
            case 'medium':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Low</span>;
        }
    };

    const getImpactColor = (score) => {
        if (score >= 80) return 'text-red-600 font-bold';
        if (score >= 50) return 'text-orange-600 font-semibold';
        return 'text-green-600';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">Detected Violations</h3>
                <span className="text-sm text-slate-500">{violations.length} issues found</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
                        <tr>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => onSort('product_name')}>Product</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => onSort('type')}>Violation Type</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => onSort('severity')}>Severity</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => onSort('impact_score')}>
                                <div className="flex items-center space-x-1">
                                    <span>Impact Score</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => onSort('status')}>Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {violations.map((v, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onItemClick(v)}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${v.product_image || '/placeholder.png'})` }}></div>
                                        <div>
                                            <div className="font-medium text-slate-900 truncate max-w-[200px]">{v.product_name}</div>
                                            <div className="text-xs text-slate-400">ID: {v._id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-700">{v.violation.type}</div>
                                    <div className="text-xs text-slate-400 truncate max-w-[150px]">{v.violation.description}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {getSeverityBadge(v.violation.severity)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={getImpactColor(v.violation.impact_score)}>{v.violation.impact_score || 0}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-1 text-slate-500">
                                        <Clock className="w-3 h-3" />
                                        <span>{v.violation.status || 'Open'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">View Details</button>
                                </td>
                            </tr>
                        ))}
                        {violations.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                    No violations found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViolationsTable;
