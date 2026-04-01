import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { StatChip } from '@/components/ui/StatChip';
import type { GameMode } from '@/lib/game/types';

type GameHeaderProps = {
  score: number;
  bestScore: number;
  combo: number;
  bestCombo: number;
  coins: number;
  accuracy: number;
  pressurePercent: number;
  mode: GameMode;
  missedRushDrops: number;
  onHelp: () => void;
  onUpgrade: () => void;
  onHome: () => void;
};

export function GameHeader({
  score,
  bestScore,
  combo,
  bestCombo,
  coins,
  accuracy,
  pressurePercent,
  mode,
  missedRushDrops,
  onHelp,
  onUpgrade,
  onHome,
}: GameHeaderProps) {
  const safePressure = Math.min(100, Math.max(0, pressurePercent));

  return (
    <div className="game-header-shell">
      <div className="game-header">
        <div className="game-header__chips">
          <StatChip label="모드" value={mode === 'rush' ? '러시' : '클래식'} />
          <StatChip label="점수" value={score} />
          <StatChip label="최고기록" value={bestScore} />
          <StatChip label="현재 콤보" value={combo} />
          <StatChip label="베스트 콤보" value={bestCombo} />
          <StatChip label="정답률" value={`${accuracy}%`} />
          <StatChip label="코인" value={coins} />
          {mode === 'rush' ? <StatChip label="놓친 납품" value={`${missedRushDrops}/3`} /> : null}
        </div>

        <div className="store-actions">
          <PrimaryButton variant="ghost" onClick={onHelp}>
            플레이 방법
          </PrimaryButton>
          <PrimaryButton variant="ghost" onClick={onUpgrade}>
            업그레이드
          </PrimaryButton>
          <PrimaryButton variant="ghost" onClick={onHome}>
            홈
          </PrimaryButton>
        </div>
      </div>

      <div className="pressure-bar-card">
        <div className="pressure-bar-card__top">
          <span>매장 압박도</span>
          <strong>{safePressure}%</strong>
        </div>
        <div className="pressure-bar">
          <div className="pressure-bar__fill" style={{ width: `${safePressure}%` }} />
        </div>
      </div>
    </div>
  );
}
