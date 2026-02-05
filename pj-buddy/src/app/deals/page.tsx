'use client';

import { useEffect, useState, FormEvent } from 'react';

// Basic type definitions
type Deal = {
  id: string;
  title: string;
  value: number;
  stage: string;
  contact: { id: string; name: string; };
};
type Contact = { id: string; name: string; };
type Workspace = { id: string; name: string; };

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newValue, setNewValue] = useState(0);
  const [selectedContact, setSelectedContact] = useState<string>('');

  // Fetch workspaces on initial load
  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const res = await fetch('/api/workspaces');
        if (!res.ok) throw new Error('Failed to fetch workspaces');
        const data = await res.json();
        setWorkspaces(data);
        if (data.length > 0) {
          setSelectedWorkspace(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
    fetchWorkspaces();
  }, []);

  // Fetch contacts and deals when workspace changes
  useEffect(() => {
    if (!selectedWorkspace) return;
    
    async function fetchDataForWorkspace() {
      setLoading(true);
      setError(null);
      try {
        // Fetch contacts for the form dropdown
        const contactsRes = await fetch(`/api/contacts?workspaceId=${selectedWorkspace}`);
        if (!contactsRes.ok) throw new Error('Failed to fetch contacts');
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
        if (contactsData.length > 0) {
          setSelectedContact(contactsData[0].id);
        }

        // Fetch deals
        const dealsRes = await fetch(`/api/deals?workspaceId=${selectedWorkspace}`);
        if (!dealsRes.ok) throw new Error('Failed to fetch deals');
        const dealsData = await dealsRes.json();
        setDeals(dealsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchDataForWorkspace();
  }, [selectedWorkspace]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedWorkspace || !selectedContact) {
      setError("A workspace and contact must be selected.");
      return;
    }
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          value: Number(newValue),
          contact_id: selectedContact,
          workspace_id: selectedWorkspace,
        }),
      });
      if (!res.ok) throw new Error('Failed to create deal');
      
      // Refetch deals list
      const dealsRes = await fetch(`/api/deals?workspaceId=${selectedWorkspace}`);
      const dealsData = await dealsRes.json();
      setDeals(dealsData);

      setNewTitle('');
      setNewValue(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Deals</h1>
      <select value={selectedWorkspace} onChange={e => setSelectedWorkspace(e.target.value)}>
        {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
      </select>

      <form onSubmit={handleSubmit} style={{ margin: '2rem 0' }}>
        <h2>Add New Deal</h2>
        <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Deal Title" required />
        <input type="number" value={newValue} onChange={e => setNewValue(Number(e.target.value))} placeholder="Value" />
        <select value={selectedContact} onChange={e => setSelectedContact(e.target.value)}>
          {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit">Add Deal</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <ul>
        {deals.map(deal => (
          <li key={deal.id}>
            <strong>{deal.title}</strong> (${deal.value}) - {deal.stage} - <em>{deal.contact.name}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
