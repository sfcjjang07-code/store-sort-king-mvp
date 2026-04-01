import { PRODUCT_META, PRODUCT_ORDER } from '@/data/products';
import type { PowerState, ProductType } from '@/lib/game/types';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionCard } from '@/components/ui/SectionCard';

type PowerPanelProps = {
  powers: PowerState;
  onUseTrashBag: (target: ProductType) => void;
  onUseEmergencyClear: (target: ProductType) => void;
};

export function PowerPanel({
  powers,
  onUseTrashBag,
  onUseEmergencyClear,
}: PowerPanelProps) {
  return (
    <SectionCard className="power-panel">
      <div className="power-panel__header">
        <div>
          <h3>특수 기능</h3>
          <p>잘못 쌓인 상품을 정리해서 위기를 넘기세요.</p>
        </div>
        <div className="power-stock">
          <span>봉투 {powers.trashBag}</span>
          <span>긴급정리 {powers.emergencyClear}</span>
        </div>
      </div>

      {PRODUCT_ORDER.map((product) => {
        const meta = PRODUCT_META[product];
        return (
          <div className="power-row" key={product}>
            <div className="power-row__label">
              <span>{meta.emoji}</span>
              <span>{meta.shelfLabel}</span>
            </div>

            <div className="power-row__buttons">
              <PrimaryButton
                variant="ghost"
                onClick={() => onUseTrashBag(product)}
                disabled={powers.trashBag <= 0}
              >
                1개 제거
              </PrimaryButton>
              <PrimaryButton
                variant="ghost"
                onClick={() => onUseEmergencyClear(product)}
                disabled={powers.emergencyClear <= 0}
              >
                전체 비우기
              </PrimaryButton>
            </div>
          </div>
        );
      })}
    </SectionCard>
  );
}
