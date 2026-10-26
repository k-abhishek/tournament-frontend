import { NavLink as Link, Outlet } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import {
  Network,
  LayoutDashboard,
  Trophy,
  User,
  ShieldAlert,
  Swords,
} from "lucide-react";

export default function DashboardLayout() {
  const { user, isLoaded } = useUser();

  const isPlatformAdmin = user?.publicMetadata?.role === "platform_admin";

  const navItems = [
    {
      to: "/dashboard",
      label: "My Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: "/dashboard/tournaments",
      label: "Explore Tournaments",
      icon: Trophy,
      exact: true,
    },
    {
      to: "/dashboard/my-teams",
      label: "My Teams & Invites",
      icon: Swords,
    },
    { to: "/dashboard/profile", label: "Profile", icon: User },
    ...(isPlatformAdmin
      ? [
          {
            to: "/dashboard/admin",
            label: "Platform Console",
            icon: ShieldAlert,
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-line bg-surface/80 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-line">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl tracking-wide uppercase text-snow hover:text-ember transition-colors"
          >
            <div className="bg-ember/15 p-1.5 rounded text-ember border border-ember/20">
              <Network size={18} />
            </div>
            <span>TourneyHub</span>
          </Link>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                end={item.exact}
                className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-mono text-fog hover:text-snow hover:bg-line/40 transition-colors [&.active]:bg-ember/10 [&.active]:text-ember [&.active]:font-semibold"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Card in Sidebar Footer */}
        <div className="p-4 border-t border-line mt-auto">
          <div className="flex items-center justify-between p-2 rounded bg-surface border border-line">
            <div className="flex items-center gap-2.5 min-w-0">
              {isLoaded && user ? (
                <>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-snow truncate">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-[10px] text-fog font-mono truncate">
                      @{user.username || "player"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-8 h-8 rounded bg-line animate-pulse" />
              )}
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto bg-background p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
