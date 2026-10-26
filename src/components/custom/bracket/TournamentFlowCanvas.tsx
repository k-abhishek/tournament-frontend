import { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  MiniMap,
  Controls,
  addEdge,
  Connection,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ShieldAlert } from 'lucide-react';

import { MatchNode } from './MatchNode';
import { BracketToolbar } from './BracketToolbar';
import { MatchEditorModal } from './MatchEditorModal';
import { buildBracketGraph } from './bracket-layout';
import { useBracketStore } from '@/stores/bracketStore';
import type { BracketMatch } from '@/components/custom/TournamentBracket';

interface TournamentFlowCanvasProps {
  matches: BracketMatch[];
  tournamentSlug?: string;
  tournamentName?: string;
  canManage?: boolean;
  viewMode: 'canvas' | 'classic';
  onViewModeChange: (mode: 'canvas' | 'classic') => void;
  onRefresh?: () => void;
  className?: string;
}

const nodeTypes = {
  matchNode: MatchNode,
};

function FlowCanvasContent({
  matches,
  tournamentSlug,
  tournamentName: _tournamentName,
  canManage = false,
  viewMode,
  onViewModeChange,
  onRefresh,
  className = '',
}: TournamentFlowCanvasProps) {
  const {
    nodes,
    edges,
    isCoordinatorMode,
    setBracket,
    onNodesChange,
    onEdgesChange,
    openMatchModal,
  } = useBracketStore();

  // Re-build layout when matches change or coordinator mode changes
  useEffect(() => {
    const { nodes: computedNodes, edges: computedEdges } = buildBracketGraph(matches, {
      canManage,
      isCoordinatorMode,
      onEditClick: openMatchModal,
    });
    setBracket(computedNodes, computedEdges);
  }, [matches, canManage, isCoordinatorMode, openMatchModal, setBracket]);

  // Support manual handle connection when coordinator mode is active
  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!isCoordinatorMode) return;
      const newEdge: Edge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}`,
        type: 'smoothstep',
        style: { stroke: '#ff5c00', strokeWidth: 2, strokeDasharray: '4 4' },
      };
      setBracket(nodes, addEdge(newEdge, edges));
    },
    [isCoordinatorMode, nodes, edges, setBracket]
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Canvas Top Bar */}
      <BracketToolbar
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        canManage={canManage}
        totalMatches={matches.length}
      />

      {/* Coordinator Mode Alert Banner */}
      {canManage && isCoordinatorMode && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-ember/10 border border-ember/30 rounded-lg text-xs font-mono text-ember animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="shrink-0 animate-bounce" />
            <span>
              <strong>Coordinator Flow Mode Active:</strong> Click any match card to update live scores, declare victors, and advance bracket flow.
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-ember/70">
            Esc or toggle button to exit
          </span>
        </div>
      )}

      {/* Interactive React Flow Canvas */}
      <div className="relative w-full h-[620px] rounded-xl border border-line bg-ink overflow-hidden shadow-2xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
          className="dark bg-ink"
        >
          {/* Subtle grid points */}
          <Background color="#27272a" gap={24} size={1} />

          {/* Canvas Bottom-Right MiniMap */}
          <MiniMap
            zoomable
            pannable
            nodeColor="#18181b"
            maskColor="rgba(9, 9, 11, 0.75)"
            className="!bg-surface !border !border-line !rounded-lg !overflow-hidden !shadow-md hidden sm:block"
          />

          {/* Bottom-Left Controls */}
          <Controls
            showInteractive={false}
            className="!bg-surface !border !border-line !rounded-lg !shadow-md [&>button]:!bg-surface [&>button]:!border-line [&>button]:!text-fog hover:[&>button]:!text-snow"
          />
        </ReactFlow>
      </div>

      {/* Modal for editing results & advancing bracket flow */}
      <MatchEditorModal
        tournamentSlug={tournamentSlug}
        onSuccess={onRefresh}
      />
    </div>
  );
}

export function TournamentFlowCanvas(props: TournamentFlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvasContent {...props} />
    </ReactFlowProvider>
  );
}
