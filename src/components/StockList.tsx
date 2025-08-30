// want to change the tax calcuation logic, goto inventoryUtils.ts --- IGNORE ---


// src/components/StockList.tsx
import { useMemo } from "react";
import { type StockItem } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { groupInventory } from "../lib/inventoryUtils"; // Import Logic
import StockItemRow from "./StockItemRow"; // Import Sub-component

interface StockListProps {
  items: StockItem[];
  onEdit: (item: StockItem) => void;
}

export default function StockList({ items, onEdit }: StockListProps) {
  const { isAdmin } = useAuth();

  // 1. Use Memo to optimize performance (Only regroup if items change)
  const groupedItems = useMemo(() => groupInventory(items), [items]);

  if (items.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50/50">
        <p className="font-bold text-stone-400">No items found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {Object.entries(groupedItems).map(([categoryName, types]) => (
        <div key={categoryName} className="animate-fade-in-up">
          
          <h2 className="mb-4 text-2xl font-black tracking-tighter text-stone-900">
            {categoryName}
          </h2>

          <div className="space-y-6 pl-0 sm:pl-4">
            {Object.entries(types).map(([typeName, stockItems]) => (
              <div key={typeName} className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
                
                {/* Type Header */}
                <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">
                    {typeName}
                  </h3>
                </div>

                {/* List Items */}
                <div className="divide-y divide-stone-100">
                  {stockItems.map((item) => (
                    <StockItemRow 
                      key={item.id} 
                      item={item} 
                      isAdmin={isAdmin} 
                      onEdit={onEdit} 
                    />
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}