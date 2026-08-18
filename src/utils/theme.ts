export function getRarityColor(rarity: string): {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  glow: string;
  themeClass: string;
} {
  const r = rarity?.toLowerCase() || 'common';
  switch (r) {
    case 'mythic':
      return {
        bg: 'bg-[#7c5d26]/40',
        border: 'border-[#f1e198]/60',
        text: 'text-[#fff0a6]',
        badgeBg: 'bg-[#7c5d26] text-[#fff0a6] border border-[#f1e198]/40',
        glow: 'shadow-[0_0_15px_rgba(241,225,152,0.25)]',
        themeClass: 'sprite-theme-mythic',
      };
    case 'legendary':
      return {
        bg: 'bg-[#8a3c1e]/40',
        border: 'border-[#de6e0e]/60',
        text: 'text-[#fbc363]',
        badgeBg: 'bg-[#8a3c1e] text-[#fbc363] border border-[#de6e0e]/40',
        glow: 'shadow-[0_0_15px_rgba(222,110,14,0.25)]',
        themeClass: 'sprite-theme-legendary',
      };
    case 'epic':
      return {
        bg: 'bg-[#4c197b]/40',
        border: 'border-[#ce59ff]/60',
        text: 'text-[#ec27ff]',
        badgeBg: 'bg-[#4c197b] text-[#ec27ff] border border-[#ce59ff]/40',
        glow: 'shadow-[0_0_15px_rgba(206,89,255,0.25)]',
        themeClass: 'sprite-theme-epic',
      };
    case 'rare':
      return {
        bg: 'bg-[#00458a]/40',
        border: 'border-[#00afff]/60',
        text: 'text-[#00fffb]',
        badgeBg: 'bg-[#00458a] text-[#00fffb] border border-[#00afff]/40',
        glow: 'shadow-[0_0_15px_rgba(0,175,255,0.25)]',
        themeClass: 'sprite-theme-rare',
      };
    case 'special':
      return {
        bg: 'bg-cyan-950/40',
        border: 'border-cyan-400/60',
        text: 'text-cyan-300',
        badgeBg: 'sprite-rarity-special border border-white/40',
        glow: 'shadow-[0_0_15px_rgba(93,255,228,0.35)]',
        themeClass: 'sprite-theme-rare',
      };
    default:
      return {
        bg: 'bg-[#40464d]/40',
        border: 'border-[#40464d]',
        text: 'text-[#b7bfc5]',
        badgeBg: 'bg-[#40464d] text-[#b7bfc5] border border-zinc-600',
        glow: '',
        themeClass: '',
      };
  }
}

export function getVariantBadge(variant: string): {
  label: string;
  bgClass: string;
  textColor: string;
  themeClass: string;
  borderColor: string;
} {
  const v = variant?.toLowerCase() || 'base';
  switch (v) {
    case 'gold':
      return {
        label: 'Gold',
        bgClass: 'bg-[#9d752a]/50 border-[#f5b642]/60',
        textColor: 'text-[#f5b642]',
        themeClass: 'sprite-theme-gold',
        borderColor: '#f5b642',
      };
    case 'candy':
    case 'gummy':
      return {
        label: 'Gummy',
        bgClass: 'bg-[#9f4540]/50 border-[#f16f68]/60',
        textColor: 'text-[#f16f68]',
        themeClass: 'sprite-theme-candy',
        borderColor: '#f16f68',
      };
    case 'galaxy':
      return {
        label: 'Galaxy',
        bgClass: 'bg-[#463b9e]/50 border-[#6d5df7]/60',
        textColor: 'text-[#a59eff]',
        themeClass: 'sprite-theme-galaxy',
        borderColor: '#6d5df7',
      };
    case 'gem':
      return {
        label: 'Gem',
        bgClass: 'bg-[#7098a3]/50 border-[#c9e7f2]/60',
        textColor: 'text-[#c9e7f2]',
        themeClass: 'sprite-theme-gem',
        borderColor: '#c9e7f2',
      };
    case 'holofoil':
    case 'holo':
      return {
        label: 'Holofoil',
        bgClass: 'bg-[#a1428e]/50 border-[#f07ad8]/60',
        textColor: 'text-[#f07ad8]',
        themeClass: 'sprite-theme-holofoil',
        borderColor: '#f07ad8',
      };
    case 'cube':
      return {
        label: 'Cube',
        bgClass: 'bg-[#730974]/50 border-[#8b008b]/60',
        textColor: 'text-[#e276e2]',
        themeClass: 'sprite-theme-cube',
        borderColor: '#8b008b',
      };
    case 'quack':
      return {
        label: 'Quack',
        bgClass: 'bg-[#6941a2]/50 border-[#a66bff]/60',
        textColor: 'text-[#c8a6ff]',
        themeClass: 'sprite-theme-quack',
        borderColor: '#a66bff',
      };
    case 'base':
    default:
      return {
        label: 'Base',
        bgClass: 'bg-zinc-800/80 border-zinc-700',
        textColor: 'text-zinc-400',
        themeClass: '',
        borderColor: '#40464d',
      };
  }
}
