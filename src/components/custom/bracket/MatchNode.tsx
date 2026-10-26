import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trophy, Clock, Flame, Edit3, ShieldAlert } from 'lucide-react';
import type { MatchNodeData } from '@/stores/bracketStore';

export const MatchNode: React.FC<NodeProps> = memo(({ data, selected }) => {
  const nodeData = data as unknown as MatchNodeData;
  const match = nodeData?.match;
  const canManage = Boolean(nodeData?.canManage);
  const isCoordinatorMode = Boolean(nodeData?.isCoordinatorMode);
  const onEditClick = nodeData?.onEditClick;

  if (!match) return null;

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

  const p1Logo = p1?.avatarUrl || p1?.team?.logoUrl || p1?.user?.avatarUrl;
  const p2Logo = p2?.avatarUrl || p2?.team?.logoUrl || p2?.user?.avatarUrl;

  const isP1Winner = Boolean(
    isCompleted &&
      (match.winnerId === p1?.id ||
        (match.score1 !== null &&
          match.score1 !== undefined &&
          match.score2 !== null &&
          match.score2 !== undefined &&
          match.score1 > match.score2))
  );

  const isP2Winner = Boolean(
    isCompleted &&
      (match.winnerId === p2?.id ||
        (match.score1 !== null &&
          match.score1 !== undefined &&
          match.score2 !== null &&
          match.score2 !== undefined &&
          match.score2 > match.score1))
  );

  return (
    <div
      onClick={() => {
        if (canManage && onEditClick) {
          onEditClick(match);
        }
      }}
      className={`group relative w-72 rounded-lg border transition-all duration-200 select-none ${
        selected
          ? 'ring-2 ring-ember border-ember shadow-lg shadow-ember/10'
          : isLive
          ? 'border-ember bg-surface shadow-[0_0_20px_rgba(255,92,0,0.18)] ring-1 ring-ember/40'
          : isCompleted
          ? 'border-line bg-surface hover:border-line/90 shadow-md'
          : 'border-line/70 bg-surface/80 hover:border-line shadow-sm'
      } ${canManage ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
    >
      {/* Target handle on Left */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !-left-1.5 !bg-line !border-2 !border-surface group-hover:!bg-ember transition-colors"
      />

      {/* Header bar */}
      <div className="px-3 py-1.5 bg-ink/80 border-b border-line flex items-center justify-between text-[10px] font-mono rounded-t-lg">
        <div className="flex items-center gap-1.5">
          <span className="text-fog font-medium">M#{match.matchNumber}</span>
          {match.roundName && (
            <span className="text-fog/60 truncate max-w-[90px]">· {match.roundName}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="flex items-center gap-1 text-ember font-bold uppercase tracking-wider animate-pulse">
              <Flame size={11} className="text-ember fill-ember" />
              LIVE
            </span>
          ) : isCompleted ? (
            <span className="flex items-center gap-1 text-lime font-medium uppercase tracking-wider">
              <Trophy size={11} />
              FINAL
            </span>
          ) : (
            <span className="flex items-center gap-1 text-fog/70">
              <Clock size={10} />
              PENDING
            </span>
          )}

          {canManage && isCoordinatorMode && (
            <span className="flex items-center gap-0.5 text-ember bg-ember/15 px-1.5 py-0.5 rounded text-[9px] font-bold">
              <Edit3 size={9} />
              EDIT
            </span>
          )}
        </div>
      </div>

      {/* Competitor list */}
      <div className="divide-y divide-line/60">
        {/* Participant 1 */}
        <div
          className={`p-2.5 flex items-center justify-between transition-colors ${
            isP1Winner
              ? 'bg-lime/10 text-snow font-semibold'
              : isCompleted && isP2Winner
              ? 'text-fog/50 line-through opacity-70'
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
              <div className="w-5 h-5 rounded bg-surface border border-line flex items-center justify-center text-[10px] font-bold text-fog shrink-0">
                {p1Name[0]}
              </div>
            )}
            <span className="text-xs truncate font-medium">{p1Name}</span>
          </div>

          <span
            className={`font-mono text-xs tabular-nums px-2 py-0.5 rounded shrink-0 ${
              isP1Winner
                ? 'bg-lime text-ink font-bold shadow-sm'
                : isLive
                ? 'bg-ember/20 text-ember font-bold'
                : 'bg-ink text-fog'
            }`}
          >
            {match.score1 !== null && match.score1 !== undefined ? match.score1 : '-'}
          </span>
        </div>

        {/* Participant 2 */}
        <div
          className={`p-2.5 flex items-center justify-between transition-colors ${
            isP2Winner
              ? 'bg-lime/10 text-snow font-semibold'
              : isCompleted && isP1Winner
              ? 'text-fog/50 line-through opacity-70'
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
              <div className="w-5 h-5 rounded bg-surface border border-line flex items-center justify-center text-[10px] font-bold text-fog shrink-0">
                {p2Name[0]}
              </div>
            )}
            <span className="text-xs truncate font-medium">{p2Name}</span>
          </div>

          <span
            className={`font-mono text-xs tabular-nums px-2 py-0.5 rounded shrink-0 ${
              isP2Winner
                ? 'bg-lime text-ink font-bold shadow-sm'
                : isLive
                ? 'bg-ember/20 text-ember font-bold'
                : 'bg-ink text-fog'
            }`}
          >
            {match.score2 !== null && match.score2 !== undefined ? match.score2 : '-'}
          </span>
        </div>
      </div>

      {/* Footer Notes or Coordinator Hint */}
      {match.notes ? (
        <div className="px-3 py-1 bg-ink/40 border-t border-line/40 text-[10px] font-mono text-fog truncate">
          {match.notes}
        </div>
      ) : canManage && isCoordinatorMode ? (
        <div className="px-3 py-1 bg-ink/60 border-t border-line/40 text-[9px] font-mono text-ember flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <ShieldAlert size={10} />
          Click node to update scores & winner
        </div>
      ) : null}

      {/* Source handle on Right */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !-right-1.5 !bg-line !border-2 !border-surface group-hover:!bg-lime transition-colors"
      />
    </div>
  );
});

MatchNode.displayName = 'MatchNode';
