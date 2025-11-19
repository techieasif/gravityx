'use client';

import dynamic from 'next/dynamic';

import { Controls } from '../components/Controls';

// Dynamically import the Scene component with no SSR to avoid window is not defined errors with Three.js
const Scene = dynamic(() => import('../components/Scene'), { ssr: false });

export default function Home() {
  return (
    <main className="w-screen h-screen relative overflow-hidden bg-black">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">

        {/* Header - Top Left */}
        <header className="pointer-events-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white/90 mix-blend-difference">
            Gravity<span className="text-cyan-400">X</span>
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-xs backdrop-blur-sm">
            Interactive N-body gravity simulation.
            <br />
            <span className="text-cyan-400/80">Drag to slingshot celestial bodies.</span>
          </p>
        </header>

        {/* Controls - Bottom Right */}
        <div className="pointer-events-auto self-end">
          <Controls />
        </div>

      </div>
    </main>
  );
}
