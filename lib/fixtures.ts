/**
 * Tournament fixture generation algorithm
 * Handles 1, 2, and 3-day tournament schedules
 * Generates group matches, semifinals, and finals
 */

import { Match } from './localDb';

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validate if player count is even
 */
export function isEvenCount(count: number): boolean {
  return count % 2 === 0;
}

/**
 * Generate match ID
 */
function generateMatchId(): string {
  return `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a match between two pairs of players
 * Each team has 2 players (doubles match)
 */
function createMatch(
  teamAPlayers: string[],
  teamBPlayers: string[],
  round: 'group' | 'semifinal' | 'final'
): Match {
  return {
    id: generateMatchId(),
    teamA: {
      players: teamAPlayers,
      points: 0,
    },
    teamB: {
      players: teamBPlayers,
      points: 0,
    },
    round,
    completed: false,
  };
}

/**
 * Generate group stage matches for 1-day tournament
 * Single round-robin: each pair plays once
 */
export function generateOneDayFixtures(playerIds: string[]): Match[] {
  const matches: Match[] = [];

  // For 1-day, we create group matches with all players
  // Simple pairing: shuffle and pair sequentially
  const shuffled = shuffleArray(playerIds);

  // Create group matches: 4 players per match (2 vs 2)
  for (let i = 0; i < shuffled.length; i += 4) {
    if (i + 3 < shuffled.length) {
      const match = createMatch(
        [shuffled[i], shuffled[i + 1]],
        [shuffled[i + 2], shuffled[i + 3]],
        'group'
      );
      matches.push(match);
    }
  }

  return matches;
}

/**
 * Generate 2-day tournament fixtures
 * Day 1: Group stage
 * Day 2: Semifinals and Finals
 */
export function generateTwoDayFixtures(playerIds: string[]): Match[] {
  const matches: Match[] = [];
  const shuffled = shuffleArray(playerIds);

  // Day 1: Group matches
  for (let i = 0; i < shuffled.length; i += 4) {
    if (i + 3 < shuffled.length) {
      const match = createMatch(
        [shuffled[i], shuffled[i + 1]],
        [shuffled[i + 2], shuffled[i + 3]],
        'group'
      );
      matches.push(match);
    }
  }

  // Day 2: Create semifinal placeholders
  // Semifinals will be determined after group results
  // For now, we create potential semifinal matches with placeholder IDs
  const numGroups = Math.ceil(shuffled.length / 4);
  const semifinalPairs = Math.ceil(numGroups / 2);

  for (let i = 0; i < semifinalPairs; i++) {
    const match = createMatch(['placeholder'], ['placeholder'], 'semifinal');
    matches.push(match);
  }

  // Final match
  const finalMatch = createMatch(['placeholder'], ['placeholder'], 'final');
  matches.push(finalMatch);

  return matches;
}

/**
 * Generate 3-day tournament fixtures
 * Day 1-2: Multiple group stages
 * Day 3: Semifinals and Final
 */
export function generateThreeDayFixtures(playerIds: string[]): Match[] {
  const matches: Match[] = [];
  const shuffled = shuffleArray(playerIds);

  // Days 1-2: Extended group stage with multiple matches per day
  // Divide players into groups and create more matches
  const groupSize = 4;
  let matchesPerDay = 0;

  for (let i = 0; i < shuffled.length; i += groupSize) {
    if (i + 3 < shuffled.length) {
      const match = createMatch(
        [shuffled[i], shuffled[i + 1]],
        [shuffled[i + 2], shuffled[i + 3]],
        'group'
      );
      matches.push(match);
      matchesPerDay++;

      // Spread matches across 2 days
      if (matchesPerDay >= Math.ceil(shuffled.length / 8)) {
        matchesPerDay = 0;
      }
    }
  }

  // Day 3: Create semifinal and final structures
  const numGroups = Math.ceil(shuffled.length / 4);

  // Create semifinals
  for (let i = 0; i < Math.min(2, numGroups); i++) {
    const match = createMatch(['placeholder'], ['placeholder'], 'semifinal');
    matches.push(match);
  }

  // Create final
  const finalMatch = createMatch(['placeholder'], ['placeholder'], 'final');
  matches.push(finalMatch);

  return matches;
}

/**
 * Main fixture generator - delegates to specific day generators
 */
export function generateFixtures(
  playerIds: string[],
  durationDays: 1 | 2 | 3
): Match[] {
  if (!isEvenCount(playerIds.length)) {
    throw new Error(
      `Invalid player count: ${playerIds.length}. Must be even. Current odd count.`
    );
  }

  if (playerIds.length < 4) {
    throw new Error('Minimum 4 players required for tournament');
  }

  switch (durationDays) {
    case 1:
      return generateOneDayFixtures(playerIds);
    case 2:
      return generateTwoDayFixtures(playerIds);
    case 3:
      return generateThreeDayFixtures(playerIds);
    default:
      throw new Error(`Invalid duration: ${durationDays}`);
  }
}

/**
 * Update match result (record points)
 */
export function updateMatchResult(
  match: Match,
  teamAPoints: number,
  teamBPoints: number,
  winnerId: string
): Match {
  return {
    ...match,
    teamA: {
      ...match.teamA,
      points: teamAPoints,
    },
    teamB: {
      ...match.teamB,
      points: teamBPoints,
    },
    completed: true,
    winnerId,
  };
}

/**
 * Calculate tournament standings from completed group matches
 */
export function calculateStandings(matches: Match[]) {
  const standings: Record<
    string,
    {
      playerId: string;
      wins: number;
      losses: number;
      points: number;
    }
  > = {};

  matches
    .filter((m) => m.round === 'group' && m.completed)
    .forEach((match) => {
      match.teamA.players.forEach((playerId) => {
        if (!standings[playerId]) {
          standings[playerId] = { playerId, wins: 0, losses: 0, points: 0 };
        }
        standings[playerId].points += match.teamA.points;
        if (match.winnerId === playerId) {
          standings[playerId].wins++;
        } else {
          standings[playerId].losses++;
        }
      });

      match.teamB.players.forEach((playerId) => {
        if (!standings[playerId]) {
          standings[playerId] = { playerId, wins: 0, losses: 0, points: 0 };
        }
        standings[playerId].points += match.teamB.points;
        if (match.winnerId === playerId) {
          standings[playerId].wins++;
        } else {
          standings[playerId].losses++;
        }
      });
    });

  return Object.values(standings).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.points !== a.points) return b.points - a.points;
    return b.wins - a.wins;
  });
}
