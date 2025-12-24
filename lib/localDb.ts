/**
 * localStorage wrapper service for badminton tournament database
 * All functions return Promises to mimic async behavior
 * Key: badminton_db_v1
 */

export interface Payment {
  date: string;
  amount: number;
}

export interface Player {
  id: string;
  name: string;
  category: string;
  photo?: string;
  phone?: string;
  status: 'approved' | 'pending' | 'rejected';
  payments?: Payment[];
}

export interface Match {
  id: string;
  teamA: { players: string[]; points: number };
  teamB: { players: string[]; points: number };
  round: 'group' | 'semifinal' | 'final';
  completed: boolean;
  winnerId?: string;
}

export interface Tournament {
  id: string;
  name: string;
  durationDays: 1 | 2 | 3;
  playerIds: string[];
  matches: Match[];
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
  winner?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface Guest {
  id: string;
  name: string;
}

export interface BadmintonDB {
  players: Player[];
  tournaments: Tournament[];
  expenses: Expense[];
  guests: Guest[];
  settings: {
    theme: 'red-black';
  };
}

const DB_KEY = 'badminton_db_v1';

// Default/dummy data
const DEFAULT_DATA: BadmintonDB = {
  players: [
    {
      id: 'p1',
      name: 'Shaker',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [{ date: '2025-01-12', amount: 500 }],
    },
    {
      id: 'p2',
      name: 'Shefat',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p3',
      name: 'Sohan',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'pending',
      payments: [],
    },
    {
      id: 'p4',
      name: 'Mahi',
      category: 'Women',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p5',
      name: 'Khabir',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p6',
      name: 'Zihad',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p7',
      name: 'Shakib',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p8',
      name: 'Shaon',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p9',
      name: 'Jahangir',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p10',
      name: 'Rafi',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p11',
      name: 'Soju',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p12',
      name: 'Naim',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p13',
      name: 'Samir',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p14',
      name: 'Shihab',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p15',
      name: 'Sojib',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
    {
      id: 'p16',
      name: 'Kazi Sobuj',
      category: 'Men',
      photo: '',
      phone: '',
      status: 'approved',
      payments: [],
    },
  ],
  tournaments: [],
  expenses: [],
  guests: [],
  settings: {
    theme: 'red-black',
  },
};

/**
 * Initialize localStorage with default data if not exists
 */
export function initializeDb(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
      localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
    }
    resolve();
  });
}

/**
 * Get entire database object
 */
export function getDb(): Promise<BadmintonDB> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(DEFAULT_DATA);
      return;
    }

    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      resolve(DEFAULT_DATA);
      return;
    }

    try {
      resolve(JSON.parse(data));
    } catch {
      resolve(DEFAULT_DATA);
    }
  });
}

/**
 * Save entire database object
 */
function saveDb(db: BadmintonDB): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    }
    resolve();
  });
}

// ============================================================================
// PLAYERS
// ============================================================================

export function getPlayers(): Promise<Player[]> {
  return getDb().then((db) => db.players);
}

export function getPlayerById(id: string): Promise<Player | null> {
  return getDb().then((db) => db.players.find((p) => p.id === id) || null);
}

export function addPlayer(player: Omit<Player, 'id'>): Promise<Player> {
  return getDb().then(async (db) => {
    const newPlayer: Player = {
      ...player,
      id: `p${Date.now()}`,
    };
    db.players.push(newPlayer);
    await saveDb(db);
    return newPlayer;
  });
}

export function updatePlayer(id: string, patch: Partial<Player>): Promise<Player | null> {
  return getDb().then(async (db) => {
    const player = db.players.find((p) => p.id === id);
    if (!player) return null;

    Object.assign(player, patch);
    await saveDb(db);
    return player;
  });
}

export function deletePlayer(id: string): Promise<boolean> {
  return getDb().then(async (db) => {
    const index = db.players.findIndex((p) => p.id === id);
    if (index === -1) return false;

    db.players.splice(index, 1);
    await saveDb(db);
    return true;
  });
}

// ============================================================================
// TOURNAMENTS
// ============================================================================

export function getTournaments(): Promise<Tournament[]> {
  return getDb().then((db) => db.tournaments);
}

export function getTournamentById(id: string): Promise<Tournament | null> {
  return getDb().then((db) => db.tournaments.find((t) => t.id === id) || null);
}

export function addTournament(tournament: Omit<Tournament, 'id' | 'createdAt'>): Promise<Tournament> {
  return getDb().then(async (db) => {
    const newTournament: Tournament = {
      ...tournament,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.tournaments.push(newTournament);
    await saveDb(db);
    return newTournament;
  });
}

export function updateTournament(id: string, patch: Partial<Tournament>): Promise<Tournament | null> {
  return getDb().then(async (db) => {
    const tournament = db.tournaments.find((t) => t.id === id);
    if (!tournament) return null;

    Object.assign(tournament, patch);
    await saveDb(db);
    return tournament;
  });
}

export function deleteTournament(id: string): Promise<boolean> {
  return getDb().then(async (db) => {
    const index = db.tournaments.findIndex((t) => t.id === id);
    if (index === -1) return false;

    db.tournaments.splice(index, 1);
    await saveDb(db);
    return true;
  });
}

// ============================================================================
// EXPENSES
// ============================================================================

export function getExpenses(): Promise<Expense[]> {
  return getDb().then((db) => db.expenses);
}

export function addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  return getDb().then(async (db) => {
    const newExpense: Expense = {
      ...expense,
      id: `e${Date.now()}`,
    };
    db.expenses.push(newExpense);
    await saveDb(db);
    return newExpense;
  });
}

export function deleteExpense(id: string): Promise<boolean> {
  return getDb().then(async (db) => {
    const index = db.expenses.findIndex((e) => e.id === id);
    if (index === -1) return false;

    db.expenses.splice(index, 1);
    await saveDb(db);
    return true;
  });
}

// ============================================================================
// GUESTS
// ============================================================================

export function getGuests(): Promise<Guest[]> {
  return getDb().then((db) => db.guests);
}

export function addGuest(guest: Omit<Guest, 'id'>): Promise<Guest> {
  return getDb().then(async (db) => {
    const newGuest: Guest = {
      ...guest,
      id: `g${Date.now()}`,
    };
    db.guests.push(newGuest);
    await saveDb(db);
    return newGuest;
  });
}

export function deleteGuest(id: string): Promise<boolean> {
  return getDb().then(async (db) => {
    const index = db.guests.findIndex((g) => g.id === id);
    if (index === -1) return false;

    db.guests.splice(index, 1);
    await saveDb(db);
    return true;
  });
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Reset entire database to default data
 */
export function resetDb(): Promise<void> {
  return getDb().then(async (db) => {
    Object.assign(db, DEFAULT_DATA);
    await saveDb(db);
  });
}

/**
 * Clear all localStorage (reset completely)
 */
export function clearDb(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DB_KEY);
    }
    resolve();
  });
}
