import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  useTournament,
  useMyTeamInTournament,
  useRegisterTeam,
  useInviteTeamMember,
  useUsers,
} from "@/hooks/useTournaments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/custom/loading-screen";
import { ArrowLeft, CheckCircle2, Gamepad2, AlertCircle } from "lucide-react";

import { RegisterStepper, Step } from "./registration/RegisterStepper";
import { RegisterStepCreate } from "./registration/RegisterStepCreate";
import { RegisterStepInvite } from "./registration/RegisterStepInvite";
import { RegisterStepDone } from "./registration/RegisterStepDone";

interface CreatedTeam {
  id: string;
  name: string;
  members?: Array<{
    id: string;
    userId: string;
    role: string;
    status: string;
    user: { id: string; username: string; displayName?: string; avatarUrl?: string };
  }>;
}

export default function RegisterTeamPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useUser();

  const { data, isLoading, error } = useTournament(slug);
  const tournament = data?.tournament;

  const { data: myTeamData, isLoading: loadingMyTeam } = useMyTeamInTournament(tournament?.id);
  const myExistingTeam = myTeamData?.team;

  const [step, setStep] = useState<Step>("create");
  const [teamName, setTeamName] = useState("");
  const [createdTeam, setCreatedTeam] = useState<CreatedTeam | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());

  const maxSlots = (tournament?.teamSize ?? 5) + 1;
  const currentMemberCount = createdTeam?.members?.length ?? 1;

  const registerTeam = useRegisterTeam(tournament?.id ?? "");
  const inviteMember = useInviteTeamMember(tournament?.id ?? "", createdTeam?.id ?? "");

  const debouncedSearch = memberSearch.length >= 2 ? memberSearch : undefined;
  const { data: usersData, isLoading: searchLoading } = useUsers(
    debouncedSearch ? { search: debouncedSearch, limit: 8 } : undefined
  );
  const searchResults: any[] = usersData?.users ?? [];

  const filteredResults = searchResults.filter(
    (u: any) => u.id !== user?.id && u.clerkId !== user?.id && !invitedIds.has(u.id)
  );

  const handleCreateTeam = useCallback(async () => {
    if (!teamName.trim()) return;
    try {
      const result = await registerTeam.mutateAsync({ name: teamName.trim() });
      const teamObj = result?.team || result;
      setCreatedTeam(teamObj);
      setStep("invite");
    } catch {
      // Error handled with toast in mutation hook
    }
  }, [teamName, registerTeam]);

  const handleInvite = useCallback(
    async (targetUser: any) => {
      if (invitedIds.has(targetUser.id)) return;
      const slotsUsed = currentMemberCount + invitedIds.size;
      if (slotsUsed >= maxSlots) return;
      try {
        await inviteMember.mutateAsync(targetUser.id);
        setInvitedIds((prev) => new Set([...prev, targetUser.id]));
      } catch {
        // Error handled with toast in mutation hook
      }
    },
    [invitedIds, inviteMember, currentMemberCount, maxSlots]
  );

  if (isLoading) {
    return (
      <LoadingScreen
        fullScreen={false}
        message="LOADING TOURNAMENT"
        subMessage="PREPARING REGISTRATION PORTAL..."
      />
    );
  }

  if (error || !tournament) {
    return (
      <Card className="max-w-xl mx-auto text-center p-8 space-y-4">
        <AlertCircle size={36} className="mx-auto text-ember" />
        <CardTitle className="text-xl">Tournament Not Found</CardTitle>
        <CardDescription>The tournament you are trying to register for cannot be found.</CardDescription>
        <Button variant="outline" asChild className="mx-auto">
          <Link to="/dashboard/tournaments">Browse Tournaments</Link>
        </Button>
      </Card>
    );
  }

  // If user is already registered in this tournament
  if (myExistingTeam && !loadingMyTeam && step !== "done") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-16">
        <Button variant="ghost" size="sm" asChild className="text-fog hover:text-snow">
          <Link to={`/dashboard/tournaments/${tournament.slug}`}>
            <ArrowLeft size={14} className="mr-1.5" />
            Back to {tournament.name}
          </Link>
        </Button>

        <Card className="border-lime/40 bg-surface p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-lime/10 border border-lime/30 text-lime flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-display text-snow font-bold">Already Registered</h2>
            <p className="text-sm text-fog">
              You are already registered for this tournament under squad{" "}
              <span className="text-snow font-semibold font-mono">"{myExistingTeam.name}"</span>.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button className="bg-lime text-ink hover:bg-lime/90 font-display" asChild>
              <Link to={`/dashboard/tournaments/${tournament.slug}`}>
                View Tournament & Squad
                <ArrowLeft size={14} className="ml-1.5 rotate-180" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const slotsUsed = currentMemberCount + invitedIds.size;
  const slotsRemaining = maxSlots - slotsUsed;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Top Back Navigation Option */}
      <div className="flex items-center justify-between">
        <Button
          id="back-to-tournament-btn"
          variant="ghost"
          size="sm"
          asChild
          className="text-fog hover:text-snow gap-1.5"
        >
          <Link to={`/dashboard/tournaments/${tournament.slug}`}>
            <ArrowLeft size={14} />
            Back to {tournament.name}
          </Link>
        </Button>

        <Badge variant="outline" className="font-mono text-xs">
          Registration Portal
        </Badge>
      </div>

      {/* Main Registration Container */}
      <Card className="bg-surface border-line shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-ember/10 rounded-full blur-3xl pointer-events-none" />

        <CardHeader className="border-b border-line pb-6 space-y-4">
          {/* Tournament Overview Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-background border border-line">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded bg-ember/10 text-ember border border-ember/20 shrink-0">
                <Gamepad2 size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-fog uppercase tracking-wider truncate">
                  {tournament.game?.name || "Esports"} • {tournament.format?.replace("_", " ")}
                </p>
                <h2 className="text-base font-display text-snow font-bold truncate">
                  {tournament.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {tournament.teamSize ?? 5} Players + 1 Sub
              </Badge>
              {tournament.prizePool && (
                <Badge variant="ember" className="font-mono text-xs">
                  {tournament.prizePool}
                </Badge>
              )}
            </div>
          </div>

          {/* Stepper Progress */}
          <RegisterStepper currentStep={step} />
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {step === "create" && (
            <RegisterStepCreate
              tournamentSlug={tournament.slug}
              teamName={teamName}
              setTeamName={setTeamName}
              maxSlots={maxSlots}
              isSubmitting={registerTeam.isPending}
              onSubmit={handleCreateTeam}
            />
          )}

          {step === "invite" && createdTeam && (
            <RegisterStepInvite
              createdTeam={createdTeam}
              maxSlots={maxSlots}
              slotsUsed={slotsUsed}
              slotsRemaining={slotsRemaining}
              memberSearch={memberSearch}
              setMemberSearch={setMemberSearch}
              searchLoading={searchLoading}
              filteredResults={filteredResults}
              searchResults={searchResults}
              invitedIds={invitedIds}
              inviteLoading={inviteMember.isPending}
              onInvite={handleInvite}
              onFinish={() => setStep("done")}
            />
          )}

          {step === "done" && (
            <RegisterStepDone
              tournamentSlug={tournament.slug}
              tournamentName={tournament.name}
              tournamentStatus={tournament.status}
              teamName={createdTeam?.name || teamName}
              captainUsername={user?.username}
              invitedCount={invitedIds.size}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
