import { PRODUCT_ORDER } from '@/data/products';
import {
  BASE_RUSH_WINDOW_MS,
  RUSH_MIN_WINDOW_MS,
  RUSH_SPEED_UP_EVERY_TURNS,
  RUSH_WINDOW_DECAY_MS,
} from '@/lib/game/constants';
import type { ProductType } from '@/lib/game/types';

export function getRandomProduct(): ProductType {
  const index = Math.floor(Math.random() * PRODUCT_ORDER.length);
  return PRODUCT_ORDER[index];
}

export function getNextProduct(preferred?: ProductType): ProductType {
  if (preferred && Math.random() < 0.25) {
    return preferred;
  }
  return getRandomProduct();
}

export function getRushWindowMs(turnCount: number) {
  const decaySteps = Math.floor(turnCount / RUSH_SPEED_UP_EVERY_TURNS);
  return Math.max(RUSH_MIN_WINDOW_MS, BASE_RUSH_WINDOW_MS - decaySteps * RUSH_WINDOW_DECAY_MS);
}

export function getRandomWrongShelf(currentProduct: ProductType): ProductType {
  const wrongTargets = PRODUCT_ORDER.filter((item) => item !== currentProduct);
  const index = Math.floor(Math.random() * wrongTargets.length);
  return wrongTargets[index];
}

export function removeOneItem<T>(items: T[]) {
  if (items.length === 0) {
    return items;
  }
  return items.slice(0, -1);
}
