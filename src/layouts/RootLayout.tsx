import { NavLink as Link, Outlet, useLocation } from "react-router-dom";
import { Network } from "lucide-react";
import { useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-ember selection:text-ink">
      <header className="h-16 border-b border-line bg-ink/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              to="/"
              className="flex items-center gap-2 text-snow font-display text-2xl tracking-wide uppercase hover:text-ember transition-colors"
            >
              <Network size={24} className="text-ember" />
              <span>TourneyHub</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-mono uppercase tracking-wider">
              <Link
                to="/#tournaments"
                className="text-fog hover:text-snow transition-colors"
              >
                Tournaments
              </Link>
              <Link
                to="/#games"
                className="text-fog hover:text-snow transition-colors"
              >
                Games
              </Link>
              <Link
                to="/#formats"
                className="text-fog hover:text-snow transition-colors"
              >
                Formats
              </Link>
              <Link
                to="/#features"
                className="text-fog hover:text-snow transition-colors"
              >
                Features
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <SignedIn>
              <Link
                to="/dashboard"
                className="text-sm font-mono uppercase tracking-wider text-fog hover:text-snow transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/tournaments/new"
                className="inline-flex items-center justify-center font-display text-lg uppercase tracking-wide bg-ember text-ink hover:bg-ember/90 transition-colors h-10 px-6"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
              >
                Host a Tournament
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link
                to="/sign-in"
                className="text-sm font-mono uppercase tracking-wider text-fog hover:text-snow transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center font-display text-lg uppercase tracking-wide bg-ember text-ink hover:bg-ember/90 transition-colors h-10 px-6"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
                }}
              >
                Host a Tournament
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-surface py-12 text-center text-fog text-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-display text-xl text-snow tracking-wide">
            <span className="text-cyan">NEXUS</span> ARENA
          </div>
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest">
            <Link to="/docs" className="hover:text-snow transition-colors">
              Docs
            </Link>
            <Link to="/status" className="hover:text-snow transition-colors">
              Status
            </Link>
            <Link to="/terms" className="hover:text-snow transition-colors">
              Terms
            </Link>
          </div>
          <div className="font-mono text-xs text-line">
            © {new Date().getFullYear()} NEXUS ARENA INC.
          </div>
        </div>
      </footer>
    </div>
  );
}
