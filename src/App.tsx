import { Routes, Route, Navigate } from 'react-router-dom';
import { OrganizationProfile } from '@clerk/clerk-react';

// Layouts
import RootLayout from '@/layouts/RootLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Auth Pages
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';

// Guards
import RequireAuth from '@/guards/RequireAuth';
import RequireOrg from '@/guards/RequireOrg';
import RequirePlatformAdmin from '@/guards/RequirePlatformAdmin';
import Can from '@/guards/Can';
import { PERMISSIONS } from '@/lib/permissions';

// Feature Pages (Placeholders for now)
import LandingPage from '@/features/landing/LandingPage';
import TournamentDetail from '@/features/tournaments/TournamentDetail';
import CreateTournamentForm from '@/features/tournaments/CreateTournamentForm';
import OrgOverview from '@/features/org/OrgOverview';
import CreateOrgForm from '@/features/org/CreateOrgForm';
import RegistrationsQueue from '@/features/org/RegistrationsQueue';
import MatchResultAdminPanel from '@/features/org/MatchResultAdminPanel';
import PlatformConsole from '@/features/admin/PlatformConsole';
import MyTournaments from '@/features/profile/MyTournaments';
import MyTeams from '@/features/profile/MyTeams';
import UpdateProfile from '@/features/profile/UpdateProfile';

const SHOW_LANDING = import.meta.env.VITE_SHOW_LANDING !== 'false';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<RootLayout />}>
        <Route path="/" element={SHOW_LANDING ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          
          {/* Player View */}
          <Route index element={<MyTournaments />} />
          <Route path="profile" element={<UpdateProfile />} />
          <Route path="tournaments" element={<TournamentDetail />} />
          <Route path="my-teams" element={<MyTeams />} />

          {/* Org Creation (doesn't require active org) */}
          <Route path="org/new" element={
            <div className="flex justify-center p-8">
              <CreateOrgForm />
            </div>
          } />

          {/* Org Scoped Routes */}
          <Route path="org" element={<RequireOrg />}>
            <Route index element={<OrgOverview />} />
            
            <Route path="tournaments/new" element={
              <Can permission={PERMISSIONS.TOURNAMENT_CREATE}>
                <CreateTournamentForm />
              </Can>
            } />
            
            <Route path="tournaments/:id/manage" element={
              <Can permission={PERMISSIONS.TOURNAMENT_UPDATE}>
                <CreateTournamentForm /> {/* Reusing form for edit */}
              </Can>
            } />
            
            <Route path="registrations" element={
              <Can permission={PERMISSIONS.REGISTRATION_REVIEW}>
                <RegistrationsQueue />
              </Can>
            } />
            
            <Route path="matches" element={
              <Can permission={PERMISSIONS.MATCH_REPORT}>
                <MatchResultAdminPanel />
              </Can>
            } />
            
            <Route path="members" element={
              <div className="flex justify-center p-8">
                <OrganizationProfile routing="hash" />
              </div>
            } />
          </Route>

          {/* Platform Admin Console */}
          <Route path="admin" element={<RequirePlatformAdmin />}>
            <Route index element={<PlatformConsole />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  );
}
