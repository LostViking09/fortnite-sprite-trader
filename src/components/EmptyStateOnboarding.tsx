import React from 'react';
import { UserProfile } from '../types';
import { FileCode, Sparkles, Check, HelpCircle } from 'lucide-react';

interface EmptyStateOnboardingProps {
  profileA: UserProfile | null;
  profileB: UserProfile | null;
  onOpenImport: (slot: 'A' | 'B') => void;
}

export const EmptyStateOnboarding: React.FC<EmptyStateOnboardingProps> = ({
  profileA,
  profileB,
  onOpenImport,
}) => {
  const hasA = profileA !== null && profileA.sprites.length > 0;
  const hasB = profileB !== null && profileB.sprites.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>HTML Source Importer</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Import Two Fortnite.GG Profiles to Compare
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Import both players' sprite locker pages to view missing items, mastery gaps, and plan trades.
        </p>
      </div>

      {/* Two Player Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Player A Card (Cyan) */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
          hasA
            ? 'border-cyan-500/40 bg-cyan-950/20 shadow-lg shadow-cyan-950/30'
            : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-black text-lg">
                A
              </div>
              <div>
                <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                  Player A
                </span>
                <h3 className="text-base font-bold text-white">
                  {hasA ? profileA.username : 'Empty Profile'}
                </h3>
              </div>
            </div>

            {hasA ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                <span>Imported</span>
              </span>
            ) : (
              <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                Waiting
              </span>
            )}
          </div>

          {hasA ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-zinc-900/80 p-3 border border-zinc-800/80 text-xs flex justify-between">
                <span className="text-zinc-400">Owned: <strong className="text-white">{profileA.ownedCount}</strong></span>
                <span className="text-zinc-400">Mastered: <strong className="text-amber-300">{profileA.masteredCount}</strong></span>
                <span className="text-zinc-400">Total: <strong className="text-zinc-200">{profileA.totalCount}</strong></span>
              </div>
              <button
                onClick={() => onOpenImport('A')}
                className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>Re-Import Player A HTML</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 min-h-[36px]">
                Paste the page source from Player A's fortnite.gg/sprites page.
              </p>
              <button
                onClick={() => onOpenImport('A')}
                className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-black hover:bg-cyan-400 shadow-md shadow-cyan-950/40 transition-all flex items-center justify-center gap-1.5"
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>Import Player A HTML</span>
              </button>
            </div>
          )}
        </div>

        {/* Player B Card (Rose / Red-ish) */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
          hasB
            ? 'border-rose-500/40 bg-rose-950/20 shadow-lg shadow-rose-950/30'
            : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 font-black text-lg">
                B
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider">
                  Player B
                </span>
                <h3 className="text-base font-bold text-white">
                  {hasB ? profileB.username : 'Empty Profile'}
                </h3>
              </div>
            </div>

            {hasB ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                <span>Imported</span>
              </span>
            ) : (
              <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                Waiting
              </span>
            )}
          </div>

          {hasB ? (
            <div className="space-y-3">
              <div className="rounded-xl bg-zinc-900/80 p-3 border border-zinc-800/80 text-xs flex justify-between">
                <span className="text-zinc-400">Owned: <strong className="text-white">{profileB.ownedCount}</strong></span>
                <span className="text-zinc-400">Mastered: <strong className="text-amber-300">{profileB.masteredCount}</strong></span>
                <span className="text-zinc-400">Total: <strong className="text-zinc-200">{profileB.totalCount}</strong></span>
              </div>
              <button
                onClick={() => onOpenImport('B')}
                className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>Re-Import Player B HTML</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 min-h-[36px]">
                Paste the page source from Player B's fortnite.gg/sprites page.
              </p>
              <button
                onClick={() => onOpenImport('B')}
                className="w-full rounded-xl bg-rose-500 py-2.5 text-xs font-bold text-white hover:bg-rose-400 shadow-md shadow-rose-950/40 transition-all flex items-center justify-center gap-1.5"
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>Import Player B HTML</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Guide Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 text-xs text-zinc-300">
        <div className="flex items-center gap-2 font-bold text-white mb-2">
          <HelpCircle className="h-4 w-4 text-purple-400" />
          <span>Quick 30-second guide to importing:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-400">
          <div className="rounded-xl bg-zinc-950/60 p-3 border border-zinc-800/80">
            <span className="text-purple-400 font-bold block mb-1">Step 1</span>
            Open <span className="text-zinc-200 font-mono">fortnite.gg/sprites</span> in your browser where your locker or friends' locker is visible.
          </div>
          <div className="rounded-xl bg-zinc-950/60 p-3 border border-zinc-800/80">
            <span className="text-purple-400 font-bold block mb-1">Step 2</span>
            Press <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono">Ctrl + U</kbd> to view the raw HTML source.
          </div>
          <div className="rounded-xl bg-zinc-950/60 p-3 border border-zinc-800/80">
            <span className="text-purple-400 font-bold block mb-1">Step 3</span>
            Select all (<kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono">Ctrl + A</kbd>), copy it, and paste it into the import window.
          </div>
        </div>
      </div>
    </div>
  );
};
