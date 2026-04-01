import { PRODUCT_META } from '@/data/products';
import type { GameMode, ProductType } from '@/lib/game/types';
import { SectionCard } from '@/components/ui/SectionCard';

type CurrentProductCardProps = {
  currentProduct: ProductType;
  nextProduct: ProductType;
  combo: number;
  comboRatio: number;
  clearedGroups: number;
  turnCount: number;
  mode: GameMode;
  rushRatio: number;
  missedRushDrops: number;
  rushWindowMs: number;
};

export function CurrentProductCard({
  currentProduct,
  nextProduct,
  combo,
  comboRatio,
  clearedGroups,
  turnCount,
  mode,
  rushRatio,
  missedRushDrops,
  rushWindowMs,
}: CurrentProductCardProps) {
  const currentMeta = PRODUCT_META[currentProduct];
  const nextMeta = PRODUCT_META[nextProduct];
  const safeComboRatio = Math.min(100, Math.max(0, comboRatio));
  const safeRushRatio = Math.min(100, Math.max(0, rushRatio));

  return (
    <SectionCard className="product-card product-card--hero">
      <div className="product-card__headline">
        <div className="product-card__now">
          <span className="product-card__big-emoji">{currentMeta.emoji}</span>
          <div>
            <div className="product-card__eyebrow">지금 손에 든 상품</div>
            <div className="product-card__name">{currentMeta.name}</div>
            <div className="product-card__desc">{currentMeta.shortDescription}</div>
          </div>
        </div>

        <div className="product-card__next product-card__next--glass">
          <span className="product-card__eyebrow">다음 상품</span>
          <strong>
            {nextMeta.emoji} {nextMeta.name}
          </strong>
        </div>
      </div>

      <div className="product-card__stats-grid">
        <div className="mini-stat-card">
          <span>정리 완료</span>
          <strong>{clearedGroups}회</strong>
        </div>
        <div className="mini-stat-card">
          <span>진행 턴</span>
          <strong>{turnCount}턴</strong>
        </div>
        <div className="mini-stat-card mini-stat-card--combo">
          <span>플레이 모드</span>
          <strong>{mode === 'rush' ? '러시 모드' : '클래식 모드'}</strong>
        </div>
      </div>

      {mode === 'rush' ? (
        <div className="rush-meter">
          <div className="rush-meter__top">
            <span>납품 타이머</span>
            <strong>{safeRushRatio}%</strong>
          </div>
          <div className="rush-meter__track">
            <div className="rush-meter__fill" style={{ width: `${safeRushRatio}%` }} />
          </div>
          <div className="rush-meter__meta">
            <span>놓친 납품 {missedRushDrops}/3</span>
            <span>현재 라운드 시간 {Math.round(rushWindowMs / 100) / 10}초</span>
          </div>
        </div>
      ) : null}

      <div className="combo-meter">
        <div className="combo-meter__top">
          <span>콤보 윈도우</span>
          <strong>{safeComboRatio}%</strong>
        </div>
        <div className="combo-meter__track">
          <div className="combo-meter__fill" style={{ width: `${safeComboRatio}%` }} />
        </div>
      </div>

      <div className="keyboard-guide">
        <span>숫자키</span>
        <div className="keyboard-guide__keys">
          <kbd>1</kbd>
          <kbd>2</kbd>
          <kbd>3</kbd>
          <kbd>4</kbd>
        </div>
        <p>{mode === 'rush' ? '러시 모드에서는 타이머가 끝나기 전에 넣어야 해요.' : '키보드로도 진열칸을 바로 선택할 수 있어요.'}</p>
      </div>
    </SectionCard>
  );
}
