import { create } from 'zustand';

interface TournamentState {
  currentTournament: any | null;
  isLoading: boolean;
  error: string | null;
  setTournament: (tournament: any) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearTournament: () => void;
}

// Note: Auth/Org state (active org, user id, permissions) are explicitly EXCLUDED 
// from this store. Use Clerk's useAuth() and useUser() hooks in components instead.
export const useTournamentStore = create<TournamentState>((set) => ({
  currentTournament: null,
  isLoading: false,
  error: null,
  setTournament: (tournament) => set({ currentTournament: tournament }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearTournament: () => set({ currentTournament: null, error: null }),
}));
