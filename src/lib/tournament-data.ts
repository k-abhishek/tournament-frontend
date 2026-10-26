/**
 * Tournament Domain Types & Data Contracts
 * Defines entities used across tournament browsing, brackets, matches, and team registrations.
 */

export type Game = 'VALORANT' | 'CS2' | 'BGMI' | 'FREE_FIRE' | 'DOTA2' | 'APEX_LEGENDS';
export type TournamentFormat = 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'SWISS';
export type TournamentStatus = 'DRAFT' | 'REGISTRATION_OPEN' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CORRECTED';
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Tournament {
  id: string;
  slug: string;
  name: string;
  description?: string;
  rules?: string;
  gameId?: string;
  game?: {
    id: string;
    name: string;
    slug: string;
  };
  format: TournamentFormat;
  status: TournamentStatus;
  maxParticipants: number;
  isTeamBased?: boolean;
  teamSize?: number;
  prizePool?: string;
  startDate: string;
  registrationDeadline: string;
  bannerUrl?: string;
  organizerId?: string;
  organizer?: {
    id: string;
    username: string;
    displayName?: string;
    email?: string;
    avatarUrl?: string;
  };
  moderators?: Array<{
    id: string;
    userId: string;
    assignedAt: string;
    user?: {
      id: string;
      username: string;
      displayName?: string;
      avatarUrl?: string;
      email?: string;
    };
  }>;
}

export interface LiveMatch {
  id: string;
  tournamentId?: string;
  tournamentTitle?: string;
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
  tournamentId: string;
  captain: string;
  players: string[];
  submittedAt: string;
  status: RegistrationStatus;
  formData: Array<{ label: string; value: string }>;
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
