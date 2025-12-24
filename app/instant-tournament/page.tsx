// "use client";

// import {
//   getPlayers,
//   getTournaments,
//   initializeDb,
//   Player,
//   Tournament,
// } from "@/lib/localDb";
// import SpinnerAnimation from "@/components/SpinnerAnimation";
// import TensionTeamCreation from "@/components/TentionTeamCreation";
// import Toast from "@/components/Toast";
// import AddPlayerModal from "@/components/AddPlayerModal";
// import { useEffect, useState } from "react";

// type Page = "list" | "team-selection" | "team-creation-mode" | "details";
// type TeamCreationMode = "oneclick" | "tension" | null;

// interface Team {
//   id: string;
//   name: string;
//   players: Player[];
// }

// // Team names array - use random, unique names
// const TEAM_NAMES = [
//   "Thunder",
//   "Phoenix",
//   "Dragon",
//   "Titan",
//   "Venom",
//   "Storm",
//   "Inferno",
//   "Shadow",
//   "Apex",
//   "Velocity",
//   "Nexus",
//   "Prism",
//   "Aurora",
//   "Onyx",
//   "Zenith",
//   "Wildfire",
//   "Catalyst",
//   "Primal",
//   "Eclipse",
//   "Essence",
//   "Rift",
//   "Spectral",
//   "Vortex",
//   "Forge",
//   "Surge",
//   "Tempest",
//   "Blade",
//   "Cosmic",
//   "Quantum",
//   "Nova",
//   "Blaze",
//   "Cyclone",
//   "Starlight",
//   "Twilight",
//   "Crimson",
//   "Azure",
//   "Obsidian",
//   "Ember",
//   "Silver",
//   "Gold",
//   "Platinum",
//   "Diamond",
//   "Pearl",
//   "Sapphire",
//   "Ruby",
//   "Emerald",
//   "Violet",
// ];

// export default function InstantTeamPage() {
//   const [page, setPage] = useState<Page>("list");
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [tournaments, setTournaments] = useState<Tournament[]>([]);
//   const [selectedTournament, setSelectedTournament] =
//     useState<Tournament | null>(null);

//   // UI State
//   const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(
//     new Set()
//   );
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newPlayerName, setNewPlayerName] = useState("");
//   const [newPlayerCategory, setNewPlayerCategory] = useState("Beginner");
//   const [toast, setToast] = useState<{
//     message: string;
//     type: "error" | "success";
//   } | null>(null);

//   // Team Creation State
//   const [teamCreationMode, setTeamCreationMode] =
//     useState<TeamCreationMode>(null);
//   const [selectedPlayersForTeams, setSelectedPlayersForTeams] = useState<
//     Player[]
//   >([]);
//   const [createdTeams, setCreatedTeams] = useState<Team[]>([]);
//   const [currentTeamPairIndex, setCurrentTeamPairIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [usedTeamNames, setUsedTeamNames] = useState<Set<string>>(new Set());
//   const [currentTeamName, setCurrentTeamName] = useState("");

//   // Background Music State
//   const [bgAudio, setBgAudio] = useState<HTMLAudioElement | null>(null);
//   const [musicVolume, setMusicVolume] = useState(0.2);
//   const [isMusicMuted, setIsMusicMuted] = useState(false);

//   // Initialize
//   useEffect(() => {
//     const init = async () => {
//       await initializeDb();
//       const [playersData, tournamentsData] = await Promise.all([
//         getPlayers(),
//         getTournaments(),
//       ]);
//       setPlayers(playersData);
//       setTournaments(tournamentsData);

//       const savedTeams = localStorage.getItem("createdTeams");
//       if (savedTeams) {
//         try {
//           const teams = JSON.parse(savedTeams);
//           setCreatedTeams(teams);
//           const usedNames = new Set(teams.map((t: Team) => t.name));
//           setUsedTeamNames(usedNames as any);
//         } catch (e) {
//           console.error("Error loading teams:", e);
//         }
//       }
//     };
//     init();
//   }, []);

//   // Persist teams
//   useEffect(() => {
//     localStorage.setItem("createdTeams", JSON.stringify(createdTeams));
//   }, [createdTeams]);

//   // Auto-hide toast
//   useEffect(() => {
//     if (toast) {
//       const timer = setTimeout(() => setToast(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast]);

//   // Generate team name when pair index changes (prevents infinite re-renders)
//   useEffect(() => {
//     if (
//       teamCreationMode === "tension" &&
//       currentTeamPairIndex < selectedPlayersForTeams.length - 1
//     ) {
//       let availableNames = TEAM_NAMES.filter(
//         (name) => !usedTeamNames.has(name)
//       );
//       if (availableNames.length === 0) {
//         availableNames = TEAM_NAMES;
//       }
//       const name =
//         availableNames[Math.floor(Math.random() * availableNames.length)];
//       setCurrentTeamName(name);
//       setUsedTeamNames((prev) => new Set([...prev, name]));
//     }
//   }, [currentTeamPairIndex, teamCreationMode]);

//   // Initialize background music on page load
//   useEffect(() => {
//     const audio = new Audio("/sounds/gaming-bg.mp3");
//     audio.volume = 0.3;
//     audio.loop = true;
//     audio.play().catch((err) => console.log("Audio autoplay prevented:", err));
//     setBgAudio(audio);

//     return () => {
//       audio.pause();
//       audio.currentTime = 0;
//     };
//   }, []);

//   // Switch music based on team creation mode
//   useEffect(() => {
//     if (!bgAudio) return;

//     if (teamCreationMode === "tension") {
//       // Switch to tension music
//       bgAudio.pause();
//       bgAudio.currentTime = 0;
//       bgAudio.src = "/sounds/gaming-bg.mp3";
//       bgAudio
//         .play()
//         .catch((err) => console.log("Tension music play error:", err));
//     } else if (page === "list" && teamCreationMode === null) {
//       // Back to gaming music
//       bgAudio.pause();
//       bgAudio.currentTime = 0;
//       bgAudio.src = "/sounds/gaming-bg.mp3";
//       bgAudio
//         .play()
//         .catch((err) => console.log("Gaming music play error:", err));
//     }
//   }, [teamCreationMode, page, bgAudio]);

//   // Sync music volume
//   useEffect(() => {
//     if (bgAudio) {
//       bgAudio.volume = isMusicMuted ? 0 : musicVolume;
//     }
//   }, [musicVolume, isMusicMuted, bgAudio]);

//   // Helper: Show toast
//   const showToast = (
//     message: string,
//     type: "error" | "success" = "success"
//   ) => {
//     setToast({ message, type });
//   };

//   // Helper: Get unique team name
//   const getUniqueTeamName = (): string => {
//     let availableNames = TEAM_NAMES.filter((name) => !usedTeamNames.has(name));
//     if (availableNames.length === 0) {
//       availableNames = TEAM_NAMES;
//     }
//     const name =
//       availableNames[Math.floor(Math.random() * availableNames.length)];
//     setUsedTeamNames((prev) => new Set([...prev, name]));
//     return name;
//   };

//   // Player Management
//   const handleAddPlayer = () => {
//     if (!newPlayerName.trim()) {
//       showToast("Player name is required", "error");
//       return;
//     }

//     const newPlayer: Player = {
//       id: `player-${Date.now()}`,
//       name: newPlayerName,
//       category: newPlayerCategory,
//       status: "approved",
//     };

//     setPlayers([...players, newPlayer]);
//     setNewPlayerName("");
//     setNewPlayerCategory("Beginner");
//     showToast(`${newPlayer.name} added!`, "success");
//   };

//   const handleDeletePlayer = (playerId: string) => {
//     setPlayers(players.filter((p) => p.id !== playerId));
//     const newSelected = new Set(selectedPlayerIds);
//     newSelected.delete(playerId);
//     setSelectedPlayerIds(newSelected);
//   };

//   const handleTogglePlayer = (playerId: string) => {
//     const newSelected = new Set(selectedPlayerIds);
//     if (newSelected.has(playerId)) {
//       newSelected.delete(playerId);
//     } else {
//       newSelected.add(playerId);
//     }
//     setSelectedPlayerIds(newSelected);
//   };

//   const handleSelectAll = () => {
//     if (selectedPlayerIds.size === players.length) {
//       setSelectedPlayerIds(new Set());
//     } else {
//       const allIds = new Set(players.map((p) => p.id));
//       setSelectedPlayerIds(allIds);
//     }
//   };

//   // Team Management
//   const handleDeleteTeam = (teamId: string) => {
//     const teamToDelete = createdTeams.find((t) => t.id === teamId);
//     if (teamToDelete) {
//       setUsedTeamNames((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(teamToDelete.name);
//         return newSet;
//       });
//     }
//     setCreatedTeams(createdTeams.filter((t) => t.id !== teamId));
//     showToast("Team deleted!", "success");
//   };

//   // Navigation
//   const handleProceedToTeamCreation = () => {
//     if (selectedPlayerIds.size < 2) {
//       showToast("Select at least 2 players", "error");
//       return;
//     }

//     const selectedPlayers = players.filter((p) => selectedPlayerIds.has(p.id));
//     const shuffled = [...selectedPlayers];

//     // Fisher-Yates shuffle algorithm for true randomization
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }

//     setSelectedPlayersForTeams(shuffled);
//     setPage("team-selection");
//   };

//   // One-Click Team Creation
//   const handleOneClickTeam = async () => {
//     setIsAnimating(true);
//     setTeamCreationMode("oneclick");
//     setPage("team-creation-mode");

//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     // Fisher-Yates shuffle for true randomization
//     const shuffled = [...selectedPlayersForTeams];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }

//     const newTeams: Team[] = [];

//     for (let i = 0; i < shuffled.length - 1; i += 2) {
//       newTeams.push({
//         id: `team-${Date.now()}-${i}`,
//         name: getUniqueTeamName(),
//         players: [shuffled[i], shuffled[i + 1]],
//       });
//     }

//     setCreatedTeams((prevTeams) => [...prevTeams, ...newTeams]);
//     setIsAnimating(false);
//   };

//   // Tension Team Creation
//   const handleTensionTeam = () => {
//     setTeamCreationMode("tension");
//     setPage("team-creation-mode");
//     setCurrentTeamPairIndex(0);
//   };

//   const handleSaveTeam = (team: Team) => {
//     setCreatedTeams((prevTeams) => [...prevTeams, team]);
//     const nextIndex = currentTeamPairIndex + 2;

//     if (nextIndex >= selectedPlayersForTeams.length) {
//       showToast("All teams created! 🎉", "success");
//       setPage("list");
//       setTeamCreationMode(null);
//       setSelectedPlayerIds(new Set());
//     } else {
//       setCurrentTeamPairIndex(nextIndex);
//     }
//   };

//   const handleCancelTeam = () => {
//     setTeamCreationMode(null);
//     setPage("team-selection");
//     setCurrentTeamPairIndex(0);
//   };

//   // --- PAGE: LIST ---
//   if (page === "list") {
//     return (
//       <div className="container-tight py-12">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold text-primary-red">Team Creation</h1>
//           <div className="flex gap-3">
//             <button
//               onClick={() => {
//                 if (bgAudio) {
//                   if (isMusicMuted) {
//                     bgAudio
//                       .play()
//                       .catch((err) => console.log("Play error:", err));
//                   } else {
//                     bgAudio.pause();
//                   }
//                   setIsMusicMuted(!isMusicMuted);
//                 }
//               }}
//               className="btn btn-outline"
//               title={isMusicMuted ? "Unmute Music" : "Mute Music"}
//             >
//               {isMusicMuted ? "🔇" : "🔊"}
//             </button>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="btn btn-primary"
//             >
//               ➕ Add Player
//             </button>
//           </div>
//         </div>

//         {/* Add Player Modal */}
//         <AddPlayerModal
//           isOpen={showAddModal}
//           onClose={() => setShowAddModal(false)}
//           playerName={newPlayerName}
//           playerCategory={newPlayerCategory}
//           onNameChange={setNewPlayerName}
//           onCategoryChange={setNewPlayerCategory}
//           onAddPlayer={handleAddPlayer}
//         />

//         {/* Toast */}
//         {toast && <Toast message={toast.message} type={toast.type} />}

//         {/* No Teams & No Players */}
//         {createdTeams.length === 0 && players.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-accent-gray-medium text-lg mb-6">
//               No teams created yet
//             </p>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="btn btn-primary text-lg px-8 py-4"
//             >
//               Add Your First Player
//             </button>
//           </div>
//         )}

//         {players.length > 0 && (
//           <>
//             {/* Player Selection */}
//             <div className="mb-12 p-6 bg-secondary-black border border-accent-gray-light rounded-lg">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-primary-red">
//                   Players ({selectedPlayerIds.size}/{players.length})
//                 </h2>
//                 <button
//                   onClick={handleSelectAll}
//                   className="btn btn-outline text-sm"
//                 >
//                   {selectedPlayerIds.size === players.length
//                     ? "Deselect All"
//                     : "Select All"}
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
//                 {players.map((player) => (
//                   <div
//                     key={player.id}
//                     className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
//                       selectedPlayerIds.has(player.id)
//                         ? "border-primary-red bg-primary-red/10"
//                         : "border-accent-gray-light hover:border-primary-red"
//                     }`}
//                     onClick={() => handleTogglePlayer(player.id)}
//                   >
//                     <div className="flex items-center gap-3 flex-1">
//                       <input
//                         type="checkbox"
//                         checked={selectedPlayerIds.has(player.id)}
//                         onChange={() => {}}
//                         className="w-4 h-4 rounded cursor-pointer"
//                       />
//                       <div>
//                         <p className="font-semibold text-accent-white">
//                           {player.name}
//                         </p>
//                         <p className="text-xs text-accent-gray-medium">
//                           {player.category}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDeletePlayer(player.id);
//                       }}
//                       className="text-red-400 hover:text-red-300 font-bold ml-2"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>

//               {selectedPlayerIds.size >= 2 && (
//                 <button
//                   onClick={handleProceedToTeamCreation}
//                   className="btn btn-primary w-full"
//                 >
//                   Create Teams ({selectedPlayerIds.size})
//                 </button>
//               )}
//             </div>

//             {/* Created Teams */}
//             {createdTeams.length > 0 && (
//               <div>
//                 <h2 className="text-2xl font-bold text-primary-red mb-6">
//                   Created Teams
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {createdTeams.map((team) => (
//                     <div key={team.id} className="card p-6 relative">
//                       <button
//                         onClick={() => handleDeleteTeam(team.id)}
//                         className="absolute top-4 right-4 text-red-400 hover:text-red-300 font-bold text-xl"
//                       >
//                         ✕
//                       </button>

//                       <h3 className="text-2xl font-bold text-primary-red mb-4">
//                         {team.name}
//                       </h3>

//                       <div className="space-y-3">
//                         {team.players.map((player) => (
//                           <div
//                             key={player.id}
//                             className="flex items-center gap-2 text-accent-white"
//                           >
//                             <span>🏸</span>
//                             <div>
//                               <p className="font-semibold">{player.name}</p>
//                               <p className="text-xs text-accent-gray-medium">
//                                 {player.category}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     );
//   }

//   // --- PAGE: TEAM SELECTION ---
//   if (page === "team-selection") {
//     return (
//       <div className="container-tight py-12">
//         <button
//           onClick={() => {
//             setPage("list");
//             setSelectedPlayerIds(new Set());
//           }}
//           className="mb-8 text-accent-gray-medium hover:text-primary-red"
//         >
//           ← Back
//         </button>

//         <h1 className="text-4xl font-bold text-primary-red mb-12 text-center">
//           How to Create Teams?
//         </h1>

//         <div className="max-w-3xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* One Click */}
//             <div
//               onClick={handleOneClickTeam}
//               className="card p-8 cursor-pointer hover:shadow-card-hover transition-all border-2 border-transparent hover:border-primary-red group"
//             >
//               <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
//                 ⚡
//               </div>
//               <h2 className="text-2xl font-bold text-primary-red mb-3">
//                 One Click Team
//               </h2>
//               <p className="text-accent-gray-medium mb-6">
//                 Instantly shuffle all players and create teams with an amazing
//                 animation!
//               </p>
//               <button
//                 onClick={handleOneClickTeam}
//                 className="btn btn-primary w-full"
//               >
//                 Let's Go! ⚡
//               </button>
//             </div>

//             {/* Create Tension */}
//             <div
//               onClick={handleTensionTeam}
//               className="card p-8 cursor-pointer hover:shadow-card-hover transition-all border-2 border-transparent hover:border-primary-red group"
//             >
//               <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
//                 🎭
//               </div>
//               <h2 className="text-2xl font-bold text-primary-red mb-3">
//                 Create Tension
//               </h2>
//               <p className="text-accent-gray-medium mb-6">
//                 Pair players one by one with dramatic animations and suspense!
//               </p>
//               <button
//                 onClick={handleTensionTeam}
//                 className="btn btn-primary w-full"
//               >
//                 Build Drama! 🎭
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- PAGE: TEAM CREATION MODE ---
//   if (page === "team-creation-mode" && teamCreationMode) {
//     return (
//       <div>
//         {/* One Click */}
//         {teamCreationMode === "oneclick" && (
//           <>
//             {isAnimating ? (
//               <SpinnerAnimation players={selectedPlayersForTeams} />
//             ) : (
//               <div className="container-tight py-12">
//                 <h1 className="text-4xl font-bold text-primary-red mb-8 text-center">
//                   ✨ Teams Created! ✨
//                 </h1>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                   {createdTeams.map((team) => (
//                     <div key={team.id} className="card p-6">
//                       <h2 className="text-2xl font-bold text-primary-red mb-4">
//                         {team.name}
//                       </h2>
//                       <div className="space-y-3">
//                         {team.players.map((player) => (
//                           <div
//                             key={player.id}
//                             className="flex items-center gap-2 text-accent-white"
//                           >
//                             <span>🏸</span>
//                             <div>
//                               <p className="font-semibold">{player.name}</p>
//                               <p className="text-xs text-accent-gray-medium">
//                                 {player.category}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="flex gap-4 justify-center">
//                   <button
//                     onClick={() => {
//                       setPage("list");
//                       setTeamCreationMode(null);
//                       setSelectedPlayerIds(new Set());
//                     }}
//                     className="btn btn-primary px-8"
//                   >
//                     ✓ Done
//                   </button>
//                   <button
//                     onClick={() => {
//                       setTeamCreationMode(null);
//                       setPage("team-selection");
//                       setCurrentTeamPairIndex(0);
//                     }}
//                     className="btn btn-outline px-8"
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* Tension */}
//         {teamCreationMode === "tension" && (
//           <>
//             {currentTeamPairIndex < selectedPlayersForTeams.length - 1 ? (
//               <TensionTeamCreation
//                 key={currentTeamPairIndex}
//                 player1={selectedPlayersForTeams[currentTeamPairIndex]}
//                 player2={selectedPlayersForTeams[currentTeamPairIndex + 1]}
//                 teamNumber={Math.floor(currentTeamPairIndex / 2) + 1}
//                 teamName={currentTeamName}
//                 onSaveAndNext={handleSaveTeam}
//                 onCancel={handleCancelTeam}
//                 totalTeams={Math.ceil(selectedPlayersForTeams.length / 2)}
//               />
//             ) : (
//               <div className="container-tight py-12">
//                 <h1 className="text-4xl font-bold text-primary-red mb-8 text-center">
//                   🎉 All Teams Created! 🎉
//                 </h1>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                   {createdTeams.map((team) => (
//                     <div key={team.id} className="card p-6">
//                       <h2 className="text-2xl font-bold text-primary-red mb-4">
//                         {team.name}
//                       </h2>
//                       <div className="space-y-3">
//                         {team.players.map((player) => (
//                           <div
//                             key={player.id}
//                             className="flex items-center gap-2 text-accent-white"
//                           >
//                             <span>🏸</span>
//                             <div>
//                               <p className="font-semibold">{player.name}</p>
//                               <p className="text-xs text-accent-gray-medium">
//                                 {player.category}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {selectedPlayersForTeams.length % 2 !== 0 && (
//                   <div className="p-4 bg-yellow-600/20 border border-yellow-600 text-yellow-400 rounded-lg mb-8 text-center">
//                     <strong>
//                       {
//                         selectedPlayersForTeams[
//                           selectedPlayersForTeams.length - 1
//                         ].name
//                       }
//                     </strong>{" "}
//                     was left out (odd number)
//                   </div>
//                 )}

//                 <div className="flex gap-4 justify-center">
//                   <button
//                     onClick={() => {
//                       setPage("list");
//                       setTeamCreationMode(null);
//                       setSelectedPlayerIds(new Set());
//                     }}
//                     className="btn btn-primary px-8"
//                   >
//                     ✓ Done
//                   </button>
//                   <button
//                     onClick={() => {
//                       setTeamCreationMode(null);
//                       setPage("team-selection");
//                       setCurrentTeamPairIndex(0);
//                     }}
//                     className="btn btn-outline px-8"
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     );
//   }

//   return null;
// }

"use client";

import {
  getPlayers,
  getTournaments,
  initializeDb,
  Player,
  Tournament,
} from "@/lib/localDb";
import SpinnerAnimation from "@/components/SpinnerAnimation";
import TensionTeamCreation from "@/components/TentionTeamCreation";
import Toast from "@/components/Toast";
import AddPlayerModal from "@/components/AddPlayerModal";
import { useEffect, useState } from "react";

type Page = "list" | "team-selection" | "team-creation-mode" | "details";
type TeamCreationMode = "oneclick" | "tension" | null;

interface Team {
  id: string;
  name: string;
  players: Player[];
}

// Team names array - use random, unique names
const TEAM_NAMES = [
  "Thunder",
  "Phoenix",
  "Dragon",
  "Titan",
  "Venom",
  "Storm",
  "Inferno",
  "Shadow",
  "Apex",
  "Velocity",
  "Nexus",
  "Prism",
  "Aurora",
  "Onyx",
  "Zenith",
  "Wildfire",
  "Catalyst",
  "Primal",
  "Eclipse",
  "Essence",
  "Rift",
  "Spectral",
  "Vortex",
  "Forge",
  "Surge",
  "Tempest",
  "Blade",
  "Cosmic",
  "Quantum",
  "Nova",
  "Blaze",
  "Cyclone",
  "Starlight",
  "Twilight",
  "Crimson",
  "Azure",
  "Obsidian",
  "Ember",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Pearl",
  "Sapphire",
  "Ruby",
  "Emerald",
  "Violet",
];

export default function InstantTeamPage() {
  const [page, setPage] = useState<Page>("list");
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);

  // UI State
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(
    new Set()
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerCategory, setNewPlayerCategory] = useState("Beginner");
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  // Team Creation State
  const [teamCreationMode, setTeamCreationMode] =
    useState<TeamCreationMode>(null);
  const [selectedPlayersForTeams, setSelectedPlayersForTeams] = useState<
    Player[]
  >([]);
  const [createdTeams, setCreatedTeams] = useState<Team[]>([]);
  const [currentTeamPairIndex, setCurrentTeamPairIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [usedTeamNames, setUsedTeamNames] = useState<Set<string>>(new Set());
  const [currentTeamName, setCurrentTeamName] = useState("");

  // Background Music State
  const [bgAudio, setBgAudio] = useState<HTMLAudioElement | null>(null);
  const [musicVolume, setMusicVolume] = useState(0.1);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  // Initialize
  useEffect(() => {
    const init = async () => {
      await initializeDb();
      const [playersData, tournamentsData] = await Promise.all([
        getPlayers(),
        getTournaments(),
      ]);
      setPlayers(playersData);
      setTournaments(tournamentsData);

      const savedTeams = localStorage.getItem("createdTeams");
      if (savedTeams) {
        try {
          const teams = JSON.parse(savedTeams);
          setCreatedTeams(teams);
          const usedNames = new Set(teams.map((t: Team) => t.name));
          setUsedTeamNames(usedNames as any);
        } catch (e) {
          console.error("Error loading teams:", e);
        }
      }
    };
    init();
  }, []);

  // Persist teams
  useEffect(() => {
    localStorage.setItem("createdTeams", JSON.stringify(createdTeams));
  }, [createdTeams]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Generate team name when pair index changes (prevents infinite re-renders)
  useEffect(() => {
    if (
      teamCreationMode === "tension" &&
      currentTeamPairIndex < selectedPlayersForTeams.length - 1
    ) {
      let availableNames = TEAM_NAMES.filter(
        (name) => !usedTeamNames.has(name)
      );
      if (availableNames.length === 0) {
        availableNames = TEAM_NAMES;
      }
      const name =
        availableNames[Math.floor(Math.random() * availableNames.length)];
      setCurrentTeamName(name);
      setUsedTeamNames((prev) => new Set([...prev, name]));
    }
  }, [currentTeamPairIndex, teamCreationMode]);

  // Initialize background music on page load
  useEffect(() => {
    const audio = new Audio("/sounds/gaming-bg.mp3");
    audio.volume = 0.3;
    audio.loop = true;
    audio.play().catch((err) => console.log("Audio autoplay prevented:", err));
    setBgAudio(audio);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Switch music based on team creation mode
  useEffect(() => {
    if (!bgAudio) return;

    if (teamCreationMode === "tension") {
      // Switch to tension music
      bgAudio.pause();
      bgAudio.currentTime = 0;
      bgAudio.src = "/sounds/gaming-bg.mp3";
      bgAudio
        .play()
        .catch((err) => console.log("Tension music play error:", err));
    } else if (page === "list" && teamCreationMode === null) {
      // Back to gaming music
      bgAudio.pause();
      bgAudio.currentTime = 0;
      bgAudio.src = "/sounds/gaming-bg.mp3";
      bgAudio
        .play()
        .catch((err) => console.log("Gaming music play error:", err));
    }
  }, [teamCreationMode, page, bgAudio]);

  // Sync music volume
  useEffect(() => {
    if (bgAudio) {
      bgAudio.volume = isMusicMuted ? 0 : musicVolume;
    }
  }, [musicVolume, isMusicMuted, bgAudio]);

  // Helper: Show toast
  const showToast = (
    message: string,
    type: "error" | "success" = "success"
  ) => {
    setToast({ message, type });
  };

  // Helper: Get unique team name
  const getUniqueTeamName = (): string => {
    let availableNames = TEAM_NAMES.filter((name) => !usedTeamNames.has(name));
    if (availableNames.length === 0) {
      availableNames = TEAM_NAMES;
    }
    const name =
      availableNames[Math.floor(Math.random() * availableNames.length)];
    setUsedTeamNames((prev) => new Set([...prev, name]));
    return name;
  };

  // Player Management
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      showToast("Player name is required", "error");
      return;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: newPlayerName,
      category: newPlayerCategory,
      status: "approved",
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
    setNewPlayerCategory("Beginner");
    showToast(`${newPlayer.name} added!`, "success");
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId));
    const newSelected = new Set(selectedPlayerIds);
    newSelected.delete(playerId);
    setSelectedPlayerIds(newSelected);
  };

  const handleTogglePlayer = (playerId: string) => {
    const newSelected = new Set(selectedPlayerIds);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedPlayerIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPlayerIds.size === players.length) {
      setSelectedPlayerIds(new Set());
    } else {
      const allIds = new Set(players.map((p) => p.id));
      setSelectedPlayerIds(allIds);
    }
  };

  // Team Management
  const handleDeleteTeam = (teamId: string) => {
    const teamToDelete = createdTeams.find((t) => t.id === teamId);
    if (teamToDelete) {
      setUsedTeamNames((prev) => {
        const newSet = new Set(prev);
        newSet.delete(teamToDelete.name);
        return newSet;
      });
    }
    setCreatedTeams(createdTeams.filter((t) => t.id !== teamId));
    showToast("Team deleted!", "success");
  };

  // Navigation
  const handleProceedToTeamCreation = () => {
    if (selectedPlayerIds.size < 2) {
      showToast("Select at least 2 players", "error");
      return;
    }

    const selectedPlayers = players.filter((p) => selectedPlayerIds.has(p.id));
    const shuffled = [...selectedPlayers];

    // Fisher-Yates shuffle algorithm for true randomization
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setSelectedPlayersForTeams(shuffled);
    setPage("team-selection");
  };

  // One-Click Team Creation
  const handleOneClickTeam = async () => {
    setIsAnimating(true);
    setTeamCreationMode("oneclick");
    setPage("team-creation-mode");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Fisher-Yates shuffle for true randomization
    const shuffled = [...selectedPlayersForTeams];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newTeams: Team[] = [];

    for (let i = 0; i < shuffled.length - 1; i += 2) {
      newTeams.push({
        id: `team-${Date.now()}-${i}`,
        name: getUniqueTeamName(),
        players: [shuffled[i], shuffled[i + 1]],
      });
    }

    setCreatedTeams((prevTeams) => [...prevTeams, ...newTeams]);
    setIsAnimating(false);
  };

  // Tension Team Creation
  const handleTensionTeam = () => {
    setTeamCreationMode("tension");
    setPage("team-creation-mode");
    setCurrentTeamPairIndex(0);
  };

  const handleSaveTeam = (team: Team) => {
    setCreatedTeams((prevTeams) => [...prevTeams, team]);
    const nextIndex = currentTeamPairIndex + 2;

    if (nextIndex >= selectedPlayersForTeams.length) {
      showToast("All teams created! 🎉", "success");
      setPage("list");
      setTeamCreationMode(null);
      setSelectedPlayerIds(new Set());
    } else {
      setCurrentTeamPairIndex(nextIndex);
    }
  };

  const handleCancelTeam = () => {
    setTeamCreationMode(null);
    setPage("team-selection");
    setCurrentTeamPairIndex(0);
  };

  // --- PAGE: LIST ---
  if (page === "list") {
    return (
      <div className="container-tight py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-red">Team Creation</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (bgAudio) {
                  if (isMusicMuted) {
                    bgAudio
                      .play()
                      .catch((err) => console.log("Play error:", err));
                  } else {
                    bgAudio.pause();
                  }
                  setIsMusicMuted(!isMusicMuted);
                }
              }}
              className="btn btn-outline"
              title={isMusicMuted ? "Unmute Music" : "Mute Music"}
            >
              {isMusicMuted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary text-white"
            >
             + <span className="hidden md:flex ml-2">Add Player</span>
            </button>
          </div>
        </div>

        {/* Add Player Modal */}
        <AddPlayerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          playerName={newPlayerName}
          playerCategory={newPlayerCategory}
          onNameChange={setNewPlayerName}
          onCategoryChange={setNewPlayerCategory}
          onAddPlayer={handleAddPlayer}
        />

        {/* Toast */}
        {toast && <Toast message={toast.message} type={toast.type} />}

        {/* No Teams & No Players */}
        {createdTeams.length === 0 && players.length === 0 && (
          <div className="text-center py-12">
            <p className="text-accent-gray-medium text-lg mb-6">
              No teams created yet
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary text-lg px-8 py-4"
            >
              Add Your First Player
            </button>
          </div>
        )}

        {players.length > 0 && (
          <>
            {/* Player Selection */}
            <div className="mb-12 p-6 bg-secondary-black border border-accent-gray-light rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary-red">
                  Players ({selectedPlayerIds.size}/{players.length})
                </h2>
                <button
                  onClick={handleSelectAll}
                  className="btn btn-outline text-sm"
                >
                  {selectedPlayerIds.size === players.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                      selectedPlayerIds.has(player.id)
                        ? "border-primary-red bg-primary-red/10"
                        : "border-accent-gray-light hover:border-primary-red"
                    }`}
                    onClick={() => handleTogglePlayer(player.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedPlayerIds.has(player.id)}
                        onChange={() => {}}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <div>
                        <p className="font-semibold text-accent-white">
                          {player.name}
                        </p>
                        <p className="text-xs text-accent-gray-medium">
                          {player.category}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlayer(player.id);
                      }}
                      className="text-red-400 hover:text-red-300 font-bold ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {selectedPlayerIds.size >= 2 && (
                <button
                  onClick={handleProceedToTeamCreation}
                  className="btn btn-primary w-full"
                >
                  Create Teams ({selectedPlayerIds.size})
                </button>
              )}
            </div>

            {/* Created Teams */}
            {createdTeams.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-primary-red mb-6">
                  Created Teams
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdTeams.map((team) => (
                    <div
                      key={team.id}
                      className="relative overflow-hidden rounded-xl   border border-slate-600 hover:border-primary-red/50 shadow-lg hover:shadow-2xl hover:shadow-primary-red/20 transition-all duration-300 transform hover:scale-105 group"
                    >
                      {/* Gradient overlay effect */}
                      <div className="absolute inset-0    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="absolute top-4 right-4 z-10 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold transition-all duration-200 hover:scale-110 shadow-lg"
                        title="Delete team"
                      >
                        ✕
                      </button>

                      {/* Team name with badge */}
                      <div className="relative p-6 pb-4 border-b border-slate-600/50">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-red to-orange-500 animate-pulse"></div>
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-red to-orange-500 bg-clip-text text-transparent">
                            {team.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Team · {team.players.length} Members
                        </p>
                      </div>

                      {/* Players list */}
                      <div className="relative p-6 space-y-4">
                        {team.players.map((player, index) => (
                          <div
                            key={player.id}
                            className="flex items-start gap-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 transition-all duration-200 hover:border-slate-500"
                          >
                            {/* Player number */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-red to-orange-500 flex items-center justify-center font-bold text-white text-sm">
                              {index + 1}
                            </div>

                            {/* Player info */}
                            <div className="flex-grow min-w-0">
                              <p className="font-bold text-accent-white truncate">
                                {player.name}
                              </p>
                              {/* <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300">
                                  {player.category}
                                </span>
                              </div> */}
                            </div>

                            {/* Badminton icon */}
                            <div
                              className="flex-shrink-0 text-xl animate-bounce"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              🏸
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom accent bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-red via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // --- PAGE: TEAM SELECTION ---
  if (page === "team-selection") {
    return (
      <div className="container-tight py-12">
        <button
          onClick={() => {
            setPage("list");
            setSelectedPlayerIds(new Set());
          }}
          className="mb-8 text-accent-gray-medium hover:text-primary-red"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-primary-red mb-12 text-center">
          How to Create Teams?
        </h1>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* One Click */}
            <div
              onClick={handleOneClickTeam}
              className="card p-8 cursor-pointer hover:shadow-card-hover transition-all border-2 border-transparent hover:border-primary-red group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h2 className="text-2xl font-bold text-primary-red mb-3">
                One Click Team
              </h2>
              <p className="text-accent-gray-medium mb-6">
                Instantly shuffle all players and create teams with an amazing
                animation!
              </p>
              <button
                onClick={handleOneClickTeam}
                className="btn btn-primary w-full"
              >
                Let's Go! ⚡
              </button>
            </div>

            {/* Create Tension */}
            <div
              onClick={handleTensionTeam}
              className="card p-8 cursor-pointer hover:shadow-card-hover transition-all border-2 border-transparent hover:border-primary-red group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                🎭
              </div>
              <h2 className="text-2xl font-bold text-primary-red mb-3">
                Create Tension
              </h2>
              <p className="text-accent-gray-medium mb-6">
                Pair players one by one with dramatic animations and suspense!
              </p>
              <button
                onClick={handleTensionTeam}
                className="btn btn-primary w-full"
              >
                Build Drama! 🎭
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PAGE: TEAM CREATION MODE ---
  if (page === "team-creation-mode" && teamCreationMode) {
    return (
      <div>
        {/* One Click */}
        {teamCreationMode === "oneclick" && (
          <>
            {isAnimating ? (
              <SpinnerAnimation players={selectedPlayersForTeams} />
            ) : (
              <div className="container-tight py-12">
                <h1 className="text-4xl font-bold text-primary-red mb-8 text-center">
                  ✨ Teams Created! ✨
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {createdTeams.map((team) => (
                    <div key={team.id} className="card p-6">
                      <h2 className="text-2xl font-bold text-primary-red mb-4">
                        {team.name}
                      </h2>
                      <div className="space-y-3">
                        {team.players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center gap-2 text-accent-white"
                          >
                            <span>🏸</span>
                            <div>
                              <p className="font-semibold">{player.name}</p>
                              <p className="text-xs text-accent-gray-medium">
                                {player.category}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setPage("list");
                      setTeamCreationMode(null);
                      setSelectedPlayerIds(new Set());
                    }}
                    className="btn btn-primary px-8"
                  >
                    ✓ Done
                  </button>
                  <button
                    onClick={() => {
                      setTeamCreationMode(null);
                      setPage("team-selection");
                      setCurrentTeamPairIndex(0);
                    }}
                    className="btn btn-outline px-8"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tension */}
        {teamCreationMode === "tension" && (
          <>
            {currentTeamPairIndex < selectedPlayersForTeams.length - 1 ? (
              <TensionTeamCreation
                key={currentTeamPairIndex}
                player1={selectedPlayersForTeams[currentTeamPairIndex]}
                player2={selectedPlayersForTeams[currentTeamPairIndex + 1]}
                teamNumber={Math.floor(currentTeamPairIndex / 2) + 1}
                teamName={currentTeamName}
                onSaveAndNext={handleSaveTeam}
                onCancel={handleCancelTeam}
                totalTeams={Math.ceil(selectedPlayersForTeams.length / 2)}
              />
            ) : (
              <div className="container-tight py-12">
                <h1 className="text-4xl font-bold text-primary-red mb-8 text-center">
                  🎉 All Teams Created! 🎉
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {createdTeams.map((team) => (
                    <div
                      key={team.id}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border border-slate-600 hover:border-primary-red/50 shadow-lg hover:shadow-2xl hover:shadow-primary-red/20 transition-all duration-300 transform hover:scale-105 group"
                    >
                      {/* Gradient overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Team name with badge */}
                      <div className="relative p-6 pb-4 border-b border-slate-600/50">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-red to-orange-500 animate-pulse"></div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-red to-orange-500 bg-clip-text text-transparent">
                            {team.name}
                          </h2>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Team · {team.players.length} Members
                        </p>
                      </div>

                      {/* Players list */}
                      <div className="relative p-6 space-y-4">
                        {team.players.map((player, index) => (
                          <div
                            key={player.id}
                            className="flex items-start gap-3 p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 transition-all duration-200 hover:border-slate-500"
                          >
                            {/* Player number */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-red to-orange-500 flex items-center justify-center font-bold text-white text-sm">
                              {index + 1}
                            </div>

                            {/* Player info */}
                            <div className="flex-grow min-w-0">
                              <p className="font-bold text-accent-white truncate">
                                {player.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300">
                                  {player.category}
                                </span>
                              </div>
                            </div>

                            {/* Badminton icon */}
                            <div
                              className="flex-shrink-0 text-xl animate-bounce"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              🏸
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom accent bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-red via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>

                {selectedPlayersForTeams.length % 2 !== 0 && (
                  <div className="p-4 bg-yellow-600/20 border border-yellow-600 text-yellow-400 rounded-lg mb-8 text-center">
                    <strong>
                      {
                        selectedPlayersForTeams[
                          selectedPlayersForTeams.length - 1
                        ].name
                      }
                    </strong>{" "}
                    was left out (odd number)
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setPage("list");
                      setTeamCreationMode(null);
                      setSelectedPlayerIds(new Set());
                    }}
                    className="btn btn-primary px-8"
                  >
                    ✓ Done
                  </button>
                  <button
                    onClick={() => {
                      setTeamCreationMode(null);
                      setPage("team-selection");
                      setCurrentTeamPairIndex(0);
                    }}
                    className="btn btn-outline px-8"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}
