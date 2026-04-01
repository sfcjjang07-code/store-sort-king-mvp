'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import { ActionPad } from '@/components/game/ActionPad';
import { CurrentProductCard } from '@/components/game/CurrentProductCard';
import { GameHeader } from '@/components/game/GameHeader';
import { GameOverModal } from '@/components/game/GameOverModal';
import { HelpModal } from '@/components/game/HelpModal';
import { PowerPanel } from '@/components/game/PowerPanel';
import { ShelfBoard } from '@/components/game/ShelfBoard';
import { UpgradePanel } from '@/components/upgrade/UpgradePanel';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SectionCard } from '@/components/ui/SectionCard';
import { StatChip } from '@/components/ui/StatChip';
import { createInitialGameState } from '@/lib/game/createInitialState';
import { gameReducer } from '@/lib/game/gameReducer';
import { saveGameSave, loadGameSave } from '@/lib/storage/gameStorage';
import { getRushWindowMs } from '@/lib/game/helpers';
import { getComboWindowMs } from '@/lib/game/upgrades';
import { PRODUCT_ORDER } from '@/data/products';
import type { GameMode, UpgradeKey, ProductType } from '@/lib/game/types';

export function StoreSortGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialGameState());
  const [helpOpen, setHelpOpen] = useState(false);
  const [clockNow, setClockNow] = useState(Date.now());

  useEffect(() => {
    const progress = loadGameSave();
    dispatch({ type: 'LOAD_PROGRESS', payload: progress });
  }, []);

  useEffect(() => {
    saveGameSave({
      bestScore: state.bestScore,
      totalCoins: state.totalCoins,
      upgrades: state.upgrades,
    });
  }, [state.bestScore, state.totalCoins, state.upgrades]);

  useEffect(() => {
    if (!state.lastToast) {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST' });
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [state.lastToast]);

  useEffect(() => {
    if (state.screen !== 'play' || state.isGameOver) {
      return;
    }

    const interval = window.setInterval(() => {
      setClockNow(Date.now());
    }, 100);

    return () => window.clearInterval(interval);
  }, [state.screen, state.isGameOver]);

  useEffect(() => {
    if (
      state.screen !== 'play' ||
      state.isGameOver ||
      state.mode !== 'rush' ||
      state.rushDeadline === null ||
      clockNow <= state.rushDeadline
    ) {
      return;
    }

    dispatch({ type: 'EXPIRE_RUSH', now: clockNow });
  }, [clockNow, state.screen, state.isGameOver, state.mode, state.rushDeadline]);

  const startGame = (mode: GameMode = state.mode) =>
    dispatch({ type: 'START_GAME', mode, now: Date.now() });

  useEffect(() => {
    if (state.screen !== 'play' || state.isGameOver) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1') placeProduct('drink');
      if (event.key === '2') placeProduct('snack');
      if (event.key === '3') placeProduct('ramen');
      if (event.key === '4') placeProduct('icecream');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.screen, state.isGameOver, state.mode, state.currentProduct, state.nextProduct]);

  const isHome = state.screen === 'home';
  const isUpgrade = state.screen === 'upgrade';

  const goHome = () => dispatch({ type: 'GO_HOME' });
  const openUpgrade = () => dispatch({ type: 'OPEN_UPGRADE' });
  const placeProduct = (target: ProductType) =>
    dispatch({ type: 'PLACE_PRODUCT', target, now: Date.now() });
  const useTrashBag = (target: ProductType) => dispatch({ type: 'USE_TRASH_BAG', target });
  const useEmergencyClear = (target: ProductType) =>
    dispatch({ type: 'USE_EMERGENCY_CLEAR', target });
  const buyUpgrade = (key: UpgradeKey) => dispatch({ type: 'PURCHASE_UPGRADE', key });

  const accuracy = useMemo(() => {
    if (state.turnCount === 0) return 100;
    return Math.round((state.correctPlacements / state.turnCount) * 100);
  }, [state.correctPlacements, state.turnCount]);

  const comboRatio = useMemo(() => {
    if (!state.comboDeadline) return 0;
    const totalWindow = getComboWindowMs(state.upgrades);
    const remaining = Math.max(0, state.comboDeadline - clockNow);
    return Math.round((remaining / totalWindow) * 100);
  }, [clockNow, state.comboDeadline, state.upgrades]);

  const rushRatio = useMemo(() => {
    if (!state.rushDeadline || state.mode !== 'rush') return 0;
    const totalWindow = getRushWindowMs(state.turnCount);
    const remaining = Math.max(0, state.rushDeadline - clockNow);
    return Math.round((remaining / totalWindow) * 100);
  }, [clockNow, state.mode, state.rushDeadline, state.turnCount]);

  const pressurePercent = useMemo(() => {
    const used = Object.values(state.shelves).reduce((sum, shelf) => sum + shelf.items.length, 0);
    const total = Object.values(state.shelves).reduce((sum, shelf) => sum + shelf.capacity, 0);
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  }, [state.shelves]);

  const totalWrongItems = useMemo(() => {
    return Object.values(state.shelves).reduce((sum, shelf) => {
      return sum + shelf.items.filter((item) => item !== shelf.type).length;
    }, 0);
  }, [state.shelves]);

  return (
    <main className="store-page">
      <div className="store-shell">
        {isHome ? (
          <div className="store-home">
            <SectionCard className="store-hero store-hero--premium">
              <div className="store-badge">러시 모드 추가판</div>
              <h1 className="store-title">편의점 정리왕</h1>
              <p className="store-description">
                쏟아지는 상품을 빠르게 분류하고, 3개씩 정리하며, 매장 압박도를 끝까지 관리하는
                야간 알바 생존 퍼즐.
              </p>

              <div className="mode-grid">
                <div className="mode-card mode-card--classic">
                  <div className="mode-card__eyebrow">클래식</div>
                  <strong>차분하게 정리하고 콤보를 쌓는 기본 모드</strong>
                  <p>판단과 복구, 업그레이드 체감에 집중하는 기본 플레이.</p>
                  <PrimaryButton variant="solid" onClick={() => startGame('classic')}>
                    클래식 시작
                  </PrimaryButton>
                </div>
                <div className="mode-card mode-card--rush">
                  <div className="mode-card__eyebrow">러시</div>
                  <strong>시간 제한 안에 넣지 못하면 오정리 납품이 터지는 압박 모드</strong>
                  <p>놓친 납품이 3개 쌓이면 즉시 종료. 점점 더 빨라진다.</p>
                  <PrimaryButton variant="danger" onClick={() => startGame('rush')}>
                    러시 시작
                  </PrimaryButton>
                </div>
              </div>

              <div className="hero-preview-grid">
                {PRODUCT_ORDER.map((type) => (
                  <div key={type} className="hero-preview-card">
                    <span className="hero-preview-card__emoji">
                      {type === 'drink' ? '🥤' : type === 'snack' ? '🍪' : type === 'ramen' ? '🍜' : '🍦'}
                    </span>
                    <span>{type === 'drink' ? '음료' : type === 'snack' ? '과자' : type === 'ramen' ? '라면' : '아이스크림'}</span>
                  </div>
                ))}
              </div>

              <div className="store-bullets">
                <div className="store-bullet">
                  <strong>즉시 이해</strong>
                  <span>상품을 맞는 칸에 넣고 3개씩 정리하면 끝.</span>
                </div>
                <div className="store-bullet">
                  <strong>손맛 우선</strong>
                  <span>정답 추천, 압박도, 콤보 윈도우에 러시 타이머까지 추가.</span>
                </div>
                <div className="store-bullet">
                  <strong>확장 가능</strong>
                  <span>카페, 마트, 문방구 테마로 쉽게 갈아끼울 수 있는 엔진.</span>
                </div>
              </div>

              <div className="store-actions">
                <PrimaryButton variant="solid" onClick={openUpgrade}>
                  업그레이드 상점
                </PrimaryButton>
                <PrimaryButton variant="ghost" onClick={() => setHelpOpen(true)}>
                  플레이 방법
                </PrimaryButton>
              </div>
            </SectionCard>

            <SectionCard className="store-side-panel store-side-panel--stacked">
              <div className="side-panel-block">
                <h2>이번 강화 포인트</h2>
                <p>
                  게임다움을 올리기 위해 자동 시간 압박이 들어가는 러시 모드를 추가했습니다. 이제
                  "생각은 되는데 느슨하다"는 느낌 대신 "빨리 정리해야 한다"는 텐션이 생깁니다.
                </p>
              </div>

              <div className="side-panel-stats">
                <StatChip label="최고 점수" value={state.bestScore} />
                <StatChip label="보유 코인" value={state.totalCoins} />
                <StatChip label="최고 콤보" value={state.bestCombo} />
              </div>

              <div className="side-panel-block">
                <h3>추천 플레이 순서</h3>
                <p>먼저 클래식으로 감을 익히고, 그다음 러시에서 진짜 긴장감과 재도전 욕구를 확인해보세요.</p>
              </div>
            </SectionCard>
          </div>
        ) : (
          <>
            <GameHeader
              score={state.score}
              bestScore={state.bestScore}
              combo={state.combo}
              bestCombo={state.bestCombo}
              coins={state.totalCoins}
              accuracy={accuracy}
              pressurePercent={pressurePercent}
              mode={state.mode}
              missedRushDrops={state.missedRushDrops}
              onHelp={() => setHelpOpen(true)}
              onUpgrade={openUpgrade}
              onHome={goHome}
            />

            {isUpgrade ? (
              <>
                <UpgradePanel totalCoins={state.totalCoins} upgrades={state.upgrades} onBuy={buyUpgrade} />
                <div className="store-actions store-actions--split">
                  <PrimaryButton variant="accent" onClick={() => startGame('classic')}>
                    클래식 시작
                  </PrimaryButton>
                  <PrimaryButton variant="danger" onClick={() => startGame('rush')}>
                    러시 시작
                  </PrimaryButton>
                  <PrimaryButton variant="ghost" onClick={goHome}>
                    홈으로
                  </PrimaryButton>
                </div>
              </>
            ) : (
              <div className="game-layout">
                <SectionCard className="game-panel game-panel--board">
                  <div className="game-panel__title-row">
                    <div>
                      <h2>진열 보드</h2>
                      <p>
                        {state.mode === 'rush'
                          ? '러시 모드에서는 시간 안에 넣지 못하면 오정리 납품이 자동으로 떨어집니다.'
                          : '정답 칸은 은은하게 강조되고, 위험한 칸은 압박도가 올라갑니다.'}
                      </p>
                    </div>
                    <div className="board-summary">
                      <StatChip label="오정리 상품" value={totalWrongItems} />
                      <StatChip label="정리 완료" value={state.clearedGroups} />
                    </div>
                  </div>
                  <ShelfBoard shelves={state.shelves} suggestedShelf={state.currentProduct} />
                </SectionCard>

                <div className="product-area">
                  <div className="product-area__current">
                    <CurrentProductCard
                      currentProduct={state.currentProduct}
                      nextProduct={state.nextProduct}
                      combo={state.combo}
                      comboRatio={comboRatio}
                      clearedGroups={state.clearedGroups}
                      turnCount={state.turnCount}
                      mode={state.mode}
                      rushRatio={rushRatio}
                      missedRushDrops={state.missedRushDrops}
                      rushWindowMs={getRushWindowMs(state.turnCount)}
                    />
                  </div>

                  <SectionCard className="game-panel game-panel--compact product-area__actions">
                    <div className="game-panel__title-row game-panel__title-row--compact">
                      <div>
                        <h3>상품 넣기</h3>
                        <p>
                          {state.mode === 'rush'
                            ? '숫자키 1~4 또는 버튼으로 즉시 넣기. 지연되면 오정리 납품이 자동 발생.'
                            : '숫자키 1~4 또는 버튼으로 바로 진열칸 선택.'}
                        </p>
                      </div>
                    </div>
                    <ActionPad
                      currentProduct={state.currentProduct}
                      onPlace={placeProduct}
                      disabled={state.isGameOver}
                    />
                  </SectionCard>

                  <div className="product-area__power">
                    <PowerPanel
                      powers={state.powers}
                      onUseTrashBag={useTrashBag}
                      onUseEmergencyClear={useEmergencyClear}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {helpOpen ? <HelpModal onClose={() => setHelpOpen(false)} /> : null}

        {state.isGameOver ? (
          <GameOverModal
            score={state.score}
            bestScore={state.bestScore}
            earnedCoins={state.lastEarnedCoins}
            bestCombo={state.bestCombo}
            accuracy={accuracy}
            reason={state.gameOverReason}
            mode={state.mode}
            onRestartClassic={() => startGame('classic')}
            onRestartRush={() => startGame('rush')}
            onUpgrade={openUpgrade}
            onHome={goHome}
          />
        ) : null}

        {state.lastToast ? <div className="toast">{state.lastToast}</div> : null}
      </div>
    </main>
  );
}
