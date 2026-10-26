import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Crown,
  Search,
  CheckCircle2,
  Clock,
  Swords,
  Shield,
  X,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useTournamentTeams } from "@/hooks/useTournaments";

interface TournamentTeamsTabProps {
  tournament: any;
  myTeam?: any;
  currentUserId?: string;
  onRegisterClick?: () => void;
}

export function TournamentTeamsTab({
  tournament,
  myTeam,
  currentUserId,
  onRegisterClick,
}: TournamentTeamsTabProps) {
  const { data: teamsData, isLoading } = useTournamentTeams(tournament?.id);
  const teams: any[] = teamsData?.teams || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "full" | "my-team">("all");

  const teamSize = tournament?.teamSize ?? 5;
  const maxSlots = teamSize + 1; // Team size + 1 sub

  // Total participating players across all teams
  const totalPlayers = useMemo(() => {
    return teams.reduce((acc, t) => acc + (t.members?.length || 0), 0);
  }, [teams]);

  // Filtered teams based on search query and filter pills
  const filteredTeams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return teams.filter((t) => {
      // Filter type check
      if (filterType === "my-team" && t.id !== myTeam?.id) return false;
      if (filterType === "full") {
        const confirmedCount = t.members?.filter((m: any) => m.status === "ACCEPTED").length || 0;
        if (confirmedCount < teamSize) return false;
      }

      if (!q) return true;

      // Team name match
      if (t.name?.toLowerCase().includes(q)) return true;

      // Member name or username match
      const hasMemberMatch = t.members?.some(
        (m: any) =>
          m.user?.username?.toLowerCase().includes(q) ||
          m.user?.displayName?.toLowerCase().includes(q)
      );

      return hasMemberMatch;
    });
  }, [teams, searchQuery, filterType, myTeam?.id, teamSize]);

  return (
    <div className="space-y-6">
      {/* ── Top Header & Summary Card ── */}
      <Card className="border-line bg-surface/90">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="cyan" className="font-mono text-xs gap-1.5 py-1">
                  <Users size={13} />
                  {teams.length} / {tournament?.maxParticipants || "∞"} Teams Registered
                </Badge>
                <Badge variant="outline" className="font-mono text-xs text-fog py-1">
                  <UserCheck size={13} className="mr-1 text-lime" />
                  {totalPlayers} Total Players
                </Badge>
                <Badge variant="outline" className="font-mono text-xs text-fog py-1">
                  Format: {teamSize}v{teamSize}
                </Badge>
              </div>
              <h2 className="text-xl font-display text-snow pt-1 flex items-center gap-2">
                <Swords size={20} className="text-ember" />
                Registered Teams & Squad Rosters
              </h2>
              <CardDescription className="text-xs">
                Inspect registered teams, active rosters, appointed captains, and player seedings.
              </CardDescription>
            </div>

            {tournament?.status === "REGISTRATION_OPEN" && !myTeam && (
              <Button
                variant="default"
                size="sm"
                asChild
                className="bg-lime text-ink hover:bg-lime/90 font-display font-semibold gap-1.5 self-start md:self-center shrink-0"
              >
                <Link to={`/dashboard/tournaments/${tournament?.slug}/register`}>
                  <Swords size={14} />
                  Register Your Team
                </Link>
              </Button>
            )}
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 mt-5 border-t border-line">
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fog"
              />
              <Input
                placeholder="Search by team or player name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-9 bg-background border-line text-snow h-9 text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fog hover:text-snow cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant={filterType === "all" ? "ember" : "outline"}
                className="h-8 text-xs font-mono px-3"
                onClick={() => setFilterType("all")}
              >
                All Teams ({teams.length})
              </Button>
              <Button
                size="sm"
                variant={filterType === "full" ? "ember" : "outline"}
                className="h-8 text-xs font-mono px-3"
                onClick={() => setFilterType("full")}
              >
                Ready Rosters
              </Button>
              {myTeam && (
                <Button
                  size="sm"
                  variant={filterType === "my-team" ? "ember" : "outline"}
                  className="h-8 text-xs font-mono px-3 gap-1"
                  onClick={() => setFilterType("my-team")}
                >
                  <Crown size={12} className="text-ember" />
                  My Team
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Loading State ── */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse border-line bg-surface/50 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-surface/90" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-surface/90 rounded w-1/3" />
                  <div className="h-3 bg-surface/90 rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-line">
                <div className="h-8 bg-surface/90 rounded" />
                <div className="h-8 bg-surface/90 rounded" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && filteredTeams.length === 0 && (
        <Card className="border-line bg-surface/60 p-12 text-center space-y-4 max-w-lg mx-auto">
          <Shield size={36} className="mx-auto text-fog opacity-50" />
          <div className="space-y-1">
            <CardTitle className="text-base text-snow">No Teams Found</CardTitle>
            <CardDescription className="text-xs">
              {searchQuery
                ? `No registered teams or players matched "${searchQuery}".`
                : "No teams have registered for this tournament yet."}
            </CardDescription>
          </div>
          {searchQuery ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-xs font-mono"
            >
              Clear Search Query
            </Button>
          ) : (
            tournament?.status === "REGISTRATION_OPEN" && (
              <Button
                variant="default"
                size="sm"
                asChild
                className="bg-lime text-ink hover:bg-lime/90 font-display font-semibold gap-1.5"
              >
                <Link to={`/dashboard/tournaments/${tournament?.slug}/register`}>
                  <Swords size={14} />
                  Be the First Team to Register
                </Link>
              </Button>
            )
          )}
        </Card>
      )}

      {/* ── Teams & Rosters Grid ── */}
      {!isLoading && filteredTeams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTeams.map((team, index) => {
            const isCurrentUsersTeam = myTeam?.id === team.id;
            const members: any[] = team.members || [];
            const confirmedMembers = members.filter((m) => m.status === "ACCEPTED");
            const pendingMembers = members.filter((m) => m.status === "PENDING");
            const captain = members.find((m) => m.role === "CAPTAIN");
            const nonCaptainMembers = members.filter((m) => m.role !== "CAPTAIN");

            const slotsRemaining = Math.max(0, teamSize - confirmedMembers.length);

            return (
              <Card
                key={team.id}
                className={`transition-all overflow-hidden ${
                  isCurrentUsersTeam
                    ? "border-ember/60 bg-surface shadow-lg shadow-ember/5"
                    : "border-line bg-surface/80 hover:border-line/90"
                }`}
              >
                {/* Team Card Header */}
                <CardHeader className="p-4 md:p-5 border-b border-line/60 bg-background/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Team Avatar / Logo */}
                      <Avatar className="h-11 w-11 rounded-lg border border-line bg-surface shrink-0 shadow">
                        <AvatarImage src={team.logoUrl} alt={team.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-ember/30 to-cyan/20 text-snow font-display font-bold text-base">
                          {team.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-display text-snow font-bold truncate">
                            {team.name}
                          </h3>
                          {isCurrentUsersTeam && (
                            <Badge className="bg-ember/20 text-ember border-ember/40 text-[10px] font-mono py-0.5">
                              <Crown size={10} className="mr-1" />
                              Your Team
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-fog font-mono flex items-center gap-2 mt-0.5">
                          <span>Seed #{index + 1}</span>
                          <span>·</span>
                          <span>
                            {confirmedMembers.length} / {teamSize} Confirmed
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {confirmedMembers.length >= teamSize ? (
                        <Badge
                          variant="lime"
                          className="font-mono text-[11px] gap-1 px-2 py-0.5"
                        >
                          <CheckCircle2 size={11} />
                          Full Roster
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="font-mono text-[11px] text-yellow-400 border-yellow-500/30 gap-1 px-2 py-0.5"
                        >
                          <Clock size={11} />
                          {slotsRemaining} {slotsRemaining === 1 ? "Slot" : "Slots"} Open
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Team Card Content: Roster Breakdown */}
                <CardContent className="p-4 md:p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-fog border-b border-line/40 pb-2">
                    <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[11px]">
                      <Users size={12} className="text-cyan" />
                      Roster Members ({members.length})
                    </span>
                    {pendingMembers.length > 0 && (
                      <span className="text-yellow-400 text-[11px]">
                        {pendingMembers.length} Pending Invite
                      </span>
                    )}
                  </div>

                  {/* Empty roster notice */}
                  {members.length === 0 ? (
                    <div className="p-4 rounded border border-dashed border-line bg-background/50 text-center text-xs font-mono text-fog">
                      No members assigned to this squad yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Captain Row (if present) */}
                      {captain && (
                        <div className="flex items-center justify-between p-2.5 rounded-lg border border-ember/30 bg-ember/5 transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarImage src={captain.user?.avatarUrl} />
                              <AvatarFallback className="bg-ember/20 text-ember text-[10px]">
                                {(captain.user?.displayName || captain.user?.username || "C")[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-snow truncate flex items-center gap-1.5">
                                <span>{captain.user?.displayName || `@${captain.user?.username}`}</span>
                                <Crown size={11} className="text-ember shrink-0" />
                              </p>
                              <p className="text-[10px] font-mono text-fog truncate">
                                @{captain.user?.username}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge className="bg-ember/20 text-ember border-ember/30 text-[9px] font-mono uppercase px-1.5 py-0.5">
                              Captain
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[9px] font-mono text-lime border-lime/30 px-1.5 py-0.5"
                            >
                              Confirmed
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Other Members */}
                      {nonCaptainMembers.map((member) => {
                        const isPending = member.status === "PENDING";
                        const isConfirmed = member.status === "ACCEPTED";

                        return (
                          <div
                            key={member.id}
                            className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                              isPending
                                ? "border-yellow-500/20 bg-yellow-500/5 text-yellow-300"
                                : "border-line bg-background/60"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Avatar className="h-7 w-7 shrink-0">
                                <AvatarImage src={member.user?.avatarUrl} />
                                <AvatarFallback className="bg-cyan/20 text-cyan text-[10px]">
                                  {(member.user?.displayName || member.user?.username || "P")[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-snow truncate">
                                  {member.user?.displayName || `@${member.user?.username}`}
                                </p>
                                <p className="text-[10px] font-mono text-fog truncate">
                                  @{member.user?.username}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isPending ? (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] font-mono text-yellow-400 border-yellow-400/30 gap-1 px-1.5 py-0.5"
                                >
                                  <Clock size={8} className="animate-pulse" />
                                  Pending Invite
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] font-mono text-lime border-lime/30 gap-1 px-1.5 py-0.5"
                                >
                                  <CheckCircle2 size={8} />
                                  Confirmed
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Visual placeholder slots if squad is still filling */}
                      {Array.from({ length: Math.min(2, slotsRemaining) }).map((_, slotIdx) => (
                        <div
                          key={`empty-slot-${slotIdx}`}
                          className="flex items-center justify-between p-2 rounded border border-dashed border-line/60 bg-background/20 text-fog/50 text-[11px] font-mono"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-line" />
                            Open Squad Slot #{confirmedMembers.length + slotIdx + 1}
                          </span>
                          <span className="text-[10px] text-fog/40">Awaiting Roster Fill</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
