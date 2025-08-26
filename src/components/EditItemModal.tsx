// src/components/EditItemModal.tsx
import { useState, useEffect } from "react";
import { updateStockItem, deleteStockItem } from "../lib/db";
import { type StockItem } from "../types";
import { useAuth } from "../contexts/AuthContext";

interface EditItemModalProps {
  item: StockItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditItemModal({ item, isOpen, onClose, onSuccess }: EditItemModalProps) {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<StockItem>>({});

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        category: item.category,
        type: item.type,
        itemName: item.itemName,
        quantity: item.quantity,
        location: item.location,
        purchasePrice: item.purchasePrice,
        sellingPrice: item.sellingPrice,
        gst: item.gst || 0 
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStockItem(item.id!, {
        ...formData,
        quantity: Number(formData.quantity),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating:", error);
      alert("Update failed.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
    
    setLoading(true);
    try {
      await deleteStockItem(item.id!);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting:", error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="animate-fade-in-up relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl">
        
        {/* Header */}
        <div className="border-b border-stone-100 bg-white px-8 py-6">
          <h2 className="text-2xl font-black tracking-tighter text-stone-900">Edit Item</h2>
          <p className="text-sm font-medium text-stone-500">Update stock details or location.</p>
        </div>

        <form onSubmit={handleUpdate} className="max-h-[70vh] overflow-y-auto p-8">
          <div className="grid gap-6">
            
            {/* 1. Hierarchy (Admin Only - Users see Read-Only) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Category</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={!isAdmin} // Lock for users
                  className="w-full rounded-xl bg-stone-50 px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Type</label>
                <input
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={!isAdmin} // Lock for users
                  className="w-full rounded-xl bg-stone-50 px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 disabled:opacity-60 disabled:cursor-not-allowed focus:bg-white focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* 2. Common Fields (Editable by Everyone) */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Item Name</label>
              <input
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* 3. Pricing (Admin Full Access / User Read-Only Selling Price) */}
            <div className="rounded-2xl bg-orange-50/50 p-6">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-orange-800">Financials</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                
                {/* Purchase Price: ADMIN ONLY */}
                {isAdmin && (
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Purchase Price</label>
                    <input
                      name="purchasePrice"
                      type="number"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                )}

                {/* Selling Price: Visible to all, but only Admin can Edit? */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">Selling Price</label>
                  <input
                    name="sellingPrice"
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    disabled={!isAdmin}
                    className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                {/* GST Field */}
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">GST %</label>
                  <div className="relative">
                    <input
                      name="gst"
                      type="number"
                      value={formData.gst}
                      onChange={handleChange}
                      // disabled={!isAdmin} // Admin Only
                      className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-orange-500/20"
                    />
                    <span className="absolute right-4 top-3.5 font-bold text-stone-400">%</span>
                  </div>
                </div>

             
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
            {/* Delete Button (Admin Only) */}
            {isAdmin ? (
              <button 
                type="button"
                onClick={handleDelete}
                className="text-sm font-bold text-red-500 hover:text-red-700 hover:underline"
              >
                Delete Item
              </button>
            ) : (
              <div></div> // Empty div to keep layout balanced
            )}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-stone-500 hover:text-stone-900">Cancel</button>
              <button 
                type="submit"
                disabled={loading}
                className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                {loading ? "Saving..." : "Update Item"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}