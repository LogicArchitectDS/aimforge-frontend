'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';

export type WeaponCategory = 'sidearm' | 'smg' | 'rifle';

interface WeaponModelProps {
    weaponType: WeaponCategory;
}

const MODEL_PATHS: Record<WeaponCategory, string> = {
    sidearm: '/models/generic_pistol.glb',
    smg: '/models/generic_smg.glb',
    rifle: '/models/generic_rifle.glb',
};

function Model({ weaponType }: WeaponModelProps) {
    const modelPath = MODEL_PATHS[weaponType];
    const { scene } = useGLTF(modelPath);

    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useFrame(() => {
        if (groupRef.current) {
            const offset = new THREE.Vector3(0.5, -0.4, -1.2);

            offset.applyQuaternion(camera.quaternion);
            groupRef.current.position.copy(camera.position).add(offset);
            groupRef.current.quaternion.copy(camera.quaternion);
        }
    });

    return (
        <group ref={groupRef}>
            <primitive object={clonedScene} scale={[0.1, 0.1, 0.1]} />
        </group>
    );
}

export default function WeaponModel({ weaponType }: WeaponModelProps) {
    return (
        <Suspense fallback={null}>
            <Model weaponType={weaponType} />
        </Suspense>
    );
}

useGLTF.preload('/models/generic_pistol.glb');
useGLTF.preload('/models/generic_smg.glb');
useGLTF.preload('/models/generic_rifle.glb');