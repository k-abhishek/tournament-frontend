import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts & Core Framework
import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import RequireAuth from "@/guards/RequireAuth";
import RequirePlatformAdmin from "@/guards/RequirePlatformAdmin";
import { LoadingScreen } from "@/components/custom/loading-screen";

// Lazy-loaded Feature Pages for optimized initial bundle & route-level code splitting
const LandingPage = lazy(() => import("@/features/landing/LandingPage"));
const SignInPage = lazy(() => import("@/pages/auth/SignInPage"));
const SignUpPage = lazy(() => import("@/pages/auth/SignUpPage"));
const MyTournaments = lazy(() => import("@/features/profile/MyTournaments"));
const TournamentExplorer = lazy(
  () => import("@/features/tournaments/TournamentExplorer"),
);
const TournamentDetail = lazy(
  () => import("@/features/tournaments/TournamentDetail"),
);
const TournamentManage = lazy(
  () => import("@/features/tournaments/TournamentManage"),
);
const CreateTournamentForm = lazy(
  () => import("@/features/tournaments/CreateTournamentForm"),
);
const RegisterTeamPage = lazy(
  () => import("@/features/tournaments/RegisterTeamPage"),
);
const UpdateProfile = lazy(() => import("@/features/profile/UpdateProfile"));
const MyTeams = lazy(() => import("@/features/profile/MyTeams"));
const PlatformConsole = lazy(() => import("@/features/admin/PlatformConsole"));

const SHOW_LANDING = import.meta.env.VITE_SHOW_LANDING !== "false";

/**
 * Main Application Component with Route-Level Code Splitting.
 * Routes are lazily imported and wrapped with a unified Suspense fallback.
 */
export default function App() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          message="INITIALIZING ARENA"
          subMessage="PREPARING COMPETITIVE INTERFACE..."
        />
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              SHOW_LANDING ? (
                <LandingPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            {/* User Dashboard & Tournament Hosting */}
            <Route index element={<MyTournaments />} />
            <Route path="tournaments" element={<TournamentExplorer />} />
            <Route path="tournaments/new" element={<CreateTournamentForm />} />
            <Route
              path="tournaments/:slug/register"
              element={<RegisterTeamPage />}
            />
            <Route path="tournaments/:slug" element={<TournamentDetail />} />
            <Route
              path="tournaments/:slug/manage"
              element={<TournamentManage />}
            />

            {/* User Profile & Teams */}
            <Route path="profile" element={<UpdateProfile />} />
            <Route path="my-teams" element={<MyTeams />} />

            {/* Platform Admin Console */}
            <Route path="admin" element={<RequirePlatformAdmin />}>
              <Route index element={<PlatformConsole />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
