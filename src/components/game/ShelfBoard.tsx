import { PRODUCT_ORDER } from '@/data/products';
import type { ProductType, ShelfState } from '@/lib/game/types';
import { ShelfCard } from './ShelfCard';

type ShelfBoardProps = {
  shelves: Record<ProductType, ShelfState>;
  suggestedShelf: ProductType;
};

export function ShelfBoard({ shelves, suggestedShelf }: ShelfBoardProps) {
  return (
    <div className="board-grid">
      {PRODUCT_ORDER.map((product) => (
        <ShelfCard key={product} shelf={shelves[product]} isSuggested={product === suggestedShelf} />
      ))}
    </div>
  );
}
