import { UPGRADE_META } from '@/data/upgrades';
import { SectionCard } from '@/components/ui/SectionCard';
import { canPurchaseUpgrade, getUpgradeCost } from '@/lib/game/upgrades';
import type { UpgradeKey, UpgradeState } from '@/lib/game/types';
import { UpgradeCard } from './UpgradeCard';

type UpgradePanelProps = {
  totalCoins: number;
  upgrades: UpgradeState;
  onBuy: (key: UpgradeKey) => void;
};

export function UpgradePanel({ totalCoins, upgrades, onBuy }: UpgradePanelProps) {
  return (
    <SectionCard className="upgrade-panel">
      <div>
        <h2>업그레이드 상점</h2>
        <p>모은 코인으로 다음 판을 더 오래 버틸 수 있게 만들어보세요.</p>
      </div>

      <div className="stat-chip" style={{ width: 'fit-content' }}>
        <span className="stat-chip__label">보유 코인</span>
        <span className="stat-chip__value">{totalCoins}</span>
      </div>

      <div className="upgrade-grid">
        {UPGRADE_META.map((meta) => {
          const level = upgrades[meta.key];
          const cost = getUpgradeCost(level);
          const canBuy = canPurchaseUpgrade(upgrades, totalCoins, meta.key, meta.maxLevel);

          return (
            <UpgradeCard
              key={meta.key}
              name={meta.name}
              description={meta.description}
              level={level}
              maxLevel={meta.maxLevel}
              cost={cost}
              canBuy={canBuy}
              onBuy={() => onBuy(meta.key)}
            />
          );
        })}
      </div>
    </SectionCard>
  );
}
