'use client';

import { useEffect, useState, FormEvent } from 'react';

type Workspace = {
  id: string;
  name: string;
  type: 'TRADIE' | 'AGENT';
  branding_color: string | null;
};

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'TRADIE' | 'AGENT'>('TRADIE');

  async function fetchWorkspaces() {
    try {
      setLoading(true);
      const response = await fetch('/api/workspaces');
      if (!response.ok) {
        throw new Error('Failed to fetch workspaces');
      }
      const data = await response.json();
      setWorkspaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, type: newType }),
      });

      if (!response.ok) {
        throw new Error('Failed to create workspace');
      }

      // Clear form and refetch list
      setNewName('');
      setNewType('TRADIE');
      fetchWorkspaces();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div>
      <h1>Workspaces</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h2>Create New Workspace</h2>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="type">Type:</label>
          <select 
            id="type"
            value={newType} 
            onChange={(e) => setNewType(e.target.value as 'TRADIE' | 'AGENT')}
          >
            <option value="TRADIE">Tradie</option>
            <option value="AGENT">Agent</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Create</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      <ul>
        {workspaces.map((ws) => (
          <li key={ws.id}>
            {ws.name} ({ws.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
