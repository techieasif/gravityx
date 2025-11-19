import { describe, it, expect } from 'vitest';
import { Vector3 } from 'three';
import { calculateForces, updatePhysics, CelestialBody } from './physics';

describe('Physics Engine', () => {
    it('should calculate gravitational force between two bodies', () => {
        const bodyA: CelestialBody = {
            id: '1',
            name: 'A',
            mass: 100,
            radius: 1,
            color: 'red',
            position: new Vector3(0, 0, 0),
            velocity: new Vector3(0, 0, 0),
        };

        const bodyB: CelestialBody = {
            id: '2',
            name: 'B',
            mass: 10,
            radius: 1,
            color: 'blue',
            position: new Vector3(10, 0, 0),
            velocity: new Vector3(0, 0, 0),
        };

        const G = 1;
        const forces = calculateForces([bodyA, bodyB], G);

        // F = G * m1 * m2 / r^2
        // F = 1 * 100 * 10 / 10^2 = 1000 / 100 = 10
        // Direction for A is towards B (positive X)
        // Direction for B is towards A (negative X)

        expect(forces[0].x).toBeCloseTo(10);
        expect(forces[0].y).toBe(0);
        expect(forces[0].z).toBe(0);

        expect(forces[1].x).toBeCloseTo(-10);
        expect(forces[1].y).toBe(0);
        expect(forces[1].z).toBe(0);
    });

    it('should ignore forces if bodies are overlapping/too close', () => {
        const bodyA: CelestialBody = {
            id: '1',
            name: 'A',
            mass: 100,
            radius: 5,
            color: 'red',
            position: new Vector3(0, 0, 0),
            velocity: new Vector3(0, 0, 0),
        };

        const bodyB: CelestialBody = {
            id: '2',
            name: 'B',
            mass: 10,
            radius: 6, // Radius sum is 11
            color: 'blue',
            position: new Vector3(10, 0, 0), // Distance is 10
            velocity: new Vector3(0, 0, 0),
        };

        const forces = calculateForces([bodyA, bodyB], 1);

        // Distance (10) < Radius Sum (11), so force should be skipped (0)
        expect(forces[0].length()).toBe(0);
        expect(forces[1].length()).toBe(0);
    });

    it('should update positions and velocities correctly', () => {
        const body: CelestialBody = {
            id: '1',
            name: 'Mover',
            mass: 1,
            radius: 1,
            color: 'green',
            position: new Vector3(0, 0, 0),
            velocity: new Vector3(1, 0, 0),
        };

        // Single body, no forces
        const updated = updatePhysics([body], 1, 1);

        // New pos = old pos + velocity * dt
        // (0,0,0) + (1,0,0)*1 = (1,0,0)
        expect(updated[0].position.x).toBe(1);
        expect(updated[0].velocity.x).toBe(1);
    });
});
