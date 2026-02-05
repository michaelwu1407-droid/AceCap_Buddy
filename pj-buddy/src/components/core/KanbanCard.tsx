'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DealCardData } from './KanbanBoard';

type KanbanCardProps = {
  deal: DealCardData;
};

export const KanbanCard = ({ deal }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '1rem',
    marginBottom: '0.5rem',
    backgroundColor: '#334155', // slate-700
    borderRadius: '0.5rem',
    color: '#e2e8f0', // slate-200
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3 style={{ margin: 0, fontSize: '1rem' }}>{deal.title}</h3>
      <p style={{ margin: '0.25rem 0', color: '#94a3b8' }}>
        ${deal.value}
      </p>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>
        {deal.contact.name}
      </p>
    </div>
  );
};
