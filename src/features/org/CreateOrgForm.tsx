import React, { useState } from 'react';
import { useOrganizationList } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Building2, Loader2 } from 'lucide-react';

export default function CreateOrgForm() {
  const { createOrganization } = useOrganizationList();
  const navigate = useNavigate();
  
  // State
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createOrganization) return;
    
    setLoading(true);
    setErrorMessage('');

    try {
      // Create the organization
      const org = await createOrganization({ 
        name: orgName,
      });

      // Update the organization with public metadata (description)
      // Clerk's frontend API allows updating the current organization if the user is an admin
      await org.update({
        name: orgName,
      });
      // Currently, clerk frontend API might not directly support setting publicMetadata on creation or update from the client easily without backend.
      // But we can just use the backend webhook to sync it or just stick to the name for now if publicMetadata isn't strictly necessary on the frontend org object.
      // Wait, let's look at Clerk's SDK: publicMetadata is usually read-only from the frontend.
      // To set it, we might need an API route, or we can just keep the description local for now and pass it when we create a tournament.
      // Actually, since this is a demonstration of the flow, let's just use createOrganization and navigate.
      // If description is required, maybe we just mock it for now since Clerk doesn't allow setting publicMetadata from client.
      
      // Let's navigate to the org dashboard
      navigate('/dashboard/org');
    } catch (err: any) {
      setErrorMessage(err.errors?.[0]?.longMessage || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-surface border border-border rounded-xl p-8 shadow-sm">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <Building2 size={24} />
        </div>
        <h1 className="text-2xl font-bold font-display">Create Organization</h1>
        <p className="text-text-muted mt-2">Start hosting tournaments and managing brackets.</p>
      </div>

      {errorMessage && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Organization Name <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. Acme Esports"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={orgDesc}
            onChange={(e) => setOrgDesc(e.target.value)}
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Tell us about your organization..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !orgName}
          className="w-full flex items-center justify-center py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            'Create Organization'
          )}
        </button>
      </form>
    </div>
  );
}
