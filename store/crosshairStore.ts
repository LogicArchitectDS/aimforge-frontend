import { create } from 'zustand';

interface CrosshairSettings {
    color: string;
    length: number;
    thickness: number;
    gap: number;
    dot: boolean;
}

interface CrosshairStore extends CrosshairSettings {
    updateSettings: (settings: Partial<CrosshairSettings>) => void;
    importValorantCode: (code: string) => boolean;
}

export const useCrosshairStore = create<CrosshairStore>((set) => ({
    // Default fallback (Classic Green Cross)
    color: '#00FF00',
    length: 6,
    thickness: 2,
    gap: 2,
    dot: false,

    // For manual UI sliders in your settings menu
    updateSettings: (settings) => set((state) => ({ ...state, ...settings })),

    // The Decryption Engine
    importValorantCode: (code: string) => {
        try {
            const parts = code.split(';');
            const newSettings: Partial<CrosshairSettings> = {};

            for (let i = 0; i < parts.length; i++) {
                const key = parts[i];
                const val = parts[i + 1];

                // Parse Colors
                if (key === 'c') {
                    const colors: Record<string, string> = {
                        '1': '#00FF00', // Green
                        '2': '#ADFF2F', // Yellow Green
                        '3': '#7FFF00', // Green Yellow
                        '4': '#FFFF00', // Yellow
                        '5': '#00FFFF', // Cyan
                        '6': '#FF00FF', // Pink
                        '7': '#FF0000', // Red
                    };
                    if (colors[val]) newSettings.color = colors[val];
                }

                // Parse Custom Hex Colors (Valorant added this later)
                if (key === 'u') newSettings.color = `#${val}`;

                // Parse Dimensions (0l = inner line length, 0t = thickness, 0o = offset/gap)
                if (key === '0l') newSettings.length = parseInt(val, 10);
                if (key === '0t') newSettings.thickness = parseInt(val, 10);
                if (key === '0o') newSettings.gap = parseInt(val, 10);

                // Parse Center Dot
                if (key === 'd') newSettings.dot = val === '1';
            }

            set((state) => ({ ...state, ...newSettings }));
            return true; // Success state for your UI notifications
        } catch (error) {
            console.error("[AimSync] Invalid crosshair code format", error);
            return false; // Error state for your UI
        }
    }
}));