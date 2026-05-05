'use client';

import { useState, useEffect } from 'react'; // <-- 1. Import these
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { getLevelFromXp } from '@/lib/game/leveling';

interface RadarProfilerProps {
    stats: {
        flickingXp: number;
        trackingXp: number;
        speedXp: number;
        precisionXp: number;
        perceptionXp: number;
        cognitionXp: number;
    }
}

export default function RadarProfiler({ stats }: RadarProfilerProps) {
    // 2. Add this mount check state
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const data = [
        { subject: 'Flicking', level: getLevelFromXp(stats.flickingXp), fullMark: 100 },
        { subject: 'Tracking', level: getLevelFromXp(stats.trackingXp), fullMark: 100 },
        { subject: 'Speed', level: getLevelFromXp(stats.speedXp), fullMark: 100 },
        { subject: 'Precision', level: getLevelFromXp(stats.precisionXp), fullMark: 100 },
        { subject: 'Perception', level: getLevelFromXp(stats.perceptionXp), fullMark: 100 },
        { subject: 'Cognition', level: getLevelFromXp(stats.cognitionXp), fullMark: 100 },
    ];

    return (
        <div className="w-full max-w-md bg-[#121212]/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col items-center relative overflow-hidden">

            <div className="absolute inset-0 bg-blue-500/5 blur-[80px] pointer-events-none rounded-full scale-150" />

            <h2 className="text-white/80 font-black tracking-[0.3em] uppercase text-sm mb-4 relative z-10">
                AimSync Diagnostic
            </h2>

            <div className="w-full h-[300px] relative z-10 flex items-center justify-center">
                {/* 3. Wrap the chart in the mount check! */}
                {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(59,130,246,0.5)', borderRadius: '12px' }}
                                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                formatter={(value: any) => [`Level ${value}`, 'Current Rank']}
                            />
                            <Radar name="Player Stats" dataKey="level" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.4} animationDuration={1500} />
                        </RadarChart>
                    </ResponsiveContainer>
                ) : (
                    // While waiting that 1 millisecond, show a cool glowing ring
                    <div className="w-48 h-48 rounded-full border-4 border-white/5 border-t-blue-500 animate-spin" />
                )}
            </div>
        </div>
    );
}