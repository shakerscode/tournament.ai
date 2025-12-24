'use client';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  playerCategory: string;
  onNameChange: (name: string) => void;
  onCategoryChange: (category: string) => void;
  onAddPlayer: () => void;
}

export default function AddPlayerModal({
  isOpen,
  onClose,
  playerName,
  playerCategory,
  onNameChange,
  onCategoryChange,
  onAddPlayer,
}: AddPlayerModalProps) {
  if (!isOpen) return null;

  const handleAddAndClose = () => {
    onAddPlayer();
    onNameChange('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-secondary-black to-primary-black border-2 border-primary-red rounded-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-red">Add Player</h2>
          <button
            onClick={onClose}
            className="text-accent-gray-medium hover:text-accent-white text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <label className="block text-accent-white font-semibold mb-2">Player Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter player name"
              className="w-full px-4 py-2 bg-secondary-black border border-accent-gray-light rounded-lg text-accent-white focus:outline-none focus:ring-2 focus:ring-primary-red"
              onKeyPress={(e) => e.key === 'Enter' && handleAddAndClose()}
            />
          </div>

          <div>
            <label className="block text-accent-white font-semibold mb-2">Skill Level</label>
            <select
              value={playerCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-2 bg-secondary-black border border-accent-gray-light rounded-lg text-accent-white focus:outline-none focus:ring-2 focus:ring-primary-red"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleAddAndClose}
            className="btn btn-primary flex-1"
          >
            ➕ Add Player
          </button>
        </div>
      </div>
    </div>
  );
}