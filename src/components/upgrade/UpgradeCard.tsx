import { PrimaryButton } from '@/components/ui/PrimaryButton';

type UpgradeCardProps = {
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  canBuy: boolean;
  onBuy: () => void;
};

export function UpgradeCard({
  name,
  description,
  level,
  maxLevel,
  cost,
  canBuy,
  onBuy,
}: UpgradeCardProps) {
  const isMax = level >= maxLevel;

  return (
    <div className="upgrade-card">
      <div className="upgrade-card__text">
        <div className="upgrade-card__name">{name}</div>
        <div className="upgrade-card__desc">{description}</div>
        <div className="upgrade-card__meta">
          레벨 {level}/{maxLevel} · {isMax ? '최대 레벨' : `다음 가격 ${cost} 코인`}
        </div>
      </div>

      <PrimaryButton variant={canBuy ? 'accent' : 'ghost'} onClick={onBuy} disabled={!canBuy}>
        {isMax ? '완료' : '구매'}
      </PrimaryButton>
    </div>
  );
}
