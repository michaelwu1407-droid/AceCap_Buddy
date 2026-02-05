'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DealStage } from '@prisma/client';
import { KanbanColumn } from './KanbanColumn';

// Define the structure for deals passed to the board
export type DealCardData = {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  contact: {
    name: string;
  };
};

// Define the columns based on the DealStage enum
const columns = Object.values(DealStage);

type KanbanBoardProps = {
  deals: DealCardData[];
  onDragEnd: (dealId: string, newStage: DealStage) => void;
};

export const KanbanBoard = ({ deals, onDragEnd }: KanbanBoardProps) => {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // The `over.id` for a column is its title (e.g., 'NEW', 'QUALIFIED')
      // The `active.id` is the deal's ID.
      const dealId = active.id;
      const newStage = over.id as DealStage;
      onDragEnd(dealId, newStage);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '1rem' }}>
        {columns.map((stage) => {
          const dealsInStage = deals.filter((deal) => deal.stage === stage);
          return (
            <KanbanColumn key={stage} stage={stage} deals={dealsInStage} />
          );
        })}
      </div>
    </DndContext>
  );
};
