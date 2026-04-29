// hooks/useRecoil.ts
import { useRef, useCallback } from 'react';
import { WeaponStats } from '@/lib/utils/AssetManager'; // Assuming you export your types from here

export const useRecoil = (activeWeapon: WeaponStats | null) => {
    // We use refs instead of state so we don't cause React re-renders 
    // every single time a bullet is fired (which would kill your frame rate)
    const isFiring = useRef(false);
    const fireStartTime = useRef(0);

    const startFiring = useCallback(() => {
        isFiring.current = true;
        fireStartTime.current = performance.now();
    }, []);

    const stopFiring = useCallback(() => {
        isFiring.current = false;
    }, []);

    // This is the core ballistics math
    const getShotTrajectory = useCallback(() => {
        // If no weapon is equipped, shoot a perfect laser pointer (0 spread)
        if (!activeWeapon) return { offsetX: 0, offsetY: 0 };

        const now = performance.now();

        // 1. Calculate how long they have been holding the trigger
        const timeFiringSeconds = isFiring.current ? (now - fireStartTime.current) / 1000 : 0;

        // 2. Calculate Bloom (Inaccuracy increases the longer you spray)
        // We cap the max bloom multiplier so it doesn't scale to infinity
        const bloomMultiplier = Math.min(timeFiringSeconds * 3.0, 4.0);
        const totalSpreadDegrees = activeWeapon.firstShotSpread + (activeWeapon.firstShotSpread * bloomMultiplier);

        // 3. Convert degrees to radians (which is what 3D engines use)
        const spreadRadians = totalSpreadDegrees * (Math.PI / 180);

        // 4. RNG: Pick a random impact point within the spread radius
        const randomAngle = Math.random() * Math.PI * 2;
        const randomRadius = Math.random() * spreadRadians;

        const offsetX = Math.cos(randomAngle) * randomRadius;
        const offsetY = Math.sin(randomAngle) * randomRadius;

        return { offsetX, offsetY };
    }, [activeWeapon]);

    return { startFiring, stopFiring, getShotTrajectory };
};