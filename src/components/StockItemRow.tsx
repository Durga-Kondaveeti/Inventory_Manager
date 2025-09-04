// src/components/StockItemRow.tsx
import { type StockItem } from "../types";
import { formatCurrency, getPriceIncGST } from "../lib/inventoryUtils";

interface StockItemRowProps {
  item: StockItem;
  onViewDetails: (item: StockItem) => void;
}

export default function StockItemRow({ item, onViewDetails }: StockItemRowProps) {
  const finalPrice = getPriceIncGST(item.sellingPrice, item.gst);

  return (
    <div className="flex items-center justify-between p-4 transition-colors hover:bg-stone-50 border-b border-stone-100 last:border-0">
      
      {/* Clickable Name Wrapper */}
      <button 
        onClick={() => onViewDetails(item)}
        className="flex flex-1 flex-col items-start text-left focus:outline-none group"
      >
        <div className="flex items-center gap-2">
          <h4 className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
            {item.itemName}
          </h4>
          {item.quantity < 5 && (
             <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
          Tap for details
        </span>
      </button>

      {/* Minimalist Price Display (Inc GST by default for quick scanning) */}
      <div className="flex flex-col items-end pl-4">
        <div className="text-[10px] font-bold uppercase text-stone-400">Price</div>
        <div className="font-mono text-sm font-bold text-green-600">
          {formatCurrency(finalPrice)}
        </div>
      </div>

    </div>
  );
}