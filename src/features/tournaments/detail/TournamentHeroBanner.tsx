import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Swords } from "lucide-react";

interface TournamentHeroBannerProps {
  tournament: any;
  isAlreadyRegistered: boolean;
  isCaptain: boolean;
}

export function TournamentHeroBanner({
  tournament,
  isAlreadyRegistered,
  isCaptain,
}: TournamentHeroBannerProps) {
  return (
    <Card className="overflow-hidden relative">
      {tournament.bannerUrl ? (
        <div className="h-48 w-full overflow-hidden relative">
          <img
            src={tournament.bannerUrl}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-r from-ember/20 via-cyan/10 to-surface border-b border-line" />
      )}

      <CardContent className="p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{tournament.game?.name || "Esports"}</Badge>
              <Badge
                variant={
                  tournament.status === "REGISTRATION_OPEN"
                    ? "lime"
                    : tournament.status === "ONGOING"
                    ? "cyan"
                    : tournament.status === "COMPLETED"
                    ? "outline"
                    : "ember"
                }
              >
                {tournament.status}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-snow tracking-wide">
              {tournament.name}
            </h1>
          </div>

          {/* Quick Registration Button */}
          {tournament.status === "REGISTRATION_OPEN" && (
            <div className="flex items-center gap-2">
              {isAlreadyRegistered ? (
                <Badge variant="lime" className="gap-1.5 px-3 py-1.5 text-sm">
                  <CheckCircle2 size={14} />
                  {isCaptain ? "You are registered (Captain)" : "You are registered"}
                </Badge>
              ) : (
                <Button
                  id="register-team-btn"
                  variant="default"
                  size="lg"
                  asChild
                  className="bg-lime text-ink hover:bg-lime/90 font-display gap-2"
                >
                  <Link to={`/dashboard/tournaments/${tournament.slug}/register`}>
                    <Swords size={16} />
                    Register Team
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-line">
          <div className="space-y-1">
            <span className="text-xs font-mono text-fog uppercase block">Format</span>
            <p className="text-sm font-semibold text-snow">
              {tournament.format?.replace("_", " ")}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-fog uppercase block">Prize Pool</span>
            <p className="text-sm font-semibold text-ember">
              {tournament.prizePool || "Glory & Prestige"}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-fog uppercase block">Slots / Teams</span>
            <p className="text-sm font-semibold text-snow">
              {tournament._count?.participants || 0} / {tournament.maxParticipants}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-fog uppercase block">Start Date</span>
            <p className="text-sm font-semibold text-snow">
              {new Date(tournament.startDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
