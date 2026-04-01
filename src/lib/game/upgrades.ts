import { BASE_COMBO_WINDOW_MS, BASE_SHELF_CAPACITY } from '@/lib/game/constants';
import type { UpgradeKey, UpgradeState } from '@/lib/game/types';

export const DEFAULT_UPGRADES: UpgradeState = {
  shelfCapacityLevel: 0,
  trashBagLevel: 0,
  emergencyClearLevel: 0,
  comboWindowLevel: 0,
  bonusCoinLevel: 0,
};

export function getShelfCapacity(upgrades: UpgradeState) {
  return BASE_SHELF_CAPACITY + upgrades.shelfCapacityLevel;
}

export function getStartingTrashBags(upgrades: UpgradeState) {
  return 1 + upgrades.trashBagLevel;
}

export function getStartingEmergencyClears(upgrades: UpgradeState) {
  return 1 + upgrades.emergencyClearLevel;
}

export function getComboWindowMs(upgrades: UpgradeState) {
  return BASE_COMBO_WINDOW_MS + upgrades.comboWindowLevel * 500;
}

export function getBonusCoins(upgrades: UpgradeState) {
  return upgrades.bonusCoinLevel;
}

export function getUpgradeCost(level: number) {
  return 10 * Math.pow(2, level);
}

export function canPurchaseUpgrade(
  upgrades: UpgradeState,
  totalCoins: number,
  key: UpgradeKey,
  maxLevel: number,
) {
  const currentLevel = upgrades[key];
  if (currentLevel >= maxLevel) {
    return false;
  }
  return totalCoins >= getUpgradeCost(currentLevel);
}
