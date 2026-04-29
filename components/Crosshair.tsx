'use client';

import { useWeaponStore } from '@/store/weaponStore';
import { useCrosshairStore } from '@/store/crosshairStore';
import { useEffect, useState } from 'react';

export default function Crosshair() {
    const activeWeapon = useWeaponStore((state) => state.activeWeapon);

    // Pull the custom user settings
    const { color, length, thickness, gap, dot } = useCrosshairStore();
    const [isFiring, setIsFiring] = useState(false);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => { if (e.button === 0) setIsFiring(true); };
        const handleMouseUp = (e: MouseEvent) => { if (e.button === 0) setIsFiring(false); };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Calculate dynamic bloom
    const baseSpread = activeWeapon ? activeWeapon.firstShotSpread * 20 : 0;

    // The total distance from the center includes the custom gap + weapon bloom
    const currentGap = gap + (isFiring ? baseSpread + 15 : baseSpread);

    return (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">

            {/* Top Line */}
            <div
                className="absolute transition-all duration-75 shadow-sm shadow-black/50"
                style={{ backgroundColor: color, width: `${thickness}px`, height: `${length}px`, transform: `translateY(-${currentGap + length / 2}px)` }}
            />
            {/* Bottom Line */}
            <div
                className="absolute transition-all duration-75 shadow-sm shadow-black/50"
                style={{ backgroundColor: color, width: `${thickness}px`, height: `${length}px`, transform: `translateY(${currentGap + length / 2}px)` }}
            />
            {/* Left Line */}
            <div
                className="absolute transition-all duration-75 shadow-sm shadow-black/50"
                style={{ backgroundColor: color, width: `${length}px`, height: `${thickness}px`, transform: `translateX(-${currentGap + length / 2}px)` }}
            />
            {/* Right Line */}
            <div
                className="absolute transition-all duration-75 shadow-sm shadow-black/50"
                style={{ backgroundColor: color, width: `${length}px`, height: `${thickness}px`, transform: `translateX(${currentGap + length / 2}px)` }}
            />

            {/* Center Dot */}
            {dot && (
                <div
                    className="absolute shadow-sm shadow-black/50"
                    style={{ backgroundColor: color, width: `${thickness}px`, height: `${thickness}px` }}
                />
            )}

        </div>
    );
}