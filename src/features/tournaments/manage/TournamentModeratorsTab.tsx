import React from 'react';
import { UserPlus, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserCandidate {
  id: string;
  username: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

interface ModeratorEntry {
  id?: string;
  userId?: string;
  assignedAt: string;
  user?: {
    id?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

interface TournamentModeratorsTabProps {
  canManageModerators: boolean;
  organizerName: string;
  moderators: ModeratorEntry[];
  candidateUsers: UserCandidate[];
  usersLoading: boolean;
  searchUser: string;
  selectedUserId: string;
  isAssigning: boolean;
  isRemoving: boolean;
  onSearchChange: (search: string) => void;
  onSelectedUserChange: (userId: string) => void;
  onAddModerator: (e: React.FormEvent) => void;
  onRemoveModerator: (userId: string) => void;
}

/**
 * Moderator assignment and roster management tab.
 * Restricted to Tournament Creator (Owner) and Platform Admins.
 */
export function TournamentModeratorsTab({
  canManageModerators,
  organizerName,
  moderators,
  candidateUsers,
  usersLoading,
  searchUser,
  selectedUserId,
  isAssigning,
  isRemoving,
  onSearchChange,
  onSelectedUserChange,
  onAddModerator,
  onRemoveModerator,
}: TournamentModeratorsTabProps) {
  return (
    <div className="space-y-6">
      {canManageModerators ? (
        <Card>
          <CardHeader className="border-b border-line pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Assign Tournament Moderator</CardTitle>
              <CardDescription>
                Select registered platform users to grant co-management capabilities.
              </CardDescription>
            </div>
            <Badge variant="ember">Admin Control</Badge>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={onAddModerator} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User search filter */}
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-xs font-mono uppercase text-fog block">Filter Users</label>
                  <Input
                    placeholder="Search by username..."
                    value={searchUser}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>

                {/* User selection dropdown */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-mono uppercase text-fog block">
                    Select Platform User <span className="text-ember">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Select value={selectedUserId} onValueChange={onSelectedUserChange}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              usersLoading
                                ? 'Loading users...'
                                : candidateUsers.length === 0
                                ? 'No eligible users found'
                                : '-- Choose user to appoint as moderator --'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {candidateUsers.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.displayName ? `${u.displayName} (@${u.username})` : `@${u.username}`} - {u.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      variant="ember"
                      disabled={!selectedUserId || isAssigning}
                    >
                      <UserPlus size={15} />
                      {isAssigning ? 'Assigning...' : 'Add Moderator'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed text-center p-8 space-y-2">
          <Lock size={24} className="mx-auto text-fog" />
          <CardTitle className="text-base">Moderator Assignment Locked</CardTitle>
          <CardDescription>
            Only the tournament creator ({organizerName}) can assign or remove moderators.
          </CardDescription>
        </Card>
      )}

      {/* Current Appointed Moderators List */}
      <Card>
        <CardHeader className="border-b border-line pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Appointed Moderators</CardTitle>
          <Badge variant="outline">{moderators.length} Total</Badge>
        </CardHeader>

        <CardContent className="pt-4">
          {moderators.length === 0 ? (
            <div className="py-8 text-center text-sm font-mono text-fog">
              No moderators appointed yet. The tournament creator manages this event solo.
            </div>
          ) : (
            <div className="divide-y divide-line">
              {moderators.map((mod) => (
                <div key={mod.id || mod.userId} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={mod.user?.avatarUrl} alt={mod.user?.username} />
                      <AvatarFallback>
                        {(mod.user?.username || 'M')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-snow">
                          {mod.user?.displayName || `@${mod.user?.username}`}
                        </span>
                        <span className="text-xs font-mono text-fog">@{mod.user?.username}</span>
                      </div>
                      <span className="text-[11px] font-mono text-fog/70">
                        Appointed: {new Date(mod.assignedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {canManageModerators && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveModerator(mod.userId || mod.user?.id || '')}
                      disabled={isRemoving}
                      className="hover:text-destructive hover:bg-destructive/10"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
