export default function Features() {
  const features = [
    {
      num: "01",
      title: "Instant Organization Hosting",
      desc: "Spin up a tournament hub in seconds. Manage teams, seed players, and control the entire event from a single dashboard."
    },
    {
      num: "02",
      title: "Automated Bracket Engine",
      desc: "No more manual updates. Match results flow directly into our bracket engine, advancing winners instantly."
    },
    {
      num: "03",
      title: "Secure & Verified Results",
      desc: "Built-in result validation and dispute resolution tools ensure fair play and accurate tournament outcomes."
    }
  ];

  return (
    <section id="features" className="py-24 border-t border-line relative bg-ink">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-snow mb-4">PLATFORM <span className="text-cyan">FEATURES</span></h2>
          <p className="text-fog font-mono text-sm uppercase tracking-widest">Built for serious organizers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="panel-surface p-8 relative group overflow-hidden transition-colors hover:border-cyan/50">
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="font-display text-6xl text-line group-hover:text-cyan/20 transition-colors mb-8 select-none">
                {f.num}
              </div>
              <h3 className="text-xl font-display text-snow mb-4 relative z-10">{f.title}</h3>
              <p className="text-fog text-sm leading-relaxed relative z-10">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
