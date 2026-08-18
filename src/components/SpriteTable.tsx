import React, { useState } from 'react';
import { OwnershipStatus } from '../types';
import { MergedSpriteComparison } from './SpriteGrid';
import { getRarityColor, getVariantBadge } from '../utils/theme';
import { Package, XCircle, ArrowUpDown } from 'lucide-react';
import { FortniteCrown } from './FortniteCrown';

interface SpriteTableProps {
  items: MergedSpriteComparison[];
  usernameA: string;
  usernameB: string;
  onChangeStatus?: (spriteId: string, player: 'A' | 'B', newStatus: OwnershipStatus) => void;
}

export const SpriteTable: React.FC<SpriteTableProps> = ({
  items,
  usernameA,
  usernameB,
  onChangeStatus,
}) => {
  const [sortField, setSortField] = useState<'name' | 'rarity' | 'variant' | 'statusA' | 'statusB'>('rarity');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const toggleSort = (field: 'name' | 'rarity' | 'variant' | 'statusA' | 'statusB') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const rarityRank: Record<string, number> = {
    mythic: 5,
    legendary: 4,
    epic: 3,
    rare: 2,
    special: 1,
  };

  const sortedItems = [...items].sort((a, b) => {
    let diff = 0;
    if (sortField === 'name') {
      diff = a.name.localeCompare(b.name);
    } else if (sortField === 'rarity') {
      const rankA = rarityRank[a.rarity.toLowerCase()] || 0;
      const rankB = rarityRank[b.rarity.toLowerCase()] || 0;
      diff = rankB - rankA;
    } else if (sortField === 'variant') {
      diff = a.variant.localeCompare(b.variant);
    } else if (sortField === 'statusA') {
      const levelA = a.spriteA?.level ?? -1;
      const levelB = b.spriteA?.level ?? -1;
      diff = levelB - levelA;
    } else if (sortField === 'statusB') {
      const levelA = a.spriteB?.level ?? -1;
      const levelB = b.spriteB?.level ?? -1;
      diff = levelB - levelA;
    }
    return sortAsc ? diff : -diff;
  });

  const renderStatusCell = (
    spriteId: string,
    player: 'A' | 'B',
    status: OwnershipStatus,
    playerName: string,
    isModified?: boolean
  ) => {
    return (
      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800/80 gap-1 shadow-inner">
          {/* Option: Not Owned */}
          <button
            type="button"
            onClick={() => onChangeStatus && onChangeStatus(spriteId, player, 'not_owned')}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
              status === 'not_owned'
                ? 'bg-zinc-800 text-zinc-300 border border-zinc-600 shadow-inner'
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
            title={`${playerName}: Not Owned`}
          >
            <XCircle className="h-4 w-4" />
          </button>

          {/* Option: Owned (Level 1) */}
          <button
            type="button"
            onClick={() => onChangeStatus && onChangeStatus(spriteId, player, 'owned')}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
              status === 'owned'
                ? player === 'A'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/60 shadow-sm shadow-cyan-950 ring-1 ring-cyan-500/30'
                  : 'bg-rose-500/25 text-rose-300 border border-rose-500/60 shadow-sm shadow-rose-950 ring-1 ring-rose-500/30'
                : player === 'A'
                ? 'text-zinc-500 hover:text-cyan-300 hover:bg-zinc-900'
                : 'text-zinc-500 hover:text-rose-300 hover:bg-zinc-900'
            }`}
            title={`${playerName}: Owned (Level 1)`}
          >
            <Package className="h-4 w-4" />
          </button>

          {/* Option: Mastered (Level 5) - Gold / Yellow */}
          <button
            type="button"
            onClick={() => onChangeStatus && onChangeStatus(spriteId, player, 'mastered')}
            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
              status === 'mastered'
                ? 'bg-amber-400/25 text-amber-300 border border-amber-400/60 shadow-sm shadow-amber-950 ring-1 ring-amber-400/40'
                : 'text-zinc-500 hover:text-amber-300 hover:bg-zinc-900'
            }`}
            title={`${playerName}: 👑 Mastered (Level 5)`}
          >
            <FortniteCrown
              size="xs"
              variant={status === 'mastered' ? 'gold' : 'default'}
              className={status === 'mastered' ? 'opacity-100' : 'opacity-35 grayscale hover:opacity-90 hover:grayscale-0'}
            />
          </button>
        </div>

        {isModified && (
          <span
            className="flex items-center gap-0.5 rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-300 border border-purple-500/30"
            title="Status manually modified"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            Mod
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-lg">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3 pl-4 pr-3">
              <button
                onClick={() => toggleSort('name')}
                className="flex items-center gap-1 hover:text-white"
              >
                Sprite
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="px-3 py-3">
              <button
                onClick={() => toggleSort('rarity')}
                className="flex items-center gap-1 hover:text-white"
              >
                Rarity
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="px-3 py-3">
              <button
                onClick={() => toggleSort('variant')}
                className="flex items-center gap-1 hover:text-white"
              >
                Variant
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="px-3 py-3">Drop Rate</th>
            <th className="px-3 py-3">
              <button
                onClick={() => toggleSort('statusA')}
                className="flex items-center gap-1 text-cyan-300 hover:text-white"
              >
                {usernameA}
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="px-3 py-3">
              <button
                onClick={() => toggleSort('statusB')}
                className="flex items-center gap-1 text-rose-300 hover:text-white"
              >
                {usernameB}
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </th>
            <th className="py-3 pl-3 pr-4">Ownership Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {sortedItems.map((item) => {
            const statusA = item.spriteA ? item.spriteA.status : 'not_owned';
            const statusB = item.spriteB ? item.spriteB.status : 'not_owned';
            const isMasteredA = statusA === 'mastered';
            const isMasteredB = statusB === 'mastered';
            const isOwnedA = statusA === 'owned' || statusA === 'mastered';
            const isOwnedB = statusB === 'owned' || statusB === 'mastered';

            const bCanGiveToA = isOwnedB && statusA === 'not_owned';
            const aCanGiveToB = isOwnedA && statusB === 'not_owned';
            const neitherOwns = !isOwnedA && !isOwnedB;
            const bothMastered = statusA === 'mastered' && statusB === 'mastered';
            const masteryGap =
              (statusA === 'mastered' && statusB === 'owned') || (statusB === 'mastered' && statusA === 'owned');

            const rarityTheme = getRarityColor(item.rarity);
            const variantInfo = getVariantBadge(item.variant);

            // Row styling based on ownership (Tradeable = Bright Green border)
            let rowThemeClass = 'hover:bg-zinc-800/40';
            if (bothMastered) {
              rowThemeClass = 'bg-amber-950/20 hover:bg-amber-950/30 border-l-2 border-l-amber-400';
            } else if (neitherOwns) {
              rowThemeClass = 'bg-zinc-950/40 text-zinc-400 hover:bg-zinc-900/40';
            } else if (isOwnedA && !isOwnedB) {
              rowThemeClass = 'bg-green-950/15 hover:bg-green-950/25 border-l-2 border-l-green-400';
            } else if (isOwnedB && !isOwnedA) {
              rowThemeClass = 'bg-green-950/15 hover:bg-green-950/25 border-l-2 border-l-green-400';
            } else if (masteryGap) {
              rowThemeClass = 'bg-purple-950/15 hover:bg-purple-950/25 border-l-2 border-l-purple-500';
            } else if (isOwnedA && isOwnedB) {
              rowThemeClass = 'bg-emerald-950/10 hover:bg-emerald-950/20 border-l-2 border-l-emerald-500/50';
            }

            return (
              <tr key={item.id} className={`${rowThemeClass} transition-colors`}>
                <td className="py-2.5 pl-4 pr-3">
                  <div className="flex items-center gap-2.5">
                    {/* Thumbnail with Mastered Crown indicator */}
                    <div className="group/thumb relative shrink-0 overflow-hidden rounded-lg border border-zinc-700/80 bg-zinc-950 p-0.5">
                      <div
                        className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
                          variantInfo.themeClass || rarityTheme.themeClass || ''
                        } ${
                          neitherOwns
                            ? 'opacity-20 group-hover:opacity-60'
                            : 'opacity-40 group-hover:opacity-100'
                        }`}
                      />
                      <img
                        src={item.iconUrl || 'https://fortnite.gg/img/icon.jpg'}
                        alt={item.name}
                        className={`relative z-0 h-10 w-10 object-contain ${neitherOwns ? 'opacity-60 grayscale-[30%]' : 'opacity-100'}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      {/* Crown Overlays for Table Thumbnail: single gold crown if both mastered */}
                      {bothMastered && (
                        <div
                          className="absolute -top-1.5 -right-1.5 z-10"
                          title={`👑 Mastered by BOTH ${usernameA} & ${usernameB}`}
                        >
                          <FortniteCrown variant="gold" size="xs" />
                        </div>
                      )}
                      {isMasteredA && !isMasteredB && (
                        <div
                          className="absolute -top-1.5 -right-1.5 z-10"
                          title={`👑 Mastered by ${usernameA}`}
                        >
                          <FortniteCrown variant="cyan" size="xs" playerBadge="A" />
                        </div>
                      )}
                      {!isMasteredA && isMasteredB && (
                        <div
                          className="absolute -top-1.5 -right-1.5 z-10"
                          title={`👑 Mastered by ${usernameB}`}
                        >
                          <FortniteCrown variant="rose" size="xs" playerBadge="B" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">#{item.id}</div>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-2.5">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${rarityTheme.badgeBg}`}>
                    {item.rarity}
                  </span>
                </td>

                <td className="px-3 py-2.5">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${variantInfo.bgClass} ${variantInfo.textColor}`}>
                    {variantInfo.label}
                  </span>
                </td>

                <td className="px-3 py-2.5 text-zinc-400 font-mono text-xs">
                  {item.dropChance || '0%'}
                </td>

                <td className="px-3 py-2.5">
                  {renderStatusCell(item.id, 'A', statusA, usernameA, item.isModifiedA)}
                </td>

                <td className="px-3 py-2.5">
                  {renderStatusCell(item.id, 'B', statusB, usernameB, item.isModifiedB)}
                </td>

                <td className="py-2.5 pl-3 pr-4">
                  {bCanGiveToA && (
                    <span className="inline-flex items-center gap-1 rounded bg-cyan-500/20 text-cyan-300 px-2 py-0.5 text-xs font-bold border border-cyan-500/30">
                      {usernameB} &rarr; {usernameA}
                    </span>
                  )}
                  {aCanGiveToB && (
                    <span className="inline-flex items-center gap-1 rounded bg-rose-500/20 text-rose-300 px-2 py-0.5 text-xs font-bold border border-rose-500/30">
                      {usernameA} &rarr; {usernameB}
                    </span>
                  )}
                  {bothMastered && (
                    <span className="inline-flex items-center gap-1.5 rounded bg-amber-400/20 text-amber-300 px-2 py-0.5 text-xs font-black border border-amber-400/40">
                      <FortniteCrown variant="gold" size="xs" />
                      Both Mastered (Gold)
                    </span>
                  )}
                  {masteryGap && (
                    <span className="inline-flex items-center gap-1 rounded bg-purple-500/20 text-purple-300 px-2 py-0.5 text-xs font-bold border border-purple-500/30">
                      👑 Mastery Gap ({statusA === 'mastered' ? usernameA : usernameB} L5)
                    </span>
                  )}
                  {neitherOwns && (
                    <span className="text-xs text-zinc-500 font-mono">Neither owns (Gray)</span>
                  )}
                  {statusA === 'owned' && statusB === 'owned' && (
                    <span className="text-xs text-emerald-300/80">Both Owned (L1)</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
