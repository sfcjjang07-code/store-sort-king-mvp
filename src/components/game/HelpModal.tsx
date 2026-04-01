import { PrimaryButton } from '@/components/ui/PrimaryButton';

type HelpModalProps = {
  onClose: () => void;
};

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>플레이 방법</h2>
        <p>쏟아지는 편의점 상품을 맞는 진열칸에 넣고 3개씩 정리하며 오래 버티는 퍼즐 게임입니다.</p>

        <div className="kv-list">
          <div className="kv-row">
            <span>1</span>
            <span>현재 상품을 올바른 진열칸에 넣으세요.</span>
          </div>
          <div className="kv-row">
            <span>2</span>
            <span>같은 상품 3개가 모이면 자동 정리되고 점수를 얻습니다.</span>
          </div>
          <div className="kv-row">
            <span>3</span>
            <span>칸이 넘치면 즉시 게임오버입니다.</span>
          </div>
          <div className="kv-row">
            <span>4</span>
            <span>쓰레기봉투와 긴급 정리로 위기를 넘기세요.</span>
          </div>
        </div>

        <div className="modal-actions">
          <PrimaryButton variant="accent" onClick={onClose}>
            확인
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
