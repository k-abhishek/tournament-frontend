import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGames, useCreateTournament } from '@/hooks/useTournaments';
import { Trophy, Calendar, Users, Shield, ArrowLeft, Gamepad2, Award } from 'lucide-react';

// shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateTimePicker } from '@/components/ui/date-time-picker';

export default function CreateTournamentForm() {
  const navigate = useNavigate();
  const { data: gamesData, isLoading: gamesLoading } = useGames();
  const createMutation = useCreateTournament();

  const [formData, setFormData] = useState({
    name: '',
    gameId: '',
    format: 'SINGLE_ELIMINATION',
    maxParticipants: 16,
    isTeamBased: true,
    teamSize: 5,
    prizePool: '',
    startDate: '',
    registrationDeadline: '',
    description: '',
    rules: '',
    bannerUrl: '',
  });

  const games = gamesData?.games || [
    { id: 'g1', name: 'Valorant', slug: 'valorant' },
    { id: 'g2', name: 'CS2', slug: 'cs2' },
    { id: 'g3', name: 'BGMI', slug: 'bgmi' },
    { id: 'g4', name: 'Apex Legends', slug: 'apex_legends' },
  ];

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.gameId || !formData.startDate) {
      alert('Please fill in Tournament Name, Game, and Start Date.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        ...formData,
        maxParticipants: Number(formData.maxParticipants),
        teamSize: formData.isTeamBased ? Number(formData.teamSize) : 1,
      });

      if (result?.tournament?.slug) {
        navigate(`/dashboard/tournaments/${result.tournament.slug}/manage`);
      } else {
        navigate('/dashboard');
      }
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-fog hover:text-snow"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Dashboard
        </Button>
        <Badge variant="ember">Creator is Tournament Admin</Badge>
      </div>

      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-ember/10 border border-ember/20 text-ember">
            <Trophy size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display text-snow tracking-wide">Host a New Tournament</h1>
            <p className="text-sm text-fog mt-0.5">
              You will be assigned as the Tournament Admin. You can assign moderators once created.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details Section */}
        <Card>
          <CardHeader className="border-b border-line pb-4">
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 size={16} className="text-ember" />
              General Information
            </CardTitle>
            <CardDescription>Primary identity, game title, and public details.</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase text-fog block">
                Tournament Title <span className="text-ember">*</span>
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g. Winter Valorant Championship 2026"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">
                Game Title <span className="text-ember">*</span>
              </label>
              <Select
                value={formData.gameId}
                onValueChange={(val) => handleFieldChange('gameId', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={gamesLoading ? 'Loading games...' : 'Select a game'} />
                </SelectTrigger>
                <SelectContent>
                  {games.map((g: any) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">
                Tournament Format <span className="text-ember">*</span>
              </label>
              <Select
                value={formData.format}
                onValueChange={(val) => handleFieldChange('format', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_ELIMINATION">Single Elimination</SelectItem>
                  <SelectItem value="DOUBLE_ELIMINATION">Double Elimination</SelectItem>
                  <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
                  <SelectItem value="SWISS">Swiss System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-mono uppercase text-fog block">Description / Overview</label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Brief summary of the tournament, broadcast details, or community notes..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Structure & Team Settings */}
        <Card>
          <CardHeader className="border-b border-line pb-4">
            <CardTitle className="flex items-center gap-2">
              <Users size={16} className="text-cyan" />
              Roster & Bracket Configuration
            </CardTitle>
            <CardDescription>Setup team sizes, slot capacity, and roster constraints.</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">Max Participants / Teams</label>
              <Select
                value={String(formData.maxParticipants)}
                onValueChange={(val) => handleFieldChange('maxParticipants', Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 Slots</SelectItem>
                  <SelectItem value="16">16 Slots</SelectItem>
                  <SelectItem value="32">32 Slots</SelectItem>
                  <SelectItem value="64">64 Slots</SelectItem>
                  <SelectItem value="128">128 Slots</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">Participation Type</label>
              <div className="flex items-center gap-4 h-9">
                <label className="flex items-center gap-2 text-sm text-snow cursor-pointer">
                  <input
                    type="radio"
                    name="isTeamBased"
                    checked={formData.isTeamBased === true}
                    onChange={() => handleFieldChange('isTeamBased', true)}
                    className="accent-ember"
                  />
                  Team Based
                </label>
                <label className="flex items-center gap-2 text-sm text-snow cursor-pointer">
                  <input
                    type="radio"
                    name="isTeamBased"
                    checked={formData.isTeamBased === false}
                    onChange={() => handleFieldChange('isTeamBased', false)}
                    className="accent-ember"
                  />
                  Solo / 1v1
                </label>
              </div>
            </div>

            {formData.isTeamBased && (
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-fog block">Players Per Team</label>
                <Input
                  type="number"
                  min={2}
                  max={10}
                  value={formData.teamSize}
                  onChange={(e) => handleFieldChange('teamSize', Number(e.target.value))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule & Prize Pool */}
        <Card>
          <CardHeader className="border-b border-line pb-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar size={16} className="text-lime" />
              Schedule & Rewards
            </CardTitle>
            <CardDescription>Dates, registration deadlines, and prize incentives.</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">
                Start Date & Time <span className="text-ember">*</span>
              </label>
              <DateTimePicker
                value={formData.startDate}
                onChange={(val) => handleFieldChange('startDate', val)}
                placeholder="Pick tournament start date & time"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">Registration Deadline</label>
              <DateTimePicker
                value={formData.registrationDeadline}
                onChange={(val) => handleFieldChange('registrationDeadline', val)}
                placeholder="Pick registration deadline"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">Prize Pool</label>
              <div className="relative">
                <Input
                  placeholder="e.g. $5,000 or ₹50,000"
                  value={formData.prizePool}
                  onChange={(e) => handleFieldChange('prizePool', e.target.value)}
                  className="pl-9"
                />
                <Award size={16} className="absolute left-3 top-2.5 text-fog" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules & Media */}
        <Card>
          <CardHeader className="border-b border-line pb-4">
            <CardTitle className="flex items-center gap-2">
              <Shield size={16} className="text-fog" />
              Rules & Media
            </CardTitle>
            <CardDescription>Guidelines, dispute policies, and cover image.</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">Cover Image / Banner URL</label>
              <Input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.bannerUrl}
                onChange={(e) => handleFieldChange('bannerUrl', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-fog block">Tournament Rules & Guidelines</label>
              <Textarea
                rows={4}
                value={formData.rules}
                onChange={(e) => handleFieldChange('rules', e.target.value)}
                placeholder="Specify match dispute protocol, map pool, check-in window, and communication channels (e.g. Discord)..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="ember"
            size="lg"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating Tournament...' : 'Host Tournament'}
          </Button>
        </div>
      </form>
    </div>
  );
}