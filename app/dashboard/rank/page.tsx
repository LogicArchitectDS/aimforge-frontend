"use client";

import { useEffect, useState } from "react";
import { StorageEngine } from "@/lib/utils/storage";
import type { UserStats } from "@/lib/game/types";

function getRankInfo(stats: UserStats) {
    if (stats.totalGamesPlayed < 5) return { tier: "Unranked", color: "text-slate-500", glow: "rgba(100,116,139,0.5)", req: 5 - stats.totalGamesPlayed + " more deployments to calibrate" };
    
    if (stats.globalAccuracy >= 90) return { tier: "Grandmaster", color: "text-yellow-400", glow: "rgba(250,204,21,0.5)", req: "Peak tier achieved" };
    if (stats.globalAccuracy >= 80) return { tier: "Master", color: "text-purple-400", glow: "rgba(192,132,252,0.5)", req: (90 - stats.globalAccuracy).toFixed(1) + "% acc to Grandmaster" };
    if (stats.globalAccuracy >= 70) return { tier: "Diamond", color: "text-cyan-400", glow: "rgba(34,211,238,0.5)", req: (80 - stats.globalAccuracy).toFixed(1) + "% acc to Master" };
    if (stats.globalAccuracy >= 60) return { tier: "Platinum", color: "text-emerald-400", glow: "rgba(52,211,153,0.5)", req: (70 - stats.globalAccuracy).toFixed(1) + "% acc to Diamond" };
    if (stats.globalAccuracy >= 50) return { tier: "Gold", color: "text-yellow-600", glow: "rgba(202,138,4,0.5)", req: (60 - stats.globalAccuracy).toFixed(1) + "% acc to Platinum" };
    if (stats.globalAccuracy >= 40) return { tier: "Silver", color: "text-slate-300", glow: "rgba(203,213,225,0.5)", req: (50 - stats.globalAccuracy).toFixed(1) + "% acc to Gold" };
    return { tier: "Bronze", color: "text-orange-800", glow: "rgba(154,52,18,0.5)", req: (40 - stats.globalAccuracy).toFixed(1) + "% acc to Silver" };
}

export default function RankPage() {
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats(StorageEngine.getUserStats());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!stats) return null;

    const rankInfo = getRankInfo(stats);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface/40 backdrop-blur-md rounded-2xl border border-white/10 p-12 mt-6">
            <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-10 text-center">Global Ranking</h2>
            
            <div className="flex flex-col items-center gap-6 mb-12">
                <div className="relative w-48 h-48">
                    <div className="absolute inset-0 rounded-full border-8 border-surface shadow-[0_0_30px_rgba(0,0,0,0.8)] z-10"></div>
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative z-0 border-4" style={{ borderColor: rankInfo.glow, boxShadow: `0 0 40px ${rankInfo.glow}` }}>
                        <span className={`text-7xl font-black ${rankInfo.color}`} style={{ textShadow: `0 0 30px ${rankInfo.glow}` }}>{rankInfo.tier.charAt(0)}</span>
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <p className="text-sm font-bold uppercase tracking-[0.4em] text-slate-500">Current Tier</p>
                    <h3 className={`text-4xl font-black uppercase tracking-widest ${rankInfo.color}`} style={{ textShadow: `0 0 20px ${rankInfo.glow}` }}>{rankInfo.tier}</h3>
                    <p className="text-sm font-mono text-slate-400 mt-2">{rankInfo.req}</p>
                </div>
            </div>

            <div className="w-full max-w-xl p-6 bg-black/30 border border-white/5 rounded-xl text-center">
                <p className="text-slate-400 text-sm leading-relaxed">
                    Ranks are calculated based on your global accuracy across all deployed protocols. Maintain a high accuracy over consistent runs to rank up.
                </p>
            </div>
        </div>
    );
}