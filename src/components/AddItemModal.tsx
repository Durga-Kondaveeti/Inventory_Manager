import { useState } from "react";
import { addStockItem } from "../lib/db";
import { type StockItem } from "../types";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
}

export default function AddItemModal({ isOpen, onClose, onSuccess }: AddItemModalProps) {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: "",
    type: "",
    itemName: "",
    quantity: 0,
    location: "",
    purchasePrice: 0,
    sellingPrice: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addStockItem({
        ...formData,
        quantity: Number(formData.quantity),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
      } as StockItem);
      
      setFormData({
        category: "", type: "", itemName: "", quantity: 0, 
        location: "", purchasePrice: 0, sellingPrice: 0
      }); // Reset form
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Check console.");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. Dark Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* 2. The Modal Card */}
      <div className="animate-fade-in-up relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl ring-1 ring-stone-900/5">
        
        {/* Header */}
        <div className="border-b border-stone-100 bg-white px-8 py-6">
          <h2 className="text-2xl font-black tracking-tighter text-stone-900">
            Add New Stock
          </h2>
          <p className="text-sm font-medium text-stone-500">
            Create a new item or add to an existing category.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-8">
          <div className="grid gap-6">
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Category</label>
                <input
                  name="category"
                  placeholder="e.g. Glass"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                  onChange={handleChange}
                />
              </div>
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Type/Sub-category</label>
                <input
                  name="type"
                  placeholder="e.g. Tempered"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Item Name</label>
              <input
                name="itemName"
                placeholder="e.g. 12mm Clear Sheet"
                required
                className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Warehouse Location</label>
                <input
                  name="location"
                  placeholder="e.g. Shelf A-4"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 3: Pricing */}
            <div className="rounded-2xl bg-orange-50/50 p-6">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-orange-800">Financials</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Purchase Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 font-bold text-stone-400">$</span>
                    <input
                      name="purchasePrice"
                      type="number"
                      step="0.01"
                      required
                      className="w-full rounded-xl bg-white pl-8 pr-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 font-bold text-stone-400">$</span>
                    <input
                      name="sellingPrice"
                      type="number"
                      step="0.01"
                      required
                      className="w-full rounded-xl bg-white pl-8 pr-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-stone-100 bg-white px-8 py-5">
          <button 
            onClick={onClose}
            className="rounded-xl px-6 py-3 text-sm font-bold text-stone-500 hover:bg-stone-50 hover:text-stone-900"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-stone-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Item"}
          </button>
        </div>

      </div>
    </div>
  );
}