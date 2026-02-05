'use client';

import { useEffect, useState, FormEvent } from 'react';

// Basic type definitions, assuming a workspace context is somehow provided
type Contact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

type Workspace = {
  id: string;
  name: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Fetch workspaces to populate selector
  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const response = await fetch('/api/workspaces');
        if (!response.ok) throw new Error('Failed to fetch workspaces');
        const data = await response.json();
        setWorkspaces(data);
        if (data.length > 0) {
          setSelectedWorkspace(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error');
      }
    }
    fetchWorkspaces();
  }, []);

  // Fetch contacts when a workspace is selected
  useEffect(() => {
    if (!selectedWorkspace) return;

    async function fetchContacts() {
      setLoading(true);
      try {
        const response = await fetch(`/api/contacts?workspaceId=${selectedWorkspace}`);
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, [selectedWorkspace]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedWorkspace) {
      setError("Please select a workspace first.");
      return;
    }
    setError(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail, workspaceId: selectedWorkspace }),
      });

      if (!response.ok) throw new Error('Failed to create contact');
      
      // Refetch contacts
      const updatedContactsRes = await fetch(`/api/contacts?workspaceId=${selectedWorkspace}`);
      const updatedContacts = await updatedContactsRes.json();
      setContacts(updatedContacts);

      setNewName('');
      setNewEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error');
    }
  };

  return (
    <div>
      <h1>Contacts</h1>
      
      <div>
        <label htmlFor="workspace-select">Select Workspace: </label>
        <select id="workspace-select" value={selectedWorkspace} onChange={e => setSelectedWorkspace(e.target.value)}>
          {workspaces.map(ws => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
        </select>
      </div>

      <form onSubmit={handleSubmit} style={{ margin: '2rem 0' }}>
        <h2>Add New Contact</h2>
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" required />
        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Add Contact</button>
      </form>

      {loading && <p>Loading contacts...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>{contact.name} - {contact.email || 'No email'}</li>
        ))}
      </ul>
    </div>
  );
}
