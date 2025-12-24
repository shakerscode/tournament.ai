// 'use client';

// import { useEffect, useState } from 'react';
// import { Player } from '@/lib/localDb';

// interface Team {
//   id: string;
//   name: string;
//   players: Player[];
// }

// interface TeamCreationModalProps {
//   player1: Player;
//   player2: Player;
//   teamNumber: number;
//   onNext: (team: Team) => void;
//   onCancel: () => void;
//   totalTeams: number;
// }

// export default function TeamCreationModal({
//   player1,
//   player2,
//   teamNumber,
//   onNext,
//   onCancel,
//   totalTeams,
// }: TeamCreationModalProps) {
//   const [isSpinning, setIsSpinning] = useState(true);
//   const [showPlayers, setShowPlayers] = useState(false);
//   const [particles, setParticles] = useState<Array<{
//     id: string;
//     x: number;
//     y: number;
//     size: number;
//   }>>([]);

//   // Play sound effect
//   const playSound = (type: 'spin' | 'reveal' | 'success') => {
//     try {
//       // Create a simple beep using Web Audio API
//       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();

//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);

//       if (type === 'spin') {
//         oscillator.frequency.value = 400;
//         gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.1);
//       } else if (type === 'reveal') {
//         oscillator.frequency.value = 800;
//         gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.3);
//       } else if (type === 'success') {
//         oscillator.frequency.value = 1200;
//         gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
//         oscillator.start(audioContext.currentTime);
//         oscillator.stop(audioContext.currentTime + 0.2);
//       }
//     } catch (error) {
//       // Fallback if Web Audio API is not available
//       console.log('Sound not available');
//     }
//   };

//   // Generate particle effects
//   useEffect(() => {
//     if (!isSpinning) return;

//     const generateParticles = () => {
//       const newParticles = [];
//       for (let i = 0; i < 20; i++) {
//         newParticles.push({
//           id: `particle-${Date.now()}-${i}`,
//           x: Math.random() * 100,
//           y: Math.random() * 100,
//           size: Math.random() * 4 + 2,
//         });
//       }
//       setParticles(newParticles);
//     };

//     playSound('spin');
//     generateParticles();
//     const interval = setInterval(() => {
//       generateParticles();
//       playSound('spin');
//     }, 500);

//     return () => clearInterval(interval);
//   }, [isSpinning]);

//   // Stop spinning and reveal players
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setIsSpinning(false);
//       setShowPlayers(true);
//       playSound('reveal');
//     }, 2000);

//     return () => clearTimeout(timeout);
//   }, []);

//   const handleNext = () => {
//     playSound('success');
//     const team: Team = {
//       id: `team-${Date.now()}`,
//       name: `Team ${teamNumber}`,
//       players: [player1, player2],
//     };
//     onNext(team);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
//       {/* Background gradient animation */}
//       <div
//         className="absolute inset-0"
//         style={{
//           background: isSpinning
//             ? 'radial-gradient(circle, rgba(220, 38, 38, 0.2), rgba(0, 0, 0, 0.8))'
//             : 'transparent',
//           transition: 'all 0.5s ease-out',
//         }}
//       />

//       {/* Magic Particles */}
//       {particles.map((particle) => (
//         <div
//           key={particle.id}
//           className="absolute rounded-full"
//           style={{
//             width: `${particle.size}px`,
//             height: `${particle.size}px`,
//             left: `${particle.x}%`,
//             top: `${particle.y}%`,
//             background: `radial-gradient(circle, rgba(220, 38, 38, 0.8), rgba(220, 38, 38, 0))`,
//             boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
//             animation: `floatUp 2s ease-in forwards`,
//             zIndex: 10,
//           }}
//         />
//       ))}

//       {/* Modal Content */}
//       <div className="relative z-50 max-w-2xl w-full mx-4">
//         <div className="bg-gradient-to-b from-secondary-black to-primary-black border-2 border-primary-red rounded-2xl p-8 shadow-2xl">
//           {/* Progress */}
//           <div className="text-center mb-8">
//             <p className="text-accent-gray-medium text-sm">
//               Team {teamNumber} of {totalTeams}
//             </p>
//             <div className="w-full bg-secondary-black rounded-full h-2 mt-2 overflow-hidden">
//               <div
//                 className="bg-primary-red h-full transition-all duration-300"
//                 style={{ width: `${(teamNumber / totalTeams) * 100}%` }}
//               />
//             </div>
//           </div>

//           {isSpinning ? (
//             /* Spinning State */
//             <>
//               <h2 className="text-3xl font-bold text-primary-red text-center mb-8 animate-pulse">
//                 Spinning the Wheel of Destiny...
//               </h2>

//               <div className="flex justify-center gap-8 mb-8">
//                 {[player1, player2].map((player, idx) => (
//                   <div
//                     key={player.id}
//                     className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-red to-red-700 flex items-center justify-center"
//                     style={{
//                       animation: `spin${idx} 2s linear infinite`,
//                       boxShadow: '0 0 30px rgba(220, 38, 38, 0.8)',
//                     }}
//                   >
//                     <div className="text-4xl">🎭</div>
//                   </div>
//                 ))}
//               </div>

//               <p className="text-center text-accent-gray-medium animate-pulse">
//                 ✨ Magic is happening... ✨
//               </p>
//             </>
//           ) : (
//             /* Reveal State */
//             <>
//               <h2 className="text-3xl font-bold text-primary-red text-center mb-8">
//                 🎉 Team {teamNumber} 🎉
//               </h2>

//               <div
//                 className="flex justify-center gap-6 mb-10"
//                 style={{
//                   animation: showPlayers ? 'slideIn 0.5s ease-out' : 'none',
//                 }}
//               >
//                 {/* Player 1 */}
//                 <div
//                   className="flex-1 text-center"
//                   style={{
//                     animation: showPlayers
//                       ? 'slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
//                       : 'none',
//                   }}
//                 >
//                   <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
//                     <span className="text-3xl">👤</span>
//                   </div>
//                   <h3 className="text-xl font-bold text-accent-white">{player1.name}</h3>
//                   <p className="text-sm text-accent-gray-medium mt-1">{player1.category}</p>
//                 </div>

//                 {/* Plus Sign */}
//                 <div className="flex items-center">
//                   <div className="text-4xl font-bold text-primary-red">+</div>
//                 </div>

//                 {/* Player 2 */}
//                 <div
//                   className="flex-1 text-center"
//                   style={{
//                     animation: showPlayers
//                       ? 'slideInRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
//                       : 'none',
//                   }}
//                 >
//                   <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
//                     <span className="text-3xl">👤</span>
//                   </div>
//                   <h3 className="text-xl font-bold text-accent-white">{player2.name}</h3>
//                   <p className="text-sm text-accent-gray-medium mt-1">{player2.category}</p>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex gap-4">
//                 <button
//                   onClick={onCancel}
//                   className="flex-1 btn btn-outline"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleNext}
//                   className="flex-1 btn btn-primary"
//                 >
//                   {teamNumber === totalTeams ? '🎉 Done!' : '➜ Next Team'}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes spin0 {
//           from {
//             transform: rotateY(0deg) rotateX(0deg);
//           }
//           to {
//             transform: rotateY(360deg) rotateX(360deg);
//           }
//         }

//         @keyframes spin1 {
//           from {
//             transform: rotateY(360deg) rotateX(360deg);
//           }
//           to {
//             transform: rotateY(0deg) rotateX(0deg);
//           }
//         }

//         @keyframes slideInLeft {
//           from {
//             opacity: 0;
//             transform: translateX(-40px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         @keyframes slideInRight {
//           from {
//             opacity: 0;
//             transform: translateX(40px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: scale(0.8);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         @keyframes floatUp {
//           0% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//           100% {
//             opacity: 0;
//             transform: translateY(-100px);
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Player } from '@/lib/localDb';

interface Team {
  id: string;
  name: string;
  players: Player[];
}

interface TeamCreationModalProps {
  player1: Player;
  player2: Player;
  teamNumber: number;
  teamName: string;
  onNext: (team: Team) => void;
  onCancel: () => void;
  totalTeams: number;
}

export default function TeamCreationModal({
  player1,
  player2,
  teamNumber,
  teamName,
  onNext,
  onCancel,
  totalTeams,
}: TeamCreationModalProps) {
  const [isSpinning, setIsSpinning] = useState(true);
  const [showPlayers, setShowPlayers] = useState(false);
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
        // Drum roll effect - sweep up in frequency
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else if (type === 'reveal') {
        // Ascending beep - build anticipation
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else if (type === 'success') {
        // Success chord - two notes
        oscillator.frequency.value = 1200;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.25);

        // Second note
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
    if (!isSpinning) return;

    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 25; i++) {
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
  }, [isSpinning]);

  // Stop spinning and reveal players after 6-7 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSpinning(false);
      setShowPlayers(true);
      playSound('reveal');
    }, 6500); // 6.5 seconds

    return () => clearTimeout(timeout);
  }, []);

  const handleNext = () => {
    playSound('success');
    const team: Team = {
      id: `team-${Date.now()}`,
      name: teamName,
      players: [player1, player2],
    };
    onNext(team);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      {/* Background gradient animation */}
      <div
        className="absolute inset-0"
        style={{
          background: isSpinning
            ? 'radial-gradient(circle, rgba(220, 38, 38, 0.2), rgba(0, 0, 0, 0.8))'
            : 'transparent',
          transition: 'all 0.5s ease-out',
        }}
      />

      {/* Magic Particles */}
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

      {/* Modal Content */}
      <div className="relative z-50 max-w-2xl w-full mx-4">
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

          {isSpinning ? (
            /* Spinning State */
            <>
              <h2 className="text-3xl font-bold text-primary-red text-center mb-8 animate-pulse">
                🎭 Building Dream {teamNumber}...
              </h2>

              <div className="flex justify-center gap-8 mb-8">
                {[player1, player2].map((player, idx) => (
                  <div
                    key={player.id}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-red to-red-700 flex items-center justify-center"
                    style={{
                      animation: `spin${idx} 6.5s linear infinite`,
                      boxShadow: '0 0 30px rgba(220, 38, 38, 0.8)',
                    }}
                  >
                    <div className="text-4xl">🎭</div>
                  </div>
                ))}
              </div>

              <p className="text-center text-accent-gray-medium animate-pulse">
                ✨ Magic spell is building... ✨
              </p>

              {/* Pulse Animation */}
              <div className="mt-6 flex justify-center">
                <div
                  className="w-16 h-16 rounded-full border-2 border-primary-red"
                  style={{
                    animation: 'scalePulse 1.5s ease-in-out infinite',
                    boxShadow: '0 0 40px rgba(220, 38, 38, 0.6)',
                  }}
                />
              </div>
            </>
          ) : (
            /* Reveal State */
            <>
              <h2 className="text-3xl font-bold text-primary-red text-center mb-8">
                ⚡ Team {teamName} ⚡
              </h2>

              <div
                className="flex justify-center gap-6 mb-10"
                style={{
                  animation: showPlayers ? 'slideIn 0.5s ease-out' : 'none',
                }}
              >
                {/* Player 1 */}
                <div
                  className="flex-1 text-center"
                  style={{
                    animation: showPlayers
                      ? 'slideInLeft 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      : 'none',
                  }}
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-4xl">👤</span>
                  </div>
                  <h3 className="text-lg font-bold text-accent-white">{player1.name}</h3>
                  <p className="text-sm text-accent-gray-medium mt-1">{player1.category}</p>
                </div>

                {/* Plus Sign */}
                <div className="flex items-center">
                  <div className="text-5xl font-bold text-primary-red animate-bounce">+</div>
                </div>

                {/* Player 2 */}
                <div
                  className="flex-1 text-center"
                  style={{
                    animation: showPlayers
                      ? 'slideInRight 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      : 'none',
                  }}
                >
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
                  onClick={handleNext}
                  className="flex-1 btn btn-primary"
                >
                  {teamNumber === totalTeams ? '🎉 Complete!' : '➜ Next Team'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin0 {
          from {
            transform: rotateY(0deg) rotateX(0deg) scale(1);
          }
          50% {
            transform: rotateY(180deg) rotateX(180deg) scale(1.05);
          }
          to {
            transform: rotateY(360deg) rotateX(360deg) scale(1);
          }
        }

        @keyframes spin1 {
          from {
            transform: rotateY(360deg) rotateX(360deg) scale(1);
          }
          50% {
            transform: rotateY(180deg) rotateX(180deg) scale(1.05);
          }
          to {
            transform: rotateY(0deg) rotateX(0deg) scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        @keyframes scalePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
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
      `}</style>
    </div>
  );
}