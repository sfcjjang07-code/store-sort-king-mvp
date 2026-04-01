import type { ProductType } from '@/lib/game/types';

export type ProductMeta = {
  id: ProductType;
  name: string;
  emoji: string;
  shortDescription: string;
  shelfLabel: string;
};

export const PRODUCT_ORDER: ProductType[] = ['drink', 'snack', 'ramen', 'icecream'];

export const PRODUCT_META: Record<ProductType, ProductMeta> = {
  drink: {
    id: 'drink',
    name: '음료',
    emoji: '🥤',
    shortDescription: '냉장 음료 진열대',
    shelfLabel: '음료 칸',
  },
  snack: {
    id: 'snack',
    name: '과자',
    emoji: '🍪',
    shortDescription: '스낵/비스킷 진열대',
    shelfLabel: '과자 칸',
  },
  ramen: {
    id: 'ramen',
    name: '라면',
    emoji: '🍜',
    shortDescription: '봉지라면 진열대',
    shelfLabel: '라면 칸',
  },
  icecream: {
    id: 'icecream',
    name: '아이스크림',
    emoji: '🍦',
    shortDescription: '냉동 간식 진열대',
    shelfLabel: '아이스크림 칸',
  },
};
