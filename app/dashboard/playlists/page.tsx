"use client";

export default function PlaylistsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface/40 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center mt-6">
            <svg className="w-16 h-16 text-slate-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Training Playlists</h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
                Create and share custom training routines. Group multiple tasks together with custom durations to target specific mechanical weaknesses.
            </p>
            <div className="mt-8 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-red uppercase tracking-widest animate-pulse">
                Module Under Construction
            </div>
        </div>
    );
}