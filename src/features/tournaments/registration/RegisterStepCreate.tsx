import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";

interface RegisterStepCreateProps {
  tournamentSlug: string;
  teamName: string;
  setTeamName: (val: string) => void;
  maxSlots: number;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function RegisterStepCreate({
  tournamentSlug,
  teamName,
  setTeamName,
  maxSlots,
  isSubmitting,
  onSubmit,
}: RegisterStepCreateProps) {
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl md:text-3xl font-display text-snow font-bold flex items-center justify-center gap-2.5">
          <Shield size={24} className="text-ember" />
          Name Your Squad
        </h1>
        <p className="text-sm text-fog leading-relaxed">
          Enter your team brand. As the creator, you will be registered as{" "}
          <span className="text-ember font-semibold">Team Captain</span> with authority to
          manage the roster and invite up to{" "}
          <span className="text-lime font-semibold">{maxSlots - 1} teammates</span>.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <label
            htmlFor="team-name"
            className="text-xs font-mono text-fog uppercase tracking-wider block"
          >
            Team Name *
          </label>
          <Input
            id="team-name"
            placeholder="e.g. Sentinels, Team Liquid, Cloud9..."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
            className="bg-background border-line text-snow text-base h-12 placeholder:text-fog/50 focus:border-ember"
            maxLength={50}
            autoFocus
          />
          <div className="flex items-center justify-between text-xs text-fog/70 font-mono">
            <span>Choose a unique, recognizable team name</span>
            <span>{teamName.length}/50</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-background border border-line space-y-3">
          <p className="text-xs font-mono text-fog uppercase tracking-wider">
            Captain Responsibilities
          </p>
          <ul className="text-xs text-fog space-y-1.5 list-disc list-inside">
            <li>Submit match check-ins and evidence when matches commence</li>
            <li>Invite registered players or substitute members to your roster</li>
            <li>Disband or adjust squad members prior to registration closing</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-line">
        <Button
          id="cancel-reg-btn"
          variant="ghost"
          asChild
          className="text-fog hover:text-snow"
        >
          <Link to={`/dashboard/tournaments/${tournamentSlug}`}>
            <ArrowLeft size={14} className="mr-1.5" />
            Cancel & Return
          </Link>
        </Button>

        <Button
          id="create-team-btn"
          onClick={onSubmit}
          disabled={!teamName.trim() || isSubmitting}
          className="bg-ember hover:bg-ember/90 text-ink font-display px-6 h-11 gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Registering Squad...
            </>
          ) : (
            <>
              Create Team & Continue
              <ChevronRight size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
