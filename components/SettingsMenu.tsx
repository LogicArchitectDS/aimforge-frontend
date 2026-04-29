'use client';

import { useState } from 'react';
import { useCrosshairStore } from '@/store/crosshairStore';

export default function SettingsMenu() {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const importValorantCode = useCrosshairStore((state) => state.importValorantCode);

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        const success = importValorantCode(code);
        setStatus(success ? 'success' : 'error');

        // Reset the success/error message after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
        if (success) setCode(''); // Clear the input on success
    };

    return (
        // Positioned top-right
        <div className="absolute top-6 right-6 z-20 w-72 bg-black/80 p-4 rounded-lg border border-zinc-800 shadow-xl backdrop-blur-sm pointer-events-auto">
            <h2 className="text-white/70 font-mono mb-3 text-xs uppercase tracking-widest border-b border-zinc-800 pb-2">
                Crosshair Import
            </h2>

            <form onSubmit={handleImport} className="flex flex-col gap-2 relative">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste Valorant Profile Code..."
                    className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-green-500 transition-colors placeholder:text-zinc-600"
                />
                <button
                    type="submit"
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-mono text-xs py-2 rounded transition-colors"
                >
                    Import Profile
                </button>
            </form>

            {/* Feedback Messages */}
            <div className="h-4 mt-2">
                {status === 'success' && <p className="text-green-400 text-[10px] font-mono tracking-wide">✓ Profile imported successfully</p>}
                {status === 'error' && <p className="text-red-400 text-[10px] font-mono tracking-wide">✗ Invalid code format</p>}
            </div>
        </div>
    );
}