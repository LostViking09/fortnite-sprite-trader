/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserProfile, ComparisonMode, OwnershipStatus, SpriteChangeRecord } from './types';
import { Navbar } from './components/Navbar';
import { ProfileComparisonHeader } from './components/ProfileComparisonHeader';
import { ComparisonTabs } from './components/ComparisonTabs';
import { FilterControls, MasteredFilter } from './components/FilterControls';
import { SpriteGrid, MergedSpriteComparison } from './components/SpriteGrid';
import { SpriteTable } from './components/SpriteTable';
import { PasteHtmlModal } from './components/PasteHtmlModal';
import { ChangesRundownModal } from './components/ChangesRundownModal';
import { EmptyStateOnboarding } from './components/EmptyStateOnboarding';
import {
  saveStateToStorage,
  loadStateFromStorage,
  clearStateStorage,
  computeChangeRecords,
} from './utils/storage';
import { ClipboardList } from 'lucide-react';

export default function App() {
  // Base original profiles (from initial HTML imports)
  const [originalProfileA, setOriginalProfileA] = useState<UserProfile | null>(null);
  const [originalProfileB, setOriginalProfileB] = useState<UserProfile | null>(null);

  // Active modified profiles (with client-side edits)
  const [profileA, setProfileA] = useState<UserProfile | null>(null);
  const [profileB, setProfileB] = useState<UserProfile | null>(null);

  // Tracked client-side changes
  const [changeRecords, setChangeRecords] = useState<SpriteChangeRecord[]>([]);

  // Default view is now "Full inventory matrix" ('all_matrix')
  const [activeMode, setActiveMode] = useState<ComparisonMode>('all_matrix');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [masteredFilter, setMasteredFilter] = useState<MasteredFilter>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search input ref for Ctrl-F focus & highlight
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [isPasteModalOpen, setIsPasteModalOpen] = useState<boolean>(false);
  const [pasteModalSlot, setPasteModalSlot] = useState<'A' | 'B'>('A');
  const [isChangesModalOpen, setIsChangesModalOpen] = useState<boolean>(false);

  // Load persistent state from storage on mount
  useEffect(() => {
    const stored = loadStateFromStorage();
    if (stored.profileA || stored.profileB) {
      setProfileA(stored.profileA);
      setProfileB(stored.profileB);
      setOriginalProfileA(stored.originalA || stored.profileA);
      setOriginalProfileB(stored.originalB || stored.profileB);

      const computed =
        stored.changes ||
        computeChangeRecords(
          stored.profileA,
          stored.profileB,
          stored.originalA || stored.profileA,
          stored.originalB || stored.profileB
        );
      setChangeRecords(computed);
    }
  }, []);

  // Global Ctrl-F / Cmd-F keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        // Prevent default browser find dialog
        e.preventDefault();

        // Target search input
        const input = searchInputRef.current || (document.getElementById('filter-search') as HTMLInputElement | null);
        const container = document.getElementById('filter-controls-container');

        if (container) {
          // Scroll so search container sits cleanly at the top of the viewport
          const topPos = container.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
        } else if (input) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Focus & select all existing text
        if (input) {
          setTimeout(() => {
            input.focus();
            input.select();
          }, 50);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick lookup maps for original statuses
  const origMapA = useMemo(() => {
    const map = new Map<string, OwnershipStatus>();
    if (originalProfileA) {
      originalProfileA.sprites.forEach((s) => map.set(s.id, s.status));
    }
    return map;
  }, [originalProfileA]);

  const origMapB = useMemo(() => {
    const map = new Map<string, OwnershipStatus>();
    if (originalProfileB) {
      originalProfileB.sprites.forEach((s) => map.set(s.id, s.status));
    }
    return map;
  }, [originalProfileB]);

  // Build a unified dictionary of all sprites from both profiles
  const allMergedSprites = useMemo<MergedSpriteComparison[]>(() => {
    if (!profileA || !profileB) return [];

    const map = new Map<string, MergedSpriteComparison>();

    // Add all from Profile A
    profileA.sprites.forEach((item) => {
      const origStatus = origMapA.get(item.id) || 'not_owned';
      map.set(item.id, {
        id: item.id,
        name: item.name,
        parent: item.parent,
        rarity: item.rarity,
        variant: item.variant,
        dropChance: item.dropChance,
        iconUrl: item.iconUrl,
        spriteA: item,
        isModifiedA: item.status !== origStatus,
      });
    });

    // Add all from Profile B
    profileB.sprites.forEach((item) => {
      const origStatus = origMapB.get(item.id) || 'not_owned';
      const isModB = item.status !== origStatus;

      if (map.has(item.id)) {
        const existing = map.get(item.id)!;
        existing.spriteB = item;
        existing.isModifiedB = isModB;
        if (!existing.iconUrl && item.iconUrl) existing.iconUrl = item.iconUrl;
        if (!existing.name && item.name) existing.name = item.name;
        if (!existing.dropChance && item.dropChance) existing.dropChance = item.dropChance;
      } else {
        map.set(item.id, {
          id: item.id,
          name: item.name,
          parent: item.parent,
          rarity: item.rarity,
          variant: item.variant,
          dropChance: item.dropChance,
          iconUrl: item.iconUrl,
          spriteB: item,
          isModifiedA: false,
          isModifiedB: isModB,
        });
      }
    });

    return Array.from(map.values());
  }, [profileA, profileB, origMapA, origMapB]);

  // Handle in-grid status changes
  const handleChangeStatus = (
    spriteId: string,
    player: 'A' | 'B',
    newStatus: OwnershipStatus
  ) => {
    if (player === 'A' && profileA && originalProfileA) {
      let spriteFound = false;
      const updatedSprites = profileA.sprites.map((s) => {
        if (s.id === spriteId) {
          spriteFound = true;
          return {
            ...s,
            status: newStatus,
            owned: newStatus === 'owned' || newStatus === 'mastered',
            mastered: newStatus === 'mastered',
            level: newStatus === 'mastered' ? 5 : newStatus === 'owned' ? 1 : -1,
          };
        }
        return s;
      });

      if (!spriteFound) {
        const template = allMergedSprites.find((m) => m.id === spriteId);
        if (template) {
          updatedSprites.push({
            id: template.id,
            name: template.name,
            parent: template.parent,
            rarity: template.rarity,
            variant: template.variant,
            status: newStatus,
            owned: newStatus === 'owned' || newStatus === 'mastered',
            mastered: newStatus === 'mastered',
            level: newStatus === 'mastered' ? 5 : newStatus === 'owned' ? 1 : -1,
            iconUrl: template.iconUrl,
            dropChance: template.dropChance,
          });
        }
      }

      const ownedCount = updatedSprites.filter(
        (s) => s.status === 'owned' || s.status === 'mastered'
      ).length;
      const masteredCount = updatedSprites.filter(
        (s) => s.status === 'mastered'
      ).length;

      const newProfileA: UserProfile = {
        ...profileA,
        sprites: updatedSprites,
        ownedCount,
        masteredCount,
      };

      setProfileA(newProfileA);
      const newChanges = computeChangeRecords(
        newProfileA,
        profileB,
        originalProfileA,
        originalProfileB
      );
      setChangeRecords(newChanges);
      saveStateToStorage(
        newProfileA,
        profileB,
        originalProfileA,
        originalProfileB,
        newChanges
      );
    } else if (player === 'B' && profileB && originalProfileB) {
      let spriteFound = false;
      const updatedSprites = profileB.sprites.map((s) => {
        if (s.id === spriteId) {
          spriteFound = true;
          return {
            ...s,
            status: newStatus,
            owned: newStatus === 'owned' || newStatus === 'mastered',
            mastered: newStatus === 'mastered',
            level: newStatus === 'mastered' ? 5 : newStatus === 'owned' ? 1 : -1,
          };
        }
        return s;
      });

      if (!spriteFound) {
        const template = allMergedSprites.find((m) => m.id === spriteId);
        if (template) {
          updatedSprites.push({
            id: template.id,
            name: template.name,
            parent: template.parent,
            rarity: template.rarity,
            variant: template.variant,
            status: newStatus,
            owned: newStatus === 'owned' || newStatus === 'mastered',
            mastered: newStatus === 'mastered',
            level: newStatus === 'mastered' ? 5 : newStatus === 'owned' ? 1 : -1,
            iconUrl: template.iconUrl,
            dropChance: template.dropChance,
          });
        }
      }

      const ownedCount = updatedSprites.filter(
        (s) => s.status === 'owned' || s.status === 'mastered'
      ).length;
      const masteredCount = updatedSprites.filter(
        (s) => s.status === 'mastered'
      ).length;

      const newProfileB: UserProfile = {
        ...profileB,
        sprites: updatedSprites,
        ownedCount,
        masteredCount,
      };

      setProfileB(newProfileB);
      const newChanges = computeChangeRecords(
        profileA,
        newProfileB,
        originalProfileA,
        originalProfileB
      );
      setChangeRecords(newChanges);
      saveStateToStorage(
        profileA,
        newProfileB,
        originalProfileA,
        originalProfileB,
        newChanges
      );
    }
  };

  // Revert a single modified sprite
  const handleRevertItem = (spriteId: string, player: 'A' | 'B') => {
    if (player === 'A' && originalProfileA) {
      const orig = originalProfileA.sprites.find((s) => s.id === spriteId);
      const origStatus = orig ? orig.status : 'not_owned';
      handleChangeStatus(spriteId, 'A', origStatus);
    } else if (player === 'B' && originalProfileB) {
      const orig = originalProfileB.sprites.find((s) => s.id === spriteId);
      const origStatus = orig ? orig.status : 'not_owned';
      handleChangeStatus(spriteId, 'B', origStatus);
    }
  };

  // Clear all manual changes & restore original baseline
  const handleClearAllChanges = () => {
    if (originalProfileA && originalProfileB) {
      const cloneA = JSON.parse(JSON.stringify(originalProfileA));
      const cloneB = JSON.parse(JSON.stringify(originalProfileB));
      setProfileA(cloneA);
      setProfileB(cloneB);
      setChangeRecords([]);
      saveStateToStorage(
        cloneA,
        cloneB,
        originalProfileA,
        originalProfileB,
        []
      );
    }
  };

  // Reset entire app back to fresh empty state
  const handleResetAllData = () => {
    clearStateStorage();
    setProfileA(null);
    setProfileB(null);
    setOriginalProfileA(null);
    setOriginalProfileB(null);
    setChangeRecords([]);
  };

  // Derived categorized lists
  const missingForA = useMemo(() => {
    return allMergedSprites.filter((item) => {
      const aOwned =
        item.spriteA &&
        (item.spriteA.status === 'owned' || item.spriteA.status === 'mastered');
      const bHasIt =
        item.spriteB &&
        (item.spriteB.status === 'owned' || item.spriteB.status === 'mastered');
      return !aOwned && bHasIt;
    });
  }, [allMergedSprites]);

  const missingForB = useMemo(() => {
    return allMergedSprites.filter((item) => {
      const aHasIt =
        item.spriteA &&
        (item.spriteA.status === 'owned' || item.spriteA.status === 'mastered');
      const bOwned =
        item.spriteB &&
        (item.spriteB.status === 'owned' || item.spriteB.status === 'mastered');
      return aHasIt && !bOwned;
    });
  }, [allMergedSprites]);

  const bothMissing = useMemo(() => {
    return allMergedSprites.filter((item) => {
      const aOwned =
        item.spriteA &&
        (item.spriteA.status === 'owned' || item.spriteA.status === 'mastered');
      const bOwned =
        item.spriteB &&
        (item.spriteB.status === 'owned' || item.spriteB.status === 'mastered');
      return !aOwned && !bOwned;
    });
  }, [allMergedSprites]);

  // Owned by both parties, but only one has mastered it
  const masteryDiff = useMemo(() => {
    return allMergedSprites.filter((item) => {
      const aStatus = item.spriteA?.status || 'not_owned';
      const bStatus = item.spriteB?.status || 'not_owned';

      const aOwns = aStatus === 'owned' || aStatus === 'mastered';
      const bOwns = bStatus === 'owned' || bStatus === 'mastered';

      if (!aOwns || !bOwns) return false;

      return (
        (aStatus === 'mastered' && bStatus === 'owned') ||
        (bStatus === 'mastered' && aStatus === 'owned')
      );
    });
  }, [allMergedSprites]);

  // Current mode items
  const currentModeItems = useMemo(() => {
    switch (activeMode) {
      case 'missing_a':
        return missingForA;
      case 'missing_b':
        return missingForB;
      case 'both_missing':
        return bothMissing;
      case 'mastery_diff':
        return masteryDiff;
      case 'all_matrix':
      default:
        return allMergedSprites;
    }
  }, [activeMode, missingForA, missingForB, bothMissing, masteryDiff, allMergedSprites]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return currentModeItems.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesParent = item.parent.toLowerCase().includes(q);
        const matchesVariant = item.variant.toLowerCase().includes(q);
        const matchesRarity = item.rarity.toLowerCase().includes(q);
        if (!matchesName && !matchesParent && !matchesVariant && !matchesRarity) {
          return false;
        }
      }

      // Variant
      if (selectedVariant !== 'all') {
        if (item.variant.toLowerCase() !== selectedVariant.toLowerCase()) return false;
      }

      // Rarity
      if (selectedRarity !== 'all') {
        if (item.rarity.toLowerCase() !== selectedRarity.toLowerCase()) return false;
      }

      // Mastered Filter
      if (masteredFilter !== 'all') {
        const isMasteredA = item.spriteA?.status === 'mastered';
        const isMasteredB = item.spriteB?.status === 'mastered';

        if (masteredFilter === 'mastered_a' && !isMasteredA) return false;
        if (masteredFilter === 'mastered_b' && !isMasteredB) return false;
        if (masteredFilter === 'mastered_either' && !isMasteredA && !isMasteredB) return false;
        if (masteredFilter === 'mastered_both' && (!isMasteredA || !isMasteredB)) return false;
      }

      return true;
    });
  }, [currentModeItems, searchQuery, selectedVariant, selectedRarity, masteredFilter]);

  // Swap users
  const handleSwapUsers = () => {
    if (!profileA || !profileB) return;

    const tempProf = profileA;
    const tempOrig = originalProfileA;

    setProfileA(profileB);
    setProfileB(tempProf);

    setOriginalProfileA(originalProfileB);
    setOriginalProfileB(tempOrig);

    const newChanges = computeChangeRecords(
      profileB,
      tempProf,
      originalProfileB,
      tempOrig
    );
    setChangeRecords(newChanges);
    saveStateToStorage(
      profileB,
      tempProf,
      originalProfileB,
      tempOrig,
      newChanges
    );
  };

  const isBothProfilesLoaded = profileA !== null && profileB !== null;

  const handleOpenPasteModal = (slot: 'A' | 'B' = 'A') => {
    setPasteModalSlot(slot);
    setIsPasteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-purple-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        onSwapUsers={handleSwapUsers}
        onOpenPasteModal={handleOpenPasteModal}
        onOpenChangesModal={() => setIsChangesModalOpen(true)}
        onClearAllChanges={handleClearAllChanges}
        onResetAllData={handleResetAllData}
        changesCount={changeRecords.length}
        hasProfiles={isBothProfilesLoaded}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {!isBothProfilesLoaded ? (
          <EmptyStateOnboarding
            profileA={profileA}
            profileB={profileB}
            onOpenImport={handleOpenPasteModal}
          />
        ) : (
          <>
            {/* Profile Comparison Header & Visual Meters */}
            <ProfileComparisonHeader
              profileA={profileA}
              profileB={profileB}
              changesCount={changeRecords.length}
              onOpenChangesModal={() => setIsChangesModalOpen(true)}
              onClearAllChanges={handleClearAllChanges}
            />

            {/* View Mode Tabs (Default: All Sprites Matrix) */}
            <ComparisonTabs
              activeMode={activeMode}
              onSelectMode={setActiveMode}
              counts={{
                missingA: missingForA.length,
                missingB: missingForB.length,
                bothMissing: bothMissing.length,
                masteryDiff: masteryDiff.length,
                total: allMergedSprites.length,
              }}
              usernameA={profileA.username}
              usernameB={profileB.username}
            />

            {/* Filter Controls with Ctrl+F search reference */}
            <FilterControls
              searchInputRef={searchInputRef}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
              selectedRarity={selectedRarity}
              onSelectRarity={setSelectedRarity}
              masteredFilter={masteredFilter}
              onMasteredFilterChange={setMasteredFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              usernameA={profileA.username}
              usernameB={profileB.username}
              availableVariants={['base', 'gold', 'candy', 'galaxy', 'gem', 'holofoil', 'cube', 'quack']}
              availableRarities={['mythic', 'legendary', 'epic', 'rare', 'special']}
              totalFilteredCount={filteredItems.length}
            />

            {/* Tab Content Rendering with Inline Grid/Table Status Editors */}
            {viewMode === 'grid' ? (
              <SpriteGrid
                items={filteredItems}
                usernameA={profileA.username}
                usernameB={profileB.username}
                onChangeStatus={handleChangeStatus}
              />
            ) : (
              <SpriteTable
                items={filteredItems}
                usernameA={profileA.username}
                usernameB={profileB.username}
                onChangeStatus={handleChangeStatus}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Action Buttons */}
      {isBothProfilesLoaded && (
        <aside aria-label="Changes actions" className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end">
          {changeRecords.length > 0 && (
            <button
              onClick={() => setIsChangesModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-zinc-900 border border-purple-500/50 px-4 py-2.5 text-xs font-bold text-purple-300 shadow-xl hover:bg-zinc-800 transition-all"
            >
              <ClipboardList className="h-4 w-4 text-purple-400" />
              <span>Changes Rundown ({changeRecords.length})</span>
            </button>
          )}
        </aside>
      )}

      {/* Modals */}
      <PasteHtmlModal
        isOpen={isPasteModalOpen}
        initialSlot={pasteModalSlot}
        onClose={() => setIsPasteModalOpen(false)}
        onImportUserA={(prof) => {
          setProfileA(prof);
          setOriginalProfileA(prof);
          const newChanges = computeChangeRecords(prof, profileB, prof, originalProfileB);
          setChangeRecords(newChanges);
          saveStateToStorage(prof, profileB, prof, originalProfileB, newChanges);
        }}
        onImportUserB={(prof) => {
          setProfileB(prof);
          setOriginalProfileB(prof);
          const newChanges = computeChangeRecords(profileA, prof, originalProfileA, prof);
          setChangeRecords(newChanges);
          saveStateToStorage(profileA, prof, originalProfileA, prof, newChanges);
        }}
      />

      {profileA && profileB && (
        <ChangesRundownModal
          isOpen={isChangesModalOpen}
          onClose={() => setIsChangesModalOpen(false)}
          changes={changeRecords}
          usernameA={profileA.username}
          usernameB={profileB.username}
          onRevertItem={handleRevertItem}
          onClearAllChanges={handleClearAllChanges}
        />
      )}
    </div>
  );
}
