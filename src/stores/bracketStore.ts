import { create } from 'zustand';
import type { Node, Edge, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { BracketMatch } from '@/components/custom/TournamentBracket';

export interface MatchNodeData extends Record<string, unknown> {
  match: BracketMatch;
  isCoordinatorMode?: boolean;
  canManage?: boolean;
  onEditClick?: (match: BracketMatch) => void;
}

interface BracketState {
  nodes: Node<MatchNodeData>[];
  edges: Edge[];
  selectedMatch: BracketMatch | null;
  isModalOpen: boolean;
  isCoordinatorMode: boolean;

  setBracket: (nodes: Node<MatchNodeData>[], edges: Edge[]) => void;
  onNodesChange: OnNodesChange<Node<MatchNodeData>>;
  onEdgesChange: OnEdgesChange;
  updateMatchData: (matchId: string, updatedMatch: Partial<BracketMatch>) => void;
  setSelectedMatch: (match: BracketMatch | null) => void;
  setIsCoordinatorMode: (enabled: boolean) => void;
  openMatchModal: (match: BracketMatch) => void;
  closeMatchModal: () => void;
}

/**
 * Bracket data store for React Flow tournament visualization & coordinator flow.
 */
export const useBracketStore = create<BracketState>((set) => ({
  nodes: [],
  edges: [],
  selectedMatch: null,
  isModalOpen: false,
  isCoordinatorMode: false,

  setBracket: (nodes, edges) => set({ nodes, edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  updateMatchData: (matchId, updatedMatch) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === matchId) {
          const newMatch = { ...node.data.match, ...updatedMatch };
          return {
            ...node,
            data: {
              ...node.data,
              match: newMatch,
            },
          };
        }
        return node;
      }),
      selectedMatch:
        state.selectedMatch?.id === matchId
          ? { ...state.selectedMatch, ...updatedMatch }
          : state.selectedMatch,
    })),

  setSelectedMatch: (match) => set({ selectedMatch: match }),
  setIsCoordinatorMode: (isCoordinatorMode) => set({ isCoordinatorMode }),
  openMatchModal: (match) => set({ selectedMatch: match, isModalOpen: true }),
  closeMatchModal: () => set({ selectedMatch: null, isModalOpen: false }),
}));
