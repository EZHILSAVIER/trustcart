import { useState, useEffect } from "react";
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { fetchReports } from "../api/axios";
import Loading from "../components/ui/Loading";
import Skeleton from "../components/ui/Skeleton";
import PageTransition from "../components/ui/PageTransition";
import clsx from "clsx";

const Reports = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        risk_level: "All",
        category: "All",
        page: 1
    });
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadReports();
    }, [filters]);

    const loadReports = async () => {
        setLoading(true);
        // Map frontend filters to backend params
        const params = {
            search: filters.search,
            risk_level: filters.risk_level === "All" ? null : filters.risk_level,
            skip: (filters.page - 1) * 10,
            limit: 10
        };

        const result = await fetchReports(params);
        if (result) {
            setData(result.data);
            setTotal(result.total);
        }
        setLoading(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const totalPages = Math.ceil(total / 10);

    return (
        <PageTransition className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Compliance Reports</h1>
                    <p className="text-slate-500">View and manage detailed analysis history.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-600 min-w-[140px]"
                        value={filters.risk_level}
                        onChange={(e) => handleFilterChange("risk_level", e.target.value)}
                    >
                        <option value="All">All Risks</option>
                        <option value="High Risk">High Risk</option>
                        <option value="Medium Risk">Medium Risk</option>
                        <option value="Low Risk">Low Risk</option>
                        <option value="Critical Risk">Critical Risk</option>
                    </select>

                    <select
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-600 min-w-[140px]"
                        value={filters.category}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Luxury">Luxury</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-4">Product Details</th>
                                <th className="p-4 text-center">Score</th>
                                <th className="p-4">Risk Level</th>
                                <th className="p-4 text-center">Violations</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-4"><Skeleton className="h-10 w-full" /></td>
                                        <td className="p-4"><Skeleton className="h-10 w-12 mx-auto" /></td>
                                        <td className="p-4"><Skeleton className="h-8 w-24" /></td>
                                        <td className="p-4"><Skeleton className="h-8 w-8 mx-auto" /></td>
                                        <td className="p-4"><Skeleton className="h-6 w-24" /></td>
                                        <td className="p-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-500">
                                        No reports found. Try changing filters or analyze a new product.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-medium text-slate-900">{item.name}</div>
                                            <div className="text-xs text-slate-400 truncate max-w-[200px]">{item.description ? item.description.substring(0, 40) + "..." : "No description"}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={clsx(
                                                "inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm border-2",
                                                item.compliance_score >= 90 ? "border-green-200 bg-green-50 text-green-700" :
                                                    item.compliance_score >= 70 ? "border-yellow-200 bg-yellow-50 text-yellow-700" :
                                                        "border-red-200 bg-red-50 text-red-700"
                                            )}>
                                                {item.compliance_score}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-full text-xs font-medium border",
                                                item.risk_level?.includes("High") || item.risk_level?.includes("Critical") ? "bg-red-50 text-red-700 border-red-100" :
                                                    item.risk_level?.includes("Medium") ? "bg-orange-50 text-orange-700 border-orange-100" :
                                                        "bg-green-50 text-green-700 border-green-100"
                                            )}>
                                                {item.risk_level || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-slate-600 font-medium">
                                            {item.violations_count}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-semibold text-slate-900">
                                                {item.price?.toString().includes("₹") ? item.price : `₹${item.price || 0}`}
                                            </div>
                                            {item.mrp && (
                                                <div className="text-xs text-slate-400 line-through">
                                                    {item.mrp?.toString().includes("₹") ? item.mrp : `₹${item.mrp}`}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date().toLocaleDateString()} {/* Mock Date as created_at might be missing */}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && data.length > 0 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Showing <span className="font-medium">{(filters.page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(filters.page * 10, total)}</span> of <span className="font-medium">{total}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                disabled={filters.page === 1}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                                disabled={filters.page === totalPages}
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default Reports;
