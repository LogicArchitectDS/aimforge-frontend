export type AimSyncSettings = {
    sensitivity: number;
    dpi: number;
    scopedSensitivityMultiplier: number;
    fov: number;
    gamePreset: string;
    defaultDifficulty: "easy" | "medium" | "hard" | "extreme";
    defaultDurationSeconds: 30 | 45 | 60;
    fullscreenByDefault: boolean;
    soundEnabled: boolean;
    crosshairEnabled: boolean;
};

const SETTINGS_STORAGE_KEY = "aimsync_user_settings";

export const getDefaultSettings = (): AimSyncSettings => ({
    sensitivity: 0.35,
    dpi: 800,
    scopedSensitivityMultiplier: 1,
    fov: 103,
    gamePreset: "custom",
    defaultDifficulty: "medium",
    defaultDurationSeconds: 30,
    fullscreenByDefault: true,
    soundEnabled: true,
    crosshairEnabled: true,
});

export const getStoredSettings = (): AimSyncSettings => {
    if (typeof window === "undefined") return getDefaultSettings(); // SSR Safety Check

    try {
        const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!raw) return getDefaultSettings();

        const parsed = JSON.parse(raw) as Partial<AimSyncSettings>;
        return { ...getDefaultSettings(), ...parsed };
    } catch (error) {
        console.error("Failed to read user settings:", error);
        return getDefaultSettings();
    }
};

export const saveStoredSettings = (settings: AimSyncSettings): void => {
    if (typeof window === "undefined") return; // SSR Safety Check
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save user settings:", error);
    }
};

export const resetStoredSettings = (): AimSyncSettings => {
    const defaults = getDefaultSettings();
    saveStoredSettings(defaults);
    return defaults;
};