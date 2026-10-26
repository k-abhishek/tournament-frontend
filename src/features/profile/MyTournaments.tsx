import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useTournaments } from "@/hooks/useTournaments";
import {
  Trophy,
  Shield,
  Plus,
  Settings,
  ExternalLink,
  Crown,
  Gamepad2,
} from "lucide-react";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingScreen } from "@/components/custom/loading-screen";

export default function MyTournaments() {
  const { user, isLoaded } = useUser();
  const { data, isLoading } = useTournaments({
    includeDrafts: "true",
    limit: 50,
  });
  const [filter, setFilter] = useState<"hosted" | "moderating" | "all">(
    "hosted",
  );

  const tournaments = data?.tournaments || [];

  const currentUsername =
    user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0];
  const currentEmail = user?.primaryEmailAddress?.emailAddress;

  // Filter tournaments by user role
  const hostedTournaments = tournaments.filter(
    (t: any) =>
      t.organizerId === user?.id ||
      t.organizer?.id === user?.id ||
      t.organizer?.username === currentUsername ||
      t.organizer?.email === currentEmail,
  );

  const moderatedTournaments = tournaments.filter(
    (t: any) =>
      t.organizerId !== user?.id &&
      t.organizer?.username !== currentUsername &&
      t.moderators?.some(
        (m: any) =>
          m.userId === user?.id ||
          m.user?.id === user?.id ||
          m.user?.username === currentUsername ||
          m.user?.email === currentEmail,
      ),
  );

  const displayedTournaments =
    filter === "hosted"
      ? hostedTournaments
      : filter === "moderating"
        ? moderatedTournaments
        : tournaments;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Welcome Hero Card */}
      <Card className="relative overflow-hidden border-line">
        <div className="absolute right-0 top-0 w-96 h-96 bg-ember/10 rounded-full blur-3xl pointer-events-none" />

        <CardContent className="p-6 md:p-8 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <Badge variant="ember">Esports Management Console</Badge>
              <h1 className="text-3xl md:text-4xl font-display text-snow tracking-wide">
                {isLoaded && user
                  ? `Welcome, ${user.firstName || user.username || "Player"}`
                  : "Tournament Dashboard"}
              </h1>
              <CardDescription className="max-w-xl text-sm">
                Host competitions, appoint moderators to manage bracket
                schedules, and track active esports tournaments.
              </CardDescription>
            </div>

            <Button variant="ember" size="lg" asChild className="shrink-0">
              <Link to="/dashboard/tournaments/new">
                <Plus size={18} />
                Host Tournament
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* shadcn Tabs Filter */}
      <Tabs
        value={filter}
        onValueChange={(val: any) => setFilter(val)}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="hosted" className="flex items-center gap-2">
            <Crown size={15} className="text-ember" />
            Hosted by Me ({hostedTournaments.length})
          </TabsTrigger>

          <TabsTrigger value="moderating" className="flex items-center gap-2">
            <Shield size={15} className="text-cyan" />
            Moderating ({moderatedTournaments.length})
          </TabsTrigger>

          <TabsTrigger value="all" className="flex items-center gap-2">
            <Trophy size={15} />
            Explore All ({tournaments.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tournament Cards Grid */}
      {isLoading ? (
        <LoadingScreen
          fullScreen={false}
          message="SYNCING TOURNAMENTS"
          subMessage="FETCHING HOSTED & MODERATED COMPETITIONS..."
        />
      ) : displayedTournaments.length === 0 ? (
        <Card className="text-center p-12 space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-ember/10 border border-ember/20 text-ember flex items-center justify-center mx-auto">
            <Trophy size={24} />
          </div>
          <CardTitle className="text-xl">
            {filter === "hosted"
              ? "You haven't hosted any tournaments yet"
              : filter === "moderating"
                ? "No tournaments assigned to you as moderator"
                : "No tournaments found"}
          </CardTitle>
          <CardDescription className="max-w-sm mx-auto">
            {filter === "hosted"
              ? "Ready to organize your first esports competition? Click the button below to get started."
              : "When tournament admins appoint you as moderator, those events will show up here."}
          </CardDescription>

          {filter === "hosted" && (
            <Button variant="ember" asChild className="mx-auto mt-2">
              <Link to="/dashboard/tournaments/new">
                <Plus size={16} />
                Host First Tournament
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTournaments.map((t: any) => {
            const isUserCreator =
              t.organizerId === user?.id ||
              t.organizer?.id === user?.id ||
              t.organizer?.username === currentUsername;

            const isUserModerator = t.moderators?.some(
              (m: any) =>
                m.userId === user?.id ||
                m.user?.id === user?.id ||
                m.user?.username === currentUsername,
            );

            return (
              <Card
                key={t.id}
                className="hover:border-line/80 transition-all flex flex-col justify-between overflow-hidden group"
              >
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
                        <span className="text-[10px] uppercase block text-fog/70">
                          Format
                        </span>
                        <span className="text-snow">
                          {t.format?.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase block text-fog/70">
                          Prize Pool
                        </span>
                        <span className="text-ember font-semibold">
                          {t.prizePool || "Glory"}
                        </span>
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
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 px-2.5"
                    >
                      <Link
                        to={`/dashboard/tournaments/${t.slug}`}
                        title="View tournament"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </Button>

                    {(isUserCreator || isUserModerator) && (
                      <Button
                        variant="secondary"
                        size="sm"
                        asChild
                        className="h-8 px-3"
                      >
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
          })}
        </div>
      )}
    </div>
  );
}
