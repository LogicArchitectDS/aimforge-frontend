"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { StorageEngine } from "@/lib/utils/storage";
import type { UserStats } from "@/lib/game/types";
import { protocolCards } from "@/app/game/page";

export default function TasksPage() {
    const router = useRouter();
    const [stats, setStats] = useState<UserStats | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStats(StorageEngine.getUserStats());
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const trainingProtocols = useMemo(() => {
        const allDifficulties = ['Eco', 'Bonus', 'Force Buy', 'Full Buy'];

        return protocolCards.flatMap(card =>
            allDifficulties.map(diff => ({
                uid: `${card.id}-${diff.toLowerCase().replace(' ', '-')}`,
                mode: card.id,
                name: card.title,
                desc: card.desc,
                category: card.category,
                color: card.color,
                difficulty: diff,
                highScore: stats?.modes?.[card.id]?.highScore || 0,
                avgAcc: stats?.modes?.[card.id]?.averageAccuracy || 0,
            }))
        );
    }, [stats]);

    return (
        <div className="w-full mt-6 bg-surface/60 border border-white/10 p-8 rounded-2xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl text-white font-black uppercase tracking-widest">Task Repository</h2>
                    <p className="text-slate-400 text-sm mt-1">Open training sandbox (No time limits). Select a protocol to deploy.</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/10 text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 px-4">
                <div className="col-span-4">Scenario Name</div>
                <div className="col-span-2 text-center">Category</div>
                <div className="col-span-2 text-center">Difficulty</div>
                <div className="col-span-2 text-right">High Score</div>
                <div className="col-span-2 text-right">Avg Acc</div>
            </div>

            <div className="flex flex-col mt-4 gap-2">
                {trainingProtocols.map((protocol) => (
                    <div key={protocol.uid} className="grid grid-cols-12 gap-4 py-4 px-4 items-center bg-[#121212]/30 border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => router.push(`/game?mode=${protocol.mode}&time=0&diff=${protocol.difficulty.toLowerCase().replace(' ', '-')}`)}>
                        <div className="col-span-4 flex flex-col">
                            <span className="text-white font-bold text-sm tracking-wide group-hover:text-[#3366FF] transition-colors">{protocol.name}</span>
                            <span className="text-slate-500 text-[11px] truncate pr-4 mt-0.5">{protocol.desc}</span>
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <span 
                                className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border rounded-md"
                                style={{
                                    color: protocol.color,
                                    borderColor: `${protocol.color}40`,
                                    backgroundColor: `${protocol.color}1a`
                                }}
                            >
                                {protocol.category}
                            </span>
                        </div>
                        <div className="col-span-2 flex justify-center">
                            <span className="px-3 py-1.5 text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 rounded-md">
                                {protocol.difficulty}
                            </span>
                        </div>
                        <div className="col-span-2 text-right">
                            <span className="text-white font-mono text-base font-bold">{protocol.highScore > 0 ? Math.round(protocol.highScore).toLocaleString() : '--'}</span>
                        </div>
                        <div className="col-span-2 text-right">
                            <span className="text-emerald-400 font-mono text-base font-bold">{protocol.avgAcc > 0 ? `${protocol.avgAcc.toFixed(1)}%` : '--'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}