import { create } from 'zustand';
import { WeaponStats } from '@/lib/utils/AssetManager';

interface WeaponStore {
    activeWeapon: WeaponStats | null;
    setActiveWeapon: (weapon: WeaponStats) => void;
}

export const useWeaponStore = create<WeaponStore>((set) => ({
    // Defaults to null until the player clicks a gun in their locker
    activeWeapon: null,

    // Call this function from your UI to swap the gun and its math instantly
    setActiveWeapon: (weapon) => set({ activeWeapon: weapon }),
}));