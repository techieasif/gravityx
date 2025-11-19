import React, { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Raycaster, Plane, Vector2 } from 'three';
import { v4 as uuidv4 } from 'uuid';
import { Body } from './Body';
import { CelestialBody, updatePhysics } from '../utils/physics';
import { useSimulationStore } from '../store/simulationStore';
import { Line } from '@react-three/drei';

const INITIAL_BODIES: CelestialBody[] = [
    {
        id: 'sun',
        name: 'Sun',
        mass: 1000,
        radius: 2.5,
        color: '#ffaa00', // Warmer sun color
        position: new Vector3(0, 0, 0),
        velocity: new Vector3(0, 0, 0),
        isFixed: true,
    },
    {
        id: 'earth',
        name: 'Earth',
        mass: 10,
        radius: 0.5,
        color: '#00f2ff', // Cyan neon
        position: new Vector3(15, 0, 0),
        velocity: new Vector3(0, 0, 2.5),
    },
    {
        id: 'mars',
        name: 'Mars',
        mass: 8,
        radius: 0.4,
        color: '#ff0055', // Pink neon
        position: new Vector3(22, 0, 0),
        velocity: new Vector3(0, 0, 2.1),
    },
    {
        id: 'jupiter',
        name: 'Jupiter',
        mass: 50,
        radius: 1.2,
        color: '#ffe600', // Yellow neon
        position: new Vector3(35, 0, 0),
        velocity: new Vector3(0, 0, 1.6),
    },
];

export const SolarSystem: React.FC = () => {
    const { speed, gravityConstant, resetKey } = useSimulationStore();
    const [bodies, setBodies] = useState<CelestialBody[]>(INITIAL_BODIES);
    const bodiesRef = useRef<CelestialBody[]>(INITIAL_BODIES);

    // Slingshot state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Vector3 | null>(null);
    const [dragCurrent, setDragCurrent] = useState<Vector3 | null>(null);

    // Reset simulation when resetKey changes
    useEffect(() => {
        // Deep copy initial bodies to avoid mutation issues on reset
        const resetBodies = INITIAL_BODIES.map(b => ({
            ...b,
            position: b.position.clone(),
            velocity: b.velocity.clone()
        }));
        setBodies(resetBodies);
        bodiesRef.current = resetBodies;
    }, [resetKey]);

    // Sync state with ref when bodies change
    useEffect(() => {
        bodiesRef.current = bodies;
    }, [bodies]);

    const handlePointerDown = (e: any) => {
        // Only start drag if clicking on background (plane)
        e.stopPropagation();
        setIsDragging(true);
        setDragStart(e.point);
        setDragCurrent(e.point);
    };

    const handlePointerMove = (e: any) => {
        if (isDragging && dragStart) {
            e.stopPropagation();
            setDragCurrent(e.point);
        }
    };

    const handlePointerUp = (e: any) => {
        if (isDragging && dragStart && dragCurrent) {
            e.stopPropagation();
            setIsDragging(false);

            const launchVector = new Vector3().subVectors(dragStart, dragCurrent);
            const velocity = launchVector.multiplyScalar(0.5); // Scale factor for velocity

            const colors = ['#00f2ff', '#ff0055', '#00ff9d', '#ffffff', '#ffe600'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            const newBody: CelestialBody = {
                id: uuidv4(),
                name: 'New Planet',
                mass: Math.random() * 5 + 1,
                radius: Math.random() * 0.4 + 0.2,
                color: randomColor,
                position: dragStart.clone(),
                velocity: velocity,
            };

            setBodies((prev) => [...prev, newBody]);
            setDragStart(null);
            setDragCurrent(null);
        }
    };

    useFrame((_, delta) => {
        const timeStep = Math.min(delta, 0.1) * speed;
        // We need to use the REF for physics to be continuous
        const newBodies = updatePhysics(bodiesRef.current, timeStep, gravityConstant);

        // Mutate the original objects so the child components see the change
        // This is a bit hacky but efficient for React Three Fiber without a store
        for (let i = 0; i < newBodies.length; i++) {
            bodiesRef.current[i].position.copy(newBodies[i].position);
            bodiesRef.current[i].velocity.copy(newBodies[i].velocity);
        }
    });

    return (
        <>
            {/* Invisible plane to catch clicks for slingshot */}
            <mesh visible={false}
                rotation={[-Math.PI / 2, 0, 0]}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            // Also handle pointer up on missed in case they drag off the plane? 
            // Plane is huge so unlikely.
            >
                <planeGeometry args={[1000, 1000]} />
            </mesh>

            {/* Slingshot Line */}
            {isDragging && dragStart && dragCurrent && (
                <Line
                    points={[dragStart, dragCurrent]}
                    color="#00f2ff"
                    lineWidth={2}
                    dashed
                    dashScale={2}
                    gapSize={1}
                />
            )}

            {bodies.map((body) => (
                <Body key={body.id} body={body} />
            ))}
        </>
    );
};
