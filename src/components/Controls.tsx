import React from 'react';
import { useSimulationStore } from '../store/simulationStore';

export const Controls: React.FC = () => {
    const { speed, gravityConstant, setSpeed, setGravityConstant, reset } = useSimulationStore();

    return (
        <div className="glass-panel p-5 rounded-2xl w-full max-w-xs backdrop-blur-xl border border-white/5 bg-black/60 shadow-2xl transition-all hover:border-white/20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-medium tracking-widest text-gray-400 uppercase">Simulation</h2>
                <div className="flex gap-2">
                    <button
                        onClick={reset}
                        className="group relative px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 transition-all hover:text-white"
                    >
                        <span className="absolute inset-0 rounded border border-cyan-500/30 transition-all group-hover:border-cyan-400 group-hover:bg-cyan-500/10"></span>
                        Clear
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="group">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors">Time Dilation</span>
                        <span className="text-cyan-400 font-mono bg-cyan-950/30 px-1.5 py-0.5 rounded text-[10px] border border-cyan-900/50">{speed.toFixed(1)}x</span>
                    </div>
                    <div className="relative h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                            style={{ width: `${(speed / 5) * 100}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="group">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors">Gravity (G)</span>
                        <span className="text-pink-500 font-mono bg-pink-950/30 px-1.5 py-0.5 rounded text-[10px] border border-pink-900/50">{gravityConstant.toFixed(2)}</span>
                    </div>
                    <div className="relative h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-600 to-pink-500 rounded-full"
                            style={{ width: `${(gravityConstant / 1.0) * 100}%` }}
                        />
                        <input
                            type="range"
                            min="0.01"
                            max="1.0"
                            step="0.01"
                            value={gravityConstant}
                            onChange={(e) => setGravityConstant(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
