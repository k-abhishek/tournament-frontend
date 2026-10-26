import type { Node, Edge } from '@xyflow/react';
import type { BracketMatch } from '@/components/custom/TournamentBracket';
import type { MatchNodeData } from '@/stores/bracketStore';

interface LayoutOptions {
  colWidth?: number;
  rowHeight?: number;
  startX?: number;
  startY?: number;
  canManage?: boolean;
  isCoordinatorMode?: boolean;
  onEditClick?: (match: BracketMatch) => void;
}

/**
 * Transforms an array of tournament matches into a deterministic, perfectly aligned
 * esports tree layout for React Flow nodes and edges.
 */
export function buildBracketGraph(
  matches: BracketMatch[],
  options: LayoutOptions = {}
): { nodes: Node<MatchNodeData>[]; edges: Edge[] } {
  if (!matches || matches.length === 0) {
    return { nodes: [], edges: [] };
  }

  const {
    colWidth = 380,
    rowHeight = 170,
    startX = 40,
    startY = 40,
    canManage = false,
    isCoordinatorMode = false,
    onEditClick,
  } = options;

  // Group matches by round
  const roundsMap = new Map<number, BracketMatch[]>();
  matches.forEach((m) => {
    const roundNum = m.round || 1;
    if (!roundsMap.has(roundNum)) {
      roundsMap.set(roundNum, []);
    }
    roundsMap.get(roundNum)!.push(m);
  });

  const sortedRounds = Array.from(roundsMap.keys()).sort((a, b) => a - b);
  // Sort matches within each round by matchNumber
  sortedRounds.forEach((r) => {
    roundsMap.get(r)!.sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0));
  });

  const nodes: Node<MatchNodeData>[] = [];
  const edges: Edge[] = [];
  const posMap = new Map<string, { x: number; y: number }>();

  // Determine explicit feeder relationships if nextMatchId exists, or fallback to paired indexes
  const feederMap = new Map<string, string[]>(); // targetMatchId -> [feederMatchId, ...]

  // Pre-calculate feeders
  sortedRounds.forEach((roundNum, roundIdx) => {
    const currentRoundMatches = roundsMap.get(roundNum) || [];
    const nextRoundNum = sortedRounds[roundIdx + 1];
    const nextRoundMatches = nextRoundNum ? roundsMap.get(nextRoundNum) || [] : [];

    currentRoundMatches.forEach((m, idx) => {
      if (m.nextMatchId) {
        if (!feederMap.has(m.nextMatchId)) feederMap.set(m.nextMatchId, []);
        feederMap.get(m.nextMatchId)!.push(m.id);
      } else if (nextRoundMatches.length > 0) {
        // Standard single-elimination binary tree pairing
        const targetIdx = Math.floor(idx / 2);
        const targetMatch = nextRoundMatches[targetIdx];
        if (targetMatch) {
          if (!feederMap.has(targetMatch.id)) feederMap.set(targetMatch.id, []);
          feederMap.get(targetMatch.id)!.push(m.id);
        }
      }
    });
  });

  // Calculate layout coordinates round-by-round
  sortedRounds.forEach((roundNum, roundIdx) => {
    const roundMatches = roundsMap.get(roundNum) || [];
    const x = startX + roundIdx * colWidth;

    roundMatches.forEach((match, idx) => {
      let y: number;

      if (roundIdx === 0) {
        // First round: evenly spaced vertically
        y = startY + idx * rowHeight;
      } else {
        // Subsequent rounds: centered between preceding feeder matches
        const feeders = feederMap.get(match.id) || [];
        const feederPositions = feeders
          .map((id) => posMap.get(id))
          .filter((p): p is { x: number; y: number } => Boolean(p));

        if (feederPositions.length >= 2) {
          const sumY = feederPositions.reduce((acc, curr) => acc + curr.y, 0);
          y = sumY / feederPositions.length;
        } else if (feederPositions.length === 1) {
          y = feederPositions[0].y;
        } else {
          // Fallback if disconnected: space according to round scaling
          const stepMultiplier = Math.pow(2, roundIdx);
          y = startY + idx * (rowHeight * stepMultiplier) + ((stepMultiplier - 1) * rowHeight) / 2;
        }
      }

      posMap.set(match.id, { x, y });

      nodes.push({
        id: match.id,
        type: 'matchNode',
        position: { x, y },
        data: {
          match,
          canManage,
          isCoordinatorMode,
          onEditClick,
        },
      });
    });
  });

  // Generate Edges
  feederMap.forEach((feederIds, targetMatchId) => {
    const targetMatch = matches.find((m) => m.id === targetMatchId);

    feederIds.forEach((sourceId) => {
      const sourceMatch = matches.find((m) => m.id === sourceId);
      if (!sourceMatch) return;

      const isSourceCompleted = sourceMatch.status === 'COMPLETED';
      const isSourceLive = sourceMatch.status === 'LIVE' || sourceMatch.status === 'ONGOING';

      // Check if winner of source match reached target match
      const sourceWinnerId = sourceMatch.winnerId;
      const reachedTarget = Boolean(
        isSourceCompleted &&
          sourceWinnerId &&
          targetMatch &&
          (targetMatch.p1Id === sourceWinnerId ||
            targetMatch.p2Id === sourceWinnerId ||
            targetMatch.participant1?.id === sourceWinnerId ||
            targetMatch.participant2?.id === sourceWinnerId)
      );

      const edgeColor = reachedTarget
        ? '#84cc16' // Lime for victorious advancement
        : isSourceLive
        ? '#ff5c00' // Ember for active live feeder
        : '#27272a'; // Line zinc-800 for scheduled

      edges.push({
        id: `e-${sourceId}-${targetMatchId}`,
        source: sourceId,
        target: targetMatchId,
        type: 'smoothstep',
        animated: isSourceLive,
        style: {
          stroke: edgeColor,
          strokeWidth: reachedTarget || isSourceLive ? 2.5 : 1.5,
          opacity: reachedTarget || isSourceLive ? 1 : 0.6,
        },
      });
    });
  });

  return { nodes, edges };
}
