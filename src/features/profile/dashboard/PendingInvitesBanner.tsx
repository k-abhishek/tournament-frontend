import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardInviteCard } from "./DashboardInviteCard";

interface PendingInvitesBannerProps {
  pendingInvites: any[];
}

export function PendingInvitesBanner({ pendingInvites }: PendingInvitesBannerProps) {
  if (pendingInvites.length === 0) return null;

  return (
    <Card className="border-cyan/40 bg-surface/90 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan via-ember to-lime" />
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-cyan/15 text-cyan border border-cyan/30">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-display text-snow font-semibold flex items-center gap-2">
                Incoming Team Invitations
                <Badge className="bg-ember text-ink font-mono text-xs">
                  {pendingInvites.length} Pending
                </Badge>
              </h2>
              <p className="text-xs text-fog">
                You have been invited to join tournament rosters. Accept to confirm your candidacy.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {pendingInvites.map((invite) => (
            <DashboardInviteCard key={invite.id} invite={invite} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
