import { UserProfile, SpriteItem, OwnershipStatus, SpriteChangeRecord } from '../types';

const STORAGE_KEY_PROFILE_A = 'fortnite_sprite_trader_profile_a_v2';
const STORAGE_KEY_PROFILE_B = 'fortnite_sprite_trader_profile_b_v2';
const STORAGE_KEY_ORIGINAL_A = 'fortnite_sprite_trader_orig_a_v2';
const STORAGE_KEY_ORIGINAL_B = 'fortnite_sprite_trader_orig_b_v2';
const STORAGE_KEY_CHANGES = 'fortnite_sprite_trader_changes_v2';

export function saveStateToStorage(
  profileA: UserProfile | null,
  profileB: UserProfile | null,
  originalA: UserProfile | null,
  originalB: UserProfile | null,
  changes: SpriteChangeRecord[]
) {
  try {
    if (profileA) localStorage.setItem(STORAGE_KEY_PROFILE_A, JSON.stringify(profileA));
    else localStorage.removeItem(STORAGE_KEY_PROFILE_A);

    if (profileB) localStorage.setItem(STORAGE_KEY_PROFILE_B, JSON.stringify(profileB));
    else localStorage.removeItem(STORAGE_KEY_PROFILE_B);

    if (originalA) localStorage.setItem(STORAGE_KEY_ORIGINAL_A, JSON.stringify(originalA));
    else localStorage.removeItem(STORAGE_KEY_ORIGINAL_A);

    if (originalB) localStorage.setItem(STORAGE_KEY_ORIGINAL_B, JSON.stringify(originalB));
    else localStorage.removeItem(STORAGE_KEY_ORIGINAL_B);

    localStorage.setItem(STORAGE_KEY_CHANGES, JSON.stringify(changes));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function loadStateFromStorage(): {
  profileA: UserProfile | null;
  profileB: UserProfile | null;
  originalA: UserProfile | null;
  originalB: UserProfile | null;
  changes: SpriteChangeRecord[] | null;
} {
  try {
    const rawA = localStorage.getItem(STORAGE_KEY_PROFILE_A);
    const rawB = localStorage.getItem(STORAGE_KEY_PROFILE_B);
    const rawOrigA = localStorage.getItem(STORAGE_KEY_ORIGINAL_A);
    const rawOrigB = localStorage.getItem(STORAGE_KEY_ORIGINAL_B);
    const rawChanges = localStorage.getItem(STORAGE_KEY_CHANGES);

    return {
      profileA: rawA ? JSON.parse(rawA) : null,
      profileB: rawB ? JSON.parse(rawB) : null,
      originalA: rawOrigA ? JSON.parse(rawOrigA) : null,
      originalB: rawOrigB ? JSON.parse(rawOrigB) : null,
      changes: rawChanges ? JSON.parse(rawChanges) : null,
    };
  } catch (err) {
    console.error('Failed to load from localStorage:', err);
    return {
      profileA: null,
      profileB: null,
      originalA: null,
      originalB: null,
      changes: null,
    };
  }
}

export function clearStateStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY_PROFILE_A);
    localStorage.removeItem(STORAGE_KEY_PROFILE_B);
    localStorage.removeItem(STORAGE_KEY_ORIGINAL_A);
    localStorage.removeItem(STORAGE_KEY_ORIGINAL_B);
    localStorage.removeItem(STORAGE_KEY_CHANGES);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
}

/**
 * Recalculate change records comparing current profiles with original baseline profiles.
 */
export function computeChangeRecords(
  currentA: UserProfile | null,
  currentB: UserProfile | null,
  originalA: UserProfile | null,
  originalB: UserProfile | null
): SpriteChangeRecord[] {
  const records: SpriteChangeRecord[] = [];

  // Check changes for Player A
  if (currentA && originalA) {
    const origMapA = new Map<string, SpriteItem>();
    originalA.sprites.forEach((s) => origMapA.set(s.id, s));

    currentA.sprites.forEach((curr) => {
      const orig = origMapA.get(curr.id);
      const origStatus: OwnershipStatus = orig ? orig.status : 'not_owned';
      if (curr.status !== origStatus) {
        records.push({
          spriteId: curr.id,
          spriteName: curr.name,
          rarity: curr.rarity,
          variant: curr.variant,
          iconUrl: curr.iconUrl,
          player: 'A',
          playerName: currentA.username,
          originalStatus: origStatus,
          currentStatus: curr.status,
          timestamp: Date.now(),
        });
      }
    });
  }

  // Check changes for Player B
  if (currentB && originalB) {
    const origMapB = new Map<string, SpriteItem>();
    originalB.sprites.forEach((s) => origMapB.set(s.id, s));

    currentB.sprites.forEach((curr) => {
      const orig = origMapB.get(curr.id);
      const origStatus: OwnershipStatus = orig ? orig.status : 'not_owned';
      if (curr.status !== origStatus) {
        records.push({
          spriteId: curr.id,
          spriteName: curr.name,
          rarity: curr.rarity,
          variant: curr.variant,
          iconUrl: curr.iconUrl,
          player: 'B',
          playerName: currentB.username,
          originalStatus: origStatus,
          currentStatus: curr.status,
          timestamp: Date.now(),
        });
      }
    });
  }

  return records;
}
