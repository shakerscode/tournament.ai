/**
 * Unit tests for tournament fixture generation
 * Run with: npm test
 */

import { generateFixtures, isEvenCount, shuffleArray } from '@/lib/fixtures';

describe('Fixture Generation', () => {
  describe('isEvenCount', () => {
    it('should return true for even numbers', () => {
      expect(isEvenCount(4)).toBe(true);
      expect(isEvenCount(8)).toBe(true);
      expect(isEvenCount(16)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(isEvenCount(3)).toBe(false);
      expect(isEvenCount(5)).toBe(false);
      expect(isEvenCount(9)).toBe(false);
    });

    it('should handle zero', () => {
      expect(isEvenCount(0)).toBe(true);
    });
  });

  describe('shuffleArray', () => {
    it('should return array with same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.sort()).toEqual(arr.sort());
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(original);
    });

    it('should handle empty array', () => {
      const arr: any[] = [];
      const shuffled = shuffleArray(arr);
      expect(shuffled).toEqual([]);
    });

    it('should handle single element', () => {
      const arr = [1];
      const shuffled = shuffleArray(arr);
      expect(shuffled).toEqual([1]);
    });
  });

  describe('generateFixtures - 1 Day', () => {
    it('should generate group matches for 4 players', () => {
      const playerIds = ['p1', 'p2', 'p3', 'p4'];
      const matches = generateFixtures(playerIds, 1);

      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((m) => m.round === 'group')).toBe(true);
      expect(matches.every((m) => m.teamA.players.length === 2)).toBe(true);
      expect(matches.every((m) => m.teamB.players.length === 2)).toBe(true);
    });

    it('should generate multiple matches for 8 players', () => {
      const playerIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
      const matches = generateFixtures(playerIds, 1);

      expect(matches.length).toBeGreaterThan(1);
      // 8 players = 2 matches (4 per match)
      expect(matches.length).toBe(2);
    });

    it('should throw for odd player count', () => {
      const playerIds = ['p1', 'p2', 'p3'];
      expect(() => generateFixtures(playerIds, 1)).toThrow();
    });

    it('should throw for less than 4 players', () => {
      const playerIds = ['p1', 'p2'];
      expect(() => generateFixtures(playerIds, 1)).toThrow();
    });
  });

  describe('generateFixtures - 2 Day', () => {
    it('should generate group and semifinal matches for 4 players', () => {
      const playerIds = ['p1', 'p2', 'p3', 'p4'];
      const matches = generateFixtures(playerIds, 2);

      const groupMatches = matches.filter((m) => m.round === 'group');
      const semiFinalMatches = matches.filter((m) => m.round === 'semifinal');
      const finalMatches = matches.filter((m) => m.round === 'final');

      expect(groupMatches.length).toBeGreaterThan(0);
      expect(semiFinalMatches.length).toBeGreaterThan(0);
      expect(finalMatches.length).toBe(1);
    });

    it('should generate correct rounds for 8 players', () => {
      const playerIds = Array.from({ length: 8 }, (_, i) => `p${i + 1}`);
      const matches = generateFixtures(playerIds, 2);

      const roundCounts = {
        group: matches.filter((m) => m.round === 'group').length,
        semifinal: matches.filter((m) => m.round === 'semifinal').length,
        final: matches.filter((m) => m.round === 'final').length,
      };

      expect(roundCounts.group).toBeGreaterThan(0);
      expect(roundCounts.semifinal).toBeGreaterThan(0);
      expect(roundCounts.final).toBe(1);
    });
  });

  describe('generateFixtures - 3 Day', () => {
    it('should generate three rounds for 4 players', () => {
      const playerIds = ['p1', 'p2', 'p3', 'p4'];
      const matches = generateFixtures(playerIds, 3);

      const hasGroup = matches.some((m) => m.round === 'group');
      const hasSemiFinal = matches.some((m) => m.round === 'semifinal');
      const hasFinal = matches.some((m) => m.round === 'final');

      expect(hasGroup).toBe(true);
      expect(hasSemiFinal).toBe(true);
      expect(hasFinal).toBe(true);
    });

    it('should generate more matches for extended tournament', () => {
      const playerIds = Array.from({ length: 8 }, (_, i) => `p${i + 1}`);
      const matches1Day = generateFixtures(playerIds, 1);
      const matches3Day = generateFixtures(playerIds, 3);

      // 3-day should have more matches than 1-day
      expect(matches3Day.length).toBeGreaterThanOrEqual(matches1Day.length);
    });
  });

  describe('Match structure', () => {
    it('should generate matches with valid IDs', () => {
      const playerIds = ['p1', 'p2', 'p3', 'p4'];
      const matches = generateFixtures(playerIds, 1);

      expect(matches.every((m) => m.id)).toBe(true);
      expect(matches.every((m) => m.id.startsWith('m'))).toBe(true);
    });

    it('should initialize points to 0', () => {
      const playerIds = ['p1', 'p2', 'p3', 'p4'];
      const matches = generateFixtures(playerIds, 1);

      expect(matches.every((m) => m.teamA.points === 0)).toBe(true);
      expect(matches.every((m) => m.teamB.points === 0)).toBe(true);
    });

    it('should mark matches as incomplete', () => {
      const playerIds = ['p1', 'p2', 'p3', 'p4'];
      const matches = generateFixtures(playerIds, 1);

      expect(matches.every((m) => m.completed === false)).toBe(true);
    });
  });
});
