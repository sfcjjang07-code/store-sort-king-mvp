import type { UpgradeKey } from '@/lib/game/types';

export type UpgradeMeta = {
  key: UpgradeKey;
  name: string;
  maxLevel: number;
  description: string;
};

export const UPGRADE_META: UpgradeMeta[] = [
  {
    key: 'shelfCapacityLevel',
    name: '진열칸 확장',
    maxLevel: 3,
    description: '모든 진열칸의 최대 적재량이 1씩 증가합니다.',
  },
  {
    key: 'trashBagLevel',
    name: '쓰레기봉투 추가',
    maxLevel: 3,
    description: '판 시작 시 쓰레기봉투 개수가 늘어납니다.',
  },
  {
    key: 'emergencyClearLevel',
    name: '긴급 정리 추가',
    maxLevel: 2,
    description: '판 시작 시 긴급 정리 개수가 늘어납니다.',
  },
  {
    key: 'comboWindowLevel',
    name: '콤보 유지 시간',
    maxLevel: 4,
    description: '정리 후 다음 정리까지 콤보가 유지되는 시간이 늘어납니다.',
  },
  {
    key: 'bonusCoinLevel',
    name: '코인 보너스',
    maxLevel: 5,
    description: '판 종료 시 추가 코인을 받습니다.',
  },
];
