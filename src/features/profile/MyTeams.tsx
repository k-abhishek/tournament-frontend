import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  useMyTeamMemberships,
  useMyPendingInvites,
  useRespondToInvite,
  useDisbandTeam,
  useRemoveTeamMember,
} from "@/hooks/useTournaments";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Swords,
  Bell,
  Trophy,
  ArrowRight,
  Trash2,
  LogOut,
  Loader2,
} from "lucide-react";

export default function MyTeams() {
  const { user } = useUser();
  const { data: membershipsData, isLoading: membershipsLoading } = useMyTeamMemberships();
  const { data: invitesData, isLoading: invitesLoading } = useMyPendingInvites();

  const memberships: any[] = membershipsData?.memberships ?? [];
  const pendingInvites: any[] = invitesData?.invites ?? [];

  const captainTeams = memberships.filter((m) => m.role === "CAPTAIN");
  const memberTeams = memberships.filter((m) => m.role !== "CAPTAIN");

  const pendingCount = pendingInvites.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-display text-snow tracking-wide flex items-center gap-3">
          <Swords size={26} className="text-ember" />
          My Teams & Registrations
        </h1>
        <p className="text-fog text-sm">
          Manage your tournament teams, rosters, invitations, and active candidacies.
        </p>
      </div>

      <Tabs defaultValue={pendingCount > 0 ? "invites" : "my-teams"} className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-teams" className="flex items-center gap-2">
            <Users size={14} />
            My Teams ({memberships.length})
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center gap-2 relative">
            <Bell size={14} />
            Invitations
            {pendingCount > 0 && (
              <Badge className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-ember text-ink rounded-full">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: My Teams ───────────────────────────────────────── */}
        <TabsContent value="my-teams" className="space-y-6">
          {membershipsLoading ? (
            <TeamListSkeleton />
          ) : memberships.length === 0 ? (
            <EmptyTeams />
          ) : (
            <>
              {/* Teams where I am captain */}
              {captainTeams.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-mono text-fog uppercase tracking-wider flex items-center gap-1.5">
                    <Crown size={13} className="text-ember" /> Captaining ({captainTeams.length})
                  </h2>
                  {captainTeams.map((m) => (
                    <TeamCard
                      key={m.id}
                      membership={m}
                      isCaptain={true}
                      currentUserId={user?.id}
                    />
                  ))}
                </section>
              )}

              {/* Teams where I am a member */}
              {memberTeams.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-mono text-fog uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={13} className="text-cyan" /> Member of ({memberTeams.length})
                  </h2>
                  {memberTeams.map((m) => (
                    <TeamCard
                      key={m.id}
                      membership={m}
                      isCaptain={false}
                      currentUserId={user?.id}
                    />
                  ))}
                </section>
              )}
            </>
          )}
        </TabsContent>

        {/* ── Tab 2: Pending Invitations ───────────────────────────── */}
        <TabsContent value="invites" className="space-y-4">
          {invitesLoading ? (
            <TeamListSkeleton />
          ) : pendingInvites.length === 0 ? (
            <EmptyInvites />
          ) : (
            pendingInvites.map((invite) => (
              <InviteCard key={invite.id} invite={invite} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────

interface TeamCardProps {
  membership: any;
  isCaptain: boolean;
  currentUserId?: string;
}

function TeamCard({ membership, isCaptain, currentUserId }: TeamCardProps) {
  const { team } = membership;
  const tournament = team?.tournament;
  const members: any[] = team?.members ?? [];
  const confirmedCount = members.filter((m) => m.status === "ACCEPTED").length;
  const pendingCount = members.filter((m) => m.status === "PENDING").length;

  const disbandMutation = useDisbandTeam(tournament?.id ?? "");
  const removeMemberMutation = useRemoveTeamMember(tournament?.id ?? "", team?.id ?? "");

  const handleDisband = useCallback(async () => {
    if (
      !window.confirm(
        `Are you sure you want to disband "${team?.name}"? This cannot be undone and unregisters the team from "${tournament?.name}".`
      )
    ) {
      return;
    }
    await disbandMutation.mutateAsync(team?.id);
  }, [team?.name, team?.id, tournament?.name, disbandMutation]);

  const handleWithdraw = useCallback(async () => {
    if (
      !window.confirm(
        `Are you sure you want to withdraw your candidacy from "${team?.name}" in "${tournament?.name}"?`
      )
    ) {
      return;
    }
    if (currentUserId) {
      await removeMemberMutation.mutateAsync(currentUserId);
    }
  }, [team?.name, tournament?.name, currentUserId, removeMemberMutation]);

  return (
    <Card className="border-line bg-surface hover:border-ember/40 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-display text-snow font-semibold truncate">
                {team?.name}
              </h3>
              {isCaptain && (
                <Badge className="text-xs gap-1 bg-ember/20 text-ember border border-ember/30 shrink-0">
                  <Crown size={10} />
                  Captain
                </Badge>
              )}
              {!isCaptain && (
                <Badge
                  className={`text-xs gap-1 shrink-0 ${
                    membership.status === "ACCEPTED"
                      ? "bg-lime/20 text-lime border border-lime/30"
                      : membership.status === "PENDING"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {membership.status === "ACCEPTED" ? (
                    <CheckCircle2 size={10} />
                  ) : membership.status === "PENDING" ? (
                    <Clock size={10} />
                  ) : (
                    <XCircle size={10} />
                  )}
                  {membership.status}
                </Badge>
              )}
            </div>
            {tournament && (
              <p className="text-xs text-fog font-mono flex items-center gap-1.5">
                <Trophy size={11} className="text-ember/70" />
                {tournament.name}
                <Badge variant="outline" className="text-[10px] font-mono ml-1">
                  {tournament.status?.replace("_", " ")}
                </Badge>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCaptain ? (
              <Button
                id={`disband-myteams-${team?.id}`}
                variant="outline"
                size="sm"
                onClick={handleDisband}
                disabled={disbandMutation.isPending}
                className="text-xs h-8 border-red-500/40 text-red-400 hover:bg-red-500/10 gap-1.5"
              >
                {disbandMutation.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                Disband Team
              </Button>
            ) : (
              <Button
                id={`withdraw-myteams-${membership.id}`}
                variant="outline"
                size="sm"
                onClick={handleWithdraw}
                disabled={removeMemberMutation.isPending}
                className="text-xs h-8 border-red-500/40 text-red-400 hover:bg-red-500/10 gap-1.5"
              >
                {removeMemberMutation.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <LogOut size={12} />
                )}
                Withdraw
              </Button>
            )}

            {tournament && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 gap-1.5 text-xs"
              >
                <Link to={`/dashboard/tournaments/${tournament.slug}`}>
                  View Tournament
                  <ArrowRight size={12} />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Member roster mini strip */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m: any) => (
              <Avatar
                key={m.id}
                className="h-7 w-7 border-2 border-surface"
                title={m.user?.username}
              >
                <AvatarImage src={m.user?.avatarUrl} />
                <AvatarFallback
                  className={`text-[10px] ${
                    m.role === "CAPTAIN" ? "bg-ember/30 text-ember" : "bg-cyan/20 text-cyan"
                  }`}
                >
                  {(m.user?.displayName || m.user?.username || "?")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 5 && (
              <div className="h-7 w-7 rounded-full bg-surface border-2 border-surface flex items-center justify-center text-[10px] text-fog font-mono">
                +{members.length - 5}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-fog font-mono">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={11} className="text-lime" />
              {confirmedCount} confirmed
            </span>
            {pendingCount > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-yellow-400" />
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InviteCard({ invite }: { invite: any }) {
  const { team, id: membershipId } = invite;
  const tournament = team?.tournament;
  const captain = team?.members?.find((m: any) => m.role === "CAPTAIN");

  const respond = useRespondToInvite(tournament?.id ?? "", team?.id ?? "");

  return (
    <Card className="border-cyan/30 bg-surface/80 hover:border-cyan/50 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center shrink-0">
            <Users size={18} className="text-cyan" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-semibold text-snow">
              You&apos;ve been invited to{" "}
              <span className="text-cyan">{team?.name}</span>
            </p>
            {tournament && (
              <p className="text-xs text-fog font-mono flex items-center gap-1.5">
                <Trophy size={11} className="text-ember/70" />
                {tournament.name}
              </p>
            )}
            {captain && (
              <p className="text-xs text-fog flex items-center gap-1.5">
                <Crown size={11} className="text-ember/70" />
                Captain: @{captain.user?.username}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 justify-end">
          <Button
            id={`decline-${membershipId}`}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-red-500/40 text-red-400 hover:bg-red-500/10"
            onClick={() => respond.mutate("decline")}
            disabled={respond.isPending}
          >
            <XCircle size={13} />
            Decline
          </Button>
          <Button
            id={`accept-${membershipId}`}
            size="sm"
            className="gap-1.5 text-xs bg-lime text-ink hover:bg-lime/90 font-display"
            onClick={() => respond.mutate("accept")}
            disabled={respond.isPending}
          >
            <CheckCircle2 size={13} />
            Accept Invitation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyTeams() {
  return (
    <Card className="border-dashed border-line">
      <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-ember/10 border border-ember/20 flex items-center justify-center">
          <Swords size={24} className="text-ember/60" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg text-snow">No team registrations yet</CardTitle>
          <CardDescription>
            Register a team for a tournament to get started. Browse active tournaments and look for
            the &quot;Register Team&quot; button.
          </CardDescription>
        </div>
        <Button variant="outline" asChild className="gap-2 mt-2">
          <Link to="/dashboard/tournaments">
            Browse Tournaments
            <ArrowRight size={14} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyInvites() {
  return (
    <Card className="border-dashed border-line">
      <CardContent className="py-14 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-cyan/10 border border-cyan/20 flex items-center justify-center">
          <Bell size={20} className="text-cyan/60" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base text-snow">No pending invitations</CardTitle>
          <CardDescription className="text-sm">
            Team captains can invite you to their tournament teams. Check back here for new
            invitations.
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <Card key={i} className="border-line">
          <CardContent className="p-5 space-y-3">
            <div className="h-5 w-48 bg-surface rounded animate-pulse" />
            <div className="h-3 w-72 bg-surface rounded animate-pulse" />
            <div className="h-7 flex gap-1">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-7 w-7 rounded-full bg-surface animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}