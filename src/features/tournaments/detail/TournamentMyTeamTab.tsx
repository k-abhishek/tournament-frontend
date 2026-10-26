import { useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Crown,
  CheckCircle2,
  Clock,
  Trash2,
  LogOut,
  UserMinus,
  UserPlus,
  Search,
  Loader2,
  Users,
  Shield,
  X,
  Sparkles,
} from "lucide-react";
import { useInviteTeamMember, useUsers } from "@/hooks/useTournaments";

interface TournamentMyTeamTabProps {
  tournament: any;
  myTeam: any;
  isCaptain: boolean;
  onDisband: () => void;
  onWithdraw: () => void;
  onKickMember: (userId: string, username: string) => void;
  isDisbanding: boolean;
  isWithdrawing: boolean;
  refetchMyTeam?: () => void;
}

export function TournamentMyTeamTab({
  tournament,
  myTeam,
  isCaptain,
  onDisband,
  onWithdraw,
  onKickMember,
  isDisbanding,
  isWithdrawing,
  refetchMyTeam,
}: TournamentMyTeamTabProps) {
  const { user: currentUser } = useUser();
  const [memberSearch, setMemberSearch] = useState("");
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);

  if (!myTeam) return null;

  const maxSlots = (tournament?.teamSize ?? 5) + 1; // Tournament team size + 1 substitute slot
  const members = myTeam.members || [];
  const confirmedMembers = members.filter((m: any) => m.status === "ACCEPTED");
  const pendingMembers = members.filter((m: any) => m.status === "PENDING");
  const slotsUsed = members.length;
  const slotsRemaining = Math.max(0, maxSlots - slotsUsed);

  // Invite mutation hook
  const inviteMember = useInviteTeamMember(tournament?.id ?? "", myTeam.id);

  // Fetch users: if search term provided use search, otherwise show suggested users
  const isSearching = memberSearch.trim().length >= 2;
  const { data: usersData, isLoading: searchLoading } = useUsers(
    isSearching
      ? { search: memberSearch.trim(), limit: 10 }
      : { limit: 8 }
  );

  const searchResults: any[] = usersData?.users ?? [];

  // Exclude current user and anyone already on the team (confirmed or pending)
  const existingUserIds = new Set<string>();
  if (currentUser?.id) existingUserIds.add(currentUser.id);

  members.forEach((m: any) => {
    if (m.userId) existingUserIds.add(m.userId);
    if (m.user?.id) existingUserIds.add(m.user.id);
    if (m.user?.clerkId) existingUserIds.add(m.user.clerkId);
    if (m.user?.username) existingUserIds.add(m.user.username.toLowerCase());
  });

  const availableUsers = searchResults.filter((u: any) => {
    if (existingUserIds.has(u.id)) return false;
    if (u.clerkId && existingUserIds.has(u.clerkId)) return false;
    if (u.username && existingUserIds.has(u.username.toLowerCase())) return false;
    return true;
  });

  const handleInvite = useCallback(
    async (targetUser: any) => {
      if (slotsRemaining <= 0 || invitingUserId) return;
      setInvitingUserId(targetUser.id);
      try {
        await inviteMember.mutateAsync(targetUser.id);
        setMemberSearch("");
        if (refetchMyTeam) {
          refetchMyTeam();
        }
      } catch {
        // Error toast is handled by useInviteTeamMember mutation hook
      } finally {
        setInvitingUserId(null);
      }
    },
    [slotsRemaining, invitingUserId, inviteMember, refetchMyTeam]
  );

  return (
    <div className="space-y-6">
      {/* ── 1. Team Header & Roster Capacity Card ── */}
      <Card className="border-line bg-surface/90">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2 text-xl font-display text-snow">
                <Crown size={20} className="text-ember" />
                {myTeam.name}
              </CardTitle>
              {isCaptain ? (
                <Badge className="bg-ember/20 text-ember border-ember/30 text-[10px] font-mono">
                  Captain
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] font-mono text-fog">
                  Member
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1">
              Your registered team for{" "}
              <span className="text-snow font-medium">
                {tournament?.name || "this tournament"}
              </span>
              .
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {isCaptain ? (
              <Button
                id="disband-team-btn"
                variant="outline"
                size="sm"
                className="border-red-500/40 text-red-400 hover:bg-red-500/10 gap-1.5 font-mono text-xs"
                onClick={onDisband}
                disabled={isDisbanding}
              >
                <Trash2 size={13} />
                Disband Team
              </Button>
            ) : (
              <Button
                id="withdraw-candidacy-btn"
                variant="outline"
                size="sm"
                className="border-red-500/40 text-red-400 hover:bg-red-500/10 gap-1.5 font-mono text-xs"
                onClick={onWithdraw}
                disabled={isWithdrawing}
              >
                <LogOut size={13} />
                Withdraw Candidacy
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Visual Roster Capacity Tracker */}
        <CardContent className="pt-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-fog flex items-center gap-1.5 font-semibold">
              <Users size={14} className="text-cyan" />
              ROSTER CAPACITY
            </span>
            <span className="text-snow font-bold">
              {slotsUsed} / {maxSlots} Slots Used{" "}
              <span className="text-fog font-normal">
                ({slotsRemaining} {slotsRemaining === 1 ? "slot" : "slots"} remaining)
              </span>
            </span>
          </div>

          {/* Slot Badges Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {Array.from({ length: maxSlots }).map((_, i) => {
              const member = members[i];
              const isCap = member?.role === "CAPTAIN";
              const isConfirmed = member?.status === "ACCEPTED";
              const isPending = member?.status === "PENDING";

              return (
                <div
                  key={i}
                  className={`p-2 rounded border flex items-center gap-2 text-xs font-mono transition-all ${
                    isCap
                      ? "border-ember bg-ember/10 text-snow"
                      : isConfirmed
                      ? "border-lime/40 bg-lime/5 text-snow"
                      : isPending
                      ? "border-yellow-500/40 bg-yellow-500/5 text-yellow-300"
                      : "border-dashed border-line/80 bg-background/50 text-fog/50"
                  }`}
                >
                  {isCap ? (
                    <Crown size={14} className="text-ember shrink-0" />
                  ) : isConfirmed ? (
                    <CheckCircle2 size={14} className="text-lime shrink-0" />
                  ) : isPending ? (
                    <Clock size={14} className="text-yellow-400 shrink-0 animate-pulse" />
                  ) : (
                    <span className="text-[10px] text-fog/60 shrink-0 font-bold">
                      #{i + 1}
                    </span>
                  )}

                  <span className="truncate font-medium text-[11px]">
                    {member
                      ? member.user?.displayName || `@${member.user?.username || "player"}`
                      : i === maxSlots - 1
                      ? "Sub Slot"
                      : "Open Slot"}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Two-Column Roster & Invites Grid ── */}
      <div
        className={`grid grid-cols-1 ${
          isCaptain ? "lg:grid-cols-2" : "max-w-3xl"
        } gap-6 items-start`}
      >
        {/* Left Column: Invite Teammates Section (Captain Only) */}
        {isCaptain && (
          <Card className="border-ember/30 bg-surface/90 shadow-sm">
            <CardHeader className="pb-3 border-b border-line/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg text-snow font-display">
                    <UserPlus size={18} className="text-ember" />
                    Invite Players to Team
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Search registered players to send an official team invite.
                  </CardDescription>
                </div>

                {slotsRemaining > 0 ? (
                  <Badge variant="lime" className="font-mono text-xs w-fit">
                    {slotsRemaining} {slotsRemaining === 1 ? "Slot" : "Slots"} Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="font-mono text-xs text-fog w-fit">
                    Roster Full
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {slotsRemaining > 0 ? (
                <div className="space-y-3">
                  {/* Search Input Bar */}
                  <div className="relative">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fog"
                    />
                    <Input
                      id="team-player-search"
                      placeholder="Search player by username or display name..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-10 pr-9 bg-background border-line text-snow h-10 text-xs"
                    />
                    {memberSearch && (
                      <button
                        type="button"
                        onClick={() => setMemberSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-fog hover:text-snow cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Header for results / suggested */}
                  <div className="flex items-center justify-between px-1 text-[11px] font-mono text-fog">
                    <span className="flex items-center gap-1">
                      {isSearching ? (
                        <>
                          <Search size={12} className="text-ember" />
                          SEARCH RESULTS ({availableUsers.length})
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} className="text-cyan" />
                          AVAILABLE PLAYERS ({availableUsers.length})
                        </>
                      )}
                    </span>
                    {searchLoading && (
                      <span className="flex items-center gap-1 text-ember">
                        <Loader2 size={11} className="animate-spin" />
                        Fetching...
                      </span>
                    )}
                  </div>

                  {/* Player List Box */}
                  <div className="rounded-lg border border-line bg-background divide-y divide-line/60 max-h-72 overflow-y-auto shadow-inner">
                    {searchLoading && availableUsers.length === 0 ? (
                      <div className="flex items-center justify-center p-6 gap-2 text-xs font-mono text-fog">
                        <Loader2 size={16} className="animate-spin text-ember" />
                        Searching registered platform players...
                      </div>
                    ) : availableUsers.length === 0 ? (
                      <div className="p-6 text-center text-xs font-mono text-fog">
                        {isSearching
                          ? `No available players found matching "${memberSearch}".`
                          : "No other registered players available to invite."}
                      </div>
                    ) : (
                      availableUsers.map((u: any) => {
                        const isInvitingThis = invitingUserId === u.id;

                        return (
                          <div
                            key={u.id}
                            className="flex items-center justify-between gap-3 p-3 hover:bg-surface/60 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={u.avatarUrl} />
                                <AvatarFallback className="bg-cyan/20 text-cyan text-xs">
                                  {(u.displayName || u.username || "P")[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-snow truncate">
                                  {u.displayName || `@${u.username}`}
                                </p>
                                <p className="text-[11px] font-mono text-fog truncate">
                                  @{u.username}
                                </p>
                              </div>
                            </div>

                            <Button
                              id={`invite-user-${u.id}`}
                              size="sm"
                              variant="ember"
                              className="h-8 text-xs font-mono gap-1.5 shrink-0 px-3"
                              onClick={() => handleInvite(u)}
                              disabled={Boolean(invitingUserId) || slotsRemaining <= 0}
                            >
                              {isInvitingThis ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  Inviting...
                                </>
                              ) : (
                                <>
                                  <UserPlus size={12} />
                                  Invite
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center rounded-lg border border-line bg-background space-y-2">
                  <Shield size={24} className="mx-auto text-ember opacity-80" />
                  <p className="text-sm font-semibold text-snow">Roster is at Max Capacity</p>
                  <p className="text-xs text-fog font-mono">
                    You have filled all {maxSlots} player slots (including reserve). Remove a member
                    or cancel a pending invite to invite another player.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Right Column: Current Team Roster List */}
        <Card className="border-line bg-surface/90">
          <CardHeader className="border-b border-line pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display text-snow flex items-center gap-2">
                <Users size={16} className="text-cyan" />
                Active Roster ({members.length} / {maxSlots})
              </CardTitle>
              <div className="flex items-center gap-2 font-mono text-xs text-fog">
                <span>{confirmedMembers.length} Confirmed</span>
                {pendingMembers.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-yellow-400">
                      {pendingMembers.length} Pending
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-2.5">
            {members.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-fog">
                No members found in this team.
              </div>
            ) : (
              members.map((member: any) => {
                const isCap = member.role === "CAPTAIN";
                const isPending = member.status === "PENDING";
                const isConfirmed = member.status === "ACCEPTED";

                return (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isCap
                        ? "border-ember/40 bg-ember/5"
                        : isPending
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : "border-line bg-background"
                    }`}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={member.user?.avatarUrl} />
                      <AvatarFallback
                        className={`text-xs ${
                          isCap
                            ? "bg-ember/20 text-ember"
                            : isPending
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-cyan/20 text-cyan"
                        }`}
                      >
                        {(member.user?.displayName || member.user?.username || "U")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-snow truncate">
                          {member.user?.displayName || `@${member.user?.username}`}
                        </p>
                        {isCap && (
                          <span className="text-[10px] font-mono text-ember uppercase font-bold tracking-wider">
                            (Captain)
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-fog">
                        @{member.user?.username}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPending && (
                        <Badge
                          variant="outline"
                          className="text-xs gap-1 text-yellow-400 border-yellow-400/30 font-mono"
                        >
                          <Clock size={10} className="animate-pulse" />
                          Pending Invite
                        </Badge>
                      )}
                      {isConfirmed && (
                        <Badge
                          variant="outline"
                          className="text-xs gap-1 text-lime border-lime/30 font-mono"
                        >
                          <CheckCircle2 size={10} />
                          Confirmed
                        </Badge>
                      )}
                      {isCap ? (
                        <Badge className="text-xs gap-1 bg-ember/20 text-ember border-ember/30 font-mono">
                          <Crown size={10} />
                          Captain
                        </Badge>
                      ) : (
                        isCaptain && (
                          <Button
                            id={`remove-member-${member.userId}`}
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs font-mono text-fog hover:text-red-400 hover:bg-red-500/10 gap-1 px-2.5"
                            onClick={() =>
                              onKickMember(
                                member.userId,
                                member.user?.displayName ||
                                  member.user?.username ||
                                  "member"
                              )
                            }
                            title={isPending ? "Cancel invitation" : "Remove member"}
                          >
                            <UserMinus size={13} />
                            {isPending ? "Cancel Invite" : "Remove"}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
