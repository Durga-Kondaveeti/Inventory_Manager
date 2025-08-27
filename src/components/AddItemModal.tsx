// src/components/AddItemModal.tsx
import { useState, useMemo } from "react";
import { addStockItem } from "../lib/db";
import { type StockItem } from "../types";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingItems: StockItem[];
}

export default function AddItemModal({ isOpen, onClose, onSuccess, existingItems }: AddItemModalProps) {
  const [loading, setLoading] = useState(false);
  
  // Toggle States
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewType, setIsNewType] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    category: "",
    type: "",
    itemName: "",
    quantity: 0,
    location: "",
    purchasePrice: 0,
    sellingPrice: 0,
    gst: 0,
  });

  // 1. EXTRACT UNIQUE CATEGORIES
  const uniqueCategories = useMemo(() => {
    const cats = existingItems.map(i => i.category).filter(Boolean);
    return Array.from(new Set(cats)).sort();
  }, [existingItems]);

  // 2. EXTRACT UNIQUE TYPES
  const availableTypes = useMemo(() => {
    if (!formData.category || isNewCategory) return [];
    const types = existingItems
      .filter(i => i.category === formData.category)
      .map(i => i.type)
      .filter(Boolean);
    return Array.from(new Set(types)).sort();
  }, [existingItems, formData.category, isNewCategory]);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      category: "", type: "", itemName: "", quantity: 0, 
      location: "", purchasePrice: 0, sellingPrice: 0, gst: 0
    });
    setIsNewCategory(false);
    setIsNewType(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addStockItem({
        ...formData,
        quantity: Number(formData.quantity),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        gst: Number(formData.gst),
      } as StockItem);
      
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item.");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Logic for Category Dropdown
    if (name === "categorySelect") {
      if (value === "NEW") {
        setIsNewCategory(true);
        setFormData(prev => ({ ...prev, category: "", type: "" }));
      } else {
        setIsNewCategory(false);
        setFormData(prev => ({ ...prev, category: value, type: "" }));
      }
      return;
    }

    // Logic for Type Dropdown
    if (name === "typeSelect") {
      if (value === "NEW") {
        setIsNewType(true);
        setFormData(prev => ({ ...prev, type: "" }));
      } else {
        setIsNewType(false);
        setFormData(prev => ({ ...prev, type: value }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      <div className="animate-fade-in-up relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl ring-1 ring-stone-900/5">
        
        {/* Header */}
        <div className="border-b border-stone-100 bg-white px-8 py-6">
          <h2 className="text-2xl font-black tracking-tighter text-stone-900">Add New Stock</h2>
          <p className="text-sm font-medium text-stone-500">Create a new item or add to an existing category.</p>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-8">
          <div className="grid gap-6">
            
            {/* --- SMART HIERARCHY SECTION --- */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              
              {/* CATEGORY SELECTOR */}
              <div className="group">
                <div className="mb-2 flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Category</label>
                  {isNewCategory && (
                    <button 
                      type="button" 
                      onClick={() => setIsNewCategory(false)}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                
                {isNewCategory ? (
                  // INPUT MODE
                  <input
                    name="category"
                    placeholder="Enter new category name..."
                    autoFocus
                    required
                    className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                    onChange={handleChange}
                  />
                ) : (
                  // CUSTOM STYLED DROPDOWN
                  <div className="relative">
                    <select
                      name="categorySelect"
                      className="w-full appearance-none rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                      onChange={handleChange}
                      value={formData.category || ""}
                      required
                    >
                      <option value="" disabled>Select Category...</option>
                      {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option disabled>──────────────────</option>
                      <option value="NEW">＋ Create New Category</option>
                    </select>
                    {/* Custom Chevron Icon */}
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* TYPE SELECTOR */}
              <div className="group">
                 <div className="mb-2 flex justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Type / Sub-Category</label>
                  {isNewType && (
                    <button 
                      type="button" 
                      onClick={() => setIsNewType(false)}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {isNewType || isNewCategory ? (
                  // INPUT MODE
                  <input
                    name="type"
                    placeholder="Enter type name..."
                    required
                    className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                    onChange={handleChange}
                  />
                ) : (
                  // CUSTOM STYLED DROPDOWN
                  <div className="relative">
                    <select
                      name="typeSelect"
                      className="w-full appearance-none rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20 disabled:bg-stone-50 disabled:text-stone-300"
                      onChange={handleChange}
                      value={formData.type || ""}
                      disabled={!formData.category}
                      required
                    >
                      <option value="" disabled>Select Type...</option>
                      {availableTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      <option disabled>──────────────────</option>
                      <option value="NEW">＋ Create New Type</option>
                    </select>
                    {/* Custom Chevron Icon */}
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ITEM NAME */}
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

            {/* FINANCIALS */}
            <div className="rounded-2xl bg-orange-50/50 p-6">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-orange-800">Financials</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                
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

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-400">GST %</label>
                  <div className="relative">
                    <input
                      name="gst"
                      type="number"
                      placeholder="18"
                      required
                      className="w-full rounded-xl bg-white px-4 py-3 font-bold text-stone-900 shadow-sm outline-none ring-1 ring-stone-100 focus:ring-2 focus:ring-orange-500/20"
                      onChange={handleChange}
                    />
                    <span className="absolute right-4 top-3.5 font-bold text-stone-400">%</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </form>

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