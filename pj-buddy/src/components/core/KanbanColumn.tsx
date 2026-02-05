'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { DealStage } from '@prisma/client';
import { DealCardData } from './KanbanBoard';
import { KanbanCard } from './KanbanCard';

type KanbanColumnProps = {
  stage: DealStage;
  deals: DealCardData[];
};

export const KanbanColumn = ({ stage, deals }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: stage, // The ID of the droppable area is the stage name
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: '1 1 280px',
        minWidth: '280px',
        backgroundColor: '#1f2937', // slate-800
        borderRadius: '0.75rem',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ color: '#f1f5f9', borderBottom: '2px solid #334155', paddingBottom: '0.5rem' }}>
        {stage}
      </h2>
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <KanbanCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
