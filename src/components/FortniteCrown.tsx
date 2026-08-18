import React from 'react';

export type CrownColorVariant = 'gold' | 'rose' | 'cyan' | 'purple' | 'default';

export const FORTNITE_CROWN_URL = 'https://fortnite.gg/img/x/sprites/crown.webp';

interface FortniteCrownProps {
  variant?: CrownColorVariant;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  title?: string;
  playerBadge?: 'A' | 'B' | null;
  rotate?: boolean;
  style?: React.CSSProperties;
}

export const getCrownCssFilter = (variant: CrownColorVariant | string = 'gold'): string => {
  switch (variant) {
    case 'cyan': // Player A: Electric Cyan / Sky Blue
      return 'hue-rotate(155deg) saturate(1.6) brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 6px rgba(6,182,212,0.65))';
    case 'rose': // Player B: Red Crown
      return 'hue-rotate(300deg) saturate(3.6) contrast(1.1) brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 6px rgba(225,29,72,0.75))';
    case 'purple': // Mastery Gap / Royal Purple
      return 'hue-rotate(245deg) saturate(1.8) brightness(1.05) drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 6px rgba(168,85,247,0.6))';
    case 'gold':
    case 'default':
    default: // Original Fortnite Gold
      return 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 6px rgba(245,158,11,0.65))';
  }
};

export const FortniteCrown: React.FC<FortniteCrownProps> = ({
  variant = 'gold',
  className = '',
  size = 'md',
  title,
  playerBadge,
  rotate = false,
  style,
}) => {
  const sizeClasses = {
    xs: 'h-3.5 w-3.5',
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
    xl: 'h-11 w-11',
    custom: '',
  }[size];

  const filterStyle = getCrownCssFilter(variant);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${rotate ? 'transform rotate-12' : ''} ${className}`}
      title={title}
    >
      <img
        src={FORTNITE_CROWN_URL}
        alt="Mastered Crown"
        className={`${sizeClasses} object-contain transition-all select-none pointer-events-none`}
        style={{
          filter: filterStyle,
          ...style,
        }}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback if network blocked
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {playerBadge === 'A' && (
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 text-[8px] font-black text-black ring-1 ring-black shadow">
          A
        </span>
      )}

      {playerBadge === 'B' && (
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white ring-1 ring-black shadow">
          B
        </span>
      )}
    </div>
  );
};
