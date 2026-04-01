import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { GameMode } from '@/lib/game/types';

type GameOverModalProps = {
  score: number;
  bestScore: number;
  earnedCoins: number;
  bestCombo: number;
  accuracy: number;
  reason: string;
  mode: GameMode;
  onRestartClassic: () => void;
  onRestartRush: () => void;
  onUpgrade: () => void;
  onHome: () => void;
};

export function GameOverModal({
  score,
  bestScore,
  earnedCoins,
  bestCombo,
  accuracy,
  reason,
  mode,
  onRestartClassic,
  onRestartRush,
  onUpgrade,
  onHome,
}: GameOverModalProps) {
  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-card--gameover">
        <div className="modal-card__eyebrow">야간 근무 종료 · {mode === 'rush' ? '러시 모드' : '클래식 모드'}</div>
        <h2>{reason}</h2>
        <p>코인을 모아 업그레이드하고, 더 오래 버티는 정리 루프를 다시 만들어보세요.</p>

        <div className="kv-list kv-list--cards">
          <div className="kv-row kv-row--card">
            <span>최종 점수</span>
            <strong>{score}</strong>
          </div>
          <div className="kv-row kv-row--card">
            <span>획득 코인</span>
            <strong>+{earnedCoins}</strong>
          </div>
          <div className="kv-row kv-row--card">
            <span>최고 기록</span>
            <strong>{bestScore}</strong>
          </div>
          <div className="kv-row kv-row--card">
            <span>베스트 콤보</span>
            <strong>{bestCombo}</strong>
          </div>
          <div className="kv-row kv-row--card">
            <span>정답률</span>
            <strong>{accuracy}%</strong>
          </div>
        </div>

        <div className="modal-actions modal-actions--stack-on-mobile">
          <PrimaryButton variant="accent" onClick={mode === 'rush' ? onRestartRush : onRestartClassic}>
            같은 모드로 다시 시작
          </PrimaryButton>
          <PrimaryButton variant="solid" onClick={onRestartClassic}>
            클래식 시작
          </PrimaryButton>
          <PrimaryButton variant="danger" onClick={onRestartRush}>
            러시 시작
          </PrimaryButton>
          <PrimaryButton variant="ghost" onClick={onUpgrade}>
            업그레이드
          </PrimaryButton>
          <PrimaryButton variant="ghost" onClick={onHome}>
            홈으로
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
