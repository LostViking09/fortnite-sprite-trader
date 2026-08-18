import React from 'react';
import { UserProfile } from '../types';
import { Package, ClipboardList, Trash2 } from 'lucide-react';
import { FortniteCrown } from './FortniteCrown';

interface ProfileComparisonHeaderProps {
  profileA: UserProfile;
  profileB: UserProfile;
  changesCount?: number;
  onOpenChangesModal?: () => void;
  onClearAllChanges?: () => void;
}

export const ProfileComparisonHeader: React.FC<ProfileComparisonHeaderProps> = ({
  profileA,
  profileB,
  changesCount = 0,
  onOpenChangesModal,
  onClearAllChanges,
}) => {
  const percentOwnedA = Math.round((profileA.ownedCount / (profileA.totalCount || 117)) * 100);
  const percentMasteredA = Math.round((profileA.masteredCount / (profileA.totalCount || 117)) * 100);

  const percentOwnedB = Math.round((profileB.ownedCount / (profileB.totalCount || 117)) * 100);
  const percentMasteredB = Math.round((profileB.masteredCount / (profileB.totalCount || 117)) * 100);

  return (
    <div className="space-y-4">
      {/* Changes Banner if client-side edits are active */}
      {changesCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-500/40 bg-purple-950/30 p-3.5 px-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-purple-200">
                  {changesCount} Manual {changesCount === 1 ? 'Edit' : 'Edits'} Active (Saved in Browser Storage)
                </span>
              </div>
              <p className="text-xs text-purple-300/80">
                You have made local changes to sprite ownership and levels. Use the rundown to sync them back to Fortnite.gg.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenChangesModal && (
              <button
                onClick={onOpenChangesModal}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-purple-500 transition-colors"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                <span>View Changes Rundown</span>
              </button>
            )}
            {onClearAllChanges && (
              <button
                onClick={onClearAllChanges}
                className="flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/25 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Reset All Changes</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Profiles Side-by-Side Banner */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {/* Player A Card (Cyan / Blue theme) */}
        <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-[#18191c]/90 p-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={profileA.avatarUrl || 'https://fortnite.gg/img/icon.jpg'}
                alt={profileA.username}
                className="h-12 w-12 rounded-full border-2 border-cyan-400 bg-zinc-800 object-cover shadow-md shadow-cyan-500/20"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 rounded bg-cyan-400 px-1 py-0.2 text-[9px] font-black text-black uppercase">
                A
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                  Player A
                </span>
                <h3 className="truncate text-base font-bold text-white">
                  {profileA.username}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                ID: {profileA.id}
              </p>
            </div>
          </div>

          {/* Stats Bar for Player A */}
          <div className="mt-3.5 grid grid-cols-2 gap-2.5 pt-3 border-t border-white/5">
            <div className="rounded-lg bg-black/30 p-2 border border-white/5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1 font-medium">
                  <Package className="h-3.5 w-3.5 text-blue-400" />
                  Owned
                </span>
                <span className="font-bold text-white">
                  {profileA.ownedCount} <span className="text-zinc-500 font-normal">/ {profileA.totalCount}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentOwnedA}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-black/30 p-2 border border-white/5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <FortniteCrown variant="gold" size="xs" />
                  Mastered
                </span>
                <span className="font-bold text-amber-300">
                  {profileA.masteredCount} <span className="text-zinc-500 font-normal">/ {profileA.totalCount}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentMasteredA}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Player B Card (Rose / Red-ish theme) */}
        <div className="relative overflow-hidden rounded-xl border border-rose-500/30 bg-[#18191c]/90 p-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={profileB.avatarUrl || 'https://fortnite.gg/img/icon.jpg'}
                alt={profileB.username}
                className="h-12 w-12 rounded-full border-2 border-rose-400 bg-zinc-800 object-cover shadow-md shadow-rose-500/20"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 rounded bg-rose-500 px-1 py-0.2 text-[9px] font-black text-white uppercase">
                B
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
                  Player B
                </span>
                <h3 className="truncate text-base font-bold text-white">
                  {profileB.username}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                ID: {profileB.id}
              </p>
            </div>
          </div>

          {/* Stats Bar for Player B */}
          <div className="mt-3.5 grid grid-cols-2 gap-2.5 pt-3 border-t border-white/5">
            <div className="rounded-lg bg-black/30 p-2 border border-white/5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1 font-medium">
                  <Package className="h-3.5 w-3.5 text-blue-400" />
                  Owned
                </span>
                <span className="font-bold text-white">
                  {profileB.ownedCount} <span className="text-zinc-500 font-normal">/ {profileB.totalCount}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentOwnedB}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-black/30 p-2 border border-white/5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <FortniteCrown variant="gold" size="xs" />
                  Mastered
                </span>
                <span className="font-bold text-amber-300">
                  {profileB.masteredCount} <span className="text-zinc-500 font-normal">/ {profileB.totalCount}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentMasteredB}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
