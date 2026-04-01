import { PRODUCT_META, PRODUCT_ORDER } from '@/data/products';
import type { ProductType } from '@/lib/game/types';

type ActionPadProps = {
  currentProduct: ProductType;
  onPlace: (target: ProductType) => void;
  disabled?: boolean;
};

export function ActionPad({ currentProduct, onPlace, disabled = false }: ActionPadProps) {
  return (
    <div className="action-grid">
      {PRODUCT_ORDER.map((target, index) => {
        const meta = PRODUCT_META[target];
        const isBest = currentProduct === target;
        return (
          <button
            key={target}
            className={`action-button ${isBest ? 'action-button--best' : ''}`.trim()}
            onClick={() => onPlace(target)}
            disabled={disabled}
            type="button"
          >
            <span className="action-button__hotkey">{index + 1}</span>
            <span className="action-button__title">
              {meta.emoji} {meta.shelfLabel}
            </span>
            <span className="action-button__meta">
              {isBest ? '정답 칸 · 지금 넣으면 가장 안전함' : '오답 칸 · 공간이 꼬이고 압박이 상승'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
