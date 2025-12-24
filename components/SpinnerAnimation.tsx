'use client';

import { useEffect, useState } from 'react';
import { Player } from '@/lib/localDb';

interface SpinnerAnimationProps {
  players: Player[];
}

export default function SpinnerAnimation({ players }: SpinnerAnimationProps) {
  const [isSpinning, setIsSpinning] = useState(true);
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    size: number;
  }>>([]);

  // Generate particle effects
  useEffect(() => {
    if (!isSpinning) return;

    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: `particle-${Date.now()}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 500);

    return () => clearInterval(interval);
  }, [isSpinning]);

  // Stop spinning after animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSpinning(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-primary-black to-secondary-black flex items-center justify-center overflow-hidden">
      {/* Magic Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `radial-gradient(circle, rgba(220, 38, 38, 0.8), rgba(220, 38, 38, 0))`,
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
            animation: `floatUp 2s ease-in forwards`,
          }}
        />
      ))}

      {/* Central Spinning Container */}
      <div className="relative w-64 h-64">
        {/* Rotating Ring */}
        <div
          className="absolute inset-0 border-4 border-primary-red rounded-full"
          style={{
            animation: isSpinning ? 'spin 2s linear infinite' : 'none',
            boxShadow: '0 0 30px rgba(220, 38, 38, 0.5)',
          }}
        />

        {/* Second Ring (counter rotation) */}
        <div
          className="absolute inset-4 border-2 border-accent-white rounded-full"
          style={{
            animation: isSpinning ? 'spinReverse 3s linear infinite' : 'none',
            opacity: 0.5,
          }}
        />

        {/* Players Bubbles in Circle */}
        {players.map((player, index) => {
          const angle = (index / players.length) * 360;
          const radius = 100;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <div
              key={player.id}
              className="absolute w-20 h-20"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                animation: isSpinning
                  ? `orbitSpin ${2 + index * 0.1}s linear infinite`
                  : 'none',
              }}
            >
              {/* Bubble */}
              <div
                className="w-full h-full rounded-full bg-gradient-to-br from-primary-red to-red-700 flex items-center justify-center text-center p-2 cursor-default transition-transform"
                style={{
                  boxShadow: `0 0 20px rgba(220, 38, 38, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.5)`,
                  animation: isSpinning ? 'pulse 1.5s ease-in-out infinite' : 'none',
                }}
              >
                <div className="text-xs font-bold text-white text-center line-clamp-2">
                  {player.name}
                </div>
              </div>

              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-full border-2 border-primary-red"
                style={{
                  animation: isSpinning ? 'glowPulse 2s ease-in-out infinite' : 'none',
                  opacity: 0.5,
                }}
              />
            </div>
          );
        })}

        {/* Center Magic Spell */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: isSpinning ? 'scalePulse 1s ease-in-out infinite' : 'none',
          }}
        >
          <div className="text-5xl filter drop-shadow-lg">✨</div>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-20 text-center">
        <h1 className="text-4xl font-bold text-primary-red mb-2 animate-pulse">
          Creating Magic Teams...
        </h1>
        <p className="text-accent-gray-medium text-lg">Spinning the wheel of destiny</p>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes orbitSpin {
          from {
            transform: rotate(0deg) translate(100px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translate(100px) rotate(-360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(220, 38, 38, 0.9);
          }
        }

        @keyframes scalePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}