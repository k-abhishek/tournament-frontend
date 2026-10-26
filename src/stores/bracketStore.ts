import { create } from 'zustand';

export interface BracketNode<T = Record<string, unknown>> {
  id: string;
  position: { x: number; y: number };
  data: T;
  type?: string;
}

export interface BracketEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

interface BracketState {
  nodes: BracketNode[];
  edges: BracketEdge[];
  setBracket: (nodes: BracketNode[], edges: BracketEdge[]) => void;
  updateNode: (nodeId: string, data: Record<string, unknown>) => void;
}

/**
 * Bracket data store for tournament visualization states.
 * Authorization to edit brackets is evaluated component-side via usePermissions.
 */
export const useBracketStore = create<BracketState>((set) => ({
  nodes: [],
  edges: [],
  setBracket: (nodes, edges) => set({ nodes, edges }),
  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node,
      ),
    })),
}));
