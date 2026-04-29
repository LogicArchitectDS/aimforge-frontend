import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
    status: 'idle' | 'playing' | 'finished';
    score: number;
    highScore: number;
    shotsFired: number;
    timeRemaining: number;
    totalDuration: number;
    sessionStartTime: number | null;
    
    startGame: (duration: number) => void;
    recordShot: () => void;
    recordHit: () => void;
    tickTimer: () => void;
    endGame: () => void;
    reset: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            status: 'idle',
            score: 0,
            highScore: 0,
            shotsFired: 0,
            timeRemaining: 30,
            totalDuration: 30,
            sessionStartTime: null,

            startGame: (duration: number) => set({
                status: 'playing',
                score: 0,
                shotsFired: 0,
                timeRemaining: duration,
                totalDuration: duration,
                sessionStartTime: Date.now()
            }),

            recordShot: () => set((state) => ({ shotsFired: state.shotsFired + 1 })),
            
            recordHit: () => set((state) => ({ score: state.score + 1 })),

            tickTimer: () => set((state) => {
                if (state.status !== 'playing' || !state.sessionStartTime) return state;

                const elapsedSeconds = Math.floor((Date.now() - state.sessionStartTime) / 1000);
                const nextTime = state.totalDuration - elapsedSeconds;

                if (nextTime <= 0) {
                    const newHighScore = Math.max(state.score, state.highScore);
                    return { 
                        timeRemaining: 0, 
                        status: 'finished',
                        highScore: newHighScore
                    };
                }
                return { timeRemaining: nextTime };
            }),

            endGame: () => set((state) => {
                const newHighScore = Math.max(state.score, state.highScore);
                return { 
                    status: 'finished',
                    highScore: newHighScore
                };
            }),

            reset: () => set({
                status: 'idle',
                score: 0,
                shotsFired: 0,
                timeRemaining: 30,
                totalDuration: 30,
                sessionStartTime: null
            })
        }),
        {
            name: 'aimsync-game-storage',
            partialize: (state) => ({ highScore: state.highScore }) // Only persist highScore
        }
    )
);
