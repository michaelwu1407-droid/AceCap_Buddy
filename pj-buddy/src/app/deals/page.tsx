'use client';

import { useEffect, useState, FormEvent } from 'react';
import { KanbanBoard, DealCardData } from '@/components/core/KanbanBoard';
import { DealStage } from '@prisma/client';

// Re-using types from previous implementation
type Contact = { id: string; name: string; };
type Workspace = { id: string; name: string; };

export default function DealsPage() {
  const [deals, setDeals] = useState<DealCardData[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newValue, setNewValue] = useState(0);
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [isFormVisible, setIsFormVisible] = useState(false);


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
        } else {
          setLoading(false);
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
        const [contactsRes, dealsRes] = await Promise.all([
          fetch(`/api/contacts?workspaceId=${selectedWorkspace}`),
          fetch(`/api/deals?workspaceId=${selectedWorkspace}`)
        ]);

        if (!contactsRes.ok) throw new Error('Failed to fetch contacts');
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
        if (contactsData.length > 0) {
          setSelectedContact(contactsData[0].id);
        }

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
      const newDeal = await res.json();
      setDeals(prevDeals => [...prevDeals, newDeal]);

      setNewTitle('');
      setNewValue(0);
      setIsFormVisible(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDragEnd = async (dealId: string, newStage: DealStage) => {
    // Optimistically update the UI
    const originalDeals = deals;
    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );

    // Update the backend
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!response.ok) {
        throw new Error('Failed to update deal stage');
      }
    } catch (error) {
      console.error(error);
      // Revert the UI on failure
      setDeals(originalDeals);
      setError('Failed to update deal. Please try again.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
        <h1>Deals Pipeline</h1>
        <div>
          <select value={selectedWorkspace} onChange={e => setSelectedWorkspace(e.target.value)}>
             {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
          </select>
          <button onClick={() => setIsFormVisible(!isFormVisible)} style={{ marginLeft: '1rem' }}>
            {isFormVisible ? 'Cancel' : '+ New Deal'}
          </button>
        </div>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} style={{ margin: '1rem', padding: '1rem', backgroundColor: '#1f2937', borderRadius: '0.5rem' }}>
          <h2>Add New Deal</h2>
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Deal Title" required />
          <input type="number" value={newValue} onChange={e => setNewValue(Number(e.target.value))} placeholder="Value" />
          <select value={selectedContact} onChange={e => setSelectedContact(e.target.value)}>
            <option value="">Select a contact</option>
            {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="submit">Add Deal</button>
        </form>
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {!loading && !error && <KanbanBoard deals={deals} onDragEnd={handleDragEnd} />}
    </div>
  );
}
