export type AppScreen = 'home' | 'play' | 'upgrade';

export type ProductType = 'drink' | 'snack' | 'ramen' | 'icecream';
export type GameMode = 'classic' | 'rush';

export type UpgradeKey =
  | 'shelfCapacityLevel'
  | 'trashBagLevel'
  | 'emergencyClearLevel'
  | 'comboWindowLevel'
  | 'bonusCoinLevel';

export type ShelfState = {
  type: ProductType;
  items: ProductType[];
  capacity: number;
  lastResolvedAt: number | null;
};

export type PowerState = {
  trashBag: number;
  emergencyClear: number;
};

export type UpgradeState = Record<UpgradeKey, number>;

export type PersistentProgress = {
  bestScore: number;
  totalCoins: number;
  upgrades: UpgradeState;
};

export type GameState = PersistentProgress & {
  screen: AppScreen;
  mode: GameMode;
  score: number;
  combo: number;
  bestCombo: number;
  comboDeadline: number | null;
  rushDeadline: number | null;
  turnCount: number;
  correctPlacements: number;
  clearedGroups: number;
  missedRushDrops: number;
  currentProduct: ProductType;
  nextProduct: ProductType;
  shelves: Record<ProductType, ShelfState>;
  powers: PowerState;
  isGameOver: boolean;
  gameOverReason: string;
  lastEarnedCoins: number;
  lastToast: string | null;
};

export type GameAction =
  | { type: 'LOAD_PROGRESS'; payload: PersistentProgress }
  | { type: 'START_GAME'; mode?: GameMode; now: number }
  | { type: 'GO_HOME' }
  | { type: 'OPEN_UPGRADE' }
  | { type: 'PLACE_PRODUCT'; target: ProductType; now: number }
  | { type: 'EXPIRE_RUSH'; now: number }
  | { type: 'USE_TRASH_BAG'; target: ProductType }
  | { type: 'USE_EMERGENCY_CLEAR'; target: ProductType }
  | { type: 'PURCHASE_UPGRADE'; key: UpgradeKey }
  | { type: 'DISMISS_TOAST' };
