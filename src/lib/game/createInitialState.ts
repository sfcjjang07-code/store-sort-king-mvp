import { PRODUCT_ORDER } from '@/data/products';
import { getRandomProduct, getRushWindowMs } from '@/lib/game/helpers';
import {
  DEFAULT_UPGRADES,
  getShelfCapacity,
  getStartingEmergencyClears,
  getStartingTrashBags,
} from '@/lib/game/upgrades';
import type {
  GameMode,
  GameState,
  PersistentProgress,
  ProductType,
  ShelfState,
  UpgradeState,
} from '@/lib/game/types';

export function createDefaultProgress(): PersistentProgress {
  return {
    bestScore: 0,
    totalCoins: 0,
    upgrades: { ...DEFAULT_UPGRADES },
  };
}

export function createShelves(upgrades: UpgradeState): Record<ProductType, ShelfState> {
  const capacity = getShelfCapacity(upgrades);

  return PRODUCT_ORDER.reduce((acc, product) => {
    acc[product] = {
      type: product,
      items: [],
      capacity,
      lastResolvedAt: null,
    };
    return acc;
  }, {} as Record<ProductType, ShelfState>);
}

export function createFreshPlayState(
  progress: PersistentProgress,
  mode: GameMode = 'classic',
  now: number = Date.now(),
): GameState {
  return {
    screen: 'play',
    mode,
    bestScore: progress.bestScore,
    totalCoins: progress.totalCoins,
    upgrades: progress.upgrades,
    score: 0,
    combo: 0,
    bestCombo: 0,
    comboDeadline: null,
    rushDeadline: mode === 'rush' ? now + getRushWindowMs(0) : null,
    turnCount: 0,
    correctPlacements: 0,
    clearedGroups: 0,
    missedRushDrops: 0,
    currentProduct: getRandomProduct(),
    nextProduct: getRandomProduct(),
    shelves: createShelves(progress.upgrades),
    powers: {
      trashBag: getStartingTrashBags(progress.upgrades),
      emergencyClear: getStartingEmergencyClears(progress.upgrades),
    },
    isGameOver: false,
    gameOverReason: '진열칸이 가득 찼습니다',
    lastEarnedCoins: 0,
    lastToast: null,
  };
}

export function createInitialGameState(progress?: PersistentProgress): GameState {
  const safeProgress = progress ?? createDefaultProgress();

  return {
    ...createFreshPlayState(safeProgress, 'classic'),
    screen: 'home',
  };
}
