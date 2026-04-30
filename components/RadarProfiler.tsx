'use client';

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
    // Convert raw XP into Player Levels for the chart
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

            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#3366FF]/5 blur-[80px] pointer-events-none rounded-full scale-150" />

            <h2 className="text-white/80 font-black tracking-[0.3em] uppercase text-sm mb-4 relative z-10">
                AimSync Diagnostic
            </h2>

            {/* THE FIX: Hardcoded h-[300px] on the parent div. Recharts no longer has to guess. */}
            <div className="w-full h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>

                        <PolarGrid stroke="rgba(255,255,255,0.1)" />

                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace' }}
                        />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', borderColor: 'rgba(51,102,255,0.5)', borderRadius: '12px' }}
                            itemStyle={{ color: '#3366FF', fontWeight: 'bold' }}
                            formatter={(value: any) => [`Level ${value}`, 'Current Rank']}
                        />

                        <Radar
                            name="Player Stats"
                            dataKey="level"
                            stroke="#3366FF"
                            strokeWidth={3}
                            fill="#3366FF"
                            fillOpacity={0.4}
                            animationDuration={1500}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}