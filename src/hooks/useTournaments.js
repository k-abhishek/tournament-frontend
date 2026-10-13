import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tournamentApi, gameApi } from '@/services/api.service';
import toast from 'react-hot-toast';

// ── Tournaments ───────────────────────────────────────────────────────
export const useTournaments = (params) =>
  useQuery({ queryKey: ['tournaments', params], queryFn: () => tournamentApi.list(params) });

export const useTournament = (slug) =>
  useQuery({ queryKey: ['tournament', slug], queryFn: () => tournamentApi.getBySlug(slug), enabled: !!slug });

export const useBracket = (slug) =>
  useQuery({ queryKey: ['bracket', slug], queryFn: () => tournamentApi.getBracket(slug), enabled: !!slug });

export const useParticipants = (slug) =>
  useQuery({ queryKey: ['participants', slug], queryFn: () => tournamentApi.getParticipants(slug), enabled: !!slug });

export const useCreateTournament = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tournamentApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Tournament created!');
    },
    onError: (err) => toast.error(err.response?.data?.error ?? 'Failed to create tournament'),
  });
};

export const useRegisterForTournament = (id) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => tournamentApi.register(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Registered successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.error ?? 'Registration failed'),
  });
};

// ── Games ─────────────────────────────────────────────────────────────
export const useGames = () =>
  useQuery({ queryKey: ['games'], queryFn: gameApi.list });
