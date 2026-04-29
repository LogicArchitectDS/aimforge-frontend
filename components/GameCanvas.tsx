'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Import our newly created stores, hooks, and components
import WeaponModel from './WeaponModel';
import TargetManager from './TargetManager';
import { useWeaponStore } from '@/store/weaponStore';
import { useRecoil } from '@/hooks/UseRecoil';

// 1. We create an inner component because we need access to the useThree() hook
function EngineCore() {
    const { camera, scene } = useThree();
    const activeWeapon = useWeaponStore((state) => state.activeWeapon);

    // Pull the math from our custom hook
    const { startFiring, stopFiring, getShotTrajectory } = useRecoil(activeWeapon);

    // The Raycaster acts as our invisible bullet
    const raycaster = useRef(new THREE.Raycaster());

    // Track firing state internally for the game loop
    const isHoldingTrigger = useRef(false);
    const lastShotTime = useRef(0);

    // 2. Mouse Click Listeners
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button === 0 && activeWeapon) {
                startFiring();
                isHoldingTrigger.current = true;
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === 0) {
                stopFiring();
                isHoldingTrigger.current = false;
            }
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [activeWeapon, startFiring, stopFiring]);

    // 3. The Core Game Loop (Runs 60+ times per second)
    useFrame(() => {
        if (!activeWeapon || !isHoldingTrigger.current) return;

        const now = performance.now();
        // Convert Fire Rate (Rounds Per Second) to milliseconds between shots
        const timeBetweenShots = 1000 / activeWeapon.fireRate;

        // If enough time has passed since the last bullet, fire the next one!
        if (now - lastShotTime.current >= timeBetweenShots) {
            lastShotTime.current = now;

            // Get the mathematical bloom offset
            const { offsetX, offsetY } = getShotTrajectory();

            // Set the raycaster to the center of the screen (0,0) PLUS the recoil offset
            raycaster.current.setFromCamera(new THREE.Vector2(offsetX, offsetY), camera);

            // Check what the invisible bullet hit in the 3D scene
            const intersects = raycaster.current.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                // Grab the first thing the bullet hit
                const hitObject = intersects[0].object;

                // Check if it's a target
                if (hitObject.name === 'target') {
                    // Trigger the respawn logic injected by TargetManager!
                    if (hitObject.userData && hitObject.userData.onHit) {
                        hitObject.userData.onHit(hitObject.userData.id);
                    }
                }
            }
        }
    });

    return (
        <>
            {/* Locks the mouse to the center of the screen like a real FPS */}
            <PointerLockControls />

            {/* Basic Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />

            {/* The new mathematically locked Primary Engagement Zone spawner */}
            <TargetManager />

            {/* Render the visually correct generic gun model based on the weapon category */}
            {activeWeapon && <WeaponModel weaponType={activeWeapon.type} />}
        </>
    );
}

// 4. The Main Wrapper
export default function GameCanvas() {
    return (
        // We add a UI overlay instruction for the player
        <div className="w-full h-screen bg-zinc-900 relative">
            <div className="absolute top-4 left-4 z-10 text-white/50 font-mono text-sm pointer-events-none">
                Click on the game to lock mouse. Press ESC to unlock.
            </div>

            <Canvas>
                <EngineCore />
            </Canvas>
        </div>
    );
}