import React from 'react';
import { Trophy, Clock, Swords } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface BracketParticipant {
  id?: string;
  name?: string;
  tag?: string;
  avatarUrl?: string;
  seed?: number;
  user?: {
    id?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
  };
  team?: {
    id?: string;
    name?: string;
    logoUrl?: string;
  };
}

export interface BracketMatch {
  id: string;
  tournamentId?: string;
  round: number;
  roundName?: string;
  matchNumber: number;
  p1Id?: string | null;
  p2Id?: string | null;
  participant1?: BracketParticipant | null;
  participant2?: BracketParticipant | null;
  score1?: number | null;
  score2?: number | null;
  winnerId?: string | null;
  status: string;
  scheduledAt?: string | null;
  completedAt?: string | null;
  notes?: string | null;
}

interface TournamentBracketProps {
  matches?: BracketMatch[] | any[];
  tournamentName?: string;
  className?: string;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({
  matches = [],
  tournamentName,
  className = '',
}) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="p-12 text-center border border-line rounded-lg bg-surface/50 space-y-3">
        <Trophy size={36} className="mx-auto text-fog/40" />
        <h4 className="text-base font-display text-snow">Bracket Not Generated Yet</h4>
        <p className="text-xs font-mono text-fog max-w-sm mx-auto">
          Match pairings and seeds will appear here automatically once registration closes and the tournament begins.
        </p>
      </div>
    );
  }

  // Group matches by round
  const roundsMap = new Map<number, BracketMatch[]>();
  matches.forEach((m) => {
    const roundNum = m.round || 1;
    if (!roundsMap.has(roundNum)) {
      roundsMap.set(roundNum, []);
    }
    roundsMap.get(roundNum)!.push(m);
  });

  const sortedRoundNumbers = Array.from(roundsMap.keys()).sort((a, b) => a - b);

  const getRoundLabel = (round: number, totalRounds: number, matchSample?: BracketMatch) => {
    if (matchSample?.roundName) return matchSample.roundName;
    if (round === totalRounds) return 'Grand Final';
    if (round === totalRounds - 1) return 'Semifinals';
    if (round === totalRounds - 2) return 'Quarterfinals';
    if (round === 1) return 'Round of 16 / Opening Round';
    return `Round ${round}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {tournamentName && (
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <div className="flex items-center gap-2">
            <Swords size={16} className="text-ember" />
            <span className="font-display text-sm tracking-wider uppercase text-snow">
              {tournamentName} — Tournament Bracket
            </span>
          </div>
          <span className="text-[11px] font-mono text-fog">
            {matches.length} Total Matches · {sortedRoundNumbers.length} Rounds
          </span>
        </div>
      )}

      {/* Bracket Tree Canvas */}
      <div className="overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-line scrollbar-track-ink">
        <div className="flex items-stretch gap-8 min-w-max px-2 py-4">
          {sortedRoundNumbers.map((roundNum) => {
            const roundMatches = roundsMap.get(roundNum) || [];
            const roundTitle = getRoundLabel(roundNum, sortedRoundNumbers.length, roundMatches[0]);

            return (
              <div key={roundNum} className="flex flex-col w-72 shrink-0">
                {/* Round Header */}
                <div className="mb-4 px-3 py-2 bg-ink border border-line rounded flex items-center justify-between">
                  <span className="text-xs font-display font-semibold tracking-wide text-snow uppercase">
                    {roundTitle}
                  </span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
                    R{roundNum} · {roundMatches.length} {roundMatches.length === 1 ? 'Match' : 'Matches'}
                  </Badge>
                </div>

                {/* Matches Column */}
                <div className="flex-1 flex flex-col justify-around gap-6">
                  {roundMatches.map((match) => {
                    const isLive = match.status === 'LIVE' || match.status === 'ONGOING';
                    const isCompleted = match.status === 'COMPLETED';

                    const p1 = match.participant1;
                    const p2 = match.participant2;

                    const p1Name =
                      p1?.name ||
                      p1?.team?.name ||
                      p1?.user?.displayName ||
                      p1?.user?.username ||
                      'TBD / Bye';
                    const p2Name =
                      p2?.name ||
                      p2?.team?.name ||
                      p2?.user?.displayName ||
                      p2?.user?.username ||
                      'TBD / Bye';

                    const p1Logo =
                      p1?.avatarUrl ||
                      p1?.team?.logoUrl ||
                      p1?.user?.avatarUrl;
                    const p2Logo =
                      p2?.avatarUrl ||
                      p2?.team?.logoUrl ||
                      p2?.user?.avatarUrl;

                    const isP1Winner = Boolean(
                      isCompleted &&
                        (match.winnerId === p1?.id ||
                          (match.score1 !== null &&
                            match.score2 !== null &&
                            match.score1 > match.score2))
                    );

                    const isP2Winner = Boolean(
                      isCompleted &&
                        (match.winnerId === p2?.id ||
                          (match.score1 !== null &&
                            match.score2 !== null &&
                            match.score2 > match.score1))
                    );

                    return (
                      <div
                        key={match.id}
                        className={`relative rounded-md border transition-all duration-200 overflow-hidden shadow-sm ${
                          isLive
                            ? 'border-ember bg-surface shadow-[0_0_15px_rgba(255,92,0,0.15)] ring-1 ring-ember/30'
                            : isCompleted
                            ? 'border-line bg-surface hover:border-line/90'
                            : 'border-line/60 bg-surface/60 opacity-85'
                        }`}
                      >
                        {/* Match Status Bar */}
                        <div className="px-3 py-1.5 bg-ink/70 border-b border-line flex items-center justify-between text-[10px] font-mono">
                          <span className="text-fog">M#{match.matchNumber}</span>
                          {isLive ? (
                            <span className="flex items-center gap-1.5 text-ember font-bold uppercase tracking-wider animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                              LIVE MATCH
                            </span>
                          ) : isCompleted ? (
                            <span className="flex items-center gap-1 text-lime font-medium uppercase tracking-wider">
                              <Trophy size={10} />
                              FINAL
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-fog">
                              <Clock size={10} />
                              SCHEDULED
                            </span>
                          )}
                        </div>

                        {/* Match Competitors */}
                        <div className="divide-y divide-line/60">
                          {/* Participant 1 */}
                          <div
                            className={`p-2.5 flex items-center justify-between transition-colors ${
                              isP1Winner
                                ? 'bg-lime/5 text-snow font-semibold'
                                : isCompleted && isP2Winner
                                ? 'text-fog/70 line-through opacity-70'
                                : 'text-snow'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              {p1?.seed && (
                                <span className="text-[10px] font-mono font-bold text-fog px-1 py-0.5 rounded bg-ink border border-line shrink-0">
                                  #{p1.seed}
                                </span>
                              )}
                              {p1Logo ? (
                                <img
                                  src={p1Logo}
                                  alt={p1Name}
                                  className="w-5 h-5 rounded object-cover border border-line shrink-0"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded bg-muted border border-line flex items-center justify-center text-[10px] font-bold text-fog shrink-0">
                                  {p1Name[0]}
                                </div>
                              )}
                              <span className="text-xs truncate font-medium">
                                {p1Name}
                              </span>
                            </div>

                            <span
                              className={`font-mono text-xs tabular-nums px-2 py-0.5 rounded shrink-0 ${
                                isP1Winner
                                  ? 'bg-lime text-ink font-bold'
                                  : isLive
                                  ? 'bg-ember/20 text-ember font-bold'
                                  : 'bg-ink text-fog'
                              }`}
                            >
                              {match.score1 !== null ? match.score1 : '-'}
                            </span>
                          </div>

                          {/* Participant 2 */}
                          <div
                            className={`p-2.5 flex items-center justify-between transition-colors ${
                              isP2Winner
                                ? 'bg-lime/5 text-snow font-semibold'
                                : isCompleted && isP1Winner
                                ? 'text-fog/70 line-through opacity-70'
                                : 'text-snow'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              {p2?.seed && (
                                <span className="text-[10px] font-mono font-bold text-fog px-1 py-0.5 rounded bg-ink border border-line shrink-0">
                                  #{p2.seed}
                                </span>
                              )}
                              {p2Logo ? (
                                <img
                                  src={p2Logo}
                                  alt={p2Name}
                                  className="w-5 h-5 rounded object-cover border border-line shrink-0"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded bg-muted border border-line flex items-center justify-center text-[10px] font-bold text-fog shrink-0">
                                  {p2Name[0]}
                                </div>
                              )}
                              <span className="text-xs truncate font-medium">
                                {p2Name}
                              </span>
                            </div>

                            <span
                              className={`font-mono text-xs tabular-nums px-2 py-0.5 rounded shrink-0 ${
                                isP2Winner
                                  ? 'bg-lime text-ink font-bold'
                                  : isLive
                                  ? 'bg-ember/20 text-ember font-bold'
                                  : 'bg-ink text-fog'
                              }`}
                            >
                              {match.score2 !== null ? match.score2 : '-'}
                            </span>
                          </div>
                        </div>

                        {/* Match Notes / Telemetry */}
                        {match.notes && (
                          <div className="px-3 py-1 bg-ink/40 border-t border-line/40 text-[10px] font-mono text-fog truncate">
                            {match.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
