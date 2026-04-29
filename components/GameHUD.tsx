'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function GameHUD() {
    // Atomic selectors for better performance
    const status = useGameStore(state => state.status);
    const score = useGameStore(state => state.score);
    const timeRemaining = useGameStore(state => state.timeRemaining);
    const totalDuration = useGameStore(state => state.totalDuration);
    const tickTimer = useGameStore(state => state.tickTimer);

    useEffect(() => {
        if (status !== 'playing') return;

        // Use 100ms interval for more responsive tracking since our store now uses Date.now()
        const interval = setInterval(() => {
            tickTimer();
        }, 100);

        return () => clearInterval(interval);
    }, [status, tickTimer]);

    if (status !== 'playing') {
        return null;
    }

    const elapsedTime = totalDuration - timeRemaining;
    const kps = elapsedTime > 0 ? (score / elapsedTime).toFixed(2) : '0.00';
    
    // Format time as 00:XX
    const formattedTime = `00:${timeRemaining.toString().padStart(2, '0')}`;
    const timeColorClass = timeRemaining <= 5 ? 'text-red-500 animate-pulse' : 'text-white';

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/10 flex items-center gap-8 shadow-xl">
            <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Time</span>
                <span className={`text-2xl font-black font-mono tabular-nums ${timeColorClass}`}>{formattedTime}</span>
            </div>
            
            <div className="w-px h-8 bg-white/10"></div>
            
            <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Score</span>
                <span className="text-2xl font-black font-mono tabular-nums text-cyan-400">{score}</span>
            </div>
            
            <div className="w-px h-8 bg-white/10"></div>
            
            <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">KPS</span>
                <span className="text-2xl font-black font-mono tabular-nums text-green-400">{kps}</span>
            </div>
        </div>
    );
}
