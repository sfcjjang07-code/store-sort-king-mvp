# 편의점 정리왕 MVP

Next.js App Router 기반의 최소 웹 게임 프로젝트입니다.

## 실행
```bash
npm install
npm run dev
```

## 핵심 구조
- `src/app/page.tsx`: 진입 페이지
- `src/components/game/StoreSortGame.tsx`: 전체 화면 컨테이너
- `src/lib/game/`: 게임 규칙, 점수, 업그레이드, reducer
- `src/lib/storage/gameStorage.ts`: localStorage 저장

## 현재 구현 범위
- 홈 / 플레이 / 업그레이드
- 상품 4종, 진열칸 4개
- 3개 매치 정리
- 점수 / 콤보 / 코인 / 업그레이드
- 특수 기능 2종
- localStorage 저장
