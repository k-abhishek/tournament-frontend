import api from '@/lib/api';

// ── Tournaments ───────────────────────────────────────────────────────
export const tournamentApi = {
  list:           (params)  => api.get('/tournaments', { params }).then(r => r.data),
  getBySlug:      (slug)    => api.get(`/tournaments/${slug}`).then(r => r.data),
  getBracket:     (slug)    => api.get(`/tournaments/${slug}/bracket`).then(r => r.data),
  getParticipants:(slug)    => api.get(`/tournaments/${slug}/participants`).then(r => r.data),
  getMatches:     (slug)    => api.get(`/tournaments/${slug}/matches`).then(r => r.data),
  create:         (payload) => api.post('/tournaments', payload).then(r => r.data),
  update:         (id, payload) => api.patch(`/tournaments/${id}`, payload).then(r => r.data),
  remove:         (id)      => api.delete(`/tournaments/${id}`),
  register:       (id)      => api.post(`/tournaments/${id}/register`).then(r => r.data),
  unregister:     (id)      => api.delete(`/tournaments/${id}/unregister`),
  start:          (id)      => api.post(`/tournaments/${id}/start`).then(r => r.data),
  complete:       (id)      => api.post(`/tournaments/${id}/complete`).then(r => r.data),
};

// ── Games ─────────────────────────────────────────────────────────────
export const gameApi = {
  list:      ()     => api.get('/games').then(r => r.data),
  getBySlug: (slug) => api.get(`/games/${slug}`).then(r => r.data),
};

// ── Users ─────────────────────────────────────────────────────────────
export const userApi = {
  getProfile: (username) => api.get(`/users/${username}/profile`).then(r => r.data),
  updateMe:   (payload)  => api.patch('/users/me', payload).then(r => r.data),
};

// ── Teams ─────────────────────────────────────────────────────────────
export const teamApi = {
  create:  (payload) => api.post('/teams', payload).then(r => r.data),
  getById: (id)      => api.get(`/teams/${id}`).then(r => r.data),
  update:  (id, payload) => api.patch(`/teams/${id}`, payload).then(r => r.data),
  invite:  (id, userId) => api.post(`/teams/${id}/invite`, { userId }).then(r => r.data),
  leave:   (id)     => api.delete(`/teams/${id}/leave`),
};

// ── Matches ───────────────────────────────────────────────────────────
export const matchApi = {
  getById:      (id)      => api.get(`/matches/${id}`).then(r => r.data),
  reportResult: (id, payload) => api.post(`/matches/${id}/result`, payload).then(r => r.data),
};

// ── Notifications ─────────────────────────────────────────────────────
export const notificationApi = {
  list:       ()   => api.get('/notifications').then(r => r.data),
  markRead:   (id) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  markAllRead:()   => api.patch('/notifications/read-all').then(r => r.data),
  remove:     (id) => api.delete(`/notifications/${id}`),
};
