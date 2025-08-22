// src/components/LowStockModal.tsx
import { StockItem } from "../types";

interface LowStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StockItem[];
}

export default function LowStockModal({ isOpen, onClose, items }: LowStockModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="animate-fade-in-up relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl ring-1 ring-stone-900/5">
        
        {/* Header */}
        <div className="border-b border-stone-100 bg-orange-50 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-stone-900">
                Low Stock Alert
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Items below 10 units
              </p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="p-8 text-center text-stone-500 font-medium">
              Good news! No items are low on stock.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
                  <div>
                    <h3 className="font-bold text-stone-900">{item.itemName}</h3>
                    <p className="text-xs text-stone-500">{item.category} / {item.type}</p>
                    <p className="text-xs font-bold text-stone-400 mt-1">Loc: {item.location}</p>
                  </div>
                  <div className="text-center">
                     <span className="block text-2xl font-black text-red-500">
                       {item.quantity}
                     </span>
                     <span className="text-[10px] font-bold uppercase text-stone-400">Left</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 bg-white p-4">
          <button 
            onClick={onClose}
            className="w-full rounded-xl bg-stone-900 py-3 text-sm font-bold text-white shadow-lg hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}