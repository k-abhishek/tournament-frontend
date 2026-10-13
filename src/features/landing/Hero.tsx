import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-ember/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-6xl md:text-8xl font-display text-snow leading-[0.85] mb-6 gap-2">
            WHERE <span className="text-ember">COMMUNITY</span> ESPORTS MEET
          </h1>
          <p className="text-lg md:text-xl text-fog mb-10 max-w-lg">
            Host, manage, and compete in Single/Double Elimination, Round Robin,
            and Swiss tournaments with automated bracket engines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 font-mono text-sm tracking-wider uppercase">
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center bg-ember text-ink hover:bg-ember/90 transition-colors h-14 px-8"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
              }}
            >
              Get Started Free
            </Link>
            <a
              href="#tournaments"
              className="inline-flex items-center justify-center bg-surface border border-line text-snow hover:bg-surface-raised transition-colors h-14 px-8"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
              }}
            >
              Explore Tournaments
            </a>
          </div>
        </div>

        {/* Live Bracket Panel */}
        <div className="panel-surface p-8 font-mono text-sm relative booth-glow transform rotate-0 hover:rotate-1 transition-transform duration-500">
          <div className="eyebrow text-ember mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
            Live Grand Final
          </div>

          <div className="flex gap-8 items-center">
            {/* Semifinals (or final match representation) */}
            <div className="flex flex-col gap-6 relative w-1/2">
              <div className="bg-ink border border-line p-4 flex justify-between items-center relative z-10">
                <span className="text-snow font-bold">Cloud9</span>
                <span className="text-ember font-bold text-lg">2</span>
              </div>
              <div className="bg-ink border border-line p-4 flex justify-between items-center relative z-10 opacity-50">
                <span className="text-fog">Team Liquid</span>
                <span className="text-fog font-bold text-lg">1</span>
              </div>

              {/* Bracket lines */}
              <div className="absolute -right-8 top-8.5 w-8 h-[calc(100%-68px)] border-r border-t border-b border-line rounded-r-sm z-0" />
            </div>

            {/* Winner */}
            <div className="relative w-1/2">
              {/* Connector from previous round */}
              <div className="absolute -left-8 top-1/2 w-8 h-px bg-line z-0" />
              <div className="bg-ink border-2 border-ember p-4 flex justify-between items-center relative z-10 shadow-[0_0_15px_rgba(255,92,0,0.2)]">
                <span className="text-snow font-bold">Cloud9</span>
                <span className="text-ember text-xl">🏆</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-4 flex justify-between text-xs text-fog">
            <span>CS2 Winter Major</span>
            <span>BO3</span>
          </div>
        </div>
      </div>
    </section>
  );
}
