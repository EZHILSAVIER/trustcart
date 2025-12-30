import React, { useEffect, useState } from "react";
import { fetchViolationStats, fetchViolations } from "../api/axios";
import ViolationsOverview from "../components/violations/ViolationsOverview";
import ViolationsTable from "../components/violations/ViolationsTable";
import ViolationDrawer from "../components/violations/ViolationDrawer";
import { Filter, Search } from "lucide-react";

const Violations = () => {
    const [stats, setStats] = useState({
        total_violations: 0,
        critical_count: 0,
        high_count: 0,
        medium_count: 0,
        low_count: 0,
        avg_impact: 0
    });
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedViolation, setSelectedViolation] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'impact_score', direction: 'desc' });
    const [filters, setFilters] = useState({});

    useEffect(() => {
        loadData();
    }, [sortConfig, filters]);

    const loadData = async () => {
        setLoading(true);
        // Prepare params
        const params = {
            sort_by: sortConfig.key,
            // Backend handles direction logic, or pass it if extended
        };

        const [statsData, violationsData] = await Promise.all([
            fetchViolationStats(),
            fetchViolations(params)
        ]);

        if (statsData) setStats(statsData);
        if (violationsData) setViolations(violationsData);
        setLoading(false);
    };

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Smart Violations</h1>
                    <p className="text-slate-500">Prioritized risk assessment and compliance tracking</p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Search className="w-4 h-4" />
                        <span>Run New Scan</span>
                    </button>
                </div>
            </div>

            <ViolationsOverview stats={stats} />

            {loading ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading prioritized violations...</p>
                </div>
            ) : (
                <ViolationsTable
                    violations={violations}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                    onItemClick={setSelectedViolation}
                />
            )}

            <ViolationDrawer
                isOpen={!!selectedViolation}
                onClose={() => setSelectedViolation(null)}
                violation={selectedViolation}
            />
        </div>
    );
};

export default Violations;
