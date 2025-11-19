'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { SolarSystem } from './SolarSystem';
import { MOUSE } from 'three';

export default function Scene() {
    return (
        <div className="absolute inset-0 w-full h-full bg-black">
            <Canvas camera={{ position: [0, 20, 25], fov: 60 }} gl={{ antialias: false }}>
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={0.1} />
                <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />

                <SolarSystem />

                <OrbitControls
                    makeDefault
                    mouseButtons={{
                        LEFT: -1 as any, // Disable Left Click for OrbitControls so Slingshot works
                        MIDDLE: MOUSE.DOLLY,
                        RIGHT: MOUSE.ROTATE
                    }}
                />
                <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <EffectComposer>
                    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
