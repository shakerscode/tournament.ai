'use client';

import { Player } from '@/lib/localDb';
import Image from 'next/image';

export interface PlayerCardProps {
  player: Player;
  variant?: 'compact' | 'full';
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  showStatus?: boolean;
}

export default function PlayerCard({
  player,
  variant = 'full',
  isSelected = false,
  onSelect,
  showStatus = false,
}: PlayerCardProps) {
  const isCompact = variant === 'compact';

  const statusColor = {
    approved: 'bg-green-600/20 text-green-400 border-green-600',
    pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600',
    rejected: 'bg-red-600/20 text-red-400 border-red-600',
  };

  const handleClick = () => {
    onSelect?.(player.id);
  };

  return (
    <div
      className={`
        rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${isCompact ? 'p-3' : 'p-6'}
        ${isSelected ? 'ring-2 ring-primary-red shadow-card-active' : 'shadow-card'}
        ${isSelected ? 'bg-secondary-black' : 'bg-secondary-black-light hover:shadow-card-hover'}
      `}
      onClick={handleClick}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onSelect) {
          handleClick();
        }
      }}
    >
      {/* Player Image / Avatar */}
      <div
        className={`
          rounded-lg overflow-hidden bg-secondary-black-lighter flex items-center justify-center
          ${isCompact ? 'w-full h-20' : 'w-full h-40 mb-4'}
        `}
      >
        {player.photo ? (
          <Image
            src={player.photo}
            alt={player.name}
            width={isCompact ? 80 : 160}
            height={isCompact ? 80 : 160}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl">🏸</div>
        )}
      </div>

      {/* Player Info */}
      <div>
        <h3 className={`font-bold text-primary-red ${isCompact ? 'text-sm' : 'text-lg mb-1'}`}>
          {player.name}
        </h3>

        {!isCompact && (
          <>
            <p className="text-accent-gray-medium text-sm mb-2">{player.category}</p>

            {player.phone && <p className="text-accent-gray-medium text-xs mb-3">{player.phone}</p>}

            {/* Status Badge */}
            {showStatus && (
              <span
                className={`
                  inline-block text-xs font-semibold px-3 py-1 rounded-full border
                  ${statusColor[player.status]}
                `}
              >
                {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
              </span>
            )}
          </>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary-red rounded-full w-6 h-6 flex items-center justify-center">
          <svg className="w-4 h-4 text-accent-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
