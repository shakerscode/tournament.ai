'use client';

import { useEffect, useState } from 'react';
import { Player } from '@/lib/localDb';

interface Team {
  id: string;
  name: string;
  players: Player[];
}

interface TensionTeamCreationProps {
  player1: Player;
  player2: Player;
  teamNumber: number;
  teamName: string;
  onSaveAndNext: (team: Team) => void;
  onCancel: () => void;
  totalTeams: number;
}

export default function TensionTeamCreation({
  player1,
  player2,
  teamNumber,
  teamName,
  onSaveAndNext,
  onCancel,
  totalTeams,
}: TensionTeamCreationProps) {
  const [phase, setPhase] = useState<'finding-p1' | 'found-p1' | 'finding-p2' | 'found-both' | 'complete'>('finding-p1');
  const [particles, setParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    size: number;
  }>>([]);

  // Play sound effect
  const playSound = (type: 'spin' | 'reveal' | 'success') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'spin') {
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else if (type === 'reveal') {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else if (type === 'success') {
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.25);

        setTimeout(() => {
          try {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 1500;
            gain2.gain.setValueAtTime(0.2, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.25);
          } catch (e) {}
        }, 150);
      }
    } catch (error) {
      console.log('Sound not available');
    }
  };

  // Generate particle effects
  useEffect(() => {
    if (phase === 'complete') return;

    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: `particle-${Date.now()}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
        });
      }
      setParticles(newParticles);
    };

    playSound('spin');
    generateParticles();
    const interval = setInterval(() => {
      generateParticles();
      playSound('spin');
    }, 600);

    return () => clearInterval(interval);
  }, [phase]);

  // Animation timeline
  useEffect(() => {
    if (phase === 'finding-p1') {
      const timer = setTimeout(() => {
        playSound('reveal');
        setPhase('found-p1');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (phase === 'found-p1') {
      const timer = setTimeout(() => {
        setPhase('finding-p2');
        playSound('spin');
      }, 1500);
      return () => clearTimeout(timer);
    } else if (phase === 'finding-p2') {
      const timer = setTimeout(() => {
        playSound('reveal');
        setPhase('found-both');
      }, 3000);
      return () => clearTimeout(timer);
    } else if (phase === 'found-both') {
      const timer = setTimeout(() => {
        setPhase('complete');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleSaveAndNext = () => {
    playSound('success');
    const team: Team = {
      id: `team-${Date.now()}`,
      name: teamName,
      players: [player1, player2],
    };
    onSaveAndNext(team);
  };

  const isAnimating = phase !== 'complete';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isAnimating
            ? 'radial-gradient(circle, rgba(220, 38, 38, 0.2), rgba(0, 0, 0, 0.8))'
            : 'transparent',
          transition: 'all 0.5s ease-out',
        }}
      />

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `radial-gradient(circle, rgba(220, 38, 38, 0.8), rgba(220, 38, 38, 0))`,
            boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
            animation: `floatUp 2s ease-in forwards`,
            zIndex: 10,
          }}
        />
      ))}

      {/* Modal */}
      <div className="relative z-50 max-w-2xl w-full">
        <div className="bg-gradient-to-b from-secondary-black to-primary-black border-2 border-primary-red rounded-2xl p-8 shadow-2xl">
          {/* Progress */}
          <div className="text-center mb-8">
            <p className="text-accent-gray-medium text-sm">
              Team {teamNumber} of {totalTeams}
            </p>
            <div className="w-full bg-secondary-black rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-primary-red h-full transition-all duration-300"
                style={{ width: `${(teamNumber / totalTeams) * 100}%` }}
              />
            </div>
          </div>

          {isAnimating ? (
            /* Animating State */
            <>
              <h2 className="text-3xl font-bold text-primary-red text-center mb-8 animate-pulse">
                🎭 Building Team {teamNumber}
              </h2>

              <div className="flex justify-center gap-8 mb-8">
                {/* Player 1 Container */}
                <div className="flex flex-col items-center">
                  {(phase === 'found-p1' || phase === 'finding-p2' || phase === 'found-both') && (
                    <div
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg"
                      style={{
                        animation: 'slideInFromLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                  {(phase === 'found-p1' || phase === 'finding-p2' || phase === 'found-both') && (
                    <div style={{ animation: 'slideInFromLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                      <h3 className="text-lg font-bold text-accent-white text-center">{player1.name}</h3>
                      <p className="text-sm text-accent-gray-medium text-center">{player1.category}</p>
                    </div>
                  )}
                  {(phase === 'finding-p1') && (
                    <div className="w-24 h-24 rounded-full border-4 border-primary-red animate-spin mb-4" />
                  )}
                </div>

                {/* Plus Sign - appears after p1 found */}
                {(phase === 'finding-p2' || phase === 'found-both') && (
                  <div className="flex items-center">
                    <div className="text-5xl font-bold text-primary-red animate-bounce">+</div>
                  </div>
                )}

                {/* Player 2 Container */}
                <div className="flex flex-col items-center">
                  {(phase === 'found-p1' || phase === 'finding-p2') && (
                    <div className="w-24 h-24 rounded-full border-4 border-primary-red animate-spin mb-4" />
                  )}
                  {(phase === 'found-both') && (
                    <div
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg"
                      style={{
                        animation: 'slideInFromRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    >
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                  {(phase === 'found-both') && (
                    <div style={{ animation: 'slideInFromRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                      <h3 className="text-lg font-bold text-accent-white text-center">{player2.name}</h3>
                      <p className="text-sm text-accent-gray-medium text-center">{player2.category}</p>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-center text-accent-gray-medium animate-pulse">
                ✨ Searching for perfect match... ✨
              </p>
            </>
          ) : (
            /* Complete State */
            <>
              <h2 className="text-3xl font-bold text-primary-red text-center mb-8">
                ⚡ Team {teamName} ⚡
              </h2>

              <div className="flex justify-center gap-6 mb-10">
                {/* Player 1 */}
                <div className="flex-1 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl">👤</span>
                  </div>
                  <h3 className="text-lg font-bold text-accent-white">{player1.name}</h3>
                  <p className="text-sm text-accent-gray-medium mt-1">{player1.category}</p>
                </div>

                {/* Plus */}
                <div className="flex items-center">
                  <div className="text-5xl font-bold text-primary-red animate-bounce">+</div>
                </div>

                {/* Player 2 */}
                <div className="flex-1 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl">👤</span>
                  </div>
                  <h3 className="text-lg font-bold text-accent-white">{player2.name}</h3>
                  <p className="text-sm text-accent-gray-medium mt-1">{player2.category}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={onCancel}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndNext}
                  className="flex-1 btn btn-primary"
                >
                  {teamNumber === totalTeams ? '🎉 Complete!' : '💾 Save & Next'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}