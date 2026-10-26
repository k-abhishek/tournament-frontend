import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  useTournament,
  useBracket,
  useUpdateTournament,
  useDeleteTournament,
  useAddModerator,
  useRemoveModerator,
  useUsers,
} from "@/hooks/useTournaments";
import {
  Shield,
  Users,
  Settings,
  Trash2,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  GitFork,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TournamentBracket } from "@/components/custom/TournamentBracket";

// shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { LoadingScreen } from "@/components/custom/loading-screen";

// Subcomponents for tournament management tabs
import {
  TournamentSettingsTab,
  TournamentFormData,
} from "./manage/TournamentSettingsTab";
import { TournamentModeratorsTab } from "./manage/TournamentModeratorsTab";
import { TournamentDangerTab } from "./manage/TournamentDangerTab";

/**
 * Tournament Coordinator View
 * Provides role-based access control (RBAC) to:
 * - Edit tournament description, rules, format & schedule (Admin + Moderator)
 * - Assign or revoke platform moderators (Admin only)
 * - Delete tournament permanently (Admin only)
 */
export default function TournamentManage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const { data, isLoading, error } = useTournament(slug);
  const tournament = data?.tournament;
  const { data: bracketData, refetch: refetchBracket } = useBracket(slug);
  const bracketMatches = bracketData?.bracket || [];

  const updateMutation = useUpdateTournament();
  const deleteMutation = useDeleteTournament();
  const addModMutation = useAddModerator(slug || "");
  const removeModMutation = useRemoveModerator(slug || "");

  // Form state
  const [formData, setFormData] = useState<TournamentFormData | null>(null);

  // Moderator select dropdown state
  const [searchUser, setSearchUser] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch users for moderator dropdown
  const { data: usersData, isLoading: usersLoading } = useUsers({
    search: searchUser,
  });
  const allUsers = usersData?.users || [];

  // Initialize form state when tournament loads
  const currentFormData: TournamentFormData = formData || {
    name: tournament?.name || "",
    description: tournament?.description || "",
    rules: tournament?.rules || "",
    format: tournament?.format || "SINGLE_ELIMINATION",
    maxParticipants: tournament?.maxParticipants || 16,
    prizePool: tournament?.prizePool || "",
    startDate: tournament?.startDate
      ? new Date(tournament.startDate).toISOString().slice(0, 16)
      : "",
    registrationDeadline: tournament?.registrationDeadline
      ? new Date(tournament.registrationDeadline).toISOString().slice(0, 16)
      : "",
    status: tournament?.status || "DRAFT",
    bannerUrl: tournament?.bannerUrl || "",
  };

  if (isLoading) {
    return (
      <LoadingScreen
        fullScreen={false}
        message="LOADING MANAGEMENT PANEL"
        subMessage="AUTHENTICATING PERMISSIONS & MODERATORS..."
      />
    );
  }

  if (error || !tournament) {
    return (
      <Card className="max-w-xl mx-auto text-center p-8 space-y-4">
        <AlertTriangle size={36} className="mx-auto text-ember" />
        <CardTitle className="text-xl">Tournament Not Found</CardTitle>
        <CardDescription>
          The tournament you are attempting to manage does not exist or has been
          removed.
        </CardDescription>
        <Button variant="outline" asChild className="mx-auto">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </Card>
    );
  }

  // ── Role Evaluation ──────────────────────────────────────────────────
  const currentUsername =
    user?.username || user?.primaryEmailAddress?.emailAddress?.split("@")[0];
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

  const isPlatformAdmin = user?.publicMetadata?.role === "platform_admin";

  const canManageSettings = isCreator || isModerator || isPlatformAdmin;
  const canManageModerators = isCreator || isPlatformAdmin;
  const canDeleteTournament = isCreator || isPlatformAdmin;

  // Filter candidate users for moderator assignment
  const assignedUserIds = new Set([
    tournament.organizerId,
    tournament.organizer?.id,
    ...(tournament.moderators?.map((m: any) => m.userId || m.user?.id) || []),
  ]);

  const candidateUsers = allUsers.filter(
    (u: any) => !assignedUserIds.has(u.id),
  );

  // Handlers
  const handleFieldChange = (
    name: keyof TournamentFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...(prev || currentFormData),
      [name]: value,
    }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSettings) {
      toast.error("You do not have permission to update settings.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: tournament.id,
        payload: {
          ...currentFormData,
          maxParticipants: Number(currentFormData.maxParticipants),
        },
      });
    } catch {
      // toast handled in hook
    }
  };

  const handleAddModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a user to add as moderator");
      return;
    }

    try {
      await addModMutation.mutateAsync({
        id: tournament.id,
        userId: selectedUserId,
      });
      setSelectedUserId("");
      setSearchUser("");
    } catch {
      // toast handled in hook
    }
  };

  const handleRemoveModerator = async (modUserId: string) => {
    if (!confirm("Are you sure you want to remove this moderator?")) return;
    try {
      await removeModMutation.mutateAsync({
        id: tournament.id,
        userId: modUserId,
      });
    } catch {
      // toast handled in hook
    }
  };

  const handleDeleteTournament = async () => {
    if (!canDeleteTournament) {
      toast.error("Only the tournament creator can delete this tournament.");
      return;
    }

    try {
      await deleteMutation.mutateAsync(tournament.id);
      setIsDeleteDialogOpen(false);
      navigate("/dashboard");
    } catch {
      // toast handled in hook
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-fog hover:text-snow text-xs font-mono transition-colors"
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>
            <span className="text-line">/</span>
            <span className="text-xs font-mono text-fog uppercase">
              {tournament.game?.name || "Tournament"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display text-snow tracking-wide">
              {tournament.name}
            </h1>
            <Badge
              variant={
                tournament.status === "REGISTRATION_OPEN"
                  ? "lime"
                  : tournament.status === "ONGOING"
                    ? "cyan"
                    : tournament.status === "COMPLETED"
                      ? "outline"
                      : "ember"
              }
            >
              {tournament.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/dashboard/tournaments/${tournament.slug}`}>
              <ExternalLink size={14} className="mr-1.5" />
              Public View
            </Link>
          </Button>

          <Badge
            variant={isCreator ? "ember" : isModerator ? "cyan" : "outline"}
            className="py-1 px-3"
          >
            <Shield size={13} className="mr-1.5" />
            {isCreator
              ? "Tournament Admin (Creator)"
              : isModerator
                ? "Tournament Moderator"
                : "Participant"}
          </Badge>
        </div>
      </div>

      {/* Permission Notification Banners */}
      {!canManageSettings && (
        <div className="bg-ember/10 border border-ember/20 p-4 rounded-lg flex items-center gap-3 text-ember text-sm font-mono">
          <AlertTriangle size={18} className="shrink-0" />
          <span>
            You do not have management privileges for this tournament. Viewing
            in read-only mode.
          </span>
        </div>
      )}

      {isModerator && !isCreator && (
        <div className="bg-cyan/10 border border-cyan/20 p-4 rounded-lg flex items-start gap-3 text-cyan text-sm">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold font-mono">
              Authenticated as Tournament Moderator
            </p>
            <p className="text-xs text-cyan/80 mt-0.5">
              You can modify description, rules, format, and dates. Only the
              tournament creator (
              {tournament.organizer?.displayName ||
                tournament.organizer?.username}
              ) can assign moderators or delete this tournament.
            </p>
          </div>
        </div>
      )}

      {/* shadcn Tabs Container */}
      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={15} />
            Description & Settings
          </TabsTrigger>
          <TabsTrigger value="flow" className="flex items-center gap-2">
            <GitFork size={15} />
            Tournament Flow & Bracket ({bracketMatches.length})
          </TabsTrigger>
          <TabsTrigger value="moderators" className="flex items-center gap-2">
            <Users size={15} />
            Moderators ({tournament.moderators?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="danger"
            className="flex items-center gap-2 text-red-400 data-[state=active]:border-red-500 data-[state=active]:text-red-400"
          >
            <Trash2 size={15} />
            Danger Zone
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Description & Settings */}
        <TabsContent value="settings">
          <TournamentSettingsTab
            formData={currentFormData}
            canManageSettings={canManageSettings}
            isSaving={updateMutation.isPending}
            onFieldChange={handleFieldChange}
            onSubmit={handleSaveSettings}
          />
        </TabsContent>

        {/* Tab 2: Tournament Flow & Matches Orchestrator */}
        <TabsContent value="flow">
          <Card className="p-6 bg-surface border-line space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-display text-snow">
                  <GitFork size={18} className="text-ember" />
                  Tournament Flow Orchestrator
                </CardTitle>
                <CardDescription>
                  Interactive bracket canvas for organizers & moderators. Click any match card to update scores, declare winners, and advance participants downstream.
                </CardDescription>
              </div>
              <Badge variant="ember" className="font-mono text-xs">
                Coordinator Privileges Active
              </Badge>
            </div>

            <TournamentBracket
              matches={bracketMatches}
              tournamentName={tournament.name}
              tournamentSlug={tournament.slug}
              canManage={canManageSettings}
              defaultView="canvas"
              onRefresh={refetchBracket}
            />
          </Card>
        </TabsContent>

        {/* Tab 2: Appointed Moderators */}
        <TabsContent value="moderators">
          <TournamentModeratorsTab
            canManageModerators={canManageModerators}
            organizerName={
              tournament.organizer?.displayName ||
              tournament.organizer?.username ||
              "Creator"
            }
            moderators={tournament.moderators || []}
            candidateUsers={candidateUsers}
            usersLoading={usersLoading}
            searchUser={searchUser}
            selectedUserId={selectedUserId}
            isAssigning={addModMutation.isPending}
            isRemoving={removeModMutation.isPending}
            onSearchChange={setSearchUser}
            onSelectedUserChange={setSelectedUserId}
            onAddModerator={handleAddModerator}
            onRemoveModerator={handleRemoveModerator}
          />
        </TabsContent>

        {/* Tab 3: Danger Zone */}
        <TabsContent value="danger">
          <TournamentDangerTab
            tournamentName={tournament.name}
            canDeleteTournament={canDeleteTournament}
            isDeleteDialogOpen={isDeleteDialogOpen}
            isDeleting={deleteMutation.isPending}
            onOpenDeleteDialog={() => setIsDeleteDialogOpen(true)}
            onCloseDeleteDialog={() => setIsDeleteDialogOpen(false)}
            onConfirmDelete={handleDeleteTournament}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
