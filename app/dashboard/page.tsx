"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StorageEngine } from "@/lib/utils/storage";
import { useAuth } from "@/lib/contexts/AuthContext";
import type { UserStats } from "@/lib/game/types";
import dynamic from 'next/dynamic';

// 1. THE FIX: Dynamically import the chart and completely disable SSR
const RadarProfiler = dynamic(() => import('@/components/RadarProfiler'), {
    ssr: false,
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

    // TEMPORARY: Mock data for the 6-Factor Radar Chart
    const mockDbStats = {
        flickingXp: 8100,
        trackingXp: 2500,
        speedXp: 400,
        precisionXp: 14400,
        perceptionXp: 100,
        cognitionXp: 900
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
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
                <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                </div>
                <h2 className="text-3xl font-black tracking-widest uppercase text-white">Initialization Required</h2>
                <p className="text-slate-400 text-sm leading-relaxed text-center">
                    Your performance matrix is currently empty. To calibrate your baseline and unlock advanced analytics, deploy into a training protocol.
                </p>
                <button onClick={() => router.push('/game?mode=static-flick')} className="mt-6 px-8 py-4 bg-blue-600 text-white font-black text-xs tracking-[0.2em] uppercase rounded-md hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    Deploy Baseline Protocol
                </button>
            </div>
        );
    }

    const rankInfo = getRankInfo(stats);

    // --- DYNAMIC TASK DATA ---
    const activeTasks = {
        daily: [
            { id: 'task-d1', mode: 'static-flick', name: 'Morning Calibration', desc: 'Hit 30 targets as fast as possible to calibrate your baseline.', difficulty: 'Normal', timeLimit: 60, xpReward: 500 },
            { id: 'task-d2', mode: 'continuous-track', name: 'Orbital Warmup', desc: 'Track the erratic drone for 30 consecutive seconds.', difficulty: 'Hard', timeLimit: 30, xpReward: 750 }
        ],
        weekly: [
            { id: 'task-w1', mode: 'micro-precision', name: 'Operation: Needlepoint', desc: 'Eliminate 100 micro-targets. Accuracy must remain above 90%.', difficulty: 'Expert', timeLimit: 120, xpReward: 5000 }
        ]
    };

    const trainingProtocols = [
        {
            id: 'static-flick',
            name: 'Static Flick Baseline',
            desc: 'Classic 3-target gridset. Prioritizes raw speed and micro-corrections.',
            category: 'Flicking',
            badgeColor: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
            highScore: stats?.modes?.['static-flick']?.highScore || 0,
            avgAcc: stats?.modes?.['static-flick']?.averageAccuracy || 0,
        },
        {
            id: 'continuous-track',
            name: 'Orbital Tracking',
            desc: 'Erratic 3D drone tracking. Prioritizes smoothness and reactivity.',
            category: 'Tracking',
            badgeColor: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
            highScore: stats?.modes?.['continuous-track']?.highScore || 0,
            avgAcc: stats?.modes?.['continuous-track']?.averageAccuracy || 0,
        }
    ];

    // --- ACTIVE DASHBOARD ---
    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT PANEL: Profile & Radar */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Profile Card */}
                    <div className="bg-surface/60 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col items-center text-center">
                        <div className="relative w-24 h-24 mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-surface shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10"></div>
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative z-0 border-2 overflow-hidden" style={{ borderColor: rankInfo.glow }}>
                                {user?.profilePhoto ? (
                                    <img src={user.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className={`text-4xl font-black ${rankInfo.color}`} style={{ textShadow: `0 0 20px ${rankInfo.glow}` }}>
                                        {isTrial ? "T" : (user?.username?.charAt(0) || rankInfo.tier.charAt(0))}
                                    </span>
                                )}
                            </div>
                        </div>
                        <h2 className="text-xl font-black tracking-widest text-white mb-1">
                            {isTrial ? "Trial Agent" : (user?.username || "Agent_01")}
                        </h2>
                        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${rankInfo.color} mb-6`}>
                            {isTrial ? "Guest Protocol" : rankInfo.tier}
                        </p>

                        <div className="w-full h-px bg-white/5 mb-4" />

                        <button
                            onClick={logout}
                            className="w-full py-2 mb-6 border border-white/5 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-red-500 transition-all"
                        >
                            Sign Out Terminal
                        </button>

                        <div className="w-full grid grid-cols-2 gap-4 text-left">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Plays</p>
                                <p className="text-xl font-mono text-white">{stats.totalGamesPlayed}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Play Time</p>
                                <p className="text-xl font-mono text-white">{formatTime(stats.timePlayedSeconds || 0)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Radar Chart */}
                    <div className="flex items-center justify-center">
                        <RadarProfiler stats={mockDbStats} />
                    </div>
                </div>

                {/* RIGHT PANEL: Operations & Tasks */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* BOX 1: ACTIVE OPERATIONS */}
                    <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-white font-black text-lg uppercase tracking-widest">Active Operations</h2>
                                <p className="text-slate-400 text-sm">Time-sensitive training contracts</p>
                            </div>
                        </div>

                        {/* --- DAILY CONTRACTS --- */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                <h3 className="text-white font-black tracking-[0.2em] uppercase text-xs">Daily Contracts</h3>
                                <span className="text-slate-500 text-[10px] font-mono ml-auto">Resets in 14h 22m</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {activeTasks.daily.map((task) => (
                                    <div key={task.id} className="group relative bg-[#121212]/50 border border-white/5 rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/5 group-hover:to-blue-500/20 transition-all pointer-events-none" />
                                        <div className="flex justify-between items-center relative z-10">
                                            <div>
                                                <h4 className="text-white font-bold text-sm tracking-wide group-hover:text-blue-400 transition-colors">{task.name}</h4>
                                                <div className="flex gap-3 mt-2">
                                                    <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">⏱ {task.timeLimit}s</span>
                                                    <span className="text-[9px] font-mono text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">⚡ {task.difficulty}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/game?mode=${task.mode}&time=${task.timeLimit}&diff=${task.difficulty}`)}
                                                className="px-6 py-2 bg-white/5 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded border border-white/10 hover:border-blue-500 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                                            >
                                                Deploy
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- WEEKLY OPERATIONS --- */}
                        <div>
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                <h3 className="text-white font-black tracking-[0.2em] uppercase text-xs">Weekly Operation</h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                {activeTasks.weekly.map((task) => (
                                    <div key={task.id} className="group relative bg-[#121212]/50 border border-white/5 rounded-lg p-4 hover:border-red-500/50 transition-colors cursor-pointer overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/5 group-hover:to-red-500/20 transition-all pointer-events-none" />
                                        <div className="flex justify-between items-center relative z-10">
                                            <div>
                                                <h4 className="text-white font-bold text-sm tracking-wide group-hover:text-red-400 transition-colors">{task.name}</h4>
                                                <div className="flex gap-3 mt-2">
                                                    <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">⏱ {task.timeLimit}s</span>
                                                    <span className="text-[9px] font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">💀 {task.difficulty}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/game?mode=${task.mode}&time=${task.timeLimit}&diff=${task.difficulty}`)}
                                                className="px-6 py-2 bg-white/5 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded border border-white/10 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                                            >
                                                Deploy
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BOX 2: TASK REPOSITORY */}
                    <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-white font-black text-lg uppercase tracking-widest">Task Repository</h2>
                                <p className="text-slate-400 text-sm">Open training sandbox</p>
                            </div>
                        </div>

                        {/* List Header */}
                        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-white/10 text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 px-4">
                            <div className="col-span-5">Scenario Name</div>
                            <div className="col-span-3 text-center">Category</div>
                            <div className="col-span-2 text-right">High Score</div>
                            <div className="col-span-2 text-right">Avg Acc</div>
                        </div>

                        {/* Sandbox List */}
                        <div className="flex flex-col mt-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {trainingProtocols.map((protocol) => (
                                <div key={protocol.id} className="grid grid-cols-12 gap-4 py-4 px-4 items-center border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => router.push(`/game?mode=${protocol.id}`)}>
                                    <div className="col-span-5 flex flex-col">
                                        <span className="text-white font-bold text-sm tracking-wide group-hover:text-[#3366FF] transition-colors">{protocol.name}</span>
                                        <span className="text-slate-500 text-[10px] truncate pr-4">{protocol.desc}</span>
                                    </div>
                                    <div className="col-span-3 flex justify-center">
                                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest border rounded-sm ${protocol.badgeColor}`}>
                                            {protocol.category}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-white font-mono text-sm font-bold">{protocol.highScore > 0 ? Math.round(protocol.highScore).toLocaleString() : '--'}</span>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-emerald-400 font-mono text-sm font-bold">{protocol.avgAcc > 0 ? `${protocol.avgAcc.toFixed(1)}%` : '--'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Stat Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-1">Global Accuracy</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-mono font-black text-white">{stats?.globalAccuracy.toFixed(1) || '0.0'}</span>
                                <span className="text-red-500 font-bold">%</span>
                            </div>
                        </div>
                        <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-1">Total Time</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-mono font-black text-white">{formatTime(stats?.timePlayedSeconds || 0)}</span>
                            </div>
                        </div>
                        <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-1">Best Reaction Time</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-mono font-black text-white">
                                    {stats && Object.keys(stats.modes).length > 0
                                        ? Math.round(Object.values(stats.modes).reduce((min, m) => m.bestReactionTime < min ? m.bestReactionTime : min, 9999))
                                        : "-"}
                                </span>
                                <span className="text-cyan-400 font-bold text-sm">ms</span>
                            </div>
                        </div>
                        <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                            <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase block mb-1">Last Deployment</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold text-white truncate">
                                    {stats?.lastPlayedAt ? new Date(stats.lastPlayedAt).toLocaleDateString() : "Never"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}