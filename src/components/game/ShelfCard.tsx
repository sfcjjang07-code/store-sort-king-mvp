import { PRODUCT_META } from '@/data/products';
import type { ShelfState } from '@/lib/game/types';

type ShelfCardProps = {
  shelf: ShelfState;
  isSuggested?: boolean;
};

export function ShelfCard({ shelf, isSuggested = false }: ShelfCardProps) {
  const meta = PRODUCT_META[shelf.type];
  const isDanger = shelf.items.length >= shelf.capacity - 1;
  const isFlash = shelf.lastResolvedAt !== null;
  const fillPercent = Math.min(100, Math.round((shelf.items.length / shelf.capacity) * 100));

  return (
    <div
      className={[
        'shelf-card',
        isDanger ? 'shelf-card--danger' : '',
        isFlash ? 'shelf-card--flash' : '',
        isSuggested ? 'shelf-card--suggested' : '',
      ]
        .join(' ')
        .trim()}
    >
      <div className="shelf-card__top">
        <div className="shelf-card__title">
          <span className="shelf-card__emoji">{meta.emoji}</span>
          <div>
            <div className="shelf-card__name">{meta.shelfLabel}</div>
            <div className="shelf-card__count">
              {shelf.items.length} / {shelf.capacity}
            </div>
          </div>
        </div>
        {isSuggested ? <div className="shelf-card__tag">정답 추천</div> : null}
      </div>

      <div className="shelf-card__meter">
        <div className="shelf-card__meter-fill" style={{ width: `${fillPercent}%` }} />
      </div>

      <div className="shelf-card__items">
        {shelf.items.length === 0 ? (
          <span className="shelf-card__hint">아직 비어 있어요. 이 칸에 상품을 쌓아보세요.</span>
        ) : (
          shelf.items.map((item, index) => {
            const itemMeta = PRODUCT_META[item];
            const isWrong = item !== shelf.type;
            return (
              <span
                key={`${item}-${index}`}
                className={`product-pill ${isWrong ? 'product-pill--wrong' : ''}`.trim()}
              >
                {itemMeta.emoji} {itemMeta.name}
              </span>
            );
          })
        )}
      </div>

      <div className="shelf-card__hint">
        {isDanger
          ? '위험! 이 칸이 곧 넘칩니다. 빠르게 정리하거나 특수 기능을 사용하세요.'
          : `${meta.name} 3개가 모이면 자동 정리됩니다.`}
      </div>
    </div>
  );
}
