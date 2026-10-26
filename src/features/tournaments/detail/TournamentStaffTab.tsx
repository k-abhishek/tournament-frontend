import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TournamentStaffTabProps {
  tournament: any;
  canManage: boolean;
}

export function TournamentStaffTab({ tournament, canManage }: TournamentStaffTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-line pb-4">
        <div>
          <CardTitle>Tournament Staff</CardTitle>
          <CardDescription>
            Organizers and moderators responsible for match approvals, dispute resolution, and scheduling.
          </CardDescription>
        </div>
        {canManage && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/dashboard/tournaments/${tournament.slug}/manage`}>
              Edit Staff in Manage
            </Link>
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Creator Card */}
        <div className="flex items-center gap-3 p-4 rounded bg-background border border-ember/20">
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
          <div>
            <p className="text-sm font-semibold text-snow">
              {tournament.organizer?.displayName || `@${tournament.organizer?.username}`}
            </p>
            <p className="text-xs font-mono text-ember font-semibold">Tournament Admin (Creator)</p>
          </div>
        </div>

        {/* Moderators List */}
        {tournament.moderators?.map((mod: any) => (
          <div key={mod.id} className="flex items-center gap-3 p-4 rounded bg-background border border-line">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mod.user?.avatarUrl} alt={mod.user?.username} />
              <AvatarFallback className="bg-cyan/20 text-cyan">
                {(mod.user?.displayName || mod.user?.username || "M")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-snow">
                {mod.user?.displayName || `@${mod.user?.username}`}
              </p>
              <p className="text-xs font-mono text-cyan">Tournament Moderator</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
