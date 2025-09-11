// src/components/StockList.tsx
import { useMemo, useState } from "react";
import { type StockItem } from "../types";
import { groupInventory } from "../lib/inventoryUtils";
import StockItemRow from "./StockItemRow";

interface StockListProps {
  items: StockItem[];
  onViewDetails: (item: StockItem) => void;
  searchTerm?: string;
}

export default function StockList({ items, onViewDetails, searchTerm = "" }: StockListProps) {
  const groupedItems = useMemo(() => groupInventory(items), [items]);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => setExpandedCategories(p => ({ ...p, [cat]: !p[cat] }));
  const toggleType = (cat: string, type: string) => setExpandedTypes(p => ({ ...p, [`${cat}-${type}`]: !p[`${cat}-${type}`] }));

  const isSearching = searchTerm.trim().length > 0;

  if (items.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50/50">
        <p className="font-bold text-stone-400">No items match your search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {Object.entries(groupedItems).map(([categoryName, types]) => {
        const isCategoryOpen = isSearching || expandedCategories[categoryName] || false;
        
        const totalItemsInCategory = Object.values(types).reduce((sum, stockItems) => 
          sum + stockItems.length, 0
        );

        return (
          <div key={categoryName} className="animate-fade-in-up overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-100">
            <button onClick={() => toggleCategory(categoryName)} className="flex w-full items-center justify-between bg-stone-50/50 p-6 transition-colors hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black tracking-tighter text-stone-900">{categoryName}</h2>
                <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-600">{totalItemsInCategory}</span>
              </div>
              <svg className={`h-5 w-5 text-stone-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {isCategoryOpen && (
              <div className="border-t border-stone-100 px-2 pb-2 pt-2 sm:px-4">
                {Object.entries(types).map(([typeName, stockItems]) => {
                  const typeKey = `${categoryName}-${typeName}`;
                  const isTypeOpen = isSearching || expandedTypes[typeKey] || false;

                  return (
                    <div key={typeName} className="mb-2 overflow-hidden rounded-2xl border border-stone-100 bg-white last:mb-0">
                      <button onClick={() => toggleType(categoryName, typeName)} className="flex w-full items-center justify-between bg-stone-50/30 px-5 py-3 transition-colors hover:bg-stone-50">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">{typeName} ({stockItems.length})</h3>
                        <svg className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${isTypeOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </button>

                      {isTypeOpen && (
                        <div className="border-t border-stone-100 bg-white">
                          {stockItems.map((item) => (
                            <StockItemRow key={item.id} item={item} onViewDetails={onViewDetails} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}