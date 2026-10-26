import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  useTournaments,
  useMyTeamMemberships,
  useMyPendingInvites,
} from "@/hooks/useTournaments";
import {
  Trophy,
  Shield,
  Plus,
  Crown,
  Swords,
  ArrowRight,
} from "lucide-react";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingScreen } from "@/components/custom/loading-screen";

// Decomposed Sub-components
import { DashboardRegistrationCard } from "./dashboard/DashboardRegistrationCard";
import { DashboardTournamentCard } from "./dashboard/DashboardTournamentCard";
import { PendingInvitesBanner } from "./dashboard/PendingInvitesBanner";

export default function MyTournaments() {
  const { user, isLoaded } = useUser();
  const { data, isLoading } = useTournaments({
    includeDrafts: "true",
    limit: 50,
  });

  const { data: membershipsData, isLoading: membershipsLoading } = useMyTeamMemberships();
  const { data: invitesData } = useMyPendingInvites();

  const [filter, setFilter] = useState<"hosted" | "moderating" | "registrations" | "all">(
    "hosted",
  );

  const memberships: any[] = membershipsData?.memberships ?? [];
  const pendingInvites: any[] = invitesData?.invites ?? [];

  const tournaments: any[] = data?.tournaments || [];

  const currentUsername =
    user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0];
  const currentEmail = user?.primaryEmailAddress?.emailAddress;

  // Filter tournaments by user role
  const hostedTournaments = tournaments.filter(
    (t: any) =>
      t.organizerId === user?.id ||
      t.organizer?.id === user?.id ||
      t.organizer?.username === currentUsername ||
      t.organizer?.email === currentEmail,
  );

  const moderatedTournaments = tournaments.filter(
    (t: any) =>
      t.organizerId !== user?.id &&
      t.organizer?.username !== currentUsername &&
      t.moderators?.some(
        (m: any) =>
          m.userId === user?.id ||
          m.user?.id === user?.id ||
          m.user?.username === currentUsername ||
          m.user?.email === currentEmail,
      ),
  );

  const displayedTournaments =
    filter === "hosted"
      ? hostedTournaments
      : filter === "moderating"
        ? moderatedTournaments
        : tournaments;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Welcome Hero Card */}
      <Card className="relative overflow-hidden border-line">
        <div className="absolute right-0 top-0 w-96 h-96 bg-ember/10 rounded-full blur-3xl pointer-events-none" />

        <CardContent className="p-6 md:p-8 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Badge variant="ember">Esports Management Console</Badge>
              <h1 className="text-3xl md:text-4xl font-display text-snow tracking-wide">
                {isLoaded && user
                  ? `Welcome, ${user.firstName || user.username || "Player"}`
                  : "Tournament Dashboard"}
              </h1>
              <CardDescription className="max-w-xl text-sm">
                Host competitions, assemble teams, respond to pending invitations, and track
                active tournament brackets.
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg" asChild className="shrink-0 gap-2 border-line">
                <Link to="/dashboard/my-teams">
                  <Swords size={16} className="text-lime" />
                  My Teams & Invites
                  {pendingInvites.length > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 px-1 bg-ember text-ink text-[11px] font-mono">
                      {pendingInvites.length}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ember" size="lg" asChild className="shrink-0">
                <Link to="/dashboard/tournaments/new">
                  <Plus size={18} />
                  Host Tournament
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations Alert Banner */}
      <PendingInvitesBanner pendingInvites={pendingInvites} />

      {/* Tabs Filter */}
      <Tabs
        value={filter}
        onValueChange={(val: any) => setFilter(val)}
        className="space-y-6"
      >
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="hosted" className="flex items-center gap-2">
            <Crown size={15} className="text-ember" />
            Hosted by Me ({hostedTournaments.length})
          </TabsTrigger>

          <TabsTrigger value="moderating" className="flex items-center gap-2">
            <Shield size={15} className="text-cyan" />
            Moderating ({moderatedTournaments.length})
          </TabsTrigger>

          <TabsTrigger value="registrations" className="flex items-center gap-2">
            <Swords size={15} className="text-lime" />
            My Registrations ({memberships.length})
          </TabsTrigger>

          <TabsTrigger value="all" className="flex items-center gap-2">
            <Trophy size={15} />
            Explore All ({tournaments.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tab Content */}
      {filter === "registrations" ? (
        membershipsLoading ? (
          <LoadingScreen
            fullScreen={false}
            message="SYNCING TEAM REGISTRATIONS"
            subMessage="FETCHING YOUR TOURNAMENT ENTRIES..."
          />
        ) : memberships.length === 0 ? (
          <Card className="text-center p-12 space-y-4 max-w-lg mx-auto border-dashed border-line">
            <div className="w-14 h-14 rounded-full bg-lime/10 border border-lime/20 text-lime flex items-center justify-center mx-auto">
              <Swords size={26} />
            </div>
            <CardTitle className="text-xl">No active tournament registrations</CardTitle>
            <CardDescription className="max-w-sm mx-auto">
              Join the arena! Find an open tournament and register your team or accept an invitation to
              compete for glory and prizes.
            </CardDescription>
            <Button variant="default" asChild className="mx-auto mt-2 bg-lime text-ink hover:bg-lime/90 font-display">
              <Link to="/dashboard/tournaments">
                Browse Tournaments
                <ArrowRight size={15} className="ml-1.5" />
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memberships.map((membership) => (
              <DashboardRegistrationCard
                key={membership.id}
                membership={membership}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )
      ) : (
        isLoading ? (
          <LoadingScreen
            fullScreen={false}
            message="SYNCING TOURNAMENTS"
            subMessage="FETCHING HOSTED & MODERATED COMPETITIONS..."
          />
        ) : displayedTournaments.length === 0 ? (
          <Card className="text-center p-12 space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-ember/10 border border-ember/20 text-ember flex items-center justify-center mx-auto">
              <Trophy size={24} />
            </div>
            <CardTitle className="text-xl">
              {filter === "hosted"
                ? "You haven't hosted any tournaments yet"
                : filter === "moderating"
                  ? "No tournaments assigned to you as moderator"
                  : "No tournaments found"}
            </CardTitle>
            <CardDescription className="max-w-sm mx-auto">
              {filter === "hosted"
                ? "Ready to organize your first esports competition? Click the button below to get started."
                : "When tournament admins appoint you as moderator, those events will show up here."}
            </CardDescription>

            {filter === "hosted" && (
              <Button variant="ember" asChild className="mx-auto mt-2">
                <Link to="/dashboard/tournaments/new">
                  <Plus size={16} />
                  Host First Tournament
                </Link>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTournaments.map((t: any) => (
              <DashboardTournamentCard
                key={t.id}
                tournament={t}
                currentUserId={user?.id}
                currentUsername={currentUsername}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
