import React from 'react';
import { ComparisonMode } from '../types';
import { Sparkles, Crown, Users, Layers } from 'lucide-react';

interface ComparisonTabsProps {
  activeMode: ComparisonMode;
  onSelectMode: (mode: ComparisonMode) => void;
  counts: {
    missingA: number;
    missingB: number;
    bothMissing: number;
    masteryDiff: number;
    total: number;
  };
  usernameA: string;
  usernameB: string;
}

export const ComparisonTabs: React.FC<ComparisonTabsProps> = ({
  activeMode,
  onSelectMode,
  counts,
  usernameA,
  usernameB,
}) => {
  const tabs = [
    {
      id: 'all_matrix' as ComparisonMode,
      label: 'Full Inventory Matrix',
      badge: counts.total,
      badgeColor: 'bg-zinc-700/50 text-zinc-300 border-zinc-600',
      icon: <Layers className="h-4 w-4 text-zinc-400" />,
      desc: 'Complete side-by-side sprite database',
    },
    {
      id: 'missing_a' as ComparisonMode,
      label: `Missing for ${usernameA}`,
      badge: counts.missingA,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
      desc: `Sprites ${usernameB} has that ${usernameA} needs`,
    },
    {
      id: 'missing_b' as ComparisonMode,
      label: `Missing for ${usernameB}`,
      badge: counts.missingB,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: <Sparkles className="h-4 w-4 text-rose-400" />,
      desc: `Sprites ${usernameA} has that ${usernameB} needs`,
    },
    {
      id: 'both_missing' as ComparisonMode,
      label: 'Both Missing',
      badge: counts.bothMissing,
      badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700',
      icon: <Users className="h-4 w-4 text-zinc-400" />,
      desc: 'Sprites neither player has unlocked yet',
    },
    {
      id: 'mastery_diff' as ComparisonMode,
      label: 'Mastery Gap',
      badge: counts.masteryDiff,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: <Crown className="h-4 w-4 text-purple-400" />,
      desc: 'Owned by both players, but only one has mastered (Lvl 5)',
    },
  ];

  return (
    <div className="border-b border-zinc-800 pb-1">
      <div className="flex space-x-2 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectMode(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold border ${tab.badgeColor}`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
