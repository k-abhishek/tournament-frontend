import { useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Crown,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Trash2,
  LogOut,
  Loader2,
} from "lucide-react";
import { useDisbandTeam, useRemoveTeamMember } from "@/hooks/useTournaments";

interface DashboardRegistrationCardProps {
  membership: any;
  currentUserId?: string;
}

export function DashboardRegistrationCard({
  membership,
  currentUserId,
}: DashboardRegistrationCardProps) {
  const { team } = membership;
  const tournament = team?.tournament;
  const members: any[] = team?.members ?? [];
  const confirmedCount = members.filter((m: any) => m.status === "ACCEPTED").length;
  const pendingCount = members.filter((m: any) => m.status === "PENDING").length;
  const isCaptain = membership.role === "CAPTAIN";

  const disbandMutation = useDisbandTeam(tournament?.id ?? "");
  const removeMemberMutation = useRemoveTeamMember(tournament?.id ?? "", team?.id ?? "");

  const handleDisband = useCallback(async () => {
    if (
      !window.confirm(
        `Are you sure you want to disband "${team?.name}"? This will withdraw your team from "${tournament?.name}" and cannot be undone.`
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
    <Card className="border-line bg-surface hover:border-line/80 transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Tournament Bar */}
        <div className="p-4 border-b border-line bg-surface/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <Trophy size={13} className="text-ember shrink-0" />
            <span className="text-xs font-mono text-snow font-semibold truncate">
              {tournament?.name}
            </span>
          </div>
          <Badge
            variant={
              tournament?.status === "REGISTRATION_OPEN"
                ? "lime"
                : tournament?.status === "ONGOING"
                ? "cyan"
                : "outline"
            }
            className="text-[10px] shrink-0 font-mono"
          >
            {tournament?.status?.replace("_", " ")}
          </Badge>
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Team Name & Role Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-display text-snow font-bold truncate">
                  {team?.name}
                </h3>
              </div>
              <p className="text-xs text-fog font-mono flex items-center gap-1">
                {isCaptain ? (
                  <span className="inline-flex items-center gap-1 text-ember font-semibold">
                    <Crown size={12} /> Team Captain
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-cyan font-semibold">
                    <Users size={12} /> Team Member
                  </span>
                )}
              </p>
            </div>

            {/* Status Badge */}
            <Badge
              className={`text-xs gap-1 shrink-0 ${
                isCaptain || membership.status === "ACCEPTED"
                  ? "bg-lime/20 text-lime border border-lime/30"
                  : membership.status === "PENDING"
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {isCaptain || membership.status === "ACCEPTED" ? (
                <CheckCircle2 size={11} />
              ) : membership.status === "PENDING" ? (
                <Clock size={11} />
              ) : (
                <XCircle size={11} />
              )}
              {isCaptain ? "CONFIRMED" : membership.status}
            </Badge>
          </div>

          {/* Member Roster Strip */}
          <div className="p-3 rounded-lg bg-background border border-line space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-fog">Roster Breakdown</span>
              <span className="text-snow">
                {confirmedCount} confirmed • {pendingCount} pending
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {members.slice(0, 6).map((m: any) => (
                  <Avatar
                    key={m.id}
                    className="h-7 w-7 border-2 border-surface"
                    title={`@${m.user?.username} (${m.role})`}
                  >
                    <AvatarImage src={m.user?.avatarUrl} />
                    <AvatarFallback
                      className={`text-[9px] ${
                        m.role === "CAPTAIN"
                          ? "bg-ember/30 text-ember"
                          : "bg-cyan/20 text-cyan"
                      }`}
                    >
                      {(m.user?.displayName || m.user?.username || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 6 && (
                  <div className="h-7 w-7 rounded-full bg-surface border-2 border-surface flex items-center justify-center text-[10px] text-fog font-mono">
                    +{members.length - 6}
                  </div>
                )}
              </div>

              <span className="text-xs text-fog font-mono">
                {members.length} / {(tournament?.teamSize ?? 5) + 1} max
              </span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Actions Footer */}
      <CardFooter className="p-4 bg-background border-t border-line flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1.5">
          <Link to={`/dashboard/tournaments/${tournament?.slug}`}>
            View Tournament
            <ArrowRight size={12} />
          </Link>
        </Button>

        {isCaptain ? (
          <Button
            id={`disband-${team?.id}`}
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
            id={`withdraw-${membership.id}`}
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
            Withdraw Candidacy
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
