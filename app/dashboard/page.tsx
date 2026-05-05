"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StorageEngine } from "@/lib/utils/storage";
import { useAuth } from "@/lib/contexts/AuthContext";
import type { UserStats } from "@/lib/game/types";
import dynamic from 'next/dynamic';

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

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m ${seconds % 60}s`;
    };

    // --- FULLY DYNAMIC TASK GENERATOR (DAILIES) ---
    const activeTasks = useMemo(() => {
        const date = new Date();
        const dailySeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        const weekSeed = Math.floor(dailySeed / 7);

        const difficulties = ['Eco', 'Bonus', 'Force Buy'];
        const timeLimits = [30, 60, 90, 120];

        const getModifier = (array: string[] | number[], offset: number) => array[(dailySeed + offset) % array.length];

        const coreBases = [
            { mode: 'static-flick', name: 'Baseline: Flick', focus: 'raw speed' },
            { mode: 'continuous-track', name: 'Baseline: Track', focus: 'reactivity' },
            { mode: 'micro-precision', name: 'Baseline: Micro', focus: 'fine-motor control' }
        ];

        const compulsoryTasks = coreBases.map((base, index) => {
            const diff = getModifier(difficulties, index * 13) as string;
            const time = getModifier(timeLimits, index * 7) as number;

            return {
                id: `task-core-${index}-${dailySeed}`,
                mode: base.mode,
                name: base.name,
                desc: `Calibrate your ${base.focus} for ${time}s on a ${diff}.`,
                difficulty: diff,
                timeLimit: time,
                xpReward: time * 10 + (difficulties.indexOf(diff) * 200)
            };
        });

        const randomPoolBases = [
            { mode: 'static-flick', name: 'Flick Endurance', focus: 'flick stamina' },
            { mode: 'continuous-track', name: 'Tracking Overdrive', focus: 'smooth tracking' },
            { mode: 'micro-precision', name: 'Needlepoint', focus: 'micro-adjustments' },
            { mode: 'cognition-react', name: 'Cognitive Test', focus: 'decision making' },
            { mode: 'echolocation', name: 'Audio Snap', focus: 'spatial audio reactions' },
            { mode: 'cognitive-overdrive', name: 'Cognitive Overdrive', focus: 'target discrimination' }
        ];

        const r1Index = dailySeed % randomPoolBases.length;
        let r2Index = (dailySeed + 3) % randomPoolBases.length;
        if (r1Index === r2Index) r2Index = (r2Index + 1) % randomPoolBases.length;

        const randomSelection = [randomPoolBases[r1Index], randomPoolBases[r2Index]];

        const dailyRandomTasks = randomSelection.map((base, index) => {
            const diff = getModifier(difficulties, index * 19 + 50) as string;
            const time = getModifier(timeLimits, index * 11 + 50) as number;

            return {
                id: `task-rnd-${index}-${dailySeed}`,
                mode: base.mode,
                name: base.name,
                desc: `Train your ${base.focus} for ${time}s on a ${diff}.`,
                difficulty: diff,
                timeLimit: time,
                xpReward: time * 10 + (difficulties.indexOf(diff) * 200)
            };
        });

        const weeklyPool = [
            { mode: 'static-flick', name: 'Operation: Lightning', desc: 'Survive the Full Buy trial for 2 full minutes.', difficulty: 'Full Buy', timeLimit: 120, xpReward: 5000 },
        ];
        const w1Index = weekSeed % weeklyPool.length;

        return {
            daily: [...compulsoryTasks, ...dailyRandomTasks],
            weekly: [
                { id: `task-w1-${weekSeed}`, ...weeklyPool[w1Index] }
            ]
        };
    }, []);


    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

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

    return (
        <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT PANEL */}
                <div className="lg:col-span-4 flex flex-col gap-6">
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

                    <div className="flex items-center justify-center">
                        <RadarProfiler stats={mockDbStats} />
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* BOX 1: ACTIVE OPERATIONS */}
                    <div className="bg-surface/60 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-white font-black text-lg uppercase tracking-widest">Active Operations</h2>
                                <p className="text-slate-400 text-sm">Time-sensitive training contracts</p>
                            </div>
                        </div>

                        {/* DAILY CONTRACTS */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                <h3 className="text-white font-black tracking-[0.2em] uppercase text-xs">Daily Contracts</h3>
                                <span className="text-slate-500 text-[10px] font-mono ml-auto">Rotates Daily</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {activeTasks.daily.map((task) => (
                                    <div key={task.id} className="group relative bg-[#121212]/50 border border-white/5 rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/5 group-hover:to-blue-500/20 transition-all pointer-events-none" />
                                        <div className="flex justify-between items-center relative z-10">
                                            <div>
                                                <h4 className="text-white font-bold text-sm tracking-wide group-hover:text-blue-400 transition-colors">{task.name}</h4>
                                                <p className="text-slate-500 text-[11px] mt-1">{task.desc}</p>
                                                <div className="flex gap-3 mt-3">
                                                    <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">⏱ {task.timeLimit}s</span>
                                                    <span className="text-[9px] font-mono text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">⚡ {task.difficulty}</span>
                                                    <span className="text-[9px] font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">✨ +{task.xpReward} XP</span>
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

                        {/* WEEKLY OPERATIONS */}
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
                                                <p className="text-slate-500 text-[11px] mt-1">{task.desc}</p>
                                                <div className="flex gap-3 mt-3">
                                                    <span className="text-[9px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">⏱ {task.timeLimit}s</span>
                                                    <span className="text-[9px] font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">💀 {task.difficulty}</span>
                                                    <span className="text-[9px] font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">✨ +{task.xpReward} XP</span>
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

                    {/* STAT GRID */}
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