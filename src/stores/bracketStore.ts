import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface BracketState {
  nodes: Node[];
  edges: Edge[];
  setBracket: (nodes: Node[], edges: Edge[]) => void;
  updateNode: (nodeId: string, data: any) => void;
}

// Bracket data solely deals with React Flow visualization state.
// Authorization to edit the bracket is handled at the component level via usePermissions.
export const useBracketStore = create<BracketState>((set) => ({
  nodes: [],
  edges: [],
  setBracket: (nodes, edges) => set({ nodes, edges }),
  updateNode: (nodeId, data) => 
    set((state) => ({
      nodes: state.nodes.map((node) => 
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    })),
}));
