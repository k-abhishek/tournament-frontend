import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function CreateTournamentForm() {
  const { id } = useParams();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!id) return;
    setIsPublishing(true);
    try {
      // In a real implementation this would use your API client
      const res = await fetch(`/api/tournaments/${id}/publish`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Tournament published successfully!');
      } else {
        alert('Failed to publish tournament');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{id ? 'Manage Tournament' : 'Create Tournament'}</h1>
      
      {id && (
        <div className="bg-surface border border-border p-4 rounded-md flex items-center justify-between">
          <div>
            <h3 className="font-medium">Tournament Status: DRAFT</h3>
            <p className="text-sm text-text-muted">Publish your tournament to make it visible on the public feed.</p>
          </div>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90"
          >
            {isPublishing ? 'Publishing...' : 'Publish Tournament'}
          </button>
        </div>
      )}
      
      {/* Rest of the form placeholder */}
      <div className="bg-background border border-border p-8 rounded-md text-center text-text-muted">
        Form fields go here...
      </div>
    </div>
  );
}