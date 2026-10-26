import { Users, UserPlus, CheckCircle2, Crown, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface RegisterStepInviteProps {
  createdTeam: CreatedTeam;
  maxSlots: number;
  slotsUsed: number;
  slotsRemaining: number;
  memberSearch: string;
  setMemberSearch: (val: string) => void;
  searchLoading: boolean;
  filteredResults: any[];
  searchResults: any[];
  invitedIds: Set<string>;
  inviteLoading: boolean;
  onInvite: (user: any) => void;
  onFinish: () => void;
}

export function RegisterStepInvite({
  createdTeam,
  maxSlots,
  slotsUsed,
  slotsRemaining,
  memberSearch,
  setMemberSearch,
  searchLoading,
  filteredResults,
  searchResults,
  invitedIds,
  inviteLoading,
  onInvite,
  onFinish,
}: RegisterStepInviteProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2 text-center">
        <Badge className="bg-lime/20 text-lime border border-lime/30 font-mono text-xs">
          Team "{createdTeam.name}" Created
        </Badge>
        <h1 className="text-2xl md:text-3xl font-display text-snow font-bold flex items-center justify-center gap-2.5">
          <Users size={24} className="text-cyan" />
          Assemble Your Roster
        </h1>
        <p className="text-sm text-fog leading-relaxed">
          Search players by username to send team invitations. They will receive an invitation
          alert in their dashboard to accept or decline.
        </p>
      </div>

      {/* Slot tracker card */}
      <div className="p-4 rounded-lg bg-background border border-line space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-cyan" />
            <span className="text-sm text-snow font-semibold">Roster Capacity</span>
          </div>
          <span className="text-xs font-mono text-fog">
            {slotsUsed} / {maxSlots} Filled ({slotsRemaining} slots remaining)
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {Array.from({ length: maxSlots }).map((_, i) => (
            <div
              key={i}
              className={`h-8 flex-1 rounded-md border flex items-center justify-center text-xs font-mono transition-all ${
                i === 0
                  ? "border-ember bg-ember/20 text-ember font-bold"
                  : i < slotsUsed
                  ? "border-cyan bg-cyan/20 text-cyan font-semibold"
                  : "border-line bg-surface/50 text-fog/40"
              }`}
              title={i === 0 ? "Captain (You)" : i < slotsUsed ? "Invited Player" : "Open Slot"}
            >
              {i === 0 ? (
                <Crown size={12} className="text-ember" />
              ) : i < slotsUsed ? (
                <div className="w-2 h-2 rounded-full bg-cyan" />
              ) : (
                `#${i + 1}`
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Player Search Input */}
      {slotsRemaining > 0 ? (
        <div className="space-y-3">
          <label
            htmlFor="player-search"
            className="text-xs font-mono text-fog uppercase tracking-wider block"
          >
            Search Players
          </label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fog/60"
            />
            <Input
              id="player-search"
              placeholder="Type player username or name (min 2 chars)..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="bg-background border-line text-snow pl-10 h-11 placeholder:text-fog/50"
              autoFocus
            />
          </div>

          {/* Search Results Dropdown/Box */}
          {memberSearch.length >= 2 && (
            <div className="max-h-60 overflow-y-auto rounded-lg border border-line bg-background divide-y divide-line/60 shadow-xl">
              {searchLoading ? (
                <div className="flex items-center justify-center p-6 gap-2 text-fog">
                  <Loader2 size={16} className="animate-spin text-cyan" />
                  <span className="text-sm">Searching active players...</span>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="p-6 text-center text-sm text-fog">
                  No players found matching "{memberSearch}"
                </div>
              ) : (
                filteredResults.map((u: any) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={u.avatarUrl} />
                        <AvatarFallback className="bg-cyan/20 text-cyan text-xs">
                          {(u.displayName || u.username || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-snow truncate">
                          {u.displayName || `@${u.username}`}
                        </p>
                        <p className="text-xs text-fog font-mono truncate">@{u.username}</p>
                      </div>
                    </div>

                    <Button
                      id={`invite-user-${u.id}`}
                      size="sm"
                      variant="outline"
                      onClick={() => onInvite(u)}
                      disabled={inviteLoading || slotsRemaining <= 0}
                      className="shrink-0 gap-1.5 text-xs border-cyan/40 text-cyan hover:bg-cyan/10"
                    >
                      <UserPlus size={13} />
                      Invite
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-lime/10 border border-lime/30 flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-lime shrink-0" />
          <p className="text-sm text-lime">
            Maximum roster capacity reached ({maxSlots} players including substitute).
          </p>
        </div>
      )}

      {/* Invited Players List */}
      {invitedIds.size > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-mono text-fog uppercase tracking-wider">
            Invitations Sent ({invitedIds.size})
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(invitedIds).map((uid) => {
              const u = searchResults.find((r: any) => r.id === uid);
              return (
                <Badge key={uid} variant="secondary" className="gap-2 py-1 pl-1.5 pr-2.5">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={u?.avatarUrl} />
                    <AvatarFallback className="text-[8px] bg-cyan/20 text-cyan">
                      {(u?.displayName || u?.username || "U")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-mono text-xs">@{u?.username ?? uid.slice(0, 8)}</span>
                  <span className="text-[10px] text-yellow-400 font-mono">(Pending)</span>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-line">
        <Button
          id="skip-invite-btn"
          variant="ghost"
          onClick={onFinish}
          className="text-fog hover:text-snow"
        >
          Skip — Invite More Later
        </Button>

        <Button
          id="finish-reg-btn"
          onClick={onFinish}
          className="bg-lime text-ink hover:bg-lime/90 font-display px-6 h-11 gap-2"
        >
          <CheckCircle2 size={16} />
          Finish Registration
        </Button>
      </div>
    </div>
  );
}
