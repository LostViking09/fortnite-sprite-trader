import React from 'react';
import { SpriteItem, OwnershipStatus } from '../types';
import { SpriteCard } from './SpriteCard';
import { PackageOpen } from 'lucide-react';

export interface MergedSpriteComparison {
  id: string;
  name: string;
  parent: string;
  rarity: string;
  variant: string;
  dropChance: string;
  iconUrl: string;
  spriteA?: SpriteItem;
  spriteB?: SpriteItem;
  isModifiedA?: boolean;
  isModifiedB?: boolean;
  searchString?: string;
}

interface SpriteGridProps {
  items: MergedSpriteComparison[];
  usernameA: string;
  usernameB: string;
  onChangeStatus?: (spriteId: string, player: 'A' | 'B', newStatus: OwnershipStatus) => void;
}

export const SpriteGrid: React.FC<SpriteGridProps> = ({
  items,
  usernameA,
  usernameB,
  onChangeStatus,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-zinc-500 mb-3">
          <PackageOpen className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-zinc-300">No Sprites Found</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          No sprites matched the selected filters and comparison criteria. Try changing your variant, rarity, or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <SpriteCard
          key={item.id}
          id={item.id}
          spriteA={item.spriteA}
          spriteB={item.spriteB}
          name={item.name}
          rarity={item.rarity}
          variant={item.variant}
          dropChance={item.dropChance}
          iconUrl={item.iconUrl}
          usernameA={usernameA}
          usernameB={usernameB}
          isModifiedA={item.isModifiedA}
          isModifiedB={item.isModifiedB}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};
