import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRespondToInvite } from "@/hooks/useTournaments";

interface DashboardInviteCardProps {
  invite: any;
}

export function DashboardInviteCard({ invite }: DashboardInviteCardProps) {
  const { team, id: membershipId } = invite;
  const tournament = team?.tournament;
  const captain = team?.members?.find((m: any) => m.role === "CAPTAIN");

  const respond = useRespondToInvite(tournament?.id ?? "", team?.id ?? "");

  return (
    <div className="p-3.5 rounded-lg bg-background border border-cyan/30 flex flex-col justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-snow truncate">
            Invite to <span className="text-cyan font-bold">{team?.name}</span>
          </p>
          <Badge
            variant="outline"
            className="text-[10px] font-mono shrink-0 text-cyan border-cyan/40"
          >
            Pending
          </Badge>
        </div>
        {tournament && (
          <p className="text-xs text-fog font-mono flex items-center gap-1 truncate">
            <Trophy size={11} className="text-ember shrink-0" />
            {tournament.name}
          </p>
        )}
        {captain && (
          <p className="text-xs text-fog flex items-center gap-1.5 pt-0.5">
            <Avatar className="h-4 w-4">
              <AvatarImage src={captain.user?.avatarUrl} />
              <AvatarFallback className="text-[8px] bg-ember/20 text-ember">
                {(captain.user?.username || "C")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-mono text-snow/90">Captain: @{captain.user?.username}</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 justify-end pt-1">
        <Button
          id={`dashboard-decline-${membershipId}`}
          variant="outline"
          size="sm"
          className="h-7 text-xs border-red-500/40 text-red-400 hover:bg-red-500/10 gap-1"
          onClick={() => respond.mutate("decline")}
          disabled={respond.isPending}
        >
          <XCircle size={12} />
          Decline
        </Button>
        <Button
          id={`dashboard-accept-${membershipId}`}
          size="sm"
          className="h-7 text-xs bg-lime text-ink hover:bg-lime/90 font-display gap-1"
          onClick={() => respond.mutate("accept")}
          disabled={respond.isPending}
        >
          <CheckCircle2 size={12} />
          Accept
        </Button>
      </div>
    </div>
  );
}
