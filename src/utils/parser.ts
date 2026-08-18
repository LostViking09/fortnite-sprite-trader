import { SpriteItem, UserProfile } from '../types';

export function parseFortniteGGSpritesHtml(html: string, fallbackId: string = 'unknown'): UserProfile {
  // If in browser, use DOMParser for optimal fidelity
  if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract username
      let username = 'Player';
      const userHeader = doc.querySelector('.sprites-user');
      if (userHeader) {
        // Clone and remove img to get clean text
        const clone = userHeader.cloneNode(true) as HTMLElement;
        const img = clone.querySelector('img');
        if (img) img.remove();
        username = clone.textContent?.replace(/'s Sprites/i, '').trim() || username;
      } else {
        const title = doc.querySelector('title')?.textContent || '';
        const match = title.match(/^([^']+)'s Sprites/i);
        if (match) {
          username = match[1].trim();
        }
      }

      // Extract avatar
      let avatarUrl = '';
      const avatarImg = doc.querySelector('.sprites-user img.avatar') as HTMLImageElement | null;
      if (avatarImg && avatarImg.getAttribute('src')) {
        const src = avatarImg.getAttribute('src') || '';
        avatarUrl = src.startsWith('http') ? src : `https://fortnite.gg${src}`;
      } else {
        avatarUrl = 'https://fortnite.gg/img/icon.jpg';
      }

      // Extract counts
      const ownedCountEl = doc.querySelector('#sprites-owned-count');
      const masteredCountEl = doc.querySelector('#sprites-mastered-count');
      const ownedCount = ownedCountEl ? parseInt(ownedCountEl.textContent || '0', 10) : 0;
      const masteredCount = masteredCountEl ? parseInt(masteredCountEl.textContent || '0', 10) : 0;

      // Extract sprites
      const cardEls = doc.querySelectorAll('.sprite-card');
      const sprites: SpriteItem[] = [];

      cardEls.forEach((card) => {
        const spriteId = card.getAttribute('data-sprite') || '';
        const parent = card.getAttribute('data-parent') || '';
        const rarity = (card.getAttribute('data-rarity') || 'common').toLowerCase();
        const variant = (card.getAttribute('data-variant') || 'base').toLowerCase();
        const rawOwned = card.getAttribute('data-owned');
        const isOwnedClass = card.classList.contains('owned');
        const isOwned = rawOwned === '1' || isOwnedClass;

        const rawLevel = card.getAttribute('data-level');
        const level = rawLevel ? parseInt(rawLevel, 10) : isOwned ? 1 : -1;
        const isMasteredClass = card.classList.contains('mastered');
        const isMastered = isMasteredClass || level >= 5;

        // Image
        const imgEl = card.querySelector('.sprite-art img');
        let iconUrl = imgEl?.getAttribute('src') || '';
        if (iconUrl && !iconUrl.startsWith('http')) {
          iconUrl = `https://fortnite.gg${iconUrl}`;
        }

        // Detail URL
        const linkEl = card.querySelector('a.sprite-name') || card.querySelector('a.sprite-art');
        const href = linkEl?.getAttribute('href') || '';
        const detailUrl = href.startsWith('http') ? href : href ? `https://fortnite.gg${href}` : undefined;

        // Name
        const nameEl = card.querySelector('.sprite-name');
        const name = nameEl?.textContent?.trim() || parent || `Sprite #${spriteId}`;

        // Drop Chance
        const pills = card.querySelectorAll('.sprite-meta .sprite-pill');
        let dropChance = '0%';
        pills.forEach((p) => {
          const text = p.textContent?.trim() || '';
          if (text.includes('%')) {
            dropChance = text;
          }
        });

        // Status
        const status = isMastered ? 'mastered' : isOwned ? 'owned' : 'not_owned';
        const isNew = card.getAttribute('data-is-new') === '1';

        if (spriteId) {
          sprites.push({
            id: spriteId,
            name,
            parent,
            rarity,
            variant,
            owned: isOwned,
            mastered: isMastered,
            level,
            status,
            iconUrl,
            dropChance,
            detailUrl,
            isNew,
          });
        }
      });

      return {
        id: fallbackId,
        url: `https://fortnite.gg/sprites?id=${fallbackId}`,
        username,
        avatarUrl,
        ownedCount: ownedCount || sprites.filter((s) => s.owned).length,
        masteredCount: masteredCount || sprites.filter((s) => s.mastered).length,
        totalCount: sprites.length || 117,
        sprites,
      };
    } catch (e) {
      console.error('Error in DOMParser for fortnite.gg HTML:', e);
    }
  }

  // Regex fallback parser
  return parseWithRegex(html, fallbackId);
}

function parseWithRegex(html: string, fallbackId: string): UserProfile {
  let username = 'Player';
  const titleMatch = html.match(/<title>([^'<]+)'s Sprites/i);
  if (titleMatch) {
    username = titleMatch[1].trim();
  } else {
    const userMatch = html.match(/<h2 class='sprites-user'[^>]*>(?:<img[^>]*>)?([^<]+)/i);
    if (userMatch) {
      username = userMatch[1].replace(/'s Sprites/i, '').trim();
    }
  }

  let avatarUrl = 'https://fortnite.gg/img/icon.jpg';
  const avatarMatch = html.match(/<h2 class='sprites-user'[^>]*>[\s\S]*?<img[^>]*src='([^']+)'/i);
  if (avatarMatch && avatarMatch[1]) {
    avatarUrl = avatarMatch[1].startsWith('http') ? avatarMatch[1] : `https://fortnite.gg${avatarMatch[1]}`;
  }

  const ownedMatch = html.match(/id='sprites-owned-count'>(\d+)</);
  const masteredMatch = html.match(/id='sprites-mastered-count'>(\d+)</);
  const parsedOwnedCount = ownedMatch ? parseInt(ownedMatch[1], 10) : 0;
  const parsedMasteredCount = masteredMatch ? parseInt(masteredMatch[1], 10) : 0;

  const sprites: SpriteItem[] = [];
  // Match each sprite-card
  const cardRegex = /<div class='sprite-card([^']*)'([^>]*)>([\s\S]*?)<\/div><\/div>/g;
  let match: RegExpExecArray | null;

  while ((match = cardRegex.exec(html)) !== null) {
    const classes = match[1] || '';
    const attrs = match[2] || '';
    const innerHtml = match[3] || '';

    const idMatch = attrs.match(/data-sprite='([^']+)'/);
    const spriteId = idMatch ? idMatch[1] : '';
    if (!spriteId) continue;

    const parentMatch = attrs.match(/data-parent='([^']+)'/);
    const rarityMatch = attrs.match(/data-rarity='([^']+)'/);
    const variantMatch = attrs.match(/data-variant='([^']+)'/);
    const ownedAttrMatch = attrs.match(/data-owned='([^']+)'/);
    const levelMatch = attrs.match(/data-level='([^']+)'/);

    const parent = parentMatch ? parentMatch[1] : '';
    const rarity = rarityMatch ? rarityMatch[1].toLowerCase() : 'common';
    const variant = variantMatch ? variantMatch[1].toLowerCase() : 'base';
    const isOwned = (ownedAttrMatch && ownedAttrMatch[1] === '1') || classes.includes('owned');
    const level = levelMatch ? parseInt(levelMatch[1], 10) : isOwned ? 1 : -1;
    const isMastered = classes.includes('mastered') || level >= 5;

    const imgMatch = innerHtml.match(/<img[^>]*src='([^']+)'/);
    let iconUrl = imgMatch ? imgMatch[1] : '';
    if (iconUrl && !iconUrl.startsWith('http')) {
      iconUrl = `https://fortnite.gg${iconUrl}`;
    }

    const nameMatch = innerHtml.match(/<a class='sprite-name'[^>]*>([^<]+)<\/a>/);
    const name = nameMatch ? nameMatch[1].trim() : parent || `Sprite #${spriteId}`;

    const dropMatch = innerHtml.match(/<span class='sprite-pill'>([\d.]+%)/);
    const dropChance = dropMatch ? dropMatch[1] : '0%';

    const hrefMatch = innerHtml.match(/href='(\/sprites\/[^']+)'/);
    const detailUrl = hrefMatch ? `https://fortnite.gg${hrefMatch[1]}` : undefined;

    const isNew = attrs.includes("data-is-new='1'");
    const status = isMastered ? 'mastered' : isOwned ? 'owned' : 'not_owned';

    sprites.push({
      id: spriteId,
      name,
      parent,
      rarity,
      variant,
      owned: isOwned,
      mastered: isMastered,
      level,
      status,
      iconUrl,
      dropChance,
      detailUrl,
      isNew,
    });
  }

  return {
    id: fallbackId,
    url: `https://fortnite.gg/sprites?id=${fallbackId}`,
    username,
    avatarUrl,
    ownedCount: parsedOwnedCount || sprites.filter((s) => s.owned).length,
    masteredCount: parsedMasteredCount || sprites.filter((s) => s.mastered).length,
    totalCount: sprites.length || 117,
    sprites,
  };
}

export function extractIdFromUrl(input: string): string {
  const trimmed = input.trim();
  // Check if it's already just numbers
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }
  // Check url params: ?id=3642328
  const urlMatch = trimmed.match(/[?&]id=(\d+)/i);
  if (urlMatch) {
    return urlMatch[1];
  }
  // Check path /sprites/3642328 or /sprites?id=3642328
  const pathMatch = trimmed.match(/\/sprites(?:\/|\?id=)(\d+)/i);
  if (pathMatch) {
    return pathMatch[1];
  }
  return trimmed;
}
