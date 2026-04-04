"use client";

import { useState } from "react";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("general");
    const [username, setUsername] = useState("Agent_01");
    const [email, setEmail] = useState("operator@aimsync.gg");
    const [crosshairColor, setCrosshairColor] = useState("#00FF00");

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would save to the backend.
        alert("Settings saved successfully!");
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 mt-6">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 flex flex-col gap-2">
                <button 
                    onClick={() => setActiveTab("general")}
                    className={`p-4 text-left rounded-lg text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "general" ? "bg-red/10 border border-red/30 text-red" : "bg-surface/40 border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"}`}
                >
                    General Settings
                </button>
                <button 
                    onClick={() => setActiveTab("preferences")}
                    className={`p-4 text-left rounded-lg text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "preferences" ? "bg-red/10 border border-red/30 text-red" : "bg-surface/40 border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"}`}
                >
                    Preferences
                </button>
                <button 
                    onClick={() => setActiveTab("security")}
                    className={`p-4 text-left rounded-lg text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "security" ? "bg-red/10 border border-red/30 text-red" : "bg-surface/40 border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"}`}
                >
                    Security & Auth
                </button>
                <button 
                    onClick={() => setActiveTab("connections")}
                    className={`p-4 text-left rounded-lg text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "connections" ? "bg-red/10 border border-red/30 text-red" : "bg-surface/40 border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"}`}
                >
                    Connections
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-surface/60 border border-white/10 rounded-xl p-8 backdrop-blur-md">
                <form onSubmit={handleSave}>
                    
                    {/* GENERAL TAB */}
                    {activeTab === "general" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-1">Operator Profile</h2>
                                <p className="text-xs text-slate-400 tracking-wide">Manage your public identity and contact information.</p>
                            </div>
                            
                            <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                                <div className="relative w-20 h-20 rounded-full bg-black flex items-center justify-center border-2 border-white/20 overflow-hidden shadow-lg">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="space-y-3">
                                    <button type="button" className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">
                                        Change Avatar
                                    </button>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Recommended size: 256x256px.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Callsign (Username)</label>
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-red transition-colors font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Communication Relay (Email)</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-red transition-colors font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PREFERENCES TAB */}
                    {activeTab === "preferences" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-1">Engine Preferences</h2>
                                <p className="text-xs text-slate-400 tracking-wide">Configure crosshair, audio, and visual feedback.</p>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2 pb-6 border-b border-white/5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Crosshair Hex Color</label>
                                    <div className="flex gap-4 items-center">
                                        <div 
                                            className="w-10 h-10 rounded border border-white/20"
                                            style={{ backgroundColor: crosshairColor }}
                                        />
                                        <input 
                                            type="text" 
                                            value={crosshairColor}
                                            onChange={(e) => setCrosshairColor(e.target.value)}
                                            className="w-48 bg-black/40 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-red transition-colors font-mono uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pb-6 border-b border-white/5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hit Marker Sound</label>
                                    <select className="w-full bg-black/40 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-red transition-colors cursor-pointer appearance-none">
                                        <option value="tick">Standard Tick</option>
                                        <option value="pop">Crisp Pop</option>
                                        <option value="bell">Soft Bell</option>
                                        <option value="none">Disabled</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-lg">
                                    <div>
                                        <p className="text-sm font-bold text-white uppercase tracking-widest">Show Damage Numbers</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Display floating scores on target hit.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === "security" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-1">Security & Authentication</h2>
                                <p className="text-xs text-slate-400 tracking-wide">Manage your password and active sessions.</p>
                            </div>
                            
                            <div className="space-y-4 pb-6 border-b border-white/5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        className="w-full bg-black/40 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-red transition-colors font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">New Password</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••"
                                        className="w-full bg-black/40 border border-white/10 rounded-md p-3 text-white focus:outline-none focus:border-red transition-colors font-mono"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-red/10 border border-red/30 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-red uppercase tracking-widest">Terminate All Other Sessions</p>
                                    <p className="text-[10px] text-red/60 uppercase tracking-widest mt-1">Log out of all other devices.</p>
                                </div>
                                <button type="button" className="px-4 py-2 bg-red/20 hover:bg-red text-red hover:text-white border border-red/30 text-xs font-bold uppercase tracking-widest rounded transition-all">
                                    Execute
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CONNECTIONS TAB */}
                    {activeTab === "connections" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-1">External Integrations</h2>
                                <p className="text-xs text-slate-400 tracking-wide">Link your gaming profiles to sync stats.</p>
                            </div>
                            
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between p-4 bg-black/30 border border-white/10 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#5865F2] rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-widest">Discord</p>
                                            <p className="text-[10px] text-[#5865F2] uppercase tracking-widest mt-1">Not Connected</p>
                                        </div>
                                    </div>
                                    <button type="button" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">
                                        Link Account
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-black/30 border border-white/10 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-widest">Steam</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Not Connected</p>
                                        </div>
                                    </div>
                                    <button type="button" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors">
                                        Link Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button Row */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                        <button 
                            type="submit"
                            className="px-8 py-3 bg-red text-white text-xs font-black uppercase tracking-[0.2em] rounded hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                        >
                            Commit Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}