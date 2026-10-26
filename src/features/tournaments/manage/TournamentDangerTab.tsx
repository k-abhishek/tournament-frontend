import { ShieldAlert, Trash2, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface TournamentDangerTabProps {
  tournamentName: string;
  canDeleteTournament: boolean;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  onOpenDeleteDialog: () => void;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
}

/**
 * Danger zone tab for tournament deletion with confirmation modal.
 * Restricted strictly to the tournament creator (owner) or platform admins.
 */
export function TournamentDangerTab({
  tournamentName,
  canDeleteTournament,
  isDeleteDialogOpen,
  isDeleting,
  onOpenDeleteDialog,
  onCloseDeleteDialog,
  onConfirmDelete,
}: TournamentDangerTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <ShieldAlert size={20} />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently eliminate this tournament, including all registered teams, brackets, and match records.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded bg-background border border-line">
            <div>
              <p className="text-sm font-mono text-snow font-semibold">Delete Tournament</p>
              <p className="text-xs text-fog mt-0.5">
                {canDeleteTournament
                  ? 'Only the Tournament Creator or System Admin has authority to perform this irreversible action.'
                  : 'Disabled: Only the tournament creator can delete this event.'}
              </p>
            </div>

            {canDeleteTournament ? (
              <Button variant="destructive" onClick={onOpenDeleteDialog}>
                <Trash2 size={15} />
                Delete Tournament
              </Button>
            ) : (
              <Badge variant="outline" className="py-2 px-3 text-fog">
                <Lock size={13} className="mr-1.5" />
                Restricted to Creator
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onCloseDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle size={20} />
              Confirm Tournament Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong className="text-snow">{tournamentName}</strong>?
              All participant registrations and bracket trees will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseDeleteDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete Tournament'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
