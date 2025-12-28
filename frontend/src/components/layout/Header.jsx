import { Bell, Search, User, Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
    return (
        <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
            {/* Mobile Menu Button - Visible only on small screens */}
            <button
                onClick={onMenuClick}
                className="mr-4 lg:hidden text-slate-500 hover:bg-slate-50 p-2 rounded-lg"
            >
                <Menu size={24} />
            </button>

            {/* Search Bar - Hidden on very small screens or adaptable */}
            <div className="relative flex-1 max-w-xl mx-auto lg:mx-0 hidden md:block">
                <input
                    type="text"
                    placeholder="Search for products, violations..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-800">Admin User</p>
                        <p className="text-xs text-slate-500">Compliance Officer</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-600">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
