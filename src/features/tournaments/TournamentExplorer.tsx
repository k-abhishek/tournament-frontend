import { useState } from "react";
import { Link } from "react-router-dom";
import { useTournaments, useGames } from "@/hooks/useTournaments";
import { Trophy, Search, Gamepad2, Plus, ExternalLink } from "lucide-react";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingScreen } from "@/components/custom/loading-screen";

export default function TournamentExplorer() {
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("ALL");
  const [selectedFormat, setSelectedFormat] = useState("ALL");

  const { data: gamesData } = useGames();
  const { data, isLoading } = useTournaments({
    search: search || undefined,
    game: selectedGame === "ALL" ? undefined : selectedGame,
    format: selectedFormat === "ALL" ? undefined : selectedFormat,
    includeDrafts: "false",
    limit: 24,
  });

  const tournaments = data?.tournaments || [];
  const games = gamesData?.games || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="text-3xl font-display text-snow tracking-wide">
            Explore Tournaments
          </h1>
          <p className="text-sm text-fog mt-0.5">
            Discover live competitions, open registrations, and community
            tournaments.
          </p>
        </div>

        <Button variant="ember" asChild>
          <Link to="/dashboard/tournaments/new">
            <Plus size={16} />
            Host Tournament
          </Link>
        </Button>
      </div>

      {/* Filter Bar with shadcn Input and Selects */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-2.5 text-fog" />
            <Input
              placeholder="Search tournaments by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="w-44">
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger>
                  <SelectValue placeholder="All Games" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Games</SelectItem>
                  {games.map((g: any) => (
                    <SelectItem key={g.id} value={g.slug}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-44">
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="All Formats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Formats</SelectItem>
                  <SelectItem value="SINGLE_ELIMINATION">
                    Single Elimination
                  </SelectItem>
                  <SelectItem value="DOUBLE_ELIMINATION">
                    Double Elimination
                  </SelectItem>
                  <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
                  <SelectItem value="SWISS">Swiss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {isLoading ? (
        <LoadingScreen
          fullScreen={false}
          message="SCANNING ARENA"
          subMessage="SEARCHING TOURNAMENT REGISTRY..."
          className="py-12"
        />
      ) : tournaments.length === 0 ? (
        <Card className="text-center p-12 space-y-3 max-w-md mx-auto">
          <Trophy size={32} className="mx-auto text-fog" />
          <CardTitle className="text-lg">No Tournaments Found</CardTitle>
          <CardDescription>
            Try adjusting your search criteria or create your own tournament.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t: any) => (
            <Link
              key={t.id}
              to={`/dashboard/tournaments/${t.slug}`}
              className="block group"
            >
              <Card className="h-full hover:border-ember/40 transition-all flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="p-4 border-b border-line/60 bg-surface/50 flex items-center justify-between">
                    <span className="eyebrow text-fog flex items-center gap-1">
                      <Gamepad2 size={12} className="text-ember" />
                      {t.game?.name || "Tournament"}
                    </span>
                    <Badge
                      variant={
                        t.status === "REGISTRATION_OPEN"
                          ? "lime"
                          : t.status === "ONGOING"
                            ? "cyan"
                            : "outline"
                      }
                    >
                      {t.status}
                    </Badge>
                  </div>

                  <CardContent className="p-5 space-y-2.5">
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
                          Prize
                        </span>
                        <span className="text-ember font-semibold">
                          {t.prizePool
                            ? String(t.prizePool).startsWith("$")
                              ? t.prizePool
                              : `$${Number(t.prizePool).toLocaleString()}`
                            : "Glory"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-4 bg-background border-t border-line flex items-center justify-between text-xs font-mono">
                  <span className="text-fog">
                    Host: @{t.organizer?.username || "admin"}
                  </span>
                  <span className="text-ember flex items-center gap-1 font-semibold group-hover:underline">
                    View <ExternalLink size={12} />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
