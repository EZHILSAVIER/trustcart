import {
    LayoutDashboard,
    ShoppingBag,
    AlertTriangle,
    Settings,
    LogOut,
    ShieldCheck,
    BarChart3
} from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // Assuming we will use router
import clsx from "clsx";

const Sidebar = ({ isOpen, onClose }) => {
    // Mock location for active state if router is not yet fully set, or use actual hook
    const location = useLocation();
    const activePath = location.pathname;

    const menuItems = [
        { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Analyze Product", icon: ShoppingBag, path: "/analyzer" },
        { label: "Reports", icon: BarChart3, path: "/reports" },
        { label: "Violations", icon: AlertTriangle, path: "/violations" },
        { label: "Settings", icon: Settings, path: "/settings" },
    ];

    return (
        <>
            <aside className={clsx(
                "w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-white transition-transform duration-300 z-50",
                // Mobile: hidden by default (translate-x-full), visible if isOpen
                "lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Brand */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <span className="font-bold text-lg tracking-wide">E-Compliance</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                activePath === item.path
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <item.icon size={20} className={clsx(activePath === item.path ? "text-white" : "text-slate-400 group-hover:text-white")} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => window.location.href = '/login'} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
