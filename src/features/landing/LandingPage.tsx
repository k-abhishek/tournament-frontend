import Hero from '@/features/landing/Hero';
import TournamentGrid from '@/features/landing/TournamentGrid';
import Features from '@/features/landing/Features';
import { useEffect } from 'react';

export default function LandingPage() {
  // Update document title and description for SEO
  useEffect(() => {
    document.title = "TourneyHub | Where Community Esports Meet";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Host, manage, and compete in community esports tournaments. Built for serious organizers with automated bracket engines.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Host, manage, and compete in community esports tournaments. Built for serious organizers with automated bracket engines.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />
      <TournamentGrid />
      <Features />
    </div>
  );
}