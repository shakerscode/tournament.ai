'use client';

import { Player } from '@/lib/localDb';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  selectedPlayerIds: Set<string>;
  newPlayerName: string;
  newPlayerCategory: string;
  onPlayerNameChange: (name: string) => void;
  onPlayerCategoryChange: (category: string) => void;
  onAddPlayer: () => void;
  onDeletePlayer: (id: string) => void;
  onTogglePlayer: (id: string) => void;
  onSelectAll: () => void;
  onProceed: () => void;
  selectedCount: number;
}

export default function PlayerModal({
  isOpen,
  onClose,
  players,
  selectedPlayerIds,
  newPlayerName,
  newPlayerCategory,
  onPlayerNameChange,
  onPlayerCategoryChange,
  onAddPlayer,
  onDeletePlayer,
  onTogglePlayer,
  onSelectAll,
  onProceed,
  selectedCount,
}: PlayerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-secondary-black to-primary-black border-2 border-primary-red rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-secondary-black p-6 border-b border-primary-red flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-red">Manage Players</h2>
          <button
            onClick={onClose}
            className="text-accent-gray-medium hover:text-accent-white text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Add Player Section */}
          <section className="p-6 bg-black border border-accent-gray-light rounded-lg">
            <h3 className="text-xl font-bold text-primary-red mb-4">Add New Player</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-accent-white font-semibold mb-2">Player Name</label>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => onPlayerNameChange(e.target.value)}
                  placeholder="Enter player name"
                  className="w-full px-4 py-2 bg-secondary-black border border-accent-gray-light rounded-lg text-accent-white focus:outline-none focus:ring-2 focus:ring-primary-red"
                  onKeyPress={(e) => e.key === 'Enter' && onAddPlayer()}
                />
              </div>

              <div>
                <label className="block text-accent-white font-semibold mb-2">Skill Level</label>
                <select
                  value={newPlayerCategory}
                  onChange={(e) => onPlayerCategoryChange(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-black border border-accent-gray-light rounded-lg text-accent-white focus:outline-none focus:ring-2 focus:ring-primary-red"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              <button
                onClick={onAddPlayer}
                className="btn btn-primary w-full"
              >
                ➕ Add Player
              </button>
            </div>
          </section>

          {/* Player Selection Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary-red">
                Select Players ({selectedCount}/{players.length})
              </h3>
              {players.length > 0 && (
                <button
                  onClick={onSelectAll}
                  className="btn btn-outline text-sm"
                >
                  {selectedCount === players.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {players.length === 0 ? (
              <div className="text-center py-8 text-accent-gray-medium">
                <p>No players added yet. Add a player above to get started!</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                      selectedPlayerIds.has(player.id)
                        ? 'border-primary-red bg-primary-red/10'
                        : 'border-accent-gray-light hover:border-primary-red'
                    }`}
                    onClick={() => onTogglePlayer(player.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedPlayerIds.has(player.id)}
                        onChange={() => {}}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <div>
                        <p className="font-semibold text-accent-white">{player.name}</p>
                        <p className="text-sm text-accent-gray-medium">{player.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlayer(player.id);
                      }}
                      className="text-red-400 hover:text-red-300 font-bold text-lg ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-primary-black p-6 border-t border-primary-red flex gap-4">
          <button
            onClick={onClose}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onProceed();
              onClose();
            }}
            disabled={selectedCount < 2}
            className="btn btn-primary flex-1 disabled:opacity-50"
          >
            Create Teams ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
}