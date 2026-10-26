import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Shield, CheckCircle2, Trash2, LogOut, UserPlus } from "lucide-react";

interface TournamentOverviewTabProps {
  tournament: any;
  myTeam: any;
  isAlreadyRegistered: boolean;
  isCaptain: boolean;
  onDisband: () => void;
  onWithdraw: () => void;
  isDisbanding: boolean;
  isWithdrawing: boolean;
  onSwitchToTeamTab?: () => void;
}

export function TournamentOverviewTab({
  tournament,
  myTeam,
  isAlreadyRegistered,
  isCaptain,
  onDisband,
  onWithdraw,
  isDisbanding,
  isWithdrawing,
  onSwitchToTeamTab,
}: TournamentOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Registered Team Callout Card */}
      {isAlreadyRegistered && myTeam && (
        <Card className="border-lime/40 bg-lime/5 p-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="lime" className="gap-1 font-mono text-xs">
                  <CheckCircle2 size={12} />
                  Your Registered Team
                </Badge>
                <span className="text-xs font-mono text-fog">
                  {isCaptain ? "You are the Team Captain" : "You are a Member"}
                </span>
              </div>
              <h3 className="text-xl font-display text-snow font-bold flex items-center gap-2">
                <Crown size={18} className="text-ember" />
                {myTeam.name}
              </h3>
              <p className="text-xs text-fog font-mono">
                {myTeam.members?.length || 0} roster members (
                {myTeam.members?.filter((m: any) => m.status === "ACCEPTED").length || 0} confirmed,{" "}
                {myTeam.members?.filter((m: any) => m.status === "PENDING").length || 0} pending)
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onSwitchToTeamTab && (
                <Button
                  id="overview-manage-team-btn"
                  variant="ember"
                  size="sm"
                  className="text-xs gap-1.5 font-mono"
                  onClick={onSwitchToTeamTab}
                >
                  <UserPlus size={13} />
                  {isCaptain ? "Invite Players & Manage Roster" : "View Team Roster"}
                </Button>
              )}
              {isCaptain ? (
                <Button
                  id="overview-disband-btn"
                  variant="outline"
                  size="sm"
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs gap-1.5"
                  onClick={onDisband}
                  disabled={isDisbanding}
                >
                  <Trash2 size={13} />
                  Disband Team
                </Button>
              ) : (
                <Button
                  id="overview-withdraw-btn"
                  variant="outline"
                  size="sm"
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs gap-1.5"
                  onClick={onWithdraw}
                  disabled={isWithdrawing}
                >
                  <LogOut size={13} />
                  Withdraw Candidacy
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Description & Tournament Admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tournament Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-fog whitespace-pre-line leading-relaxed">
              {tournament.description || "No description provided for this tournament."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Crown size={15} className="text-ember" />
              Tournament Admin
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded bg-background border border-line">
              <Avatar className="h-10 w-10">
                <AvatarImage src={tournament.organizer?.avatarUrl} alt="Organizer" />
                <AvatarFallback className="bg-ember/20 text-ember">
                  {(
                    tournament.organizer?.displayName ||
                    tournament.organizer?.username ||
                    "A"
                  )[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-snow truncate">
                  {tournament.organizer?.displayName || `@${tournament.organizer?.username}`}
                </p>
                <p className="text-xs font-mono text-ember font-semibold">Tournament Creator</p>
              </div>
            </div>

            {tournament.moderators?.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-line">
                <span className="text-xs font-mono text-fog uppercase block">
                  Appointed Moderators
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tournament.moderators.map((m: any) => (
                    <Badge key={m.id} variant="secondary" className="gap-1 py-1">
                      <Shield size={11} className="text-cyan" />
                      @{m.user?.username}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
