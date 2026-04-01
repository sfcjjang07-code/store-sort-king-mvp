import { MATCH_COUNT, MAX_MISSED_RUSH_DROPS } from '@/lib/game/constants';
import { UPGRADE_META } from '@/data/upgrades';
import { createFreshPlayState } from '@/lib/game/createInitialState';
import { getNextProduct, getRandomWrongShelf, getRushWindowMs, removeOneItem } from '@/lib/game/helpers';
import {
  getEarnedCoins,
  getNextComboDeadline,
  getClearScore,
  resolveCombo,
} from '@/lib/game/scoring';
import { canPurchaseUpgrade, getUpgradeCost } from '@/lib/game/upgrades';
import type { GameAction, GameState, PersistentProgress, ProductType } from '@/lib/game/types';

function toProgress(state: GameState): PersistentProgress {
  return {
    bestScore: state.bestScore,
    totalCoins: state.totalCoins,
    upgrades: state.upgrades,
  };
}

function removeMatchedItems(items: ProductType[], target: ProductType) {
  let removed = 0;
  return items.filter((item) => {
    if (item === target && removed < MATCH_COUNT) {
      removed += 1;
      return false;
    }
    return true;
  });
}

function finishGame(state: GameState, nextScore: number, nextBestCombo: number, reason: string, extra?: Partial<GameState>): GameState {
  const earnedCoins = getEarnedCoins(nextScore, state.upgrades);
  const totalCoins = state.totalCoins + earnedCoins;
  const bestScore = Math.max(state.bestScore, nextScore);

  return {
    ...state,
    score: nextScore,
    combo: 0,
    comboDeadline: null,
    rushDeadline: null,
    bestCombo: nextBestCombo,
    isGameOver: true,
    gameOverReason: reason,
    lastEarnedCoins: earnedCoins,
    totalCoins,
    bestScore,
    lastToast: reason,
    ...extra,
  };
}

type PlacementOptions = {
  now: number;
  target: ProductType;
  timeoutPlacement?: boolean;
};

function applyPlacement(state: GameState, { now, target, timeoutPlacement = false }: PlacementOptions): GameState {
  const targetShelf = state.shelves[target];
  const nextItems = [...targetShelf.items, state.currentProduct];
  const placedShelf = {
    ...targetShelf,
    items: nextItems,
  };

  const isCorrectPlacement = state.currentProduct === target;
  const matchedCount = nextItems.filter((item) => item === target).length;
  const nextShelves = { ...state.shelves, [target]: placedShelf };

  let nextScore = state.score;
  let nextCombo = state.combo;
  let nextComboDeadline = state.comboDeadline;
  let nextBestCombo = state.bestCombo;
  let nextToast = timeoutPlacement
    ? '시간 초과! 납품이 잘못 꽂혀서 매장이 꼬였습니다.'
    : isCorrectPlacement
      ? '정답 칸에 정리 성공!'
      : '다른 칸에 넣어서 공간이 꼬였어요.';
  let nextClearedGroups = state.clearedGroups;

  if (matchedCount >= MATCH_COUNT) {
    nextCombo = resolveCombo(state.combo, state.comboDeadline, now);
    nextComboDeadline = getNextComboDeadline(now, state.upgrades);
    nextScore += getClearScore(placedShelf, nextCombo);
    nextBestCombo = Math.max(state.bestCombo, nextCombo);
    nextClearedGroups += 1;
    nextShelves[target] = {
      ...placedShelf,
      items: removeMatchedItems(placedShelf.items, target),
      lastResolvedAt: now,
    };
    nextToast = `${nextCombo > 0 ? `${nextCombo} 콤보! ` : ''}${MATCH_COUNT}개 정리 완료`;
  } else if (state.comboDeadline !== null && now > state.comboDeadline) {
    nextCombo = 0;
    nextComboDeadline = null;
  }

  const nextTurnCount = state.turnCount + 1;
  const nextMissedRushDrops = state.missedRushDrops + (timeoutPlacement ? 1 : 0);
  const nextRushDeadline = state.mode === 'rush' ? now + getRushWindowMs(nextTurnCount) : null;

  const isOverflow = Object.values(nextShelves).some((shelf) => shelf.items.length > shelf.capacity);
  if (isOverflow) {
    return finishGame(state, nextScore, nextBestCombo, '진열칸이 가득 찼습니다', {
      turnCount: nextTurnCount,
      correctPlacements: state.correctPlacements + (isCorrectPlacement ? 1 : 0),
      clearedGroups: nextClearedGroups,
      shelves: nextShelves,
      missedRushDrops: nextMissedRushDrops,
    });
  }

  if (state.mode === 'rush' && nextMissedRushDrops >= MAX_MISSED_RUSH_DROPS) {
    return finishGame(state, nextScore, nextBestCombo, '납품 3개를 놓쳐 매장이 마비됐습니다', {
      turnCount: nextTurnCount,
      correctPlacements: state.correctPlacements + (isCorrectPlacement ? 1 : 0),
      clearedGroups: nextClearedGroups,
      shelves: nextShelves,
      missedRushDrops: nextMissedRushDrops,
    });
  }

  return {
    ...state,
    score: nextScore,
    combo: nextCombo,
    bestCombo: nextBestCombo,
    comboDeadline: nextComboDeadline,
    rushDeadline: nextRushDeadline,
    turnCount: nextTurnCount,
    correctPlacements: state.correctPlacements + (isCorrectPlacement ? 1 : 0),
    clearedGroups: nextClearedGroups,
    missedRushDrops: nextMissedRushDrops,
    currentProduct: state.nextProduct,
    nextProduct: getNextProduct(target),
    shelves: nextShelves,
    lastToast: nextToast,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_PROGRESS': {
      return {
        ...state,
        bestScore: action.payload.bestScore,
        totalCoins: action.payload.totalCoins,
        upgrades: action.payload.upgrades,
      };
    }

    case 'START_GAME': {
      return createFreshPlayState(toProgress(state), action.mode ?? state.mode, action.now);
    }

    case 'GO_HOME': {
      return {
        ...state,
        screen: 'home',
        isGameOver: false,
        lastToast: null,
        rushDeadline: null,
      };
    }

    case 'OPEN_UPGRADE': {
      return {
        ...state,
        screen: 'upgrade',
        isGameOver: false,
        lastToast: null,
        rushDeadline: null,
      };
    }

    case 'PLACE_PRODUCT': {
      if (state.isGameOver) {
        return state;
      }
      return applyPlacement(state, { target: action.target, now: action.now });
    }

    case 'EXPIRE_RUSH': {
      if (state.isGameOver || state.mode !== 'rush') {
        return state;
      }
      const forcedTarget = getRandomWrongShelf(state.currentProduct);
      return applyPlacement(state, {
        target: forcedTarget,
        now: action.now,
        timeoutPlacement: true,
      });
    }

    case 'USE_TRASH_BAG': {
      if (state.powers.trashBag <= 0) {
        return {
          ...state,
          lastToast: '쓰레기봉투가 없습니다.',
        };
      }

      const shelf = state.shelves[action.target];
      if (shelf.items.length === 0) {
        return {
          ...state,
          lastToast: '비어 있는 칸입니다.',
        };
      }

      return {
        ...state,
        shelves: {
          ...state.shelves,
          [action.target]: {
            ...shelf,
            items: removeOneItem(shelf.items),
          },
        },
        powers: {
          ...state.powers,
          trashBag: state.powers.trashBag - 1,
        },
        lastToast: '상품 1개 제거 완료',
      };
    }

    case 'USE_EMERGENCY_CLEAR': {
      if (state.powers.emergencyClear <= 0) {
        return {
          ...state,
          lastToast: '긴급 정리가 없습니다.',
        };
      }

      const shelf = state.shelves[action.target];
      if (shelf.items.length === 0) {
        return {
          ...state,
          lastToast: '비어 있는 칸입니다.',
        };
      }

      return {
        ...state,
        shelves: {
          ...state.shelves,
          [action.target]: {
            ...shelf,
            items: [],
          },
        },
        powers: {
          ...state.powers,
          emergencyClear: state.powers.emergencyClear - 1,
        },
        lastToast: '긴급 정리 완료',
      };
    }

    case 'PURCHASE_UPGRADE': {
      const meta = UPGRADE_META.find((item) => item.key === action.key);
      if (!meta) return state;

      const currentLevel = state.upgrades[action.key];
      if (!canPurchaseUpgrade(state.upgrades, state.totalCoins, action.key, meta.maxLevel)) {
        return {
          ...state,
          lastToast: '코인이 부족하거나 최대 레벨입니다.',
        };
      }

      const cost = getUpgradeCost(currentLevel);
      return {
        ...state,
        upgrades: {
          ...state.upgrades,
          [action.key]: currentLevel + 1,
        },
        totalCoins: state.totalCoins - cost,
        lastToast: `${meta.name} 업그레이드 완료`,
      };
    }

    case 'DISMISS_TOAST': {
      return {
        ...state,
        lastToast: null,
      };
    }

    default:
      return state;
  }
}
