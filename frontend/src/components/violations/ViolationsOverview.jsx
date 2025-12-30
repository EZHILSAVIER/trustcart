import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import StatCard from '../ui/StatCard';

const ViolationsOverview = ({ stats }) => {
    const {
        total_violations,
        avg_impact,
        critical_count,
        high_count,
        medium_count,
        low_count
    } = stats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Violations"
                value={total_violations}
                icon={ShieldAlert}
                trend="+12%"
                trendUp={false}
                color="bg-blue-500"
            />
            <StatCard
                title="Critical Impact"
                value={critical_count}
                icon={AlertTriangle}
                trend="+2"
                trendUp={false}
                color="bg-red-500"
            />
            <StatCard
                title="Avg Impact Score"
                value={Math.round(avg_impact || 0)}
                icon={Activity}
                trend="-5%"
                trendUp={true}
                color="bg-orange-500"
            />
            {/* Custom Guage Card for Severity Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <h3 className="text-slate-500 text-sm font-medium mb-4">Severity Split</h3>
                <div className="flex items-end space-x-2 h-16">
                    <div className="bg-red-500 rounded-t w-1/3" style={{ height: `${(critical_count / total_violations) * 100}%` }}></div>
                    <div className="bg-orange-500 rounded-t w-1/3" style={{ height: `${(high_count / total_violations) * 100}%` }}></div>
                    <div className="bg-yellow-500 rounded-t w-1/3" style={{ height: `${((medium_count + low_count) / total_violations) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>Crit</span>
                    <span>High</span>
                    <span>Med/Low</span>
                </div>
            </div>
        </div>
    );
};

export default ViolationsOverview;
