export type Game = 'VALORANT' | 'CS2' | 'BGMI' | 'FREE_FIRE';
export type TournamentFormat = 'SINGLE_ELIM' | 'DOUBLE_ELIM' | 'ROUND_ROBIN' | 'SWISS';
export type TournamentStatus = 'DRAFT' | 'REGISTRATION_OPEN' | 'ONGOING' | 'COMPLETED';
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CORRECTED';
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Tournament {
  id: string;
  slug: string;
  title: string;
  org: string;
  game: Game;
  format: TournamentFormat;
  status: TournamentStatus;
  maxTeams: number;
  registeredTeams: number;
  teamSize: number;
  prizePool: string;
  startDate: string;
  registrationDeadline: string;
}

export interface LiveMatch {
  id: string;
  tournament: string;
  round: string;
  game: Game;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  status: MatchStatus;
  scheduledAt: string;
  previousScore?: string;
  correctionReason?: string;
}

export interface Registration {
  id: string;
  team: string;
  tag: string;
  tournament: string;
  captain: string;
  players: string[];
  submittedAt: string;
  status: RegistrationStatus;
  formData: { label: string; value: string }[];
}

export interface Standing {
  rank: number;
  team: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  buchholz: number;
}

export interface MatchNode {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number | null;
  scoreB: number | null;
  status: MatchStatus;
  winner?: string;
}

export interface Round {
  name: string;
  matches: MatchNode[];
}

export interface BracketSide {
  label: string;
  rounds: Round[];
}

export const mockTournaments: Tournament[] = [
  { id: 't1', slug: 'val-champions-2026', title: 'Valorant Champions Cup', org: 'Matchdeck', game: 'VALORANT', format: 'DOUBLE_ELIM', status: 'ONGOING', maxTeams: 16, registeredTeams: 16, teamSize: 5, prizePool: '$10,000', startDate: '2026-10-01T10:00:00Z', registrationDeadline: '2026-09-28T23:59:59Z' },
  { id: 't2', slug: 'cs2-pro-league', title: 'CS2 Pro League S4', org: 'ESL', game: 'CS2', format: 'ROUND_ROBIN', status: 'REGISTRATION_OPEN', maxTeams: 32, registeredTeams: 28, teamSize: 5, prizePool: '$50,000', startDate: '2026-11-15T18:00:00Z', registrationDeadline: '2026-11-01T23:59:59Z' },
  { id: 't3', slug: 'bgmi-masters', title: 'BGMI Masters Series', org: 'Nodwin', game: 'BGMI', format: 'SINGLE_ELIM', status: 'DRAFT', maxTeams: 64, registeredTeams: 0, teamSize: 4, prizePool: '₹20,00,000', startDate: '2026-12-01T12:00:00Z', registrationDeadline: '2026-11-20T23:59:59Z' },
  { id: 't4', slug: 'ff-world-series', title: 'Free Fire World Series', org: 'Garena', game: 'FREE_FIRE', format: 'SWISS', status: 'COMPLETED', maxTeams: 128, registeredTeams: 128, teamSize: 4, prizePool: '$2,000,000', startDate: '2026-05-01T10:00:00Z', registrationDeadline: '2026-04-15T23:59:59Z' },
  { id: 't5', slug: 'val-challengers', title: 'Valorant Challengers', org: 'Riot Games', game: 'VALORANT', format: 'DOUBLE_ELIM', status: 'REGISTRATION_OPEN', maxTeams: 8, registeredTeams: 4, teamSize: 5, prizePool: '$5,000', startDate: '2026-10-15T14:00:00Z', registrationDeadline: '2026-10-10T23:59:59Z' },
  { id: 't6', slug: 'cs2-weekly', title: 'CS2 Weekly Showdown', org: 'Matchdeck', game: 'CS2', format: 'SINGLE_ELIM', status: 'ONGOING', maxTeams: 16, registeredTeams: 16, teamSize: 5, prizePool: '$500', startDate: '2026-09-27T18:00:00Z', registrationDeadline: '2026-09-26T23:59:59Z' },
];

export const mockMatches: LiveMatch[] = [
  { id: 'm1', tournament: 'Valorant Champions Cup', round: 'Upper Bracket Final', game: 'VALORANT', teamA: 'Sentinels', teamB: 'LOUD', scoreA: 1, scoreB: 0, status: 'LIVE', scheduledAt: '2026-10-05T18:00:00Z' },
  { id: 'm2', tournament: 'CS2 Weekly Showdown', round: 'Quarterfinal 2', game: 'CS2', teamA: 'NaVi', teamB: 'Vitality', scoreA: 11, scoreB: 11, status: 'LIVE', scheduledAt: '2026-09-28T19:00:00Z' },
  { id: 'm3', tournament: 'Valorant Champions Cup', round: 'Lower Bracket R3', game: 'VALORANT', teamA: 'Paper Rex', teamB: 'Fnatic', scoreA: null, scoreB: null, status: 'SCHEDULED', scheduledAt: '2026-10-06T15:00:00Z' },
  { id: 'm4', tournament: 'CS2 Weekly Showdown', round: 'Quarterfinal 3', game: 'CS2', teamA: 'FaZe Clan', teamB: 'G2', scoreA: null, scoreB: null, status: 'SCHEDULED', scheduledAt: '2026-09-28T21:00:00Z' },
  { id: 'm5', tournament: 'Valorant Champions Cup', round: 'Upper Bracket Semifinal', game: 'VALORANT', teamA: 'Sentinels', teamB: 'Paper Rex', scoreA: 2, scoreB: 1, status: 'COMPLETED', scheduledAt: '2026-10-04T18:00:00Z' },
  { id: 'm6', tournament: 'CS2 Weekly Showdown', round: 'Quarterfinal 1', game: 'CS2', teamA: 'Astralis', teamB: 'MOUZ', scoreA: 13, scoreB: 11, status: 'CORRECTED', scheduledAt: '2026-09-28T17:00:00Z', previousScore: '13-9', correctionReason: 'Admin verified round rollback due to server crash' },
];

export const mockRegistrations: Registration[] = [
  { id: 'r1', team: 'Cloud9', tag: 'C9', tournament: 'CS2 Pro League S4', captain: 'C9_mango', players: ['C9_mango', 'C9_tenz', 'C9_shroud', 'C9_n0thing', 'C9_seangares'], submittedAt: '2026-10-25T14:32:00Z', status: 'PENDING', formData: [{ label: 'Steam ID64', value: '76561198000000000' }, { label: 'Region', value: 'NA' }, { label: 'Discord', value: 'mango#1234' }] },
  { id: 'r2', team: 'Team Liquid', tag: 'TL', tournament: 'CS2 Pro League S4', captain: 'TL_nitr0', players: ['TL_nitr0', 'TL_EliGE', 'TL_NAF', 'TL_Twistzz', 'TL_Stewie2K'], submittedAt: '2026-10-25T15:10:00Z', status: 'PENDING', formData: [{ label: 'Steam ID64', value: '76561198000000001' }, { label: 'Region', value: 'NA' }, { label: 'Discord', value: 'nitr0#5678' }] },
  { id: 'r3', team: 'NRG', tag: 'NRG', tournament: 'Valorant Challengers', captain: 'NRG_s0m', players: ['NRG_s0m', 'NRG_FNS', 'NRG_crashies', 'NRG_Victor', 'NRG_Demon1'], submittedAt: '2026-10-01T09:45:00Z', status: 'PENDING', formData: [{ label: 'Riot ID', value: 's0m#NRG' }, { label: 'Region', value: 'NA' }, { label: 'Discord', value: 's0m#9999' }] },
  { id: 'r4', team: 'Soul', tag: 'SOUL', tournament: 'BGMI Masters Series', captain: 'Mortal', players: ['Mortal', 'Viper', 'Regaltos', 'Goblin'], submittedAt: '2026-11-10T11:20:00Z', status: 'PENDING', formData: [{ label: 'BGMI UID', value: '5123456789' }, { label: 'Region', value: 'IN' }, { label: 'Discord', value: 'mortal#0000' }] },
];

export const mockStandings: Standing[] = [
  { rank: 1, team: 'LOUD', wins: 5, losses: 0, draws: 0, points: 15, buchholz: 45 },
  { rank: 2, team: 'Sentinels', wins: 4, losses: 1, draws: 0, points: 12, buchholz: 42 },
  { rank: 3, team: 'Paper Rex', wins: 3, losses: 2, draws: 0, points: 9, buchholz: 40 },
  { rank: 4, team: 'Fnatic', wins: 3, losses: 2, draws: 0, points: 9, buchholz: 38 },
  { rank: 5, team: 'DRX', wins: 2, losses: 3, draws: 0, points: 6, buchholz: 35 },
  { rank: 6, team: 'Team Liquid', wins: 2, losses: 3, draws: 0, points: 6, buchholz: 33 },
  { rank: 7, team: 'EDG', wins: 1, losses: 4, draws: 0, points: 3, buchholz: 30 },
  { rank: 8, team: 'KRU', wins: 0, losses: 5, draws: 0, points: 0, buchholz: 25 },
];

export const mockBracket: BracketSide[] = [
  {
    label: 'Upper Bracket',
    rounds: [
      {
        name: 'Round of 8',
        matches: [
          { id: 'ub_r1_m1', teamA: 'Sentinels', teamB: 'KRU', scoreA: 2, scoreB: 0, status: 'COMPLETED', winner: 'Sentinels' },
          { id: 'ub_r1_m2', teamA: 'Paper Rex', teamB: 'EDG', scoreA: 2, scoreB: 1, status: 'COMPLETED', winner: 'Paper Rex' },
          { id: 'ub_r1_m3', teamA: 'LOUD', teamB: 'DRX', scoreA: 2, scoreB: 0, status: 'COMPLETED', winner: 'LOUD' },
          { id: 'ub_r1_m4', teamA: 'Fnatic', teamB: 'Team Liquid', scoreA: 2, scoreB: 0, status: 'COMPLETED', winner: 'Fnatic' },
        ]
      },
      {
        name: 'Semifinal',
        matches: [
          { id: 'ub_r2_m1', teamA: 'Sentinels', teamB: 'Paper Rex', scoreA: 2, scoreB: 1, status: 'COMPLETED', winner: 'Sentinels' },
          { id: 'ub_r2_m2', teamA: 'LOUD', teamB: 'Fnatic', scoreA: 2, scoreB: 0, status: 'COMPLETED', winner: 'LOUD' },
        ]
      },
      {
        name: 'Upper Final',
        matches: [
          { id: 'ub_r3_m1', teamA: 'Sentinels', teamB: 'LOUD', scoreA: 1, scoreB: 0, status: 'LIVE' },
        ]
      }
    ]
  },
  {
    label: 'Lower Bracket',
    rounds: [
      {
        name: 'Lower Round 1',
        matches: [
          { id: 'lb_r1_m1', teamA: 'KRU', teamB: 'EDG', scoreA: 0, scoreB: 2, status: 'COMPLETED', winner: 'EDG' },
          { id: 'lb_r1_m2', teamA: 'DRX', teamB: 'Team Liquid', scoreA: 1, scoreB: 2, status: 'COMPLETED', winner: 'Team Liquid' },
        ]
      },
      {
        name: 'Lower Round 2',
        matches: [
          { id: 'lb_r2_m1', teamA: 'Fnatic', teamB: 'EDG', scoreA: 2, scoreB: 0, status: 'COMPLETED', winner: 'Fnatic' },
          { id: 'lb_r2_m2', teamA: 'Paper Rex', teamB: 'Team Liquid', scoreA: 2, scoreB: 0, status: 'COMPLETED', winner: 'Paper Rex' },
        ]
      },
      {
        name: 'Lower Round 3',
        matches: [
          { id: 'lb_r3_m1', teamA: 'Fnatic', teamB: 'Paper Rex', scoreA: null, scoreB: null, status: 'SCHEDULED' },
        ]
      },
      {
        name: 'Lower Final',
        matches: [
          { id: 'lb_r4_m1', teamA: 'TBD', teamB: 'TBD', scoreA: null, scoreB: null, status: 'SCHEDULED' },
        ]
      }
    ]
  },
  {
    label: 'Grand Final',
    rounds: [
      {
        name: 'Grand Final',
        matches: [
          { id: 'gf_m1', teamA: 'TBD', teamB: 'TBD', scoreA: null, scoreB: null, status: 'SCHEDULED' },
        ]
      }
    ]
  }
];

export const mockKpis = {
  activeTournaments: 12,
  liveMatches: 4,
  pendingApprovals: 7,
  registeredTeams: 148,
  totalCapacity: 160
};

export const mockAuditLog = [
  { id: 1, actor: 'D. Okafor', role: 'OWNER', action: 'Corrected result for CS2 Weekly Showdown QF1 (rollback)', timeAgo: '10m ago' },
  { id: 2, actor: 'S. Patel', role: 'MODERATOR', action: 'Approved registration for C9 (CS2 Pro League)', timeAgo: '1h ago' },
  { id: 3, actor: 'J. Smith', role: 'ADMIN', action: 'Started match Sentinels vs LOUD', timeAgo: '2h ago' },
  { id: 4, actor: 'D. Okafor', role: 'OWNER', action: 'Created tournament BGMI Masters Series', timeAgo: '1d ago' },
];
