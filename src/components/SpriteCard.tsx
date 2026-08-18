import React from 'react';
import { SpriteItem, OwnershipStatus } from '../types';
import { getRarityColor, getVariantBadge } from '../utils/theme';
import { Package, XCircle } from 'lucide-react';
import { FortniteCrown } from './FortniteCrown';

interface SpriteCardProps {
  id: string;
  spriteA?: SpriteItem;
  spriteB?: SpriteItem;
  name: string;
  rarity: string;
  variant: string;
  dropChance: string;
  iconUrl: string;
  usernameA: string;
  usernameB: string;
  isModifiedA?: boolean;
  isModifiedB?: boolean;
  onChangeStatus?: (spriteId: string, player: 'A' | 'B', newStatus: OwnershipStatus) => void;
}

export const SpriteCard: React.FC<SpriteCardProps> = ({
  id,
  spriteA,
  spriteB,
  name,
  rarity,
  variant,
  dropChance,
  iconUrl,
  usernameA,
  usernameB,
  isModifiedA,
  isModifiedB,
  onChangeStatus,
}) => {
  const rarityTheme = getRarityColor(rarity);
  const variantInfo = getVariantBadge(variant);

  const statusA: OwnershipStatus = spriteA ? spriteA.status : 'not_owned';
  const statusB: OwnershipStatus = spriteB ? spriteB.status : 'not_owned';

  const isMasteredA = statusA === 'mastered';
  const isMasteredB = statusB === 'mastered';
  const isOwnedA = statusA === 'owned' || statusA === 'mastered';
  const isOwnedB = statusB === 'owned' || statusB === 'mastered';

  // Determine comparison state
  const bCanGiveToA = isOwnedB && statusA === 'not_owned';
  const aCanGiveToB = isOwnedA && statusB === 'not_owned';
  const bothOwnOnlyOneMastered =
    (statusA === 'mastered' && statusB === 'owned') || (statusB === 'mastered' && statusA === 'owned');
  const bothOwnBothMastered = statusA === 'mastered' && statusB === 'mastered';
  const neitherOwns = !isOwnedA && !isOwnedB;

  // Outer border & shadow based on ownership state
  const getCardBorderClass = () => {
    if (bothOwnBothMastered) {
      return 'border-2 border-[#fed83d] shadow-md shadow-amber-950/40';
    }
    if (isOwnedA && !isOwnedB) {
      return 'border-2 border-green-400 shadow-md shadow-green-950/40';
    }
    if (isOwnedB && !isOwnedA) {
      return 'border-2 border-green-400 shadow-md shadow-green-950/40';
    }
    if (bothOwnOnlyOneMastered) {
      return 'border border-purple-500/60 shadow-md shadow-purple-950/30';
    }
    if (isOwnedA && isOwnedB) {
      return 'border border-emerald-500/40';
    }
    return 'border border-zinc-800/80 hover:border-zinc-700';
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-[#18191c]/95 p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl ${getCardBorderClass()} ${
        neitherOwns ? 'opacity-70 hover:opacity-100' : 'opacity-100'
      }`}
    >
      {/* Upper Theme Gradient (fades from top into card body) */}
      <div
        className={`absolute top-0 left-0 right-0 h-40 pointer-events-none transition-opacity duration-300 ${
          variantInfo.themeClass || rarityTheme.themeClass || ''
        } ${
          neitherOwns
            ? 'opacity-25 group-hover:opacity-60 grayscale-[40%]'
            : 'opacity-40 group-hover:opacity-100'
        }`}
      />

      {/* Sprite Art with Crown Floating Above Head */}
      <div className="relative flex h-36 items-center justify-center pt-2 pb-1 select-none">
        <img
          src={iconUrl || 'https://fortnite.gg/img/icon.jpg'}
          alt={name}
          className={`relative z-0 h-32 w-32 object-contain sprite-art-img ${
            neitherOwns ? 'opacity-70 grayscale-[30%] group-hover:opacity-100 group-hover:grayscale-0' : 'opacity-100'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.opacity = '0.5';
          }}
        />

        {/* Mastered Crown directly positioned on top of the sprite's head */}
        {bothOwnBothMastered && (
          <div
            className="absolute top-1 left-[53%] z-10 pointer-events-none transform rotate-12 transition-transform duration-300 group-hover:scale-115"
            title={`👑 Mastered by BOTH ${usernameA} & ${usernameB}`}
          >
            <FortniteCrown variant="gold" size="lg" />
          </div>
        )}

        {isMasteredA && !isMasteredB && (
          <div
            className="absolute top-1 left-[53%] z-10 pointer-events-none transform rotate-12 transition-transform duration-300 group-hover:scale-115"
            title={`👑 Mastered by ${usernameA} (Player A)`}
          >
            <FortniteCrown variant="cyan" size="lg" playerBadge="A" />
          </div>
        )}

        {!isMasteredA && isMasteredB && (
          <div
            className="absolute top-1 left-[53%] z-10 pointer-events-none transform rotate-12 transition-transform duration-300 group-hover:scale-115"
            title={`👑 Mastered by ${usernameB} (Player B)`}
          >
            <FortniteCrown variant="rose" size="lg" playerBadge="B" />
          </div>
        )}
      </div>

      {/* Sprite Name */}
      <div className="relative z-10 mb-1 mt-1 text-left">
        <h4 className="truncate text-[15px] font-bold text-white transition-colors group-hover:text-[#fed83d]">
          {name}
        </h4>
      </div>

      {/* Meta Pills (Rarity, Variant, Drop Chance, Trade Flow) */}
      <div className="relative z-10 flex flex-wrap items-center gap-1.5 mb-2.5">
        <span className={`inline-flex items-center min-h-[20px] px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${rarityTheme.badgeBg}`}>
          {rarity}
        </span>

        {variant !== 'base' && (
          <span className={`inline-flex items-center min-h-[20px] px-1.5 py-0.5 rounded text-[10px] font-bold ${variantInfo.bgClass} ${variantInfo.textColor}`}>
            {variantInfo.label}
          </span>
        )}

        {dropChance && dropChance !== '0%' && (
          <span className="inline-flex items-center min-h-[20px] px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-white/5">
            {dropChance}
          </span>
        )}

        {bCanGiveToA && (
          <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {usernameB} &rarr; {usernameA}
          </span>
        )}
        {aCanGiveToB && (
          <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {usernameA} &rarr; {usernameB}
          </span>
        )}
      </div>

      {/* Streamlined Flat Player Ownership Controls (No bulky nested boxes) */}
      <div className="relative z-10 mt-auto space-y-1.5 pt-2 border-t border-white/10">
        {/* Player A Row */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="truncate text-xs font-bold text-cyan-300 max-w-[80px]" title={usernameA}>
              {usernameA}
            </span>
            {isModifiedA && (
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" title="Locally Edited" />
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Not Owned Toggle */}
            <button
              type="button"
              onClick={() => onChangeStatus && onChangeStatus(id, 'A', 'not_owned')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                statusA === 'not_owned'
                  ? 'bg-zinc-800 text-zinc-200 ring-1 ring-zinc-600 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
              }`}
              title={`${usernameA}: Not Owned`}
              aria-label={`${usernameA}: Not Owned`}
            >
              <XCircle className="h-4 w-4" />
            </button>

            {/* Owned Toggle */}
            <button
              type="button"
              onClick={() => onChangeStatus && onChangeStatus(id, 'A', 'owned')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                statusA === 'owned'
                  ? 'bg-cyan-500/25 text-cyan-300 ring-1 ring-cyan-400 shadow-sm'
                  : 'text-zinc-600 hover:text-cyan-300 hover:bg-white/5'
              }`}
              title={`${usernameA}: Owned`}
              aria-label={`${usernameA}: Owned`}
            >
              <Package className="h-4 w-4" />
            </button>

            {/* Mastered Toggle */}
            <button
              type="button"
              onClick={() => onChangeStatus && onChangeStatus(id, 'A', 'mastered')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                statusA === 'mastered'
                  ? 'bg-amber-400/25 text-amber-300 ring-1 ring-amber-400 shadow-sm'
                  : 'text-zinc-600 hover:text-amber-300 hover:bg-white/5'
              }`}
              title={`${usernameA}: Mastered`}
              aria-label={`${usernameA}: Mastered`}
            >
              <FortniteCrown
                size="xs"
                variant={statusA === 'mastered' ? 'gold' : 'default'}
                className={statusA === 'mastered' ? 'opacity-100' : 'opacity-30 grayscale'}
              />
            </button>
          </div>
        </div>

        {/* Player B Row */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="truncate text-xs font-bold text-rose-300 max-w-[80px]" title={usernameB}>
              {usernameB}
            </span>
            {isModifiedB && (
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" title="Locally Edited" />
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Not Owned Toggle */}
            <button
              type="button"
              onClick={() => onChangeStatus && onChangeStatus(id, 'B', 'not_owned')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                statusB === 'not_owned'
                  ? 'bg-zinc-800 text-zinc-200 ring-1 ring-zinc-600 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
              }`}
              title={`${usernameB}: Not Owned`}
              aria-label={`${usernameB}: Not Owned`}
            >
              <XCircle className="h-4 w-4" />
            </button>

            {/* Owned Toggle */}
            <button
              type="button"
              onClick={() => onChangeStatus && onChangeStatus(id, 'B', 'owned')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                statusB === 'owned'
                  ? 'bg-rose-500/25 text-rose-300 ring-1 ring-rose-400 shadow-sm'
                  : 'text-zinc-600 hover:text-rose-300 hover:bg-white/5'
              }`}
              title={`${usernameB}: Owned`}
              aria-label={`${usernameB}: Owned`}
            >
              <Package className="h-4 w-4" />
            </button>

            {/* Mastered Toggle */}
            <button
              type="button"
              onClick={() => onChangeStatus && onChangeStatus(id, 'B', 'mastered')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                statusB === 'mastered'
                  ? 'bg-amber-400/25 text-amber-300 ring-1 ring-amber-400 shadow-sm'
                  : 'text-zinc-600 hover:text-amber-300 hover:bg-white/5'
              }`}
              title={`${usernameB}: Mastered`}
              aria-label={`${usernameB}: Mastered`}
            >
              <FortniteCrown
                size="xs"
                variant={statusB === 'mastered' ? 'gold' : 'default'}
                className={statusB === 'mastered' ? 'opacity-100' : 'opacity-30 grayscale'}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
