import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  useTournament,
  useBracket,
  useMyTeamInTournament,
  useTournamentTeams,
  useRemoveTeamMember,
  useDisbandTeam,
} from "@/hooks/useTournaments";
import {
  Users,
  Shield,
  Settings,
  ArrowLeft,
  FileText,
  AlertCircle,
  Crown,
  GitFork,
  Swords,
} from "lucide-react";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoadingScreen } from "@/components/custom/loading-screen";
import { TournamentBracket } from "@/components/custom/TournamentBracket";

// Decomposed Sub-components
import { TournamentHeroBanner } from "./detail/TournamentHeroBanner";
import { TournamentOverviewTab } from "./detail/TournamentOverviewTab";
import { TournamentTeamsTab } from "./detail/TournamentTeamsTab";
import { TournamentStaffTab } from "./detail/TournamentStaffTab";
import { TournamentMyTeamTab } from "./detail/TournamentMyTeamTab";

export default function TournamentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useUser();
  const { data, isLoading, error } = useTournament(slug);
  const { data: bracketData, refetch: refetchBracket } = useBracket(slug);

  const tournament = data?.tournament;
  const bracketMatches = bracketData?.bracket || [];

  // My team in this tournament
  const { data: myTeamData, refetch: refetchMyTeam } = useMyTeamInTournament(tournament?.id);
  const myTeam = myTeamData?.team;
  const myMembership = myTeamData?.membership;

  // Registered teams in this tournament
  const { data: teamsData } = useTournamentTeams(tournament?.id);
  const registeredTeams = teamsData?.teams || [];

  const disbandTeam = useDisbandTeam(tournament?.id ?? "");
  const removeMyself = useRemoveTeamMember(tournament?.id ?? "", myTeam?.id ?? "");
  const kickMember = useRemoveTeamMember(tournament?.id ?? "", myTeam?.id ?? "");

  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    if (tournament?.status === "ONGOING" && bracketMatches.length > 0) {
      setActiveTab("bracket");
    }
  }, [tournament?.status, bracketMatches.length]);

  const isCaptain =
    myMembership?.role === "CAPTAIN" ||
    myTeam?.captainId === user?.id ||
    myTeam?.captain?.clerkId === user?.id ||
    myTeam?.members?.some(
      (m: any) =>
        (m.userId === user?.id ||
          m.user?.clerkId === user?.id ||
          m.user?.id === user?.id ||
          (user?.username && m.user?.username === user?.username)) &&
        m.role === "CAPTAIN"
    );
  const isAlreadyRegistered = Boolean(myTeam);

  const handleDisband = async () => {
    if (!window.confirm("Disband team? This will cancel your tournament entry.")) return;
    await disbandTeam.mutateAsync(myTeam?.id);
    refetchMyTeam();
  };

  const handleWithdraw = async () => {
    if (!window.confirm("Withdraw your candidacy from this team?")) return;
    await removeMyself.mutateAsync(user?.id ?? "");
    refetchMyTeam();
  };

  const handleKickMember = async (userId: string, username: string) => {
    if (!window.confirm(`Remove @${username} from the team?`)) return;
    await kickMember.mutateAsync(userId);
    refetchMyTeam();
  };

  if (isLoading) {
    return (
      <LoadingScreen
        fullScreen={false}
        message="LOADING TOURNAMENT DATA"
        subMessage="FETCHING BRACKETS & PARTICIPANTS..."
      />
    );
  }

  if (error || !tournament) {
    return (
      <Card className="max-w-xl mx-auto text-center p-8 space-y-4">
        <AlertCircle size={36} className="mx-auto text-ember" />
        <CardTitle className="text-xl">Tournament Not Found</CardTitle>
        <CardDescription>The tournament could not be retrieved or has been removed.</CardDescription>
        <Button variant="outline" asChild className="mx-auto">
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </Card>
    );
  }

  const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0];
  const currentEmail = user?.primaryEmailAddress?.emailAddress;

  const isCreator =
    user &&
    (tournament.organizer?.id === user.id ||
      tournament.organizer?.username === currentUsername ||
      tournament.organizer?.email === currentEmail ||
      tournament.organizerId === user.id);

  const isModerator = tournament.moderators?.some(
    (m: any) =>
      m.userId === user?.id ||
      m.user?.id === user?.id ||
      m.user?.username === currentUsername ||
      m.user?.email === currentEmail,
  );

  const canManage = isCreator || isModerator || user?.publicMetadata?.role === "platform_admin";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="text-fog hover:text-snow">
          <Link to="/dashboard">
            <ArrowLeft size={14} className="mr-1.5" />
            Back to Dashboard
          </Link>
        </Button>

        {canManage && (
          <Button variant="ember" size="sm" asChild>
            <Link to={`/dashboard/tournaments/${tournament.slug}/manage`}>
              <Settings size={14} className="mr-1.5" />
              Manage Tournament
            </Link>
          </Button>
        )}
      </div>

      {/* Hero Banner Card */}
      <TournamentHeroBanner
        tournament={tournament}
        isAlreadyRegistered={isAlreadyRegistered}
        isCaptain={isCaptain}
      />

      {/* Tabs Container */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText size={15} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Swords size={15} />
            Teams ({registeredTeams.length})
          </TabsTrigger>
          <TabsTrigger value="bracket" className="flex items-center gap-2">
            <GitFork size={15} />
            Bracket ({bracketMatches.length})
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Shield size={15} />
            Rules & Format
          </TabsTrigger>
          <TabsTrigger value="moderators" className="flex items-center gap-2">
            <Users size={15} />
            Staff & Moderators ({tournament.moderators?.length || 0})
          </TabsTrigger>
          {isAlreadyRegistered && (
            <TabsTrigger value="my-team" className="flex items-center gap-2">
              <Crown size={15} className="text-ember" />
              My Team
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview">
          <TournamentOverviewTab
            tournament={tournament}
            myTeam={myTeam}
            isAlreadyRegistered={isAlreadyRegistered}
            isCaptain={isCaptain}
            onDisband={handleDisband}
            onWithdraw={handleWithdraw}
            isDisbanding={disbandTeam.isPending}
            isWithdrawing={removeMyself.isPending}
            onSwitchToTeamTab={() => setActiveTab("my-team")}
          />
        </TabsContent>

        {/* Tab 2: Registered Teams & Rosters */}
        <TabsContent value="teams">
          <TournamentTeamsTab
            tournament={tournament}
            myTeam={myTeam}
            currentUserId={user?.id}
          />
        </TabsContent>

        {/* Tab 3: Bracket */}
        <TabsContent value="bracket">
          <Card className="p-6 bg-surface border-line space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-display text-snow">
                  <GitFork size={18} className="text-ember" />
                  Tournament Bracket & Fixtures
                </CardTitle>
                <CardDescription>
                  Real-time match progression, scores, seeds, and championship pathways.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {tournament.format?.replace("_", " ")}
                </Badge>
                {tournament.status === "ONGOING" && (
                  <Badge variant="cyan" className="font-mono text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse mr-1" />
                    LIVE TOURNAMENT
                  </Badge>
                )}
              </div>
            </div>

            <TournamentBracket
              matches={bracketMatches}
              tournamentName={tournament.name}
              tournamentSlug={tournament.slug}
              canManage={canManage}
              onRefresh={refetchBracket}
            />
          </Card>
        </TabsContent>

        {/* Tab 3: Rules */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Rules & Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-fog whitespace-pre-line leading-relaxed font-mono bg-background p-4 rounded border border-line">
                {tournament.rules ||
                  "Standard competitive esports guidelines apply. Contact tournament moderators for disputes."}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Moderators & Staff */}
        <TabsContent value="moderators">
          <TournamentStaffTab tournament={tournament} canManage={canManage} />
        </TabsContent>

        {/* Tab 5: My Team */}
        {isAlreadyRegistered && myTeam && (
          <TabsContent value="my-team">
            <TournamentMyTeamTab
              tournament={tournament}
              myTeam={myTeam}
              isCaptain={isCaptain}
              onDisband={handleDisband}
              onWithdraw={handleWithdraw}
              onKickMember={handleKickMember}
              isDisbanding={disbandTeam.isPending}
              isWithdrawing={removeMyself.isPending}
              refetchMyTeam={refetchMyTeam}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
