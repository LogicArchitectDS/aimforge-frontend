"use client";

export default function TasksPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface/40 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center mt-6">
            <svg className="w-16 h-16 text-slate-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Task Library</h2>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
                Browse our extensive collection of over 10,000 community-created training scenarios. Filter by tracking, flicking, clicking, or specific game profiles.
            </p>
            <div className="mt-8 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-red uppercase tracking-widest animate-pulse">
                System Integration Pending
            </div>
        </div>
    );
}