'use client';

import { Match, Player } from '@/lib/localDb';
import { useMemo } from 'react';

export interface TournamentBracketProps {
  matches: Match[];
  players: Player[];
  onMatchUpdate?: (matchId: string, teamAPoints: number, teamBPoints: number) => void;
}

export default function TournamentBracket({
  matches,
  players,
  onMatchUpdate,
}: TournamentBracketProps) {
  // Group matches by round
  const groupedMatches = useMemo(() => {
    const groups: Record<string, Match[]> = {
      group: [],
      semifinal: [],
      final: [],
    };

    matches.forEach((match) => {
      groups[match.round]?.push(match);
    });

    return groups;
  }, [matches]);

  // Get player name by ID
  const getPlayerName = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    return player?.name || 'Unknown';
  };

  // Render single match card
  const MatchCard = ({ match }: { match: Match }) => {
    const isPlaceholder = match.teamA.players[0] === 'placeholder';

    return (
      <div className="bg-secondary-black-light rounded-lg p-4 shadow-card hover:shadow-card-hover transition-shadow">
        {/* Team A */}
        <div className={`mb-3 pb-3 border-b border-secondary-black-lighter`}>
          <div className="text-xs text-accent-gray-medium mb-1 font-semibold">TEAM A</div>
          <div className="space-y-1">
            {match.teamA.players.map((playerId, idx) => (
              <div key={idx} className="text-sm text-accent-white">
                {isPlaceholder ? (
                  <span className="italic text-accent-gray-medium">Pending</span>
                ) : (
                  getPlayerName(playerId)
                )}
              </div>
            ))}
          </div>
          {match.completed && (
            <div className="mt-2 text-lg font-bold text-primary-red">
              {match.teamA.points} pts
            </div>
          )}
        </div>

        {/* vs */}
        <div className="text-center text-xs text-accent-gray-medium font-semibold mb-3 uppercase">
          vs
        </div>

        {/* Team B */}
        <div>
          <div className="text-xs text-accent-gray-medium mb-1 font-semibold">TEAM B</div>
          <div className="space-y-1">
            {match.teamB.players.map((playerId, idx) => (
              <div key={idx} className="text-sm text-accent-white">
                {isPlaceholder ? (
                  <span className="italic text-accent-gray-medium">Pending</span>
                ) : (
                  getPlayerName(playerId)
                )}
              </div>
            ))}
          </div>
          {match.completed && (
            <div className="mt-2 text-lg font-bold text-primary-red">
              {match.teamB.points} pts
            </div>
          )}
        </div>

        {/* Status */}
        {match.completed && (
          <div className="mt-3 pt-3 border-t border-secondary-black-lighter">
            <span className="inline-block bg-green-600/20 text-green-400 text-xs font-semibold px-2 py-1 rounded">
              Completed
            </span>
            {match.winnerId && (
              <div className="text-xs text-primary-red mt-2 font-semibold">
                Winner: {getPlayerName(match.winnerId)}
              </div>
            )}
          </div>
        )}

        {/* Edit button (stub for admin) */}
        {!match.completed && onMatchUpdate && (
          <button className="mt-3 w-full btn btn-outline btn-sm text-xs">
            Record Result
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Group Stage */}
      {groupedMatches.group.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-primary-red mb-4">Group Stage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedMatches.group.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Semifinals */}
      {groupedMatches.semifinal.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-primary-red mb-4">Semifinals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedMatches.semifinal.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {/* Final */}
      {groupedMatches.final.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-primary-red mb-4">Final</h3>
          <div className="max-w-md">
            {groupedMatches.final.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-accent-gray-medium text-lg">No matches scheduled yet</p>
        </div>
      )}
    </div>
  );
}
