import { BASE_CLEAR_SCORE, DANGER_THRESHOLD_OFFSET } from '@/lib/game/constants';
import { getBonusCoins, getComboWindowMs } from '@/lib/game/upgrades';
import type { ShelfState, UpgradeState } from '@/lib/game/types';

export function getComboMultiplier(combo: number) {
  if (combo >= 3) return 2;
  if (combo === 2) return 1.5;
  if (combo === 1) return 1.2;
  return 1;
}

export function resolveCombo(
  combo: number,
  comboDeadline: number | null,
  now: number,
) {
  if (comboDeadline !== null && now <= comboDeadline) {
    return combo + 1;
  }
  return 0;
}

export function getNextComboDeadline(now: number, upgrades: UpgradeState) {
  return now + getComboWindowMs(upgrades);
}

export function getClearScore(shelf: ShelfState, combo: number) {
  const dangerBonus =
    shelf.items.length >= shelf.capacity - DANGER_THRESHOLD_OFFSET ? 50 : 0;
  return Math.round((BASE_CLEAR_SCORE + dangerBonus) * getComboMultiplier(combo));
}

export function getEarnedCoins(score: number, upgrades: UpgradeState) {
  const base = Math.max(1, Math.floor(score / 100));
  return base + getBonusCoins(upgrades);
}
