import React from 'react';
import { Search, LayoutGrid, Table, X, RotateCcw } from 'lucide-react';
import { FortniteCrown } from './FortniteCrown';

export type MasteredFilter = 'all' | 'mastered_a' | 'mastered_b' | 'mastered_either' | 'mastered_both';

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedVariant: string;
  onSelectVariant: (variant: string) => void;
  selectedRarity: string;
  onSelectRarity: (rarity: string) => void;
  masteredFilter: MasteredFilter;
  onMasteredFilterChange: (filter: MasteredFilter) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  usernameA: string;
  usernameB: string;
  availableVariants: string[];
  availableRarities: string[];
  totalFilteredCount: number;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  onSearchChange,
  selectedVariant,
  onSelectVariant,
  selectedRarity,
  onSelectRarity,
  masteredFilter,
  onMasteredFilterChange,
  viewMode,
  onViewModeChange,
  usernameA,
  usernameB,
  availableVariants,
  availableRarities,
  totalFilteredCount,
  searchInputRef,
}) => {
  const variants = [
    { id: 'all', label: 'All Variants' },
    { id: 'base', label: 'Base' },
    { id: 'gold', label: 'Gold' },
    { id: 'candy', label: 'Gummy' },
    { id: 'galaxy', label: 'Galaxy' },
    { id: 'gem', label: 'Gem' },
    { id: 'holofoil', label: 'Holofoil' },
    { id: 'cube', label: 'Cube' },
    { id: 'quack', label: 'Quack' },
  ];

  const rarities = [
    { id: 'all', label: 'All Rarities' },
    { id: 'mythic', label: 'Mythic' },
    { id: 'legendary', label: 'Legendary' },
    { id: 'epic', label: 'Epic' },
    { id: 'rare', label: 'Rare' },
    { id: 'special', label: 'Special' },
  ];

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedVariant !== 'all' ||
    selectedRarity !== 'all' ||
    masteredFilter !== 'all';

  const clearAllFilters = () => {
    onSearchChange('');
    onSelectVariant('all');
    onSelectRarity('all');
    onMasteredFilterChange('all');
  };

  return (
    <div id="filter-controls-container" className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 scroll-mt-20">
      {/* Search bar + Select Filter Dropdowns + View Mode */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input with Ctrl-F shortcut badge */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            ref={searchInputRef}
            id="filter-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sprites (Ctrl + F to quick find)..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 py-2 pl-9 pr-20 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="rounded p-1 text-zinc-400 hover:text-zinc-200"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
                Ctrl+F
              </kbd>
            )}
          </div>
        </div>

        {/* Filter Dropdowns (Mastery, Variant, Rarity) + View Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mastery Filter Select */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 shadow-sm">
            <FortniteCrown variant="gold" size="xs" />
            <span className="text-xs text-zinc-400 font-medium">Mastery:</span>
            <select
              id="filter-mastery-select"
              value={masteredFilter}
              onChange={(e) => onMasteredFilterChange(e.target.value as MasteredFilter)}
              className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-zinc-200">
                All Sprites
              </option>
              <option value="mastered_a" className="bg-zinc-900 text-cyan-300">
                👑 Mastered by {usernameA} Only
              </option>
              <option value="mastered_b" className="bg-zinc-900 text-rose-300">
                👑 Mastered by {usernameB} Only
              </option>
              <option value="mastered_either" className="bg-zinc-900 text-purple-300">
                👑 Mastered on Either Side
              </option>
              <option value="mastered_both" className="bg-zinc-900 text-amber-300">
                👑 Mastered by Both (Gold)
              </option>
            </select>
          </div>

          {/* Variant Select */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 shadow-sm">
            <span className="text-xs text-zinc-400 font-medium">Variant:</span>
            <select
              id="filter-variant-select"
              value={selectedVariant}
              onChange={(e) => onSelectVariant(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id} className="bg-zinc-900 text-zinc-200">
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity Select */}
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 shadow-sm">
            <span className="text-xs text-zinc-400 font-medium">Rarity:</span>
            <select
              id="filter-rarity-select"
              value={selectedRarity}
              onChange={(e) => onSelectRarity(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
            >
              {rarities.map((r) => (
                <option key={r.id} value={r.id} className="bg-zinc-900 text-zinc-200">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center rounded-lg border border-zinc-700 bg-zinc-950 p-0.5 shadow-sm">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Table View"
            >
              <Table className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Reset Filters button if active */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-0.5">
        <span>
          Showing <span className="font-bold text-white">{totalFilteredCount}</span> sprites matching filters
        </span>
      </div>
    </div>
  );
};
