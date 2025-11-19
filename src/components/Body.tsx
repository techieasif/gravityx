import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { CelestialBody } from '../utils/physics';
import { Html, Trail } from '@react-three/drei';

interface BodyProps {
    body: CelestialBody;
}

export const Body: React.FC<BodyProps> = ({ body }) => {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(body.position);
        }
    });

    const MeshComponent = (
        <mesh ref={meshRef} position={body.position}>
            <sphereGeometry args={[body.radius, 32, 32]} />
            <meshStandardMaterial
                color={body.color}
                emissive={body.color}
                emissiveIntensity={body.isFixed ? 2 : 0.5}
                toneMapped={false}
            />
            {body.isFixed && (
                <pointLight distance={100} intensity={2} color={body.color} decay={2} />
            )}
        </mesh>
    );

    return (
        <group>
            {!body.isFixed ? (
                <Trail
                    width={2}
                    color={body.color}
                    length={20}
                    decay={1}
                    local={false}
                    stride={0}
                    interval={1}
                    attenuation={(width) => width}
                >
                    {MeshComponent}
                </Trail>
            ) : (
                MeshComponent
            )}
            {/* Label */}
            {/* <Html position={body.position} distanceFactor={10}>
        <div className="text-white text-xs pointer-events-none select-none bg-black/50 px-1 rounded">
          {body.name}
        </div>
      </Html> */}
        </group>
    );
};
