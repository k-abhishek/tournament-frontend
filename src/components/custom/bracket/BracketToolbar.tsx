import React from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  Shield,
  ShieldAlert,
  GitFork,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBracketStore } from '@/stores/bracketStore';

interface BracketToolbarProps {
  viewMode: 'canvas' | 'classic';
  onViewModeChange: (mode: 'canvas' | 'classic') => void;
  canManage?: boolean;
  totalMatches: number;
}

export const BracketToolbar: React.FC<BracketToolbarProps> = ({
  viewMode,
  onViewModeChange,
  canManage = false,
  totalMatches,
}) => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const { isCoordinatorMode, setIsCoordinatorMode } = useBracketStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-ink/70 border border-line rounded-lg">
      {/* Left: View selector & match tally */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-surface border border-line p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => onViewModeChange('canvas')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              viewMode === 'canvas'
                ? 'bg-ember text-snow font-semibold shadow-sm'
                : 'text-fog hover:text-snow'
            }`}
          >
            <GitFork size={13} />
            Flow Canvas
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('classic')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
              viewMode === 'classic'
                ? 'bg-ember text-snow font-semibold shadow-sm'
                : 'text-fog hover:text-snow'
            }`}
          >
            <LayoutGrid size={13} />
            Classic Grid
          </button>
        </div>

        <Badge variant="outline" className="font-mono text-[11px] py-1 text-fog">
          {totalMatches} Matches
        </Badge>
      </div>

      {/* Right: Controls & Coordinator Mode */}
      <div className="flex items-center gap-2">
        {/* Canvas viewport zoom tools (only active in canvas mode) */}
        {viewMode === 'canvas' && (
          <div className="flex items-center gap-1 border-r border-line pr-2 mr-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => zoomIn({ duration: 200 })}
              className="h-7 w-7 p-0 text-fog hover:text-snow"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => zoomOut({ duration: 200 })}
              className="h-7 w-7 p-0 text-fog hover:text-snow"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fitView({ padding: 0.2, duration: 400 })}
              className="h-7 px-2 text-xs font-mono text-fog hover:text-snow gap-1"
              title="Fit to view"
            >
              <Maximize2 size={13} />
              Fit View
            </Button>
          </div>
        )}

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-fog border-r border-line pr-3 mr-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-lime" />
            Victor Advance
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
            Live Match
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-fog/50" />
            Scheduled
          </span>
        </div>

        {/* Coordinator Flow toggle for Owners and Moderators */}
        {canManage && (
          <Button
            type="button"
            size="sm"
            variant={isCoordinatorMode ? 'ember' : 'outline'}
            onClick={() => setIsCoordinatorMode(!isCoordinatorMode)}
            className="h-7 text-xs font-mono gap-1.5 transition-all"
          >
            {isCoordinatorMode ? (
              <>
                <ShieldAlert size={13} className="text-snow animate-pulse" />
                <span>Coordinator Flow: ACTIVE</span>
              </>
            ) : (
              <>
                <Shield size={13} className="text-fog" />
                <span>Enable Flow Editing</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
