import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { User, Gamepad2, Trophy, Building2 } from "lucide-react";
import { LoadingScreen } from "@/components/custom/loading-screen";

export default function UpdateProfile() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <LoadingScreen
        fullScreen={false}
        message="LOADING PLAYER PROFILE"
        subMessage="FETCHING IDENTITY & GAME ACCOUNTS..."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Your Profile
        </h1>
        <p className="text-text-muted mt-1">
          Manage your personal information and connected game accounts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <section className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <User size={20} className="text-primary" />
              Basic Information
            </h2>
            <div className="flex items-center gap-6">
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-border"
              />
              <div>
                <p className="font-medium text-lg">
                  {user?.fullName || user?.username}
                </p>
                <p className="text-text-muted">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-background rounded-lg border border-border text-sm text-text-muted">
              To update your avatar, email, or password, please use the account
              management popup from the top menu.
            </div>
          </section>

          {/* Connect Games */}
          <section className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Gamepad2 size={20} className="text-primary" />
              Connected Games
            </h2>
            <p className="text-sm text-text-muted mb-4">
              Connect your game accounts to easily register for tournaments and
              report match results.
            </p>
            <div className="space-y-4">
              {/* Mock Connected Game */}
              <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#eb0029] rounded flex items-center justify-center text-white font-bold">
                    V
                  </div>
                  <div>
                    <p className="font-medium">Valorant</p>
                    <p className="text-xs text-text-muted">Not connected</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                  Connect
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#000000] border border-border rounded flex items-center justify-center text-white font-bold">
                    CS
                  </div>
                  <div>
                    <p className="font-medium">Counter-Strike 2</p>
                    <p className="text-xs text-text-muted">Not connected</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Host a Tournament CTA */}
          <section className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-6">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4">
              <Trophy size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">
              Want to host tournaments?
            </h2>
            <p className="text-sm text-text-muted mb-6">
              Create an organization to start organizing tournaments, inviting
              moderators, and managing brackets.
            </p>
            <Link
              to="/dashboard/org/new"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              <Building2 size={18} />
              Create Organization
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
