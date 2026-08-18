export type SpriteRarity = 'mythic' | 'legendary' | 'epic' | 'rare' | 'special' | 'uncommon' | 'common' | string;
export type SpriteVariant = 'base' | 'gold' | 'candy' | 'galaxy' | 'gem' | 'holofoil' | 'cube' | 'quack' | string;
export type OwnershipStatus = 'not_owned' | 'owned' | 'mastered';

export interface SpriteItem {
  id: string;
  name: string;
  parent: string;
  rarity: SpriteRarity;
  variant: SpriteVariant;
  owned: boolean;
  mastered: boolean;
  level: number; // -1 = not owned, 1 = owned, 5 = mastered
  status: OwnershipStatus;
  iconUrl: string;
  dropChance: string;
  detailUrl?: string;
  isNew?: boolean;
}

export interface UserProfile {
  id: string;
  url: string;
  username: string;
  avatarUrl: string;
  ownedCount: number;
  masteredCount: number;
  totalCount: number;
  sprites: SpriteItem[];
}

export type ComparisonMode =
  | 'missing_a' // Missing for User A (User B has it)
  | 'missing_b' // Missing for User B (User A has it)
  | 'both_missing' // Both are missing
  | 'mastery_diff' // Both own, but only one mastered
  | 'all_matrix'; // Side-by-side full matrix

export interface TradeMatchPair {
  id: string;
  rarity: string;
  variant: string;
  giveToB: SpriteItem; // A has it, B needs it
  giveToA: SpriteItem; // B has it, A needs it
  fairnessScore: number;
}

export interface SpriteChangeRecord {
  spriteId: string;
  spriteName: string;
  rarity: string;
  variant: string;
  iconUrl: string;
  player: 'A' | 'B';
  playerName: string;
  originalStatus: OwnershipStatus;
  currentStatus: OwnershipStatus;
  timestamp: number;
}
