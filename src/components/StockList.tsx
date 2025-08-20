import { type StockItem } from "../types";
import { useAuth } from "../contexts/AuthContext";

interface StockListProps {
  items: StockItem[];
}

export default function StockList({ items }: StockListProps) {
  const { isAdmin } = useAuth();

 
  // Structure: { "Glass": { "Tempered": [Item1, Item2], "Frosted": [Item3] } }
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    const type = item.type || "General";

    if (!acc[category]) acc[category] = {};
    if (!acc[category][type]) acc[category][type] = [];
    
    acc[category][type].push(item);
    return acc;
  }, {} as Record<string, Record<string, StockItem[]>>);

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
                
                <div className="border-b border-stone-100 bg-stone-50/50 px-6 py-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">
                    {typeName}
                  </h3>
                </div>

                {/* List of ITEMS */}
                <div className="divide-y divide-stone-100">
                  {stockItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex flex-col gap-4 p-5 transition-colors hover:bg-stone-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Item Basic Info */}
                      <div>
                        <h4 className="text-lg font-bold text-stone-900">{item.itemName}</h4>
                        <div className="mt-1 flex items-center gap-3 text-sm font-medium text-stone-500">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-stone-300"></span>
                            {item.location}
                          </span>
                          {/* Low Stock Warning */}
                          {item.quantity < 5 && (
                            <span className="text-orange-600 font-bold">Low Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Stats & Actions */}
                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        
                        {/* Quantity Pill */}
                        <div className="text-center">
                          <div className="text-xs font-bold uppercase text-stone-400">Qty</div>
                          <div className="text-xl font-black text-stone-900">{item.quantity}</div>
                        </div>

                        <div className="flex gap-6">
                          {/* Admin sees Purchase Price */}
                          {isAdmin && (
                            <div className="hidden text-right sm:block">
                              <div className="text-xs font-bold uppercase text-stone-400">Buy</div>
                              <div className="font-mono font-bold text-stone-600">
                                ${item.purchasePrice.toFixed(2)}
                              </div>
                            </div>
                          )}
                          
                          {/* Everyone sees Selling Price */}
                          <div className="text-right">
                            <div className="text-xs font-bold uppercase text-stone-400">Sell</div>
                            <div className="font-mono font-bold text-green-600">
                              ${item.sellingPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Edit Button (Visible to everyone, but logic will differ later) */}
                        <button className="rounded-full bg-stone-100 p-2 text-stone-400 hover:bg-stone-200 hover:text-stone-900">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </div>
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