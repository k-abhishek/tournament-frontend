import { useParams, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useTournament, useRegisterForTournament } from '@/hooks/useTournaments';
import {
  Users,
  Shield,
  Settings,
  ArrowLeft,
  FileText,
  AlertCircle,
  Crown,
} from 'lucide-react';

// shadcn UI components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function TournamentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useUser();
  const { data, isLoading, error } = useTournament(slug);
  const registerMutation = useRegisterForTournament(data?.tournament?.id);

  const tournament = data?.tournament;

  if (isLoading) {
    return (
      <LoadingScreen
        fullScreen={false}
        message="LOADING TOURNAMENT DATA"
        subMessage="FETCHING BRACKETS & PARTICIPANTS..."
        className="min-h-[420px]"
      />
    );
  }

  if (error || !tournament) {
    return (
      <Card className="max-w-xl mx-auto text-center p-8 space-y-4">
        <AlertCircle size={36} className="mx-auto text-ember" />
        <CardTitle className="text-xl">Tournament Not Found</CardTitle>
        <CardDescription>The tournament could not be retrieved or has been removed.</CardDescription>
        <Button variant="outline" asChild className="mx-auto">
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </Card>
    );
  }

  const currentUsername = user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0];
  const currentEmail = user?.primaryEmailAddress?.emailAddress;

  const isCreator =
    user &&
    (tournament.organizer?.id === user.id ||
      tournament.organizer?.username === currentUsername ||
      tournament.organizer?.email === currentEmail ||
      tournament.organizerId === user.id);

  const isModerator = tournament.moderators?.some(
    (m: any) =>
      m.userId === user?.id ||
      m.user?.id === user?.id ||
      m.user?.username === currentUsername ||
      m.user?.email === currentEmail,
  );

  const canManage = isCreator || isModerator || user?.publicMetadata?.role === 'platform_admin';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="text-fog hover:text-snow">
          <Link to="/dashboard">
            <ArrowLeft size={14} className="mr-1.5" />
            Back to Dashboard
          </Link>
        </Button>

        {canManage && (
          <Button variant="ember" size="sm" asChild>
            <Link to={`/dashboard/tournaments/${tournament.slug}/manage`}>
              <Settings size={14} className="mr-1.5" />
              Manage Tournament
            </Link>
          </Button>
        )}
      </div>

      {/* Hero Banner Card */}
      <Card className="overflow-hidden relative">
        {tournament.bannerUrl ? (
          <div className="h-48 w-full overflow-hidden relative">
            <img src={tournament.bannerUrl} alt={tournament.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          </div>
        ) : (
          <div className="h-28 bg-gradient-to-r from-ember/20 via-cyan/10 to-surface border-b border-line" />
        )}

        <CardContent className="p-6 md:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{tournament.game?.name || 'Esports'}</Badge>
                <Badge
                  variant={
                    tournament.status === 'REGISTRATION_OPEN'
                      ? 'lime'
                      : tournament.status === 'ONGOING'
                      ? 'cyan'
                      : tournament.status === 'COMPLETED'
                      ? 'outline'
                      : 'ember'
                  }
                >
                  {tournament.status}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-display text-snow tracking-wide">{tournament.name}</h1>
            </div>

            {/* Quick Registration Button */}
            {tournament.status === 'REGISTRATION_OPEN' && (
              <Button
                variant="default"
                size="lg"
                onClick={() => registerMutation.mutate()}
                disabled={registerMutation.isPending}
                className="bg-lime text-ink hover:bg-lime/90 font-display"
              >
                {registerMutation.isPending ? 'Registering...' : 'Register Now'}
              </Button>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-line">
            <div className="space-y-1">
              <span className="text-xs font-mono text-fog uppercase block">Format</span>
              <p className="text-sm font-semibold text-snow">{tournament.format?.replace('_', ' ')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-fog uppercase block">Prize Pool</span>
              <p className="text-sm font-semibold text-ember">{tournament.prizePool || 'Glory & Prestige'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-fog uppercase block">Slots / Teams</span>
              <p className="text-sm font-semibold text-snow">
                {tournament._count?.participants || 0} / {tournament.maxParticipants}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono text-fog uppercase block">Start Date</span>
              <p className="text-sm font-semibold text-snow">
                {new Date(tournament.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* shadcn Tabs Container */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText size={15} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Shield size={15} />
            Rules & Format
          </TabsTrigger>
          <TabsTrigger value="moderators" className="flex items-center gap-2">
            <Users size={15} />
            Staff & Moderators ({tournament.moderators?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tournament Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-fog whitespace-pre-line leading-relaxed">
                  {tournament.description || 'No description provided for this tournament.'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Crown size={15} className="text-ember" />
                  Tournament Admin
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded bg-background border border-line">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={tournament.organizer?.avatarUrl} alt="Organizer" />
                    <AvatarFallback className="bg-ember/20 text-ember">
                      {(tournament.organizer?.displayName || tournament.organizer?.username || 'A')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-snow truncate">
                      {tournament.organizer?.displayName || `@${tournament.organizer?.username}`}
                    </p>
                    <p className="text-xs font-mono text-ember font-semibold">Tournament Creator</p>
                  </div>
                </div>

                {tournament.moderators?.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-line">
                    <span className="text-xs font-mono text-fog uppercase block">Appointed Moderators</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tournament.moderators.map((m: any) => (
                        <Badge key={m.id} variant="secondary" className="gap-1 py-1">
                          <Shield size={11} className="text-cyan" />
                          @{m.user?.username}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Rules */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Rules & Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-fog whitespace-pre-line leading-relaxed font-mono bg-background p-4 rounded border border-line">
                {tournament.rules || 'Standard competitive esports guidelines apply. Contact tournament moderators for disputes.'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Moderators & Staff */}
        <TabsContent value="moderators">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-line pb-4">
              <div>
                <CardTitle>Tournament Staff</CardTitle>
                <CardDescription>
                  Organizers and moderators responsible for match approvals, dispute resolution, and scheduling.
                </CardDescription>
              </div>
              {canManage && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/dashboard/tournaments/${tournament.slug}/manage`}>
                    Edit Staff in Manage
                  </Link>
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Creator Card */}
              <div className="flex items-center gap-3 p-4 rounded bg-background border border-ember/20">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={tournament.organizer?.avatarUrl} alt="Organizer" />
                  <AvatarFallback className="bg-ember/20 text-ember">
                    {(tournament.organizer?.displayName || tournament.organizer?.username || 'A')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-snow">
                    {tournament.organizer?.displayName || `@${tournament.organizer?.username}`}
                  </p>
                  <p className="text-xs font-mono text-ember font-semibold">Tournament Admin (Creator)</p>
                </div>
              </div>

              {/* Moderators List */}
              {tournament.moderators?.map((mod: any) => (
                <div key={mod.id} className="flex items-center gap-3 p-4 rounded bg-background border border-line">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={mod.user?.avatarUrl} alt={mod.user?.username} />
                    <AvatarFallback className="bg-cyan/20 text-cyan">
                      {(mod.user?.displayName || mod.user?.username || 'M')[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-snow">
                      {mod.user?.displayName || `@${mod.user?.username}`}
                    </p>
                    <p className="text-xs font-mono text-cyan">Tournament Moderator</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}