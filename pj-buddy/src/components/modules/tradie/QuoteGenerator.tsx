'use client';

import { useState } from 'react';
import { generateQuote } from '@/actions/tradie-actions';

type QuoteItem = {
    desc: string;
    price: number;
};

type QuoteGeneratorProps = {
    dealId: string;
    onQuoteGenerated: (updatedDeal: any) => void;
};

export const QuoteGenerator = ({ dealId, onQuoteGenerated }: QuoteGeneratorProps) => {
    const [items, setItems] = useState<QuoteItem[]>([{ desc: '', price: 0 }]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleItemChange = (index: number, field: keyof QuoteItem, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { desc: '', price: 0 }]);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        
        const result = await generateQuote({ dealId, items });

        if (result.success) {
            onQuoteGenerated(result.data);
        } else {
            setError(Array.isArray(result.error) ? result.error.map(e => e.message).join(', ') : 'Failed to generate quote.');
        }
        setIsSubmitting(false);
    };

    return (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #334155', borderRadius: '0.5rem' }}>
            <h4>Generate Quote</h4>
            {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={item.desc} 
                        onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
                    />
                    <input 
                        type="number" 
                        placeholder="Price" 
                        value={item.price} 
                        onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                    />
                </div>
            ))}
            <button onClick={addItem}>+ Add Item</button>
            <button onClick={handleSubmit} disabled={isSubmitting} style={{ marginLeft: '1rem' }}>
                {isSubmitting ? 'Generating...' : 'Generate and Update Deal'}
            </button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    );
};
