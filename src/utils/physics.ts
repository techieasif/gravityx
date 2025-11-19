import { Vector3 } from 'three';

export interface CelestialBody {
  id: string;
  name: string;
  mass: number;
  radius: number;
  color: string;
  position: Vector3;
  velocity: Vector3;
  isFixed?: boolean; // For the sun, maybe?
}

export const DEFAULT_G = 0.1;

export function calculateForces(bodies: CelestialBody[], G: number = DEFAULT_G): Vector3[] {
  const forces: Vector3[] = bodies.map(() => new Vector3(0, 0, 0));

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const bodyA = bodies[i];
      const bodyB = bodies[j];

      const direction = new Vector3().subVectors(bodyB.position, bodyA.position);
      const distance = direction.length();

      // Avoid division by zero and extreme forces at very close range
      if (distance < (bodyA.radius + bodyB.radius)) continue;

      const forceMagnitude = (G * bodyA.mass * bodyB.mass) / (distance * distance);
      const force = direction.normalize().multiplyScalar(forceMagnitude);

      forces[i].add(force);
      forces[j].sub(force); // Newton's 3rd law
    }
  }

  return forces;
}

export function updatePhysics(bodies: CelestialBody[], timeStep: number, G: number = DEFAULT_G): CelestialBody[] {
  const forces = calculateForces(bodies, G);

  return bodies.map((body, index) => {
    if (body.isFixed) return body;

    const acceleration = forces[index].clone().divideScalar(body.mass);
    const newVelocity = body.velocity.clone().add(acceleration.multiplyScalar(timeStep));
    const newPosition = body.position.clone().add(newVelocity.clone().multiplyScalar(timeStep));

    return {
      ...body,
      velocity: newVelocity,
      position: newPosition,
    };
  });
}
