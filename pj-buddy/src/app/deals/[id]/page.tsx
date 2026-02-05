'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DealCardData } from '@/components/core/KanbanBoard';
import { QuoteGenerator } from '@/components/modules/tradie/QuoteGenerator';
import { MatchFinder } from '@/components/modules/agent/MatchFinder';
import { WorkspaceType } from '@prisma/client';

type DealDetails = DealCardData & {
    workspace: {
        type: WorkspaceType;
    };
    metadata: {
        quote_items?: { desc: string, price: number }[]
    }
};

export default function DealDetailPage() {
    const [deal, setDeal] = useState<DealDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const id = params.id as string;

    const fetchDeal = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/deals/${id}`);
            if (!res.ok) throw new Error('Failed to fetch deal details');
            const data = await res.json();
            setDeal(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!id) return;
        fetchDeal();
    }, [id]);
    
    const handleUpdate = () => {
        // Refresh the deal data after an action
        fetchDeal();
    };

    if (loading) return <div>Loading deal...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!deal) return <div>Deal not found.</div>;

    return (
        <div>
            <h1>{deal.title}</h1>
            <p><strong>Value:</strong> ${deal.value}</p>
            <p><strong>Stage:</strong> {deal.stage}</p>
            <p><strong>Contact:</strong> {deal.contact.name}</p>
            <p><strong>Workspace Type:</strong> {deal.workspace.type}</p>

            {deal.workspace.type === 'TRADIE' && (
                <>
                    {deal.metadata.quote_items && (
                        <div style={{ marginTop: '2rem' }}>
                            <h4>Generated Quote:</h4>
                            <ul>
                                {deal.metadata.quote_items.map((item, i) => (
                                    <li key={i}>{item.desc} - ${item.price}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <QuoteGenerator dealId={deal.id} onQuoteGenerated={handleUpdate} />
                </>
            )}

            {deal.workspace.type === 'AGENT' && (
                <MatchFinder dealId={deal.id} />
            )}
        </div>
    );
}
