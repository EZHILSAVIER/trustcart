import React, { useState } from 'react';
import { User, Bell, Shield, Sliders, Save, Info } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile & Account', icon: User },
        { id: 'compliance', label: 'Compliance Rules', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'system', label: 'System Preferences', icon: Sliders },
    ];

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500">Manage your account and application preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id
                                ? "bg-white text-primary shadow-sm ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    {/* PROFILE SETTINGS */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Profile Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input type="text" defaultValue="Sanjay" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input type="email" defaultValue="user@example.com" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                    <input type="text" defaultValue="Administrator" disabled className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <button className="text-red-600 text-sm font-medium hover:underline">Change Password</button>
                            </div>
                        </div>
                    )}

                    {/* COMPLIANCE RULES */}
                    {activeTab === 'compliance' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Compliance Thresholds</h2>

                            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-2 items-start">
                                <Info size={18} className="shrink-0 mt-0.5" />
                                <p>Adjusting these thresholds will affect how new products are classified. Existing reports will retain their original status.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">High Risk Score Threshold (0-100)</label>
                                    <div className="flex items-center gap-4">
                                        <input type="range" min="0" max="100" defaultValue="60" className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded">60</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Scores below this value are flagged as "High Risk".</p>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">Flag Suspicious Discounts</p>
                                        <p className="text-xs text-slate-500">Automatically flag products with discounts &gt; 80%</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">Strict Image Validation</p>
                                        <p className="text-xs text-slate-500">Reject analysis if image download fails (currently warns)</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Notification Preferences</h2>
                            <div className="space-y-4">
                                {['Daily Compliance Summary', 'Critical Violation Alerts', 'System Updates'].map((item) => (
                                    <div key={item} className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium text-slate-700">{item}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SYSTEM */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">System Preferences</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary">
                                    <option>Indian Rupee (INR ₹)</option>
                                    <option>US Dollar (USD $)</option>
                                    <option>Euro (EUR €)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
                                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-primary">
                                    <option>Light Mode</option>
                                    <option>Dark Mode (Beta)</option>
                                </select>
                            </div>
                            <div className="pt-4">
                                <button className="text-red-600 text-sm font-medium flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-red-200">
                                    Delete All Data
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SAVE ACTION */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            {saved ? (
                                <>
                                    <span className="animate-pulse">Saved!</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
