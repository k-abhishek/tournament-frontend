import { Calendar, Trophy, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface Tournament {
  id: string;
  title: string;
  game: string;
  format: string;
  prizePool: string;
  startDate: string;
  organizer: string;
}

const SAMPLE_TOURNAMENTS: Tournament[] = [
  { id: 'ex-1', title: 'Winter CS2 Open (Example)', game: 'CS2', format: 'Single Elimination', prizePool: '$5,000', startDate: '2026-11-01', organizer: 'Nexus Arena' },
  { id: 'ex-2', title: 'VALORANT Challengers (Example)', game: 'VALORANT', format: 'Double Elimination', prizePool: '$10,000', startDate: '2026-11-15', organizer: 'Riot Games' },
  { id: 'ex-3', title: 'BGMI Masters Series (Example)', game: 'BGMI', format: 'Round Robin', prizePool: '$2,500', startDate: '2026-11-20', organizer: 'Krafton' },
  { id: 'ex-4', title: 'Rocket League 3v3 (Example)', game: 'Rocket League', format: 'Swiss', prizePool: '$1,000', startDate: '2026-12-01', organizer: 'Psyonix' },
  { id: 'ex-5', title: 'Dota 2 Weekly Cup (Example)', game: 'Dota 2', format: 'Single Elimination', prizePool: '$500', startDate: '2026-10-15', organizer: 'Valve' },
  { id: 'ex-6', title: 'Apex Legends Scrims (Example)', game: 'Apex Legends', format: 'Round Robin', prizePool: '$2,000', startDate: '2026-10-30', organizer: 'EA' },
];

export default function TournamentGrid() {
  const navigate = useNavigate();

  const displayTournaments = SAMPLE_TOURNAMENTS;

  return (
    <section id="tournaments" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-display text-snow mb-4">LIVE <span className="text-lime">TOURNAMENTS</span></h2>
            <p className="text-fog font-mono text-sm uppercase tracking-widest">Compete and climb the ranks</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTournaments.map((t) => (
            <div 
              key={t.id} 
              className="panel-surface group hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(204,255,0,0.15)] hover:border-lime/40 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              onClick={() => navigate('/sign-in')}
            >
              {/* Header/Game Badge */}
              <div className="p-6 border-b border-line bg-ink relative">
                <div className="absolute inset-0 bg-lime/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="font-mono text-xs uppercase tracking-widest font-bold bg-surface px-2 py-1 rounded text-lime border border-line">
                    {t.game}
                  </span>
                  <span className="text-fog text-xs font-mono bg-surface px-2 py-1 rounded border border-line">
                    {t.format}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-snow relative z-10 truncate">{t.title}</h3>
              </div>
              
              {/* Details */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-6 bg-surface">
                <div className="space-y-3 font-mono text-sm text-fog">
                  <div className="flex items-center gap-3">
                    <Trophy size={16} className="text-muted" />
                    <span className="text-snow">{t.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-muted" />
                    <span>{t.startDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-muted" />
                    <span>By <span className="text-snow">{t.organizer}</span></span>
                  </div>
                </div>
                
                {/* Overlay Prompt on Hover */}
                <div className="pt-4 border-t border-line mt-auto">
                  <div className="font-mono text-xs text-lime uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-bold flex items-center justify-between">
                    Sign in to view bracket <span>→</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
