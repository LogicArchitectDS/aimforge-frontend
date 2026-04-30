"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StorageEngine } from "@/lib/utils/storage";
import { useAuth } from "@/lib/contexts/AuthContext";
import type { UserStats } from "@/lib/game/types";
import { protocolCards } from "../game/page";
import dynamic from 'next/dynamic';

// 1. THE FIX: Dynamically import the chart and completely disable SSR
const RadarProfiler = dynamic(() => import('@/components/RadarProfiler'), {
    ssr: false,
    // Optional: Show a glowing skeleton loader while the chart calculates its size
    loading: () => <div className="w-full max-w-md h-[400px] animate-pulse bg-[#121212]/80 backdrop-blur-md rounded-3xl border border-white/5" />
});

// --- RANK CALCULATOR ---
function getRankInfo(stats: UserStats) {
    if (stats.totalGamesPlayed < 5) return { tier: "Unranked", color: "text-slate-500", glow: "rgba(100,116,139,0.5)" };

    if (stats.globalAccuracy >= 90) return { tier: "Grandmaster", color: "text-yellow-400", glow: "rgba(250,204,21,0.5)" };
    if (stats.globalAccuracy >= 80) return { tier: "Master", color: "text-purple-400", glow: "rgba(192,132,252,0.5)" };
    if (stats.globalAccuracy >= 70) return { tier: "Diamond", color: "text-cyan-400", glow: "rgba(34,211,238,0.5)" };
    if (stats.globalAccuracy >= 60) return { tier: "Platinum", color: "text-emerald-400", glow: "rgba(52,211,153,0.5)" };
    if (stats.globalAccuracy >= 50) return { tier: "Gold", color: "text-yellow-600", glow: "rgba(202,138,4,0.5)" };
    if (stats.globalAccuracy >= 40) return { tier: "Silver", color: "text-slate-300", glow: "rgba(203,213,225,0.5)" };
    return { tier: "Bronze", color: "text-orange-800", glow: "rgba(154,52,18,0.5)" };
}

export default function DashboardPage() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isTrial, logout } = useAuth();
    const router = useRouter();

    // TEMPORARY: We will fetch this from Cloudflare D1 next!
    // Try changing these numbers to see how the graph physically morphs
    const mockDbStats = {
        flickingXp: 8100,    // Level 10
        trackingXp: 2500,    // Level 6
        speedXp: 400,        // Level 3
        precisionXp: 14400,  // Level 13 (A highly precise, but slow player)
        perceptionXp: 100,   // Level 2
        cognitionXp: 900     // Level 4
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats(StorageEngine.getUserStats());
            setIsLoading(false);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-red border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m ${seconds % 60}s`;
    };

    // --- EMPTY STATE ---
    if (!stats || stats.totalGamesPlayed === 0) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto border border-white/10 bg-surface/60 backdrop-blur-md p-12 rounded-2xl shadow-2xl my-auto w-full">
                <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]">
                    <svg className="w-10 h-10 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h2 className="text-3xl font-black tracking-widest uppercase text-white">Initialization Required</h2>
                <p className="text-slate-400 text-sm leading-relaxed text-center">
                    Your performance matrix is currently empty. To calibrate your baseline and unlock advanced analytics, deploy into a training protocol.
                </p>
                <button onClick={() => router.push('/game?mode=static-flick')} className="mt-6 px-8 py-4 bg-red text-white font-black text-xs tracking-[0.2em] uppercase rounded-md hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                    Deploy Baseline Protocol
                </button>
            </div>
        );
    }

    const rankInfo = getRankInfo(stats);

    // --- ACTIVE DASHBOARD ---
    return (
        <div className="flex flex-col gap-8 w-full">
            {/* TOP SECTION: Command Center Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT PANEL: Profile & Radar */}
                <div className="lg:col-span-4 flex flex-col gap-6 items-center">
                    {/* 2. Drop the dynamic chart in */}
                    <RadarProfiler stats={mockDbStats} />
                </div>

                {/* RIGHT PANEL: Tasks & Stat Blocks */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-white font-black text-lg uppercase tracking-widest">Training Regimen</h2>
                                <p className="text-slate-400 text-sm">Select a protocol to deploy</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-red text-white text-[10px] font-black tracking-widest uppercase rounded border border-red hover:bg-red-600 transition-colors">All Tasks</button>
                                <button className="px-4 py-1.5 bg-transparent text-slate-400 text-[10px] font-black tracking-widest uppercase rounded border border-white/10 hover:text-white transition-colors">Favorites</button>
                            </div>
                        </div>

                        {/* Task List Header */}
                        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-white/10 text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 px-4">
                            <div className="col-span-5">Scenario Name</div>
                            <div className="col-span-2 text-center">Category</div>
                            <div className="col-span-2 text-right">High Score</div>
                            <div className="col-span-2 text-right">Avg Acc</div>
                        </div>
                        {/* You will map through actual protocol lists here later */}
                    </div>

                    {/* Bottom Stat Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-1">Global Accuracy</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-mono font-black text-white">{stats.globalAccuracy.toFixed(1)}</span>
                                <span className="text-red font-bold">%</span>
                            </div>
                        </div>

                        <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-1">Total Time</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-mono font-black text-white">{formatTime(stats.timePlayedSeconds)}</span>
                            </div>
                        </div>

                        <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-1">Best Reaction Time</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-mono font-black text-white">
                                    {Object.values(stats.modes).reduce((min, m) => m.bestReactionTime < min ? m.bestReactionTime : min, 9999) === 9999
                                        ? "-"
                                        : Math.round(Object.values(stats.modes).reduce((min, m) => m.bestReactionTime < min ? m.bestReactionTime : min, 9999))}
                                </span>
                                <span className="text-cyan-400 font-bold text-sm">ms</span>
                            </div>
                        </div>

                        <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-1">Last Deployment</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-white truncate">
                                    {stats.lastPlayedAt ? new Date(stats.lastPlayedAt).toLocaleDateString() : "Never"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}