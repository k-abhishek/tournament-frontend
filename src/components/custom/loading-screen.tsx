import { Network } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  className?: string;
  fullScreen?: boolean;
}

/**
 * Cyber / Esports Aesthetic Loading Screen
 * Features glowing ambient embers, tactical HUD bracket accents,
 * dual-pulse rings, animated scanning beam, and monospace telemetry.
 */
export function LoadingScreen({
  message = "INITIALIZING ARENA INTERFACE",
  subMessage = "SYNCING TOURNAMENT TELEMETRY...",
  className,
  fullScreen = true,
}: LoadingScreenProps) {
  const content = (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-8 select-none",
        className,
      )}
    >
      {/* Ambient background glow orb */}
      <div className="absolute w-72 h-72 bg-ember/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-48 h-48 bg-cyan/10 rounded-full blur-2xl pointer-events-none -translate-x-12 translate-y-8" />

      {/* Tactical HUD Corner Frame */}
      <div className="relative p-8 rounded-xl border border-line bg-surface/80 backdrop-blur-md shadow-2xl flex flex-col items-center max-w-sm w-full overflow-hidden">
        {/* Top & Bottom Accent Decals */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ember to-transparent" />
        {/* <div className="absolute -top-1 left-4 text-[9px] font-mono text-ember/60 tracking-widest uppercase">
          SYS.NODE // 01
        </div>
        <div className="absolute -bottom-1 right-4 text-[9px] font-mono text-fog/40 tracking-widest uppercase">
          PROTOCOL: SECURE
        </div> */}

        {/* Center Animated Logo & Dual Rings */}
        <div className="relative flex items-center justify-center my-6">
          {/* Outer Pulsing Radar Ring */}
          <div className="absolute w-20 h-20 rounded-full border border-ember/30 animate-ping opacity-25" />
          {/* Counter-rotating border ring */}
          <div className="w-16 h-16 rounded-lg border-2 border-dashed border-ember/50 flex items-center justify-center animate-spin [animation-duration:8s] bg-ink/60 shadow-[0_0_20px_rgba(255,92,0,0.2)]">
            <div className="w-10 h-10 rounded-md border border-line/80 bg-surface flex items-center justify-center">
              <Network size={18} className="text-ember animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand / Status Headings */}
        <div className="text-center space-y-1.5 z-10 w-full">
          <div className="flex items-center justify-center gap-1.5 font-display text-lg tracking-wider text-snow uppercase">
            <span>Tourney</span>
            <span className="text-ember">Hub</span>
          </div>
          <p className="font-mono text-xs font-semibold text-snow/90 tracking-widest uppercase">
            {message}
          </p>
          <p className="font-mono text-[11px] text-fog tracking-wider uppercase animate-pulse">
            {subMessage}
          </p>
        </div>

        {/* Tactical Scanning Laser Progress Bar */}
        <div className="w-full mt-6 space-y-1.5">
          <div className="relative h-1 w-full bg-line overflow-hidden rounded-full">
            <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-ember to-transparent animate-shimmer shadow-[0_0_8px_#FF5C00]" />
          </div>
          {/* <div className="flex justify-between items-center text-[10px] font-mono text-fog/60 px-0.5">
            <span>READY</span>
            <span className="text-ember/80 font-semibold animate-pulse">
              CONNECTING
            </span>
            <span>99.9%</span>
          </div> */}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
