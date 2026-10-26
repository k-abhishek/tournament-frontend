# Gaming Tournament Platform - Revision 3 Implementation Tracker (User-Centric Hosting & Moderator Flow)

> **Updated Flow Architecture:**
> - **Direct Tournament Hosting**: Authenticated users can host tournaments directly from their dashboard (`/dashboard`) without requiring a Clerk Organization.
> - **Tournament Roles**: The user who creates the tournament becomes the **Tournament Admin** (`organizerId`).
> - **Moderator Delegation**: On the tournament page / manage view, the Admin can assign moderators using a select dropdown populated via the user list endpoint (`GET /api/users`).
> - **Scoped Permissions**:
>   - **Moderators**: Can update tournament description, rules, schedule, and settings.
>   - **Admin (Creator) & Platform Admin**: Can update settings, manage moderators, and **only they can delete the tournament**.

---

## 1. Database & Data Model (Prisma)
- [x] Base Prisma setup and connection
- [x] Base models for `User`, `Game`, `Tournament`, `Team`, `Match`
- [x] Add `TournamentModerator` junction model (`tournamentId`, `userId`, `assignedAt`) with cascade delete
- [x] Update `Tournament` model with `moderators` relation (`TournamentModerator[]`)
- [x] Update `User` model with `moderatedTournaments` relation (`TournamentModerator[]`)
- [x] Run `prisma db push` and `prisma generate` to synchronize database
- [ ] Add `brackets`, `standings`, and `player_tournament_history` models
- [ ] Add platform ops models: `audit_logs`, `processed_webhooks`, `platform_settings`
- [ ] Update `Match` model (evidence URLs, reported score metadata)

## 2. Backend Infrastructure & Auth (Node.js/Fastify)
- [x] Fastify server with CORS, Helmet, Rate Limit, Swagger setup
- [x] Redis and BullMQ connection established
- [x] Clerk JWT verification middleware (`authenticate.js`) verifying Clerk Bearer tokens
- [x] User sync via Clerk webhooks (`clerkWebhook.controller.js`)
- [x] Allow any authenticated user to create a tournament as Tournament Admin
- [x] Built tournament permission checking (Creator, Moderator, Admin) inside controllers

## 3. Backend API Routes
- [x] Public Tournament Routes (`GET /api/tournaments`, `GET /api/tournaments/:slug`, `bracket`, `participants`, `matches`)
- [x] Update `POST /api/tournaments`: Authenticated user hosts tournament and becomes `organizerId` (Admin)
- [x] Update `GET /api/users`: Authenticated users can list/search users for moderator selection dropdown
- [x] Tournament Moderator Management Endpoints:
  - [x] `GET /api/tournaments/:id/moderators`: List assigned moderators
  - [x] `POST /api/tournaments/:id/moderators`: Add a moderator (Tournament Admin / Creator only)
  - [x] `DELETE /api/tournaments/:id/moderators/:userId`: Remove a moderator (Tournament Admin / Creator only)
- [x] Update `PATCH /api/tournaments/:id`: Allow both Tournament Creator (Admin) AND assigned Moderators to update description & settings
- [x] Update `DELETE /api/tournaments/:id`: Enforce strict restriction - ONLY Tournament Creator (Admin) or Platform Admin can delete
- [x] Registration Endpoints (`POST /api/tournaments/:id/register`, `DELETE /api/tournaments/:id/unregister`)
- [x] Tournament Lifecycle Endpoints (`POST /publish`, `POST /start`, `POST /complete`)

## 4. Bracket Generation Engine & Workers (BullMQ)
- [x] Worker entry point and Redis connection setup
- [ ] Implement `advanceBracket` logic (Single/Double Elimination logic)
- [ ] Implement `recalculateStandingsJob` (Round Robin / Swiss)

## 5. Frontend Architecture & Routing (React 19 + Vite 6 + TypeScript)
- [x] React Router setup and ClerkProvider initialization
- [x] Landing Page (`/`) with public tournament showcase and "Host a Tournament" CTA
- [x] Clerk Auth routes (`/sign-in/*`, `/sign-up/*`)
- [x] Update `src/lib/api.ts`: Inject Clerk session token via `window.Clerk?.session?.getToken()` with typed interceptors
- [x] Revise Dashboard routing in `App.tsx`:
  - `/dashboard`: User overview & tournaments hosted/moderated
  - `/dashboard/tournaments`: Explore all tournaments
  - `/dashboard/tournaments/new`: Create Tournament Form (Host Tournament)
  - `/dashboard/tournaments/:slug`: Tournament Detail public/player view
    - Overview Tab: Description, creator, format, schedule, rules
    - **Registered Teams & Rosters Tab**: Shows all registered teams, rosters, captain badges, seedings, and member status with search/filter
    - Bracket & Fixtures Tab: Interactive bracket visualization with match fixtures and scores
    - Staff & Moderators Tab: Tournament creator and appointed moderators
    - **My Team Tab**: Full roster management, visual capacity tracker, captain player search and invite panel
  - `/dashboard/tournaments/:slug/manage`: Tournament Management (Settings, Description & Moderator Selection)
  - `/dashboard/profile`: User Profile
  - Cleaned up obsolete forced Clerk Org routes
- [x] **Route-Level Code Splitting**: Implemented dynamic `React.lazy()` imports wrapped in `<Suspense fallback={<LoadingScreen />}>`, reducing initial bundle size by ~46%.

## 6. Frontend State, Services & API Client
- [x] Zustand stores for UI and bracket state
- [x] Complete TypeScript migration (`api.service.ts`, `api.ts`, `tournament-data.ts`)
- [x] Typed `api.service.ts`:
  - [x] `userApi.list(params)` for listing users
  - [x] `tournamentApi.getModerators(id)`
  - [x] `tournamentApi.addModerator(id, userId)`
  - [x] `tournamentApi.removeModerator(id, userId)`
  - [x] `tournamentApi.publish(id)`
- [x] **Lightweight Reactive Axios Hooks (`useTournaments.ts`)**:
  - Replaced heavy `@tanstack/react-query` dependency with native reactive hooks
  - Custom EventBus query invalidation mechanism (`invalidateQueries(prefix)`)
  - Provides `useTournaments`, `useTournament`, `useCreateTournament`, `useUpdateTournament`, `useDeleteTournament`, `useAddModerator`, `useRemoveModerator`, `useUsers`

## 7. UI Components & Design System (Tailwind v4 + Shadcn Primitives)
- [x] **Shadcn Component Suite (`src/components/ui/`)**:
  - `Button`, `Badge`, `Input`, `Textarea`, `Card`
  - Accessible Radix primitives: `Select`, `Tabs`, `Dialog`, `Avatar`, `Popover`
  - Styled `Calendar` and `DateTimePicker` (react-day-picker v10) for start/end date configuration
- [x] **Native Toast System**: Replaced `react-hot-toast` with native Shadcn toast (`toast.tsx`, `toaster.tsx`, `use-toast.ts`) styled with dark cyberpunk/esports accents
- [x] **Tactical Cyber LoadingScreen (`src/components/custom/loading-screen.tsx`)**:
  - Tactical HUD corner telemetry (`SYS.NODE // 01`, `PROTOCOL: SECURE`)
  - Dual-pulse radar ring, counter-rotating terminal shield, animated scanning beam

## 8. Frontend Features & Domain Views
- [x] **Dashboard Overview (`MyTournaments.tsx`)**:
  - Hero header with "Host Tournament" CTA
  - Role-based tabs ("Hosted by Me (Admin)", "Moderating", "Explore All")
  - Tournament status cards with direct links to "Manage" or "View"
- [x] **Tournament Creation Page (`CreateTournamentForm.tsx`)**:
  - Comprehensive form to configure title, mandatory **Organizer Name** (host branding), game, format, max teams, prize pool, start date (using `DateTimePicker`), rules, and description
  - Validates and submits `organizerName` in `POST /api/tournaments` payload as mandatory
  - Submits to `POST /api/tournaments` and redirects creator to management panel
- [x] **Tournament Management & Moderator Selector (`TournamentManage.tsx`)**:
  - Modular decomposed tabs: `TournamentSettingsTab`, `TournamentModeratorsTab`, `TournamentDangerTab`
  - Description & Settings Tab: Editable by both Admin and Moderators
  - Moderator Selection Dropdown: Populated from `userApi.list()` with search, user avatars, and add/remove actions (Admin-only)
  - Danger Zone: "Delete Tournament" button strictly gated to Tournament Creator / Platform Admin
- [x] **Tournament Detail Page (`TournamentDetail.tsx`)**:
  - Banner, game tag, status badge, dates, prize pool, and registration button
  - Dedicated **Bracket & Matches** tab with full visual match fixtures and score progression
  - Staff & Moderators tab showing appointed organizers and moderators
  - Conditional "Manage Tournament" button visible to Creator and Moderators
- [x] **Database Seeding (`prisma/seed.js`) & Real API Integration**:
  - Seeded 33 games, master users (Alex, Sara, Marcus, Elena + pro team captains like TenZ, Boaster, s1mple, ZywOo), 6 tournaments, team rosters, participants, and full bracket fixtures with scores and match results.
  - Removed all fallback references to `dummy-tournaments.ts` across `TournamentExplorer`, `TournamentDetail`, `RegisterTeamPage`, `MyTournaments`, `TournamentGrid`, and `TournamentBracket`.
  - Live data from Fastify REST API (`GET /api/tournaments`, `GET /api/tournaments/:slug`, `GET /api/tournaments/:slug/bracket`) actively populates the frontend without relying on mock fallbacks.
- [x] **User Profile (`UpdateProfile.tsx`)**:
  - Profile customization and metadata management using shadcn primitives

---

## 9. Team-Based Tournament Registration & Roster Flow (Phases 1-3)

- [x] **Phase 1 — Backend (New API Routes & Prisma Data Model)**:
  - [x] Prisma Schema: `TeamMember` model (`teamId`, `userId`, `role` [CAPTAIN | MEMBER], `status` [PENDING | ACCEPTED | DECLINED], `joinedAt`), `Team` model with `tournamentId` FK and cascade member relations
  - [x] `POST /api/tournaments/:id/teams`: Auth required, validates tournament is published/registration open, creates Team with creator as CAPTAIN with status ACCEPTED, returns `{ team, teamId }`
  - [x] `GET /api/tournaments/:id/teams`: Public list of registered teams with member counts (`_count.members`)
  - [x] `POST /api/tournaments/:id/teams/:teamId/members`: Captain-only member invitation, validates total members ≤ `tournament.teamSize + 1`, creates `TeamMember` with PENDING status, generates user `Notification`
  - [x] `PATCH /api/tournaments/:id/teams/:teamId/members/me`: Invited user accepts or declines candidacy, updates `TeamMember.status`
  - [x] `DELETE /api/tournaments/:id/teams/:teamId/members/:userId`: Member self-withdraws candidacy (or captain kicks member)
  - [x] `DELETE /api/tournaments/:id/teams/:teamId`: Captain-only destructive team disbanding with cascade delete
  - [x] `GET /api/tournaments/:id/teams/mine`: Current user's team in the tournament context
  - [x] `GET /api/users/me/teams` & `GET /api/users/me/invites`: User's global team memberships & pending invitations

- [x] **Phase 2 — Frontend: Dedicated Registration Page & Component Decomposition**:
  - [x] Removed obsolete `RegisterTeamDialog.tsx` modal component
  - [x] Decomposed `RegisterTeamPage.tsx` into modular step sub-components:
    - `registration/RegisterStepper.tsx`: 3-step progress indicator
    - `registration/RegisterStepCreate.tsx`: Squad name input and captain assignment
    - `registration/RegisterStepInvite.tsx`: Player search, roster visualizer, and invite dispatch
    - `registration/RegisterStepDone.tsx`: Confirmation celebration and return links
  - [x] Decomposed `TournamentDetail.tsx` into domain sub-components:
    - `detail/TournamentHeroBanner.tsx`: Hero banner, format badges, and stats
    - `detail/TournamentOverviewTab.tsx`: Tournament description, admin card, and registered squad banner
    - `detail/TournamentStaffTab.tsx`: Creator and moderator cards
    - `detail/TournamentMyTeamTab.tsx`: Team roster, confirmed/pending badges, kick member, and disband/withdraw controls
  - [x] Decomposed `MyTournaments.tsx` into dashboard sub-components:
    - `dashboard/DashboardRegistrationCard.tsx`: Registration status, confirmed/pending breakdown, and disband/withdraw buttons
    - `dashboard/DashboardInviteCard.tsx`: Pending invitation card with accept/decline actions
    - `dashboard/DashboardTournamentCard.tsx`: Hosted/moderated tournament card
    - `dashboard/PendingInvitesBanner.tsx`: Incoming invitations alert banner
  - [x] `useTeamRegistration(tournamentId)` Hook: Unified hook providing `createTeam`, `inviteMember`, `getMyTeam`, `respondToInvite`, `removeMember`, and `disbandTeam` with reactive event bus cache invalidation

- [x] **Phase 3 — Frontend: Dashboard "My Registrations" & Pending Invites UI**:
  - [x] Dashboard (`MyTournaments.tsx`):
    - Added "My Registrations" tab listing all tournaments the user is registered in (as captain or member)
    - Registration cards with tournament name, status badge, team name, confirmed & pending member counts, and roster avatars
    - "Withdraw Candidacy" button for members (with confirmation prompt)
    - "Disband Team" button for captains (destructive with confirmation prompt)
    - Direct "View Tournament" action button
  - [x] Pending Invites UI (`MyTournaments.tsx` & `MyTeams.tsx`):
    - Prominent incoming invitations alert banner in the Dashboard when pending invites exist
    - "Accept" / "Decline" actions with direct API dispatch and toast feedback
  - [x] Navigation & Dedicated View (`MyTeams.tsx` & `DashboardLayout.tsx`):
    - Added "My Teams & Invites" to sidebar navigation
    - Enhanced `MyTeams.tsx` with Disband Team and Withdraw Candidacy actions

---

# Verification & Build Summary

1. **Backend Tests**:
   - `prisma validate` & `prisma db push` completed without errors.
   - Fastify server running on `http://localhost:3001` with active PostgreSQL and Redis connection.
   - `GET /api/tournaments` returns `200 OK`.
   - `GET /api/tournaments/:id/teams` & `/mine` verified.
   - `GET /api/users/me/teams` & `/me/invites` verified.
2. **Frontend Tests**:
   - `npm run build` compiled 2,571 modules cleanly in 833ms with 0 errors.
   - Dynamic code splitting verified: vendor, features, and route chunks isolated cleanly.
   - Dev server active and responding.
