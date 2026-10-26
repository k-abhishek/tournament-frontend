import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowLeft, Crown } from "lucide-react";

interface RegisterStepDoneProps {
  tournamentSlug: string;
  tournamentName: string;
  tournamentStatus: string;
  teamName: string;
  captainUsername?: string;
  invitedCount: number;
}

export function RegisterStepDone({
  tournamentSlug,
  tournamentName,
  tournamentStatus,
  teamName,
  captainUsername,
  invitedCount,
}: RegisterStepDoneProps) {
  return (
    <div className="space-y-6 max-w-lg mx-auto text-center py-4">
      <div className="w-16 h-16 rounded-full bg-lime/10 border-2 border-lime text-lime flex items-center justify-center mx-auto shadow-lg shadow-lime/20">
        <CheckCircle2 size={32} />
      </div>

      <div className="space-y-2">
        <Badge variant="lime" className="font-mono text-xs uppercase tracking-wider">
          Registration Complete
        </Badge>
        <h1 className="text-3xl font-display text-snow font-bold">You&apos;re in the Arena!</h1>
        <p className="text-sm text-fog leading-relaxed">
          Team <span className="text-snow font-bold">"{teamName}"</span> is officially registered for{" "}
          <span className="text-snow font-semibold">{tournamentName}</span>.
        </p>
      </div>

      <div className="p-5 rounded-lg bg-background border border-line text-left space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <span className="text-xs font-mono text-fog uppercase">Captain</span>
          <span className="text-xs font-mono text-ember font-semibold flex items-center gap-1">
            <Crown size={12} /> @{captainUsername || "You"}
          </span>
        </div>
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <span className="text-xs font-mono text-fog uppercase">Roster Status</span>
          <span className="text-xs font-mono text-snow">
            {invitedCount > 0
              ? `1 Captain + ${invitedCount} Pending Invites`
              : "1 Captain (Roster open for invites)"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-fog uppercase">Tournament Status</span>
          <Badge variant="outline" className="text-[10px] font-mono">
            {tournamentStatus}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          id="return-to-tournament-btn"
          className="w-full sm:w-auto bg-lime text-ink hover:bg-lime/90 font-display px-6 h-11 gap-2"
          asChild
        >
          <Link to={`/dashboard/tournaments/${tournamentSlug}`}>
            <ArrowLeft size={16} />
            Return to Tournament Page
          </Link>
        </Button>

        <Button
          id="go-to-dashboard-btn"
          variant="outline"
          className="w-full sm:w-auto text-fog hover:text-snow h-11"
          asChild
        >
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
