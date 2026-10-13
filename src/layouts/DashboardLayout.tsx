import { NavLink as Link, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Terminal,
  LayoutDashboard,
  Trophy,
  Network,
  CheckSquare,
  Swords,
  ListOrdered,
  User,
} from "lucide-react";

export default function DashboardLayout() {
  const { user, isLoaded } = useUser();
  const location = useLocation();
  const currentPath =
    location.pathname.split("/").filter(Boolean).pop() || "overview";
  const pathName =
    currentPath === "dashboard"
      ? "Overview"
      : currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
  const navItems = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/dashboard/profile", label: "Profile", icon: User },
    { to: "/dashboard/tournaments", label: "Tournaments", icon: Trophy },
    { to: "/dashboard/bracket", label: "Bracket", icon: Network },
    { to: "/dashboard/approvals", label: "Approvals", icon: CheckSquare },
    { to: "/dashboard/matches", label: "Match results", icon: Swords },
    { to: "/dashboard/standings", label: "Standings", icon: ListOrdered },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border bg-surface/50 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold"
          >
            <div className="bg-primary/20 p-1.5 rounded-md text-primary">
              <Terminal size={18} />
            </div>
            <span className="font-light">TourneyHub</span>
          </Link>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="eyebrow mb-3 px-2">Console</div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                end={item.exact}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface transition-colors [&.active]:bg-primary/10 [&.active]:text-primary"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-md bg-surface border border-border">
            {isLoaded && user ? (
              <>
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                  className="w-8 h-8 rounded bg-primary/20 object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.fullName || user.username}
                  </p>
                  {/* <p className="text-[10px] text-text-muted truncate">
                    {user.primaryEmailAddress?.emailAddress || "Player"}
                  </p> */}
                </div>
              </>
            ) : (
              <div className="w-8 h-8 rounded bg-primary/20 animate-pulse"></div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 shrink-0 border-b border-border bg-background flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Console</span>
            <span>/</span>
            <span className="text-foreground font-medium">
              {pathName.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium booth-glow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              4 live
            </div>
            <div className="eyebrow bg-surface px-2 py-1 rounded border border-border">
              polling 15s
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto bg-background p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
