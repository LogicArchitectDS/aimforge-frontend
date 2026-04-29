// lib/utils/AssetManager.ts

export interface WeaponStats {
    id: string;
    name: string;
    type: 'sidearm' | 'smg' | 'rifle';
    gameStyle: 'valorant' | 'cs2';
    magSize: number;
    fireRate: number;
    firstShotSpread: number;
    audioProfile: string;
}

export interface GunRegistry {
    weapons: Record<string, WeaponStats>;
}

// All this file does now is instantly fetch your math blueprint
export const fetchGunRegistry = async (): Promise<GunRegistry | null> => {
    try {
        const response = await fetch('/GunRegistry.json');
        if (!response.ok) throw new Error('Failed to fetch registry');
        return await response.json();
    } catch (error) {
        console.error('[AssetManager] Registry fetch error:', error);
        return null;
    }
};