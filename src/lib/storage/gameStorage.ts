import { STORAGE_KEY } from '@/lib/game/constants';
import { createDefaultProgress } from '@/lib/game/createInitialState';
import type { PersistentProgress } from '@/lib/game/types';

export function loadGameSave(): PersistentProgress {
  if (typeof window === 'undefined') {
    return createDefaultProgress();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultProgress();
  }

  try {
    const parsed = JSON.parse(raw) as PersistentProgress;
    return {
      bestScore: Number(parsed.bestScore) || 0,
      totalCoins: Number(parsed.totalCoins) || 0,
      upgrades: {
        shelfCapacityLevel: Number(parsed.upgrades?.shelfCapacityLevel) || 0,
        trashBagLevel: Number(parsed.upgrades?.trashBagLevel) || 0,
        emergencyClearLevel: Number(parsed.upgrades?.emergencyClearLevel) || 0,
        comboWindowLevel: Number(parsed.upgrades?.comboWindowLevel) || 0,
        bonusCoinLevel: Number(parsed.upgrades?.bonusCoinLevel) || 0,
      },
    };
  } catch {
    return createDefaultProgress();
  }
}

export function saveGameSave(progress: PersistentProgress) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
