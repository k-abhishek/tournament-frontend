import React from 'react';
import { Gamepad2, Award, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface TournamentFormData {
  name: string;
  description: string;
  rules: string;
  format: string;
  maxParticipants: number;
  prizePool: string;
  startDate: string;
  registrationDeadline: string;
  status: string;
  bannerUrl: string;
}

interface TournamentSettingsTabProps {
  formData: TournamentFormData;
  canManageSettings: boolean;
  isSaving: boolean;
  onFieldChange: (field: keyof TournamentFormData, value: string | number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Settings tab for updating tournament details, rules, schedule, and statuses.
 * Accessible to Tournament Creator, Appointed Moderators, and Platform Admins.
 */
export function TournamentSettingsTab({
  formData,
  canManageSettings,
  isSaving,
  onFieldChange,
  onSubmit,
}: TournamentSettingsTabProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader className="border-b border-line pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 size={16} className="text-ember" />
              Tournament Details & Content
            </CardTitle>
            <CardDescription>
              Configure settings, rules, format, and public descriptions.
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-fog">Editable by Admin & Moderators</span>
        </CardHeader>

        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono uppercase text-fog block">Tournament Title</label>
            <Input
              name="name"
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              disabled={!canManageSettings}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-fog block">Tournament Status</label>
            <Select
              value={formData.status}
              onValueChange={(val) => onFieldChange('status', val)}
              disabled={!canManageSettings}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="REGISTRATION_OPEN">REGISTRATION OPEN</SelectItem>
                <SelectItem value="ONGOING">ONGOING (In Progress)</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-fog block">Tournament Format</label>
            <Select
              value={formData.format}
              onValueChange={(val) => onFieldChange('format', val)}
              disabled={!canManageSettings}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE_ELIMINATION">Single Elimination</SelectItem>
                <SelectItem value="DOUBLE_ELIMINATION">Double Elimination</SelectItem>
                <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
                <SelectItem value="SWISS">Swiss</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono uppercase text-fog block">Description</label>
            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) => onFieldChange('description', e.target.value)}
              disabled={!canManageSettings}
              placeholder="Provide tournament overview, broadcast schedules, prize information..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono uppercase text-fog block">Rules & Guidelines</label>
            <Textarea
              rows={4}
              value={formData.rules}
              onChange={(e) => onFieldChange('rules', e.target.value)}
              disabled={!canManageSettings}
              placeholder="Specify match dispute protocol, check-in window, conduct rules..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-fog block">Max Slots</label>
            <Input
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => onFieldChange('maxParticipants', Number(e.target.value))}
              disabled={!canManageSettings}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-fog block">Prize Pool / Reward</label>
            <div className="relative">
              <Input
                value={formData.prizePool}
                onChange={(e) => onFieldChange('prizePool', e.target.value)}
                disabled={!canManageSettings}
                placeholder="e.g. $5,000 or ₹50,000"
                className="pl-9"
              />
              <Award size={16} className="absolute left-3 top-2.5 text-fog" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-fog block">Start Date & Time</label>
            <DateTimePicker
              value={formData.startDate}
              onChange={(val) => onFieldChange('startDate', val)}
              disabled={!canManageSettings}
              placeholder="Pick tournament start date & time"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-fog block">Registration Deadline</label>
            <DateTimePicker
              value={formData.registrationDeadline}
              onChange={(val) => onFieldChange('registrationDeadline', val)}
              disabled={!canManageSettings}
              placeholder="Pick registration deadline"
            />
          </div>
        </CardContent>

        {canManageSettings && (
          <CardFooter className="justify-end border-t border-line pt-4">
            <Button type="submit" variant="ember" disabled={isSaving}>
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  );
}
