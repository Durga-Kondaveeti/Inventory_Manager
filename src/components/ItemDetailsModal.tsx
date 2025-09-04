// src/components/ItemDetailsModal.tsx
import { type StockItem } from "../types";
import { getPriceIncGST, formatCurrency } from "../lib/inventoryUtils";
import { useAuth } from "../contexts/AuthContext";

interface ItemDetailsModalProps {
  item: StockItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: StockItem) => void;
}

export default function ItemDetailsModal({ item, isOpen, onClose, onEdit }: ItemDetailsModalProps) {
  const { isAdmin } = useAuth();

  if (!isOpen || !item) return null;

  const finalPrice = getPriceIncGST(item.sellingPrice, item.gst);

  const handleEditClick = () => {
    onClose(); // Close details view
    onEdit(item); // Open edit view
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="animate-fade-in-up relative my-auto w-full max-w-sm overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl ring-1 ring-stone-900/5 flex flex-col">
        
        {/* Header Section */}
        <div className="border-b border-stone-100 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tighter text-stone-900">{item.itemName}</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mt-1">
                {item.category} / {item.type}
              </p>
            </div>
            {item.quantity < 5 && (
              <span className="flex h-6 items-center rounded-full bg-orange-100 px-2 text-[10px] font-black uppercase tracking-wider text-orange-600">
                Low
              </span>
            )}
          </div>
        </div>

        {/* Details Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Stock & Location Row */}
          <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-100">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Location</div>
              <div className="font-bold text-stone-700">{item.location}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Current Stock</div>
              <div className="text-2xl font-black text-stone-900">{item.quantity}</div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100">
            <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-stone-400">Financial Overview</h3>
            <div className="space-y-3">
              
              {isAdmin && (
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-sm font-bold text-stone-500">Our Cost (Buy)</span>
                  <span className="font-mono font-bold text-stone-400">{formatCurrency(item.purchasePrice)}</span>
                </div>
              )}

              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-sm font-bold text-stone-500">Sell (Excl. Tax)</span>
                <span className="font-mono font-bold text-stone-700">{formatCurrency(item.sellingPrice)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-stone-900">Final Price (Inc. {item.gst || 0}% GST)</span>
                <span className="font-mono text-lg font-black text-green-600">{formatCurrency(finalPrice)}</span>
              </div>

            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex justify-between border-t border-stone-100 bg-white px-6 py-4">
          <button 
            onClick={handleEditClick}
            className="flex items-center gap-2 rounded-xl bg-stone-100 px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Item
          </button>
          
          <button 
            onClick={onClose}
            className="rounded-xl bg-stone-900 px-6 py-2 text-sm font-bold text-white shadow-lg active:scale-95"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}