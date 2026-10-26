import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Clock, Swords, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReportMatchResult, useUpdateMatch } from '@/hooks/useTournaments';
import { useBracketStore } from '@/stores/bracketStore';
import type { BracketMatch } from '@/components/custom/TournamentBracket';

interface MatchEditorModalProps {
  tournamentSlug?: string;
  onSuccess?: () => void;
}

export const MatchEditorModal: React.FC<MatchEditorModalProps> = ({
  tournamentSlug,
  onSuccess,
}) => {
  const { selectedMatch, isModalOpen, closeMatchModal, updateMatchData } = useBracketStore();

  const reportMutation = useReportMatchResult(tournamentSlug);
  const updateMutation = useUpdateMatch(tournamentSlug);

  const [score1, setScore1] = useState<number | ''>('');
  const [score2, setScore2] = useState<number | ''>('');
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('SCHEDULED');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (selectedMatch) {
      setScore1(selectedMatch.score1 !== null && selectedMatch.score1 !== undefined ? selectedMatch.score1 : '');
      setScore2(selectedMatch.score2 !== null && selectedMatch.score2 !== undefined ? selectedMatch.score2 : '');
      setWinnerId(selectedMatch.winnerId || null);
      setStatus(selectedMatch.status || 'SCHEDULED');
      setNotes(selectedMatch.notes || '');
    }
  }, [selectedMatch]);

  if (!isModalOpen || !selectedMatch) return null;

  const p1 = selectedMatch.participant1;
  const p2 = selectedMatch.participant2;

  const p1Name = p1?.name || p1?.team?.name || p1?.user?.displayName || p1?.user?.username || 'Participant 1 (TBD)';
  const p2Name = p2?.name || p2?.team?.name || p2?.user?.displayName || p2?.user?.username || 'Participant 2 (TBD)';

  const handleScore1Change = (val: string) => {
    const num = val === '' ? '' : parseInt(val, 10);
    setScore1(num);

    // Auto-detect winner if numbers provided
    if (typeof num === 'number' && typeof score2 === 'number') {
      if (num > score2 && p1?.id) {
        setWinnerId(p1.id);
      } else if (score2 > num && p2?.id) {
        setWinnerId(p2.id);
      }
    }
  };

  const handleScore2Change = (val: string) => {
    const num = val === '' ? '' : parseInt(val, 10);
    setScore2(num);

    if (typeof score1 === 'number' && typeof num === 'number') {
      if (score1 > num && p1?.id) {
        setWinnerId(p1.id);
      } else if (num > score1 && p2?.id) {
        setWinnerId(p2.id);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, unknown> = {
      score1: score1 === '' ? null : Number(score1),
      score2: score2 === '' ? null : Number(score2),
      winnerId: winnerId || null,
      status,
      notes: notes.trim() || null,
    };

    // If marked completed, winner is required if participants exist
    if (status === 'COMPLETED' && !winnerId && p1?.id && p2?.id) {
      if (typeof score1 === 'number' && typeof score2 === 'number') {
        if (score1 > score2) payload.winnerId = p1.id;
        else if (score2 > score1) payload.winnerId = p2.id;
      }
    }

    try {
      if (status === 'COMPLETED' || winnerId) {
        await reportMutation.mutateAsync({
          matchId: selectedMatch.id,
          payload,
        });
      } else {
        await updateMutation.mutateAsync({
          matchId: selectedMatch.id,
          payload,
        });
      }

      // Optimistic update in client store
      updateMatchData(selectedMatch.id, payload as Partial<BracketMatch>);
      closeMatchModal();
      onSuccess?.();
    } catch {
      // toast notification handled inside mutation hook
    }
  };

  const isSaving = reportMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-surface border border-line rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-ink/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords size={18} className="text-ember" />
            <div>
              <h3 className="text-base font-display font-semibold text-snow">
                Match #{selectedMatch.matchNumber} Flow Coordinator
              </h3>
              <p className="text-xs font-mono text-fog">
                {selectedMatch.roundName || `Round ${selectedMatch.round}`} · Update live progression
              </p>
            </div>
          </div>

          <button
            onClick={closeMatchModal}
            className="p-1 rounded-md text-fog hover:text-snow hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-fog uppercase tracking-wider block">
              Match Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'SCHEDULED', label: 'Scheduled', icon: Clock, color: 'text-fog border-line' },
                { id: 'LIVE', label: 'Live', icon: Flame, color: 'text-ember border-ember/40 bg-ember/10' },
                { id: 'COMPLETED', label: 'Final', icon: Trophy, color: 'text-lime border-lime/40 bg-lime/10' },
                { id: 'CANCELLED', label: 'Cancelled', icon: AlertCircle, color: 'text-red-400 border-red-500/40 bg-red-500/10' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = status === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatus(item.id)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-mono flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? `${item.color} ring-1 ring-ember/60 font-bold shadow-sm`
                        : 'border-line/70 bg-ink/30 text-fog hover:text-snow hover:border-line'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Competitors & Scoring */}
          <div className="space-y-3">
            <label className="text-xs font-mono text-fog uppercase tracking-wider block">
              Scoreboard & Winner Determination
            </label>

            {/* Participant 1 Row */}
            <div
              className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-4 ${
                winnerId === p1?.id
                  ? 'border-lime bg-lime/5 ring-1 ring-lime/30'
                  : 'border-line bg-ink/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {p1?.seed && (
                  <span className="text-[10px] font-mono font-bold text-fog px-1.5 py-0.5 rounded bg-surface border border-line">
                    #{p1.seed}
                  </span>
                )}
                <span className="text-sm font-semibold text-snow truncate">{p1Name}</span>
                {winnerId === p1?.id && (
                  <Badge variant="lime" className="text-[10px] py-0 px-1.5">
                    Winner
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="0"
                  value={score1}
                  onChange={(e) => handleScore1Change(e.target.value)}
                  className="w-14 text-center font-mono text-base font-bold bg-surface border border-line rounded px-2 py-1 text-snow focus:outline-none focus:border-ember"
                />
                {p1?.id && (
                  <Button
                    type="button"
                    size="sm"
                    variant={winnerId === p1.id ? 'emerald' : 'outline'}
                    onClick={() => {
                      setWinnerId(p1.id!);
                      if (status !== 'COMPLETED') setStatus('COMPLETED');
                    }}
                    className="h-8 px-2.5 text-xs font-mono"
                  >
                    <CheckCircle2 size={12} className="mr-1" />
                    Win
                  </Button>
                )}
              </div>
            </div>

            {/* Participant 2 Row */}
            <div
              className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-4 ${
                winnerId === p2?.id
                  ? 'border-lime bg-lime/5 ring-1 ring-lime/30'
                  : 'border-line bg-ink/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {p2?.seed && (
                  <span className="text-[10px] font-mono font-bold text-fog px-1.5 py-0.5 rounded bg-surface border border-line">
                    #{p2.seed}
                  </span>
                )}
                <span className="text-sm font-semibold text-snow truncate">{p2Name}</span>
                {winnerId === p2?.id && (
                  <Badge variant="lime" className="text-[10px] py-0 px-1.5">
                    Winner
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="0"
                  value={score2}
                  onChange={(e) => handleScore2Change(e.target.value)}
                  className="w-14 text-center font-mono text-base font-bold bg-surface border border-line rounded px-2 py-1 text-snow focus:outline-none focus:border-ember"
                />
                {p2?.id && (
                  <Button
                    type="button"
                    size="sm"
                    variant={winnerId === p2.id ? 'emerald' : 'outline'}
                    onClick={() => {
                      setWinnerId(p2.id!);
                      if (status !== 'COMPLETED') setStatus('COMPLETED');
                    }}
                    className="h-8 px-2.5 text-xs font-mono"
                  >
                    <CheckCircle2 size={12} className="mr-1" />
                    Win
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Notes & Stream telemetry */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-fog uppercase tracking-wider block">
              Match Notes / Stream Link / Commentary
            </label>
            <input
              type="text"
              placeholder="e.g. Bo3 Final · Stream on twitch.tv/arena · Server US-East"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs font-mono bg-ink/50 border border-line rounded-lg px-3 py-2 text-snow focus:outline-none focus:border-ember"
            />
          </div>

          {/* Notice */}
          <div className="p-3 bg-ember/5 border border-ember/20 rounded-lg flex items-start gap-2.5 text-[11px] font-mono text-fog">
            <Flame size={14} className="text-ember shrink-0 mt-0.5" />
            <span>
              Saving will update live brackets for all tournament participants. Advancing a winner will route them directly into the connected downstream bracket node.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-line">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={closeMatchModal}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="ember"
              size="sm"
              disabled={isSaving}
              className="min-w-28 font-mono"
            >
              {isSaving ? 'Updating...' : 'Save Match Flow'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
