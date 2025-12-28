import { useState, useEffect } from "react";
import StatCard from "../components/ui/StatCard";
import { AlertCircle, CheckCircle, TrendingUp, BarChart3, ShieldAlert, ShoppingBag } from "lucide-react";
import { fetchDashboardStats } from "../api/axios";
import Loading from "../components/ui/Loading";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import PageTransition from "../components/ui/PageTransition";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ category: "all" });

    useEffect(() => {
        loadStats();
    }, [filters]);

    const loadStats = async () => {
        setLoading(true);
        const data = await fetchDashboardStats(filters);

        // Use data if available, otherwise use default empty structure (fallback for error/offline)
        if (data) {
            setStats(data);
        } else {
            setStats({
                summary: { total_analyzed: 0, avg_compliance: 0, critical_issues: 0 },
                violations_by_type: [],
                risk_distribution: [],
                score_trend: []
            });
        }

        setLoading(false);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    if (loading && !stats) return <Loading message="Loading dashboard report..." />;

    // Transform Backend Summary to Stat Cards
    const summaryCards = [
        { title: "Total Analyzed", value: stats?.summary?.total_analyzed || 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Avg Compliance", value: `${stats?.summary?.avg_compliance || 0}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
        { title: "Critical Issues", value: stats?.summary?.critical_issues || 0, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
        { title: "Active Reports", value: "12", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" }, // Mock
    ];

    return (
        <PageTransition className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-500">Real-time compliance monitoring analytics.</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="all">All Categories</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="food">Food</option>
                        <option value="luxury">Luxury</option>
                    </select>
                    <button onClick={loadStats} className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            {stats && <AnalyticsCharts data={stats} />}

            {/* Recent Violations (Placeholder / Could Fetch from DB) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-slate-800">Recent Violations Log</h2>
                    <span className="text-xs text-slate-400">Data syncing from database...</span>
                </div>
                <div className="text-sm text-slate-500 text-center py-8">
                    Select "Product Analyzer" to scan more products and populate this list.
                </div>
            </div>
        </PageTransition>
    );
};

export default Dashboard;
