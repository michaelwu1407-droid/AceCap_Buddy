'use client';

import { useState } from 'react';
import { findMatches } from '@/actions/agent-actions';

type ContactMatch = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
};

type MatchFinderProps = {
    dealId: string;
};

export const MatchFinder = ({ dealId }: MatchFinderProps) => {
    const [matches, setMatches] = useState<ContactMatch[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleFindMatches = async () => {
        setIsSearching(true);
        setError(null);
        setMatches([]);

        const result = await findMatches({ listingId: dealId });

        if (result.success && result.data) {
            setMatches(result.data);
        } else {
             setError(Array.isArray(result.error) ? result.error.map(e => e.message).join(', ') : 'Failed to find matches.');
        }
        setIsSearching(false);
    };

    return (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #334155', borderRadius: '0.5rem' }}>
            <h4>Find Matching Buyers</h4>
            <p>Find contacts whose budget matches or exceeds this property's price.</p>
            <button onClick={handleFindMatches} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Find Matches'}
            </button>

            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

            {matches.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <h5>Top Matches:</h5>
                    <ul>
                        {matches.map(match => (
                            <li key={match.id}>{match.name} ({match.email || match.phone})</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {!isSearching && matches.length === 0 && (
                 <p style={{ marginTop: '1rem' }}>No matches found.</p>
            )}
        </div>
    );
};
