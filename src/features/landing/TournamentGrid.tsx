import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Trophy,
  Search,
  ExternalLink,
  GitFork,
  Gamepad2,
  Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { TournamentBracket } from '@/components/custom/TournamentBracket';
import { useTournaments, useGames, useBracket } from '@/hooks/useTournaments';

function BracketPreviewModal({
  tournament,
  onClose,
  onEnter,
}: {
  tournament: any;
  onClose: () => void;
  onEnter: (slug: string) => void;
}) {
  const { data: bracketData, isLoading } = useBracket(tournament.slug);
  const matches = bracketData?.bracket || [];
  const prizeFormatted = tournament.prizePool
    ? String(tournament.prizePool).startsWith('$')
      ? tournament.prizePool
      : `$${Number(tournament.prizePool).toLocaleString()}`
    : 'Glory';

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-surface border-line">
        <div className="space-y-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{tournament.game?.name || 'Tournament'}</Badge>
              <Badge
                variant={
                  tournament.status === 'ONGOING'
                    ? 'cyan'
                    : tournament.status === 'REGISTRATION_OPEN'
                    ? 'lime'
                    : 'outline'
                }
              >
                {tournament.status}
              </Badge>
            </div>
            <DialogTitle className="text-2xl">{tournament.name}</DialogTitle>
            <DialogDescription>
              Format: {tournament.format?.replace('_', ' ')} · Prize Pool: {prizeFormatted} · Organized by @{tournament.organizer?.username || 'admin'}
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-lg bg-ink border border-line">
            {isLoading ? (
              <div className="p-12 text-center text-xs font-mono text-fog">Loading bracket fixtures...</div>
            ) : (
              <TournamentBracket
                matches={matches}
                tournamentName={tournament.name}
              />
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-line">
            <span className="text-xs font-mono text-fog">
              Full registration & moderator controls available in the Arena view.
            </span>
            <Button
              variant="ember"
              size="sm"
              onClick={() => onEnter(tournament.slug)}
              className="font-mono text-xs"
            >
              Enter Full Tournament Arena <ExternalLink size={13} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function TournamentGrid() {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTournament, setPreviewTournament] = useState<any | null>(null);

  const { data: tournamentsData } = useTournaments({
    includeDrafts: 'false',
    limit: 24,
  });
  const { data: gamesData } = useGames();

  const allTournaments = tournamentsData?.tournaments || [];
  const gamesList = gamesData?.games || [];

  const gameOptions = [
    { label: 'All Games', value: 'ALL' },
    ...gamesList.map((g: any) => ({ label: g.name, value: g.slug })),
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Live Now', value: 'ONGOING' },
    { label: 'Open Registration', value: 'REGISTRATION_OPEN' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  const filteredTournaments = allTournaments.filter((t: any) => {
    const matchesGame = selectedGame === 'ALL' || t.game?.slug === selectedGame;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.game?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGame && matchesStatus && matchesSearch;
  });

  return (
    <section id="tournaments" className="py-24 bg-surface border-t border-line/60 relative">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-ember/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
              <span className="eyebrow text-ember">Competitive Registry</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-snow">
              FEATURED <span className="text-ember">TOURNAMENTS</span>
            </h2>
            <p className="text-fog font-mono text-sm uppercase tracking-wider mt-1">
              Explore active championships, live brackets, and open registrations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/tournaments')}
              className="font-mono text-xs text-snow hover:text-ember border-line"
            >
              Browse All In Explorer <ExternalLink size={13} className="ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-ink border border-line rounded-lg p-4 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={15} className="absolute left-3 top-2.5 text-fog" />
              <Input
                placeholder="Search tournaments or games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-surface border-line"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`px-3 py-1.5 rounded text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                    selectedStatus === opt.value
                      ? 'bg-ember text-ink font-bold shadow-sm'
                      : 'bg-surface text-fog hover:text-snow border border-line'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Game Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-line/60 scrollbar-none">
            <span className="text-[11px] font-mono text-fog uppercase mr-1 flex items-center gap-1 shrink-0">
              <Gamepad2 size={12} className="text-ember" /> Game:
            </span>
            {gameOptions.map((g) => (
              <button
                key={g.value}
                onClick={() => setSelectedGame(g.value)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  selectedGame === g.value
                    ? 'bg-snow/10 text-snow border border-ember font-semibold'
                    : 'text-fog hover:text-snow hover:bg-surface/80'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tournaments Grid */}
        {filteredTournaments.length === 0 ? (
          <div className="p-16 text-center border border-line rounded-lg bg-ink space-y-3">
            <Trophy size={36} className="mx-auto text-fog/40" />
            <h4 className="text-base font-display text-snow">No Tournaments Match Your Filter</h4>
            <p className="text-xs font-mono text-fog max-w-sm mx-auto">
              Try adjusting your search criteria or game filters to discover active competitions.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedGame('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((t: any) => {
              const isOngoing = t.status === 'ONGOING';
              const isOpen = t.status === 'REGISTRATION_OPEN';
              const isCompleted = t.status === 'COMPLETED';

              return (
                <div
                  key={t.id}
                  className="panel-surface group hover:-translate-y-1 hover:border-ember/50 hover:shadow-[0_12px_30px_-10px_rgba(255,92,0,0.15)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Banner Image or Stylized Header */}
                    <div className="h-40 relative overflow-hidden bg-ink border-b border-line">
                      <img
                        src={t.bannerUrl}
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

                      {/* Top Floating Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="font-mono text-[11px] uppercase tracking-wider font-bold bg-ink/90 backdrop-blur-md px-2.5 py-1 rounded text-snow border border-line flex items-center gap-1.5 shadow-sm">
                          <Gamepad2 size={12} className="text-ember" />
                          {t.game?.name || 'Tournament'}
                        </span>

                        <Badge
                          variant={
                            isOpen ? 'lime' : isOngoing ? 'cyan' : isCompleted ? 'outline' : 'ember'
                          }
                          className="shadow-sm font-mono text-[10px] tracking-wide"
                        >
                          {isOngoing && <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse mr-1" />}
                          {t.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Prize Pool Floating Badge */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-ink/90 border border-ember/30 text-ember px-2.5 py-0.5 rounded shadow-sm">
                          <Trophy size={11} />
                          {t.prizePool
                            ? String(t.prizePool).startsWith('$')
                              ? t.prizePool
                              : `$${Number(t.prizePool).toLocaleString()}`
                            : 'Glory'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-display text-xl text-snow group-hover:text-ember transition-colors line-clamp-1">
                          {t.name}
                        </h3>
                        <p className="text-fog text-xs line-clamp-2 mt-1 leading-relaxed">
                          {t.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Specs Matrix */}
                      <div className="pt-2 grid grid-cols-2 gap-2 text-xs font-mono border-t border-line/60">
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase text-fog block">Format</span>
                          <span className="text-snow font-medium text-xs">
                            {t.format.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase text-fog block">Slots / Teams</span>
                          <span className="text-snow font-medium text-xs">
                            {t._count?.participants ?? 0} / {t.maxParticipants} Registered
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase text-fog block">Start Date</span>
                          <span className="text-fog font-medium text-xs flex items-center gap-1">
                            <Calendar size={11} className="text-ember" />
                            {new Date(t.startDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] uppercase text-fog block">Organizer</span>
                          <span className="text-snow font-medium text-xs truncate block">
                            @{t.organizer?.username || 'admin'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 bg-ink/60 border-t border-line flex items-center justify-between gap-2 mt-2">
                    {/* Quick Bracket Preview Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTournament(t);
                      }}
                      className="h-8 text-xs font-mono text-fog hover:text-snow border-line flex items-center gap-1.5"
                    >
                      <GitFork size={13} className="text-cyan" />
                      Bracket ({t._count?.matches ?? 0})
                    </Button>

                    {/* View Tournament Link */}
                    <Button
                      variant="ember"
                      size="sm"
                      onClick={() => navigate(`/dashboard/tournaments/${t.slug}`)}
                      className="h-8 text-xs font-mono flex items-center gap-1 font-bold"
                    >
                      View Arena <ExternalLink size={12} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Global CTA Banner under the Grid */}
        <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-ember/15 via-surface to-cyan/10 border border-line flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-display text-snow flex items-center justify-center md:justify-start gap-2">
              <Sparkles size={20} className="text-ember" />
              HOST YOUR OWN COMPETITION
            </h3>
            <p className="text-sm text-fog max-w-xl">
              Create Single/Double Elimination brackets, configure moderator staff, and broadcast live tournament match results in minutes.
            </p>
          </div>

          <Button
            variant="ember"
            size="lg"
            onClick={() => navigate('/dashboard/tournaments/new')}
            className="shrink-0 font-display tracking-wide"
          >
            Create Tournament Now
          </Button>
        </div>
      </div>

      {/* Interactive Quick Bracket Preview Dialog */}
      {previewTournament && (
        <BracketPreviewModal
          tournament={previewTournament}
          onClose={() => setPreviewTournament(null)}
          onEnter={(slug) => {
            setPreviewTournament(null);
            navigate(`/dashboard/tournaments/${slug}`);
          }}
        />
      )}
    </section>
  );
}
