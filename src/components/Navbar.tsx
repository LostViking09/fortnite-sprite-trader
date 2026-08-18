import React from 'react';
import { Sparkles, ArrowLeftRight, FileCode, ExternalLink, ClipboardList, Trash2, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onSwapUsers: () => void;
  onOpenPasteModal: (slot?: 'A' | 'B') => void;
  onOpenChangesModal?: () => void;
  onClearAllChanges?: () => void;
  onResetAllData?: () => void;
  changesCount?: number;
  hasProfiles?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSwapUsers,
  onOpenPasteModal,
  onOpenChangesModal,
  onClearAllChanges,
  onResetAllData,
  changesCount = 0,
  hasProfiles = false,
}) => {
  return (
    <header className="relative z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-white uppercase sm:text-xl">
                Fortnite <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400">Sprite Trader</span>
              </h1>
              <span className="hidden rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-300 sm:inline-block border border-purple-500/30">
                fortnite.gg
              </span>
            </div>
            <p className="text-xs text-zinc-400">Compare collections & organize mutual trades</p>
          </div>
        </div>

        {/* Top Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* Changes Rundown Button */}
          {changesCount > 0 && onOpenChangesModal && (
            <button
              id="btn-view-changes"
              onClick={onOpenChangesModal}
              className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-300 transition-all hover:bg-purple-500/30 hover:border-purple-400 shadow-sm"
              title="View Client-Side Changes Rundown"
            >
              <ClipboardList className="h-3.5 w-3.5 text-purple-300" />
              <span>Changes</span>
              <span className="rounded-full bg-purple-400 text-zinc-950 px-1.5 py-0.2 text-[10px] font-black">
                {changesCount}
              </span>
            </button>
          )}

          {/* Swap button if profiles loaded */}
          {hasProfiles && (
            <button
              id="btn-swap-users"
              onClick={onSwapUsers}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              title="Swap Player A and Player B"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Swap</span>
            </button>
          )}

          {/* Reset All Data button if profiles exist */}
          {hasProfiles && onResetAllData && (
            <button
              id="btn-reset-data"
              onClick={onResetAllData}
              className="hidden md:flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
              title="Reset and clear all imported profiles"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Primary Top Right Import HTML Button */}
          <button
            id="btn-paste-html"
            onClick={() => onOpenPasteModal('A')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-900/30 hover:opacity-95 transition-all border border-purple-400/30"
            title="Import Fortnite.GG HTML Source"
          >
            <FileCode className="h-4 w-4" />
            <span>Import HTML</span>
          </button>

          <a
            href="https://fortnite.gg/sprites"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
          >
            <span>Fortnite.GG</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
