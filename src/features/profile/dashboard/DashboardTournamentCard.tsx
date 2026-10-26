import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Gamepad2, ExternalLink, Settings } from "lucide-react";

interface DashboardTournamentCardProps {
  tournament: any;
  currentUserId?: string;
  currentUsername?: string;
}

export function DashboardTournamentCard({
  tournament: t,
  currentUserId,
  currentUsername,
}: DashboardTournamentCardProps) {
  const isUserCreator =
    t.organizerId === currentUserId ||
    t.organizer?.id === currentUserId ||
    t.organizer?.username === currentUsername;

  const isUserModerator = t.moderators?.some(
    (m: any) =>
      m.userId === currentUserId ||
      m.user?.id === currentUserId ||
      m.user?.username === currentUsername,
  );

  return (
    <Card className="hover:border-line/80 transition-all flex flex-col justify-between overflow-hidden group">
      <div>
        <div className="p-4 border-b border-line bg-surface/50 flex items-center justify-between">
          <span className="eyebrow text-fog flex items-center gap-1.5">
            <Gamepad2 size={13} className="text-ember" />
            {t.game?.name || "Tournament"}
          </span>
          <Badge
            variant={
              t.status === "REGISTRATION_OPEN"
                ? "lime"
                : t.status === "ONGOING"
                ? "cyan"
                : t.status === "COMPLETED"
                ? "outline"
                : "ember"
            }
          >
            {t.status}
          </Badge>
        </div>

        <CardContent className="p-5 space-y-3">
          <CardTitle className="text-lg group-hover:text-ember transition-colors line-clamp-1">
            {t.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">
            {t.description || "No description provided."}
          </CardDescription>

          <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-mono text-fog">
            <div>
              <span className="text-[10px] uppercase block text-fog/70">Format</span>
              <span className="text-snow">{t.format?.replace("_", " ")}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase block text-fog/70">Prize Pool</span>
              <span className="text-ember font-semibold">{t.prizePool || "Glory"}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 bg-background border-t border-line flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isUserCreator ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-ember">
              <Crown size={12} />
              Admin (Creator)
            </span>
          ) : isUserModerator ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-cyan">
              <Shield size={12} />
              Moderator
            </span>
          ) : (
            <span className="text-[11px] font-mono text-fog">
              By @{t.organizer?.username || "admin"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="h-8 px-2.5">
            <Link to={`/dashboard/tournaments/${t.slug}`} title="View tournament">
              <ExternalLink size={14} />
            </Link>
          </Button>

          {(isUserCreator || isUserModerator) && (
            <Button variant="secondary" size="sm" asChild className="h-8 px-3">
              <Link to={`/dashboard/tournaments/${t.slug}/manage`}>
                <Settings size={13} className="mr-1" />
                Manage
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
