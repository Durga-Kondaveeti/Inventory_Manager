// src/components/StockItemRow.tsx
import {type StockItem } from "../types";
import { getPriceIncGST, formatCurrency } from "../lib/inventoryUtils";

interface StockItemRowProps {
  item: StockItem;
  isAdmin: boolean;
  onEdit: (item: StockItem) => void;
}

export default function StockItemRow({ item, isAdmin, onEdit }: StockItemRowProps) {
  const finalPrice = getPriceIncGST(item.sellingPrice, item.gst);

  return (
    <div className="flex flex-col gap-4 p-5 transition-colors hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between">
      
      {/* 1. Item Details (Now includes Edit Button) */}
      <div>
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-bold text-stone-900">{item.itemName}</h4>
          
          {/* EDIT BUTTON MOVED HERE */}
          <button 
            onClick={() => onEdit(item)} 
            className="rounded-full bg-stone-100 p-1.5 text-stone-400 hover:bg-orange-100 hover:text-orange-600 transition-colors"
            title="Edit Item"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        <div className="mt-1 flex items-center gap-3 text-sm font-medium text-stone-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-stone-300"></span>
            {item.location}
          </span>
          
          {item.quantity < 5 && (
            <span className="text-orange-600 font-bold">Low Stock</span>
          )}
          
          {item.gst > 0 && (
            <span className="rounded bg-stone-100 px-1 text-[10px] font-bold text-stone-400">
              {item.gst}% GST
            </span>
          )}
        </div>
      </div>

      {/* 2. Stats (Removed Button from here) */}
      <div className="flex flex-wrap items-center justify-between gap-6 sm:justify-end">
        
        {/* Quantity */}
        <div className="text-center">
          <div className="text-xs font-bold uppercase text-stone-400">Qty</div>
          <div className="text-xl font-black text-stone-900">{item.quantity}</div>
        </div>

        <div className="flex gap-6">
          {/* Admin Buy Price */}
          {isAdmin && (
            <div className="hidden text-right sm:block">
              <div className="text-xs font-bold uppercase text-stone-400">Buy</div>
              <div className="font-mono font-bold text-stone-400">
                {formatCurrency(item.purchasePrice)}
              </div>
            </div>
          )}

          {/* Sell Ex. GST */}
          <div className="text-right">
            <div className="text-xs font-bold uppercase text-stone-400">Sell (Ex. GST)</div>
            <div className="font-mono font-bold text-stone-600">
              {formatCurrency(item.sellingPrice)}
            </div>
          </div>

          {/* Sell Inc. GST */}
          <div className="text-right">
            <div className="text-xs font-bold uppercase text-stone-400">Sell (Inc. GST)</div>
            <div className="font-mono font-bold text-green-600">
              {formatCurrency(finalPrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}