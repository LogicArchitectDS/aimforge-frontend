'use client';

import { useEffect, useState } from 'react';
import { useWeaponStore } from '@/store/weaponStore';
import { fetchGunRegistry, GunRegistry } from '@/lib/utils/AssetManager';

export default function GunLocker() {
    const [registry, setRegistry] = useState<GunRegistry | null>(null);
    const { activeWeapon, setActiveWeapon } = useWeaponStore();

    // Fetch the lightweight JSON blueprint when the locker mounts
    useEffect(() => {
        fetchGunRegistry().then(setRegistry);
    }, []);

    if (!registry) return null;

    return (
        // Positioned bottom-left, translucent black background for that tactical feel
        <div className="absolute bottom-6 left-6 z-20 w-80 bg-black/80 p-4 rounded-lg border border-zinc-800 shadow-xl max-h-96 overflow-y-auto backdrop-blur-sm pointer-events-auto">
            <h2 className="text-white/70 font-mono mb-3 text-xs uppercase tracking-widest border-b border-zinc-800 pb-2">
                Armory Selection
            </h2>

            <div className="grid grid-cols-2 gap-2">
                {Object.values(registry.weapons).map((weapon) => {
                    const isEquipped = activeWeapon?.id === weapon.id;

                    return (
                        <button
                            key={weapon.id}
                            onClick={() => setActiveWeapon(weapon)}
                            className={`px-3 py-2 text-xs font-mono rounded border transition-all duration-150 ${isEquipped
                                    ? 'bg-green-500/10 border-green-500 text-green-400'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            {weapon.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}