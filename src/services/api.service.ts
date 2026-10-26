import api from '@/lib/api';

export interface TournamentListParams {
  page?: number;
  limit?: number;
  gameId?: string;
  game?: string;
  format?: string;
  status?: string;
  search?: string;
  includeDrafts?: string | boolean;
}

export interface UserListParams {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

// ── Tournaments ───────────────────────────────────────────────────────
export const tournamentApi = {
  list: (params?: TournamentListParams) =>
    api.get('/tournaments', { params }).then((r) => r.data),
  getBySlug: (slug: string) =>
    api.get(`/tournaments/${slug}`).then((r) => r.data),
  getBracket: (slug: string) =>
    api.get(`/tournaments/${slug}/bracket`).then((r) => r.data),
  getParticipants: (slug: string) =>
    api.get(`/tournaments/${slug}/participants`).then((r) => r.data),
  getMatches: (slug: string) =>
    api.get(`/tournaments/${slug}/matches`).then((r) => r.data),
  create: (payload: Record<string, unknown>) =>
    api.post('/tournaments', payload).then((r) => r.data),
  update: (id: string, payload: Record<string, unknown>) =>
    api.patch(`/tournaments/${id}`, payload).then((r) => r.data),
  remove: (id: string) =>
    api.delete(`/tournaments/${id}`).then((r) => r.data),
  register: (id: string) =>
    api.post(`/tournaments/${id}/register`).then((r) => r.data),
  start: (id: string) =>
    api.post(`/tournaments/${id}/start`).then((r) => r.data),
  complete: (id: string) =>
    api.post(`/tournaments/${id}/complete`).then((r) => r.data),
  publish: (id: string) =>
    api.post(`/tournaments/${id}/publish`).then((r) => r.data),
  getModerators: (id: string) =>
    api.get(`/tournaments/${id}/moderators`).then((r) => r.data),
  addModerator: (id: string, userId: string) =>
    api.post(`/tournaments/${id}/moderators`, { userId }).then((r) => r.data),
  removeModerator: (id: string, userId: string) =>
    api.delete(`/tournaments/${id}/moderators/${userId}`).then((r) => r.data),
};

// ── Games ─────────────────────────────────────────────────────────────
export const gameApi = {
  list: () => api.get('/games').then((r) => r.data),
  getBySlug: (slug: string) => api.get(`/games/${slug}`).then((r) => r.data),
};

// ── Users ─────────────────────────────────────────────────────────────
export const userApi = {
  list: (params?: UserListParams) =>
    api.get('/users', { params }).then((r) => r.data),
  getProfile: (username: string) =>
    api.get(`/users/${username}/profile`).then((r) => r.data),
  updateMe: (payload: Record<string, unknown>) =>
    api.patch('/users/me', payload).then((r) => r.data),
  getMyTeams: () =>
    api.get('/users/me/teams').then((r) => r.data),
  getMyInvites: () =>
    api.get('/users/me/invites').then((r) => r.data),
};

// ── Teams (generic) ────────────────────────────────────────────────────
export const teamApi = {
  create: (payload: Record<string, unknown>) =>
    api.post('/teams', payload).then((r) => r.data),
  getById: (id: string) =>
    api.get(`/teams/${id}`).then((r) => r.data),
  update: (id: string, payload: Record<string, unknown>) =>
    api.patch(`/teams/${id}`, payload).then((r) => r.data),
  invite: (id: string, userId: string) =>
    api.post(`/teams/${id}/invite`, { userId }).then((r) => r.data),
  leave: (id: string) =>
    api.delete(`/teams/${id}/leave`).then((r) => r.data),
};

// ── Tournament-Scoped Team Registration ───────────────────────────────
export const tournamentTeamApi = {
  /** List all teams registered in a tournament */
  list: (tournamentId: string) =>
    api.get(`/tournaments/${tournamentId}/teams`).then((r) => r.data),

  /** Get the current user's team in a specific tournament */
  getMyTeam: (tournamentId: string) =>
    api.get(`/tournaments/${tournamentId}/teams/mine`).then((r) => r.data),

  /** Register a new team for a tournament (caller becomes CAPTAIN) */
  create: (tournamentId: string, payload: { name: string; logoUrl?: string }) =>
    api.post(`/tournaments/${tournamentId}/teams`, payload).then((r) => r.data),

  /** Captain invites a user to the team */
  inviteMember: (tournamentId: string, teamId: string, userId: string) =>
    api.post(`/tournaments/${tournamentId}/teams/${teamId}/members`, { userId }).then((r) => r.data),

  /** Invited member accepts or declines their invitation */
  respondToInvite: (tournamentId: string, teamId: string, action: 'accept' | 'decline') =>
    api.patch(`/tournaments/${tournamentId}/teams/${teamId}/members/me`, { action }).then((r) => r.data),

  /** Remove a member (member withdraws self, or captain kicks) */
  removeMember: (tournamentId: string, teamId: string, userId: string) =>
    api.delete(`/tournaments/${tournamentId}/teams/${teamId}/members/${userId}`).then((r) => r.data),

  /** Captain disbands the whole team */
  disband: (tournamentId: string, teamId: string) =>
    api.delete(`/tournaments/${tournamentId}/teams/${teamId}`).then((r) => r.data),
};

// ── Matches ───────────────────────────────────────────────────────────
export const matchApi = {
  getById: (id: string) =>
    api.get(`/matches/${id}`).then((r) => r.data),
  reportResult: (id: string, payload: Record<string, unknown>) =>
    api.post(`/matches/${id}/result`, payload).then((r) => r.data),
  update: (id: string, payload: Record<string, unknown>) =>
    api.patch(`/matches/${id}`, payload).then((r) => r.data),
};

// ── Notifications ─────────────────────────────────────────────────────
export const notificationApi = {
  list: () => api.get('/notifications').then((r) => r.data),
  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () =>
    api.patch('/notifications/read-all').then((r) => r.data),
  remove: (id: string) =>
    api.delete(`/notifications/${id}`).then((r) => r.data),
};
